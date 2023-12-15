import React, { useEffect, useState, useRef } from 'react';

import {
  Typography,
  styled,
  Grid,
  Stack,
  Switch,
  Box,
  LinearProgress,
  linearProgressClasses,
  Button,
} from '@mui/material';
import { useSnackbar } from 'notistack';

import axios from 'src/utils/axios';
import CustomPlanDrawer from './drawer/CustomPlanDrawer';
import IconStorageSVG from 'src/assets/shared/svg/icon_storage';
import IconValiditySVG from 'src/assets/shared/svg/icon_validity';
import IconGoSVG from 'src/assets/shared/svg/icon_go';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';

import useResponsive from 'src/hooks/useResponsive';
import Loader from '../dialogs/Loader';
import { useDispatch, useSelector } from 'src/redux/store';
import { customPlan } from 'src/redux/slices/customPlan';

const SettingWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(3),

  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(3, 1),
  },
}));

const CurrentWrapper = styled('div')(() => ({
  alignSelf: 'flex-end',
}));

const FlexItems = styled('div')(() => ({
  display: 'flex',
  alignItems: 'center',
}));

const DFlex = styled('div')(() => ({
  display: 'flex',
}));

const RateWrapper = styled('div')(() => ({
  display: 'flex',
  alignItems: 'flex-end',
}));

const UpgradeHeading = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: theme.spacing(2),
}));

const Card = styled('div')(({ theme }) => ({
  padding: theme.spacing(2),
  background: theme.palette.grey[900],
  borderRadius: 4,
  marginBottom: theme.spacing(3),
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
}));

const NextButton = styled('div')(({ theme }) => ({
  borderRadius: '50%',
  backgroundColor: theme.palette.grey[300],
  cursor: 'pointer',
  width: '3rem',
  height: '3rem',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}));

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  width: '16rem',
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.common.black,
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: theme.palette.secondary.main,
  },
  [theme.breakpoints.down('sm')]: {
    width: '10rem',
  },
}));

