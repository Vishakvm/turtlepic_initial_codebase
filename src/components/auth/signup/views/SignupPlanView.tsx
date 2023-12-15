/*
 * Sign Up Plan Page
 *
 */
import React, { useEffect, useState, useRef } from 'react';

import { useNavigate } from 'react-router-dom';

import {
  Grid,
  Typography,
  styled,
  Stack,
  Switch,
  ToggleButtonGroup,
  ToggleButton,
  Button,
} from '@mui/material';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { LoadingButton } from '@mui/lab';
import { useSnackbar } from 'notistack';

import { BUYPLAN, TRYPLAN } from 'src/utils/constants';
import axios from 'src/utils/axios';
import { BorderLinearProgress } from 'src/components/auth/elements/SignupBodyWrapper';
import CustomPlanDrawer from 'src/components/auth/drawer/CustomPlanDrawer';
import Ellipse from 'src/assets/shared/images/Ellipse.png';
import IconNextSVG from 'src/assets/shared/svg/IconNextSVG';
import LogoWhiteSVG from 'src/assets/shared/svg/LogoWhiteSVG';
import MobilePlanDetailsView from 'src/components/auth/elements/MobilePlanDetails';
import Page from 'src/components/Page';
import { PATH_AUTH } from 'src/routes/paths';
import { prePlanDetails } from 'src/redux/slices/prePlans';
import SignupPlanCard from 'src/components/auth/elements/SignupPlanCard';
import { useSelector, useDispatch } from 'src/redux/store';
import Loader from 'src/components/dialogs/Loader';
import FAQ from './FAQ';

import TickSVG from 'src/assets/shared/svg/signup/TickSVG';
import { INDIVIDUAL, AGENCY } from 'src/utils/constants';
import { selectType } from 'src/redux/slices/userType';
import PlansInfoDialog from 'src/components/dialogs/PlansInfoDialog';



const LogoWrapper = styled('div')(({ theme }) => ({
  position: 'relative',
  cursor: 'pointer',
  padding: theme.spacing(4, 0, 0, 4),
  [theme.breakpoints.down('md')]: {
    position: 'unset',
    padding: theme.spacing(4, 2, 0, 4),
  },
}));

const PlanWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 4, 0, 4),
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
}));

const PlanCardWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'flex-end',
  [theme.breakpoints.down('lg')]: {
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
}));

const HeadWrapper = styled('div')(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  margin: theme.spacing(0, 0, 7, 0),
  [theme.breakpoints.down('md')]: {
    gridTemplateColumns: 'unset',
  },
}));

const SavingsContainer = styled('div')(({ theme }) => ({
  justifySelf: 'end',
  [theme.breakpoints.down('md')]: {
    justifySelf: 'center',
  },
}));
const SingleTableContainer = styled('div')(({ theme }) => ({
  margin: theme.spacing(0, 0, 3, 0),
  [theme.breakpoints.up('lg')]: {
    display: 'none',
  },
}));

const MainGrid = styled(Grid)(({ theme }) => ({
  [theme.breakpoints.down('lg')]: {
    display: 'unset',
  },
}));

const TableWrapper = styled('div')(({ theme }) => ({
  margin: theme.spacing(5, 0, 10, 0),
  [theme.breakpoints.down('lg')]: {
    display: 'none',
  },
}));

export const Folder = styled('div')(({ theme }) => ({
  position: 'relative',
  cursor: 'pointer',
  [theme.breakpoints.between('sm', 'md')]: {
    width: '100%',
  },
}));

const Heading = styled(Typography)(({ theme }) => ({
  borderBottom: '1px solid',
  borderColor: theme.palette.grey[200],
  paddingBottom: theme.spacing(2),
}));

const Body = styled('div')(({ theme }) => ({
  maxHeight: '100%',
  overflow: 'auto',
  overflowY: 'scroll',
  '&::-webkit-scrollbar': {
    width: '0.3em',
    backgroundColor: '#000',
  },
  '&::-webkit-scrollbar-track': {
    boxShadow: 'inset 0 0 6px rgba(0,0,0,0.1)',
    backgroundColor: '#000',
    borderRadius: '10px',
  },
  '&::-webkit-scrollbar-thumb': {
    borderRadius: '10px',
    backgroundColor: '#7dd78d',
  },
}));

