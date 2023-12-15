import { styled, Typography, Grid, Stack, Switch } from '@mui/material';
import { useEffect, useState } from 'react';

import IconEditSVG from 'src/assets/shared/svg/icon_edit';
import Page from 'src/components/Page';
import { useSnackbar } from 'notistack';
import useResponsive from 'src/hooks/useResponsive';
import Loader from 'src/components/dialogs/Loader';
import axios from 'src/utils/axios';

const Wrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: theme.palette.grey[300],
}));
const NextButton = styled('div')(({ theme }) => ({
  position: 'relative',
  top: '-37px',
  cursor: 'pointer',
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
const Card = styled('div')(({ theme }) => ({
  padding: theme.spacing(2),
  background: theme.palette.grey[900],
  borderRadius: 4,
  margin: theme.spacing(3, 0, 3, 0),
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  boxShadow: '0px 15px 45px rgba(0, 23, 28, 0.5)',
}));
const RateWrapper = styled('div')(() => ({
  display: 'flex',
  alignItems: 'flex-end',
}));

export default function PlansView() {
  const [planDetails, setPlanDetails] = useState<PlanType[]>([]);
  const [fetchPlan, setFetchPlan] = useState(true);
  const [annually, setAnnually] = useState<boolean>(true);

  const { enqueueSnackbar } = useSnackbar();

  const isDesktop = useResponsive('up', 'lg');

  useEffect(() => {
    const getPlans = async () => {
      try {
        await axios.get('/api/subscription/plans').then((response) => {
          const { data } = response.data;
          const sortedData = data.sort(
            (a: any, b: any) =>
              a.price_point_yearly.original_price - b.price_point_yearly.original_price ||
              a.price_point_monthly.original_price - b.price_point_monthly.original_price
          );
          setPlanDetails(sortedData);
          setFetchPlan(false);
        });
      } catch (error) {
        enqueueSnackbar(error.message, { variant: 'error' });
        setFetchPlan(false);
      }
    };
    getPlans();
  }, [enqueueSnackbar]);

  const switchHandler = () => {
    setAnnually(!annually);
  };
  return (
    <Page
      title="Plans"
      header={true}
      headerTitle={
        <Typography color="primary" variant="h6">
          Plans
        </Typography>
      }
    >
      <Wrapper>
        <Grid container spacing={7}>
          <Grid item xs={12} sm={12} md={7} lg={7}>
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
            </div>
            {planDetails.length ? (
              <>
                {!annually ? (
                  <>
                    {planDetails.map((ele, index) => (
                      <Card key={index}>
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

                        <NextButton
                          onClick={() => window.open(`https://app.chargebee.com/`, '_blank')}
                        >
                          <IconEditSVG />
                        </NextButton>
                      </Card>
                    ))}
                  </>
                ) : (
                  <>
                    {planDetails.map((ele, index) => (
                      <Card key={index}>
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

                        <NextButton
                          onClick={() => window.open(`https://www.chargebee.com/`, '_blank')}
                        >
                          <IconEditSVG />
                        </NextButton>
                      </Card>
                    ))}
                  </>
                )}
              </>
            ) : (
              <Loader title={'Fetching Data'} isOpen={fetchPlan} />
            )}

            <Card>
              <div>
                <Typography variant="h5" color="primary">
                  Turtle Custom Plan
                </Typography>
                <Typography variant="body1" py={2}>
                  Customise your plan according to your need
                </Typography>
                <Typography variant="subtitle2" color="secondary" fontStyle="italic">
                  Only for high volume users
                </Typography>
              </div>

              <NextButton onClick={() => window.open(`https://www.chargebee.com/`, '_blank')}>
                <IconEditSVG />
              </NextButton>
            </Card>
          </Grid>
        </Grid>
      </Wrapper>
    </Page>
  );
}