export const StrikeThroughText = styled(Typography)(() => ({
  textDecoration: 'line-through',
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
    current_plan: boolean;
    original_price: number;
  };
  price_point_yearly: {
    price: number;
    period_unit: string;
    trial: string;
    id: string;
    current_plan: boolean;
    original_price: number;
  };
};
type UserPlanType = {
  events_allocated: number;
  events_used: number;
  events_left: number;
  expiry: string;
  name: string;
  storage_allocated: number;
  photo_count: number;
  video_count: number;
  storage_percent: number;
  storage_used: number;
  validity: string;
  validity_percent: number;
  ends_at: string;
};

export default function PlanView(): React.ReactElement {
  const [annually, setAnnually] = useState<boolean>(false);
  const [customPlanDrawer, setCustomPlanDrawer] = useState<boolean>(false);
  const [planDetails, setPlanDetails] = useState<PlanType[]>([]);
  const [expire, setExpire] = useState('');
  const [userPlanDetails, setUserPlanDetails] = useState<UserPlanType>({
    events_allocated: 0,
    events_used: 0,
    events_left: 0,
    expiry: '',
    name: '',
    storage_allocated: 0,
    photo_count: 0,
    video_count: 0,
    storage_percent: 0,
    storage_used: 0,
    validity: '',
    validity_percent: 0,
    ends_at: '',
  });
  const [loading, setLoading] = useState(false);
  const [fetchPlan, setFetchPlan] = useState(true);

  const isMounted = useRef(false);

  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();

  const isDesktop = useResponsive('up', 'lg');

  const { storage, events } = useSelector((state) => state.customPlan.value);

  const setData = (response: any) => {
    if (!isMounted.current) {
      const { data } = response.data;
      setExpire(data.user_plan.notice);
      const sortedData = data.plans.sort(
        (a: any, b: any) =>
          a.price_point_yearly.original_price - b.price_point_yearly.original_price ||
          a.price_point_monthly.original_price - b.price_point_monthly.original_price
      );
      setPlanDetails(sortedData);
      setUserPlanDetails(data.user_plan);
      if (data.subscription_request.events !== null) {
        dispatch(
          customPlan({
            events: data.subscription_request.events,
            storage: data.subscription_request.storage,
          })
        );
      }
      const plan = data.plans.map((d: any) => d.price_point_monthly.current_plan);
      if (plan.includes(true)) {
        setAnnually(annually);
      } else {
        setAnnually(!annually);
      }
    }
    setFetchPlan(false);
  };

  const getPlans = async (url: string) => {
    if (url === 'user-plans') {
      try {
        await axios.get(`/api/subscription/${url}`).then((response) => {
          setData(response);
        });
      } catch (error) {
        enqueueSnackbar(error.message, { variant: 'error' });
        setFetchPlan(false);
      }
    } else {
      try {
        await axios.post(`/api/subscription/${url}`).then((response) => {
          setData(response);
        });
        setLoading(false);
      } catch (error) {
        enqueueSnackbar(error.message, { variant: 'error' });
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    getPlans('user-plans');
    return () => {
      isMounted.current = true;
    };
  }, []);

  const switchHandler = () => {
    setAnnually(!annually);
  };

  const chargebee = (window as any).Chargebee.init({
    site: process.env.REACT_APP_CHARGEBEE_SITE_NAME,
    iframeOnly: true,
  });

  chargebee.setPortalSession(() => axiosCall());

  const axiosCall = async () => {
    try {
      const { data } = await axios.post('api/subscription/portal-session');
      return data.data;
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubscription = () => {
    let cbPortal = chargebee.createChargebeePortal();
    cbPortal.open({
      close: () => {
        setLoading(true);
        getPlans('refresh-plans');
      },
    });
  };

  return (
    <div style={{ maxWidth: '1400px', margin: 'auto' }}>
      <Grid container>
        <Grid
          item
          xs={12}
          sm={12}
          md={5}
          lg={5}
          sx={{ borderRight: isDesktop ? `2px solid #6d6d6d` : 'none' }}
        >
          {userPlanDetails ? (
            <SettingWrapper>
              {expire !== null && (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mb: 2,
                  }}
                >
                  <ReportProblemIcon fontSize="large" sx={{ color: 'error.dark' }} />
                  <Typography ml={1} variant="h5" pt={1}>
                    {expire}
                  </Typography>
                </Box>
              )}
              <div
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
              >
                <Box my={3}>
                  <Typography variant="h6">Your Current Plan</Typography>
                  <Typography variant="h5" color="primary">
                    {userPlanDetails.name ? userPlanDetails.name : '-'}
                  </Typography>
                </Box>
                <Box>
                  <Button variant="contained" size="small" onClick={handleSubscription}>
                    Manage Subscription
                  </Button>
                </Box>
              </div>

              <Typography variant="h6">No. of events left</Typography>
              <Typography mb={6} variant="h5" color="primary">
                {userPlanDetails.events_left}/{userPlanDetails.events_allocated}
              </Typography>
              {userPlanDetails.validity && (
                <>
                  <FlexItems>
                    <IconValiditySVG />
                    <Typography px={1} variant="h6">
                      Plan Validity
                    </Typography>
                  </FlexItems>
                  <Typography variant="body1" mt={1.5} mb={1}>
                    {userPlanDetails.validity}
                  </Typography>
                  <Box sx={{ width: '10rem' }}>
                    <LinearProgress
                      variant="determinate"
                      value={Number(userPlanDetails.validity_percent)}
                      color="info"
                    />
                  </Box>
                  <Typography variant="body1" mt={1.5} mb={6}>
                    Expires on:&nbsp;
                    {userPlanDetails.ends_at.split(' ')[0].split('-').reverse().join('-')}
                  </Typography>
                </>
              )}

              <FlexItems>
                <IconStorageSVG />
                <Typography px={1} variant="h6">
                  Storage
                </Typography>
              </FlexItems>
              <DFlex>
                <div>
                  <Typography mt={1.5} mb={1} variant="h6">
                    Utilised {userPlanDetails.storage_used}
                  </Typography>
                  <BorderLinearProgress
                    variant="determinate"
                    value={Number(userPlanDetails.storage_percent)}
                  />
                  <Typography py={1} variant="body1">
                    {userPlanDetails.photo_count} {''}Photos
                  </Typography>
                  <Typography py={1} variant="body1">
                    {userPlanDetails.video_count} {''}Videos
                  </Typography>
                </div>
                <div>
                  <Typography variant="h6" mt={1.5} mb={0.2} ml={1.5}>
                    Limit
                  </Typography>
                  <Typography variant="body1" ml={1.5}>
                    {userPlanDetails.storage_allocated} GB
                  </Typography>
                </div>
              </DFlex>
            </SettingWrapper>
          ) : (
            <SettingWrapper>
              <Typography variant="h4" pt={1} color="primary">
                No details found!
              </Typography>
            </SettingWrapper>
          )}
        </Grid>
        <Grid item xs={12} sm={12} md={7} lg={7}>
          <SettingWrapper>
            <UpgradeHeading>
              <Typography variant="h4" pt={1} color="info.main">
                Available Plans
              </Typography>
              <div>
                <Stack direction="row" sx={{ py: isDesktop ? 0 : 3 }} alignItems="center">
                  <Typography pr={1} variant="h6">
                    Monthly
                  </Typography>
                  <Switch checked={annually} onChange={switchHandler} />
                  <Typography pl={1} variant="h6">
                    Annually
                  </Typography>
                </Stack>
                <Typography variant="h6" color="secondary">
                  17% savings on Annual plan
                </Typography>
              </div>
            </UpgradeHeading>

            {planDetails.length ? (
              <>
                {!annually ? (
                  <>
                    {planDetails.map((ele, index) => (
                      <Card
                        key={index}
                        sx={{
                          border: ele.price_point_monthly.current_plan
                            ? '1px solid #02C2D9'
                            : 'none',
                        }}
                      >
                        <div>
                          <Typography variant="h5" color="primary">
                            {ele.display_name}
                          </Typography>
                          <Typography variant="body1" py={2}>
                            {ele.storage} GB | {ele.event_count} Events
                          </Typography>
                          <RateWrapper>
                            <Typography variant="h2" color="primary">
                              &#8377;
                              {ele.price_point_monthly && ele.price_point_monthly.price}
                            </Typography>

                            <Typography variant="h5" color="primary">
                              /{ele.price_point_monthly && ele.price_point_monthly.period_unit}
                            </Typography>
                          </RateWrapper>
                        </div>
                        {ele.price_point_monthly && ele.price_point_monthly.current_plan ? (
                          <CurrentWrapper>
                            <Typography variant="h5" color="secondary">
                              Current Plan
                            </Typography>
                          </CurrentWrapper>
                        ) : null}
                      </Card>
                    ))}
                  </>
                ) : (
                  <>
                    {planDetails.map((ele, index) => (
                      <Card
                        key={index}
                        sx={{
                          border: ele.price_point_yearly.current_plan
                            ? '1px solid #02C2D9'
                            : 'none',
                        }}
                      >
                        <div>
                          <Typography variant="h5" color="primary">
                            {ele.display_name}
                          </Typography>
                          <Typography variant="body1" py={2}>
                            {ele.storage} GB | {ele.event_count} Events
                          </Typography>
                          <RateWrapper>
                            <Typography variant="h2" color="primary">
                              &#8377;
                              {ele.price_point_yearly && ele.price_point_yearly.price}
                            </Typography>
                            <Typography variant="h5" color="primary">
                              /month
                            </Typography>
                            {ele.price_point_yearly.original_price && (
                              <StrikeThroughText variant="h5" color="error" pl={2}>
                                &#8377;
                                {ele.price_point_yearly.original_price}/month
                              </StrikeThroughText>
                            )}
                          </RateWrapper>
                        </div>
                        {ele.price_point_yearly && ele.price_point_yearly.current_plan ? (
                          <CurrentWrapper>
                            <Typography variant="h5" color="secondary">
                              Current Plan
                            </Typography>
                          </CurrentWrapper>
                        ) : null}
                      </Card>
                    ))}
                  </>
                )}
              </>
            ) : (
              <Loader title={'Fetching Data'} isOpen={fetchPlan} />
            )}
            <Loader title={'Fetching Data'} isOpen={loading} />
            <Card>
              <div>
                <Typography variant="h5" color="primary">
                  Turtle Custom Plan
                </Typography>
                {storage !== 0 && events !== 0 ? (
                  <>
                    <Typography variant="body1" pt={1}>
                      Requested for
                    </Typography>
                    <Typography variant="body1" py={1}>
                      {storage} GB | {events} Events
                    </Typography>
                  </>
                ) : (
                  <>
                    <Typography variant="body1" py={2}>
                      Request your custom plan
                    </Typography>
                    <Typography variant="subtitle2" color="secondary">
                      Only for high volume users
                    </Typography>
                  </>
                )}
              </div>
              <div>
                <CustomPlanDrawer
                  openDrawer={customPlanDrawer}
                  onClose={() => {
                    setCustomPlanDrawer(false);
                  }}
                />
                <NextButton
                  onClick={(): void => {
                    setCustomPlanDrawer(true);
                  }}
                >
                  <IconGoSVG color="#7DD78D" />
                </NextButton>
              </div>
            </Card>
          </SettingWrapper>
        </Grid>
      </Grid>
    </div>
  );
}