type PlanType = {
  display_name: string;
  storage: number;
  event_count: number;
  custom_domain: boolean;
  designer_templates: boolean;
  face_recognition_searches: string;
  privacy_control: string;
  inbuilt_analytics: boolean;
  guest_pre_registration: boolean;
  sharing_with_guests: string;
  price_point_monthly: {
    price: number;
    period_unit: string;
    trial: string;
    id: string;
    original_price: number;
    trial_period: number;
  };
  price_point_yearly: {
    price: number;
    period_unit: string;
    trial: string;
    trial_period: number;
    id: string;
    original_price: number;
  };
};

const ToggleBtnGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  width: '100%',
  height: '100%',
  background: 'none',
  border: 'none',
  display: 'flex',
  justifyContent: 'space-between',
  flexDirection: 'column',
  '& .MuiToggleButton-root': {
    margin: 0,
    borderRadius: '5px !important',
    borderColor: '#7dd78d !important',
  },
  '.MuiToggleButtonGroup-grouped:not(:first-of-type)': {
    margin: 0,
  },
  [theme.breakpoints.between('xs', 'lg')]: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
}));

const ToggleBtn = styled(ToggleButton)(({ theme }) => ({
  width: '100%',
  height: '118px',
  // boxShadow: `${theme.palette.primary.main} 0px 0px 3px`,
  margin: 0,
  '&.Mui-selected, &.Mui-selected:hover': {
    color: 'white',
    backgroundColor: '#7dd78d',
  },
  [theme.breakpoints.down('sm')]: {
    width: '48%',
    height: '80px',
  },
  [theme.breakpoints.down('lg')]: {
    width: '48%',
    height: '80px',
  },
}));

const TickIcon = styled('div')(({ theme }) => ({
  // position: 'absolute',
  // top: '-1rem',
  // right: '-1rem',
  marginRight: '10px'
}));

const ButtonContainer = styled('div')(({ theme }) => ({
  paddingTop: theme.spacing(10),
}));

const PlanCard = styled('div')(({ theme }) => ({
  // border: `0.5px solid ${theme.palette.primary.main}`,
  borderRadius: 4,
  // padding: theme.spacing(3, 2),
  height: '250px',
  margin: theme.spacing(0, 2, 2, 0),
  [theme.breakpoints.between('xs', 'lg')]: {
    margin: theme.spacing(0, 0, 2, 0),
    height: '100px',
  },
}));


export default function SignupPlanView(): React.ReactElement {
  const [annually, setAnnually] = useState(true);
  const [eventDrawer, setEventDrawer] = useState(false);

  const [planDetails, setPlanDetails] = useState<PlanType[]>([]);

  const [fetchPlan, setFetchPlan] = useState(true);

  const [user, setUser] = React.useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const isMounted = useRef(false);

  const dispatch = useDispatch();

  const { enqueueSnackbar } = useSnackbar();

  const navigate = useNavigate();

  const registrationType = useSelector((state) => state.userType.value);

  const switchHandler = () => {
    setAnnually(!annually);
  };

  const progressValue = 25;

  useEffect(() => {
    const getAllUsers = async () => {
      try {
        await axios.get('/api/subscription/plans').then((response) => {
          if (!isMounted.current) {
            const { data } = response.data;
            const sortedData = data.sort(
              (a: any, b: any) =>
                a.price_point_yearly.original_price - b.price_point_yearly.original_price ||
                a.price_point_monthly.original_price - b.price_point_monthly.original_price
            );
            setPlanDetails(sortedData);
            setFetchPlan(false);
          }
        });
      } catch (error) {
        enqueueSnackbar(error.message, { variant: 'error' });
        setFetchPlan(false);
      }
    };
    getAllUsers();
    return () => {
      isMounted.current = true;
    };
  }, [enqueueSnackbar]);

  // useEffect(() => {
  //   if (!registrationType.type) {
  //     navigate(PATH_AUTH.welcome);
  //     return;
  //   }
  // }, [navigate, registrationType.type]);

  useEffect(() => {
    if (!registrationType.type) {
     setUser(INDIVIDUAL);
    }
    else {
     setUser(registrationType.type);
    }
  }, []);

  const handlePlanClick = (id: string, planPath: string) => {
    if (user !== '') {
      dispatch(selectType({ type: user }));
      dispatch(prePlanDetails({ planStatus: planPath, planId: id }));
      navigate(PATH_AUTH.details);
      // if (registrationType.type) navigate(PATH_AUTH.details);
      // else {
      //   enqueueSnackbar('Please Select Type of Account', { variant: 'error' });
      // }
    } else {
      enqueueSnackbar('Please Select Type of Account', { variant: 'error' });
    }
  };

  const handleChange = (event: React.MouseEvent<HTMLElement>, newUser: string) => {
    setUser(newUser);
  };

  return (
    <Body>
      <Page title="Plans">
        <PlansInfoDialog
          isDialogOpen={showSuccess}
          dialogContent="Payment Succsfull"
          dialogId="error-dialog-title"
          onClose={() => setShowSuccess(false)}
        />
        <BorderLinearProgress variant="determinate" value={progressValue} />
        <LogoWrapper>
          <LogoWhiteSVG />
        </LogoWrapper>
        <PlanWrapper>
          <HeadWrapper>
            <div />
            <Typography variant="h2" align="center" mt={2} mb={5}>
              Choose Your Plan
            </Typography>
            <SavingsContainer>
              <Stack direction="row" py={1} alignItems="center">
                <Typography variant="h6">Monthly</Typography>
                <Switch checked={annually} onChange={switchHandler} />
                <Typography pr={1} variant="h6">
                  Annually
                </Typography>
              </Stack>
              <Typography variant="h6" color="secondary">
                17% savings on Annual plan
              </Typography>
            </SavingsContainer>
          </HeadWrapper>
          <MainGrid container>
            <Grid item lg={3} md={8} sx={{}}>
              <Button size="medium" color="primary" onClick={() => setShowSuccess(true)}>
                <Typography variant="h4">
                  <u>What's This?</u>
                </Typography>
              </Button>
            </Grid>
          </MainGrid>

          <PlanCardWrapper>
            <MainGrid container>
              <Grid item sm={12} md={12} lg={3}>
                <PlanCard>
                  <ToggleBtnGroup color="primary" value={user} exclusive onChange={handleChange}>
                    <ToggleBtn value={INDIVIDUAL}>
                      {user === INDIVIDUAL ? (
                        <TickIcon>
                          <TickSVG size="30" />
                        </TickIcon>
                      ) : null}
                      <Typography variant="h3" align="center" color="white">
                        Individual
                      </Typography>
                    </ToggleBtn>
                    <ToggleBtn value={AGENCY}>
                      {user === AGENCY ? (
                        <TickIcon>
                          <TickSVG size="30" />
                        </TickIcon>
                      ) : null}
                      <Typography variant="h3" align="center" color="white">
                        Agency
                      </Typography>
                    </ToggleBtn>
                  </ToggleBtnGroup>
                </PlanCard>
              </Grid>

              {planDetails.length ? (
                <>
                  {planDetails.map((ele, index) => (
                    <React.Fragment key={index}>
                      <Grid item sm={12} md={12} lg={3}>
                        {annually ? (
                          <SignupPlanCard
                            amount={ele.price_point_yearly && ele.price_point_yearly.price}
                            period={ele.price_point_monthly && ele.price_point_monthly.period_unit}
                            trialDays={ele.price_point_yearly && ele.price_point_yearly.trial}
                            original_price={ele.price_point_yearly.original_price}
                            trial_period={
                              ele.price_point_yearly && ele.price_point_yearly.trial_period
                            }
                            discountedAmount={200}
                            type={ele?.display_name}
                            onTryClick={(): void => {
                              handlePlanClick(ele.price_point_yearly.id, TRYPLAN);
                            }}
                            onBuyClick={(): void => {
                              handlePlanClick(ele.price_point_yearly.id, BUYPLAN);
                            }}
                          />
                        ) : (
                          <SignupPlanCard
                            amount={ele.price_point_monthly && ele.price_point_monthly.price}
                            period={ele.price_point_monthly && ele.price_point_monthly.period_unit}
                            trialDays={ele.price_point_monthly && ele.price_point_monthly.trial}
                            trial_period={
                              ele.price_point_monthly && ele.price_point_monthly.trial_period
                            }
                            discountedAmount={100}
                            type={ele?.display_name}
                            onTryClick={(): void => {
                              handlePlanClick(ele.price_point_monthly.id, TRYPLAN);
                            }}
                            onBuyClick={(): void => {
                              handlePlanClick(ele.price_point_monthly.id, BUYPLAN);
                            }}
                          />
                        )}
                      </Grid>
                      <SingleTableContainer>
                        <Heading variant="h4">What all you get</Heading>
                        <MobilePlanDetailsView
                          label="Storage"
                          value={
                            <Typography variant="h5" color="info.main">
                              {ele.storage} GB
                            </Typography>
                          }
                        />
                        <MobilePlanDetailsView
                          label="No. of events"
                          value={
                            <Typography variant="h5" color="info.main">
                              {ele.event_count}
                            </Typography>
                          }
                        />
                        <MobilePlanDetailsView
                          label="Validity"
                          value={
                            <Typography variant="h5">{annually ? '1 Year' : '1 Month'}</Typography>
                          }
                        />

                        <MobilePlanDetailsView
                          label="Custom Subdomain"
                          value={
                            ele.custom_domain ? (
                              <CheckCircleIcon color="primary" />
                            ) : (
                              <CancelRoundedIcon color="primary" />
                            )
                          }
                        />
                        <MobilePlanDetailsView
                          label="Designer Templates"
                          value={
                            ele.designer_templates ? (
                              <CheckCircleIcon color="primary" />
                            ) : (
                              <CancelRoundedIcon color="primary" />
                            )
                          }
                        />
                        <MobilePlanDetailsView
                          label="Face Recognition Searches"
                          value={
                            <Typography variant="h5">{ele.face_recognition_searches}</Typography>
                          }
                        />
                        <MobilePlanDetailsView
                          label="Privacy Control"
                          value={<Typography variant="h5">{ele.privacy_control}</Typography>}
                        />
                        <MobilePlanDetailsView
                          label="Inbuilt Analytics"
                          value={
                            ele.inbuilt_analytics ? (
                              <CheckCircleIcon color="primary" />
                            ) : (
                              <CancelRoundedIcon color="primary" />
                            )
                          }
                        />
                        <MobilePlanDetailsView
                          label="Guests Pre-registration"
                          value={
                            ele.guest_pre_registration ? (
                              <CheckCircleIcon color="primary" />
                            ) : (
                              <CancelRoundedIcon color="primary" />
                            )
                          }
                        />
                        <MobilePlanDetailsView
                          label="Inbuilt sharing with guests"
                          value={<Typography variant="h5">{ele.sharing_with_guests}</Typography>}
                        />
                      </SingleTableContainer>
                    </React.Fragment>
                  ))}
                </>
              ) : (
                <Loader title={'Fetching Plans'} isOpen={fetchPlan} />
              )}
            </MainGrid>
          </PlanCardWrapper>
          <TableWrapper>
            <Heading variant="h4">What all you get</Heading>
            <Grid container>
              <Grid item={true} container lg={3} p={2} direction="row" alignItems="center">
                <img src={String(Ellipse)} alt="selfie" width="10px" height="11px" />
                <Typography ml={1} variant="h5" color="info">
                  Storage
                </Typography>
              </Grid>
              {planDetails.map((ele, index) => (
                <Grid item lg={3} p={2} key={index}>
                  <Typography variant="h5" align="center" color="info.main">
                    {ele.storage} GB
                  </Typography>
                </Grid>
              ))}
            </Grid>
            <Grid container>
              <Grid item={true} container lg={3} p={2} direction="row" alignItems="center">
                <img src={String(Ellipse)} alt="selfie" width="10px" height="11px" />
                <Typography ml={1} variant="h5" color="info">
                  No. of events
                </Typography>
              </Grid>
              {planDetails.map((ele, index) => (
                <Grid item lg={3} p={2} key={index}>
                  <Typography variant="h5" align="center" color="info.main">
                    {ele.event_count}
                  </Typography>
                </Grid>
              ))}
            </Grid>

            <Grid container>
              <Grid item={true} container lg={3} p={2} direction="row" alignItems="center">
                <img src={String(Ellipse)} alt="selfie" width="10px" height="11px" />
                <Typography ml={1} variant="h5" color="info">
                  Validity
                </Typography>
              </Grid>
              {planDetails.map((ele, index) => (
                <Grid item lg={3} p={2} key={index}>
                  <Typography variant="h5" align="center">
                    {annually ? '1 Year' : '1 Month'}
                  </Typography>
                </Grid>
              ))}
            </Grid>

            <Grid container>
              <Grid item={true} container lg={3} p={2} direction="row" alignItems="center">
                <img src={String(Ellipse)} alt="selfie" width="10px" height="11px" />
                <Typography ml={1} variant="h5" color="info">
                  Custom Subdomain
                </Typography>
              </Grid>
              {planDetails.map((ele, index) => (
                <Grid
                  item={true}
                  container
                  lg={3}
                  p={2}
                  key={index}
                  direction="row"
                  alignItems="center"
                  justifyContent="center"
                >
                  {ele.custom_domain ? (
                    <CheckCircleIcon color="primary" />
                  ) : (
                    <CancelRoundedIcon color="primary" />
                  )}
                </Grid>
              ))}
            </Grid>
            <Grid container>
              <Grid item={true} container lg={3} p={2} direction="row" alignItems="center">
                <img src={String(Ellipse)} alt="selfie" width="10px" height="11px" />
                <Typography ml={1} variant="h5" color="info">
                  Designer Templates
                </Typography>
              </Grid>
              {planDetails.map((ele, index) => (
                <Grid
                  item={true}
                  container
                  lg={3}
                  p={2}
                  key={index}
                  direction="row"
                  alignItems="center"
                  justifyContent="center"
                >
                  {ele.designer_templates ? (
                    <CheckCircleIcon color="primary" />
                  ) : (
                    <CancelRoundedIcon color="primary" />
                  )}
                </Grid>
              ))}
            </Grid>
            <Grid container>
              <Grid item={true} container lg={3} p={2} direction="row" alignItems="center">
                <img src={String(Ellipse)} alt="selfie" width="10px" height="11px" />
                <Typography ml={1} variant="h5" color="info">
                  Face Recognition Searches
                </Typography>
              </Grid>
              {planDetails.map((ele, index) => (
                <Grid item lg={3} p={2} key={index}>
                  <Typography variant="h5" align="center" textTransform="capitalize">
                    {ele.face_recognition_searches}
                  </Typography>
                </Grid>
              ))}
            </Grid>
            <Grid container>
              <Grid item={true} container lg={3} p={2} direction="row" alignItems="center">
                <img src={String(Ellipse)} alt="selfie" width="10px" height="11px" />
                <Typography ml={1} variant="h5" color="info">
                  Privacy Control
                </Typography>
              </Grid>
              {planDetails.map((ele, index) => (
                <Grid item lg={3} p={2} key={index}>
                  <Typography variant="h5" align="center" textTransform="capitalize">
                    {ele.privacy_control}
                  </Typography>
                </Grid>
              ))}
            </Grid>
            <Grid container>
              <Grid item={true} container lg={3} p={2} direction="row" alignItems="center">
                <img src={String(Ellipse)} alt="selfie" width="10px" height="11px" />
                <Typography ml={1} variant="h5" color="info">
                  Inbuilt Analytics
                </Typography>
              </Grid>
              {planDetails.map((ele, index) => (
                <Grid
                  item={true}
                  container
                  lg={3}
                  p={2}
                  key={index}
                  direction="row"
                  alignItems="center"
                  justifyContent="center"
                >
                  {ele.inbuilt_analytics ? (
                    <CheckCircleIcon color="primary" />
                  ) : (
                    <CancelRoundedIcon color="primary" />
                  )}
                </Grid>
              ))}
            </Grid>
            <Grid container>
              <Grid item={true} container lg={3} p={2} direction="row" alignItems="center">
                <img src={String(Ellipse)} alt="selfie" width="10px" height="11px" />
                <Typography ml={1} variant="h5" color="info">
                  Guests Pre-registration
                </Typography>
              </Grid>
              {planDetails.map((ele, index) => (
                <Grid
                  item={true}
                  container
                  lg={3}
                  p={2}
                  key={index}
                  direction="row"
                  alignItems="center"
                  justifyContent="center"
                >
                  {ele.guest_pre_registration ? (
                    <CheckCircleIcon color="primary" />
                  ) : (
                    <CancelRoundedIcon color="primary" />
                  )}
                </Grid>
              ))}
            </Grid>
            <Grid container>
              <Grid item={true} container lg={3} p={2} direction="row" alignItems="center">
                <img src={String(Ellipse)} alt="selfie" width="10px" height="11px" />
                <Typography ml={1} variant="h5" color="info">
                  Inbuilt sharing with guests
                </Typography>
              </Grid>
              {planDetails.map((ele, index) => (
                <Grid item lg={3} p={2} key={index}>
                  <Typography variant="h5" align="center" textTransform="capitalize">
                    {ele.sharing_with_guests}
                  </Typography>
                </Grid>
              ))}
            </Grid>
          </TableWrapper>
          <Typography variant="h2" align="center">
            {' '}
            Didn’t find the plan as per your need?
          </Typography>
          <LoadingButton
            size="large"
            type="submit"
            variant="contained"
            color="info"
            endIcon={<IconNextSVG />}
            sx={{ margin: '25px auto 95px auto' }}
            onClick={() => {
              setEventDrawer(!eventDrawer);
            }}
          >
            Request for a custom plan
          </LoadingButton>
          <CustomPlanDrawer
            openDrawer={eventDrawer}
            onClose={() => {
              setEventDrawer(false);
            }}
          />
          <FAQ />
        </PlanWrapper>
      </Page>
    </Body>
  );
}
