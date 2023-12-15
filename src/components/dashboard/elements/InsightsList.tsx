import React, { useState, useEffect, useRef } from 'react';

import { styled, Button, Grid, Typography, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import TrendingUpSharpIcon from '@mui/icons-material/TrendingUpSharp';
import TrendingDownSharpIcon from '@mui/icons-material/TrendingDownSharp';
import { useNavigate } from 'react-router';
import { useSnackbar } from 'notistack';

import axios from 'src/utils/axios';
import CreateEventDrawerView from 'src/components/dashboard/CreateEventDrawerView';
import IconGoSVG from 'src/assets/shared/svg/icon_go';
import { PATH_MAIN } from 'src/routes/paths';

const InsightsCard = styled('div')(({ theme }) => ({
  borderRadius: '4px',
  padding: theme.spacing(2),
  background: theme.palette.grey[300],
  marginBottom: theme.spacing(2),
  height: '7rem',
  display: 'flex',
  alignItems: 'center',
}));

const TitleWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
}));

const CardWrapper = styled('div')(({ theme }) => ({
  width: '360px',
  height: '160px',
  backgroundColor: theme.palette.grey[300],
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: theme.spacing(4.5),
  borderRadius: '4px',
  boxShadow: '0px 20px 60px rgba(0, 23, 28, 0.5)',
  cursor: 'pointer',
}));
const PlusIcon = styled(AddIcon)(({ theme }) => ({
  width: '2rem',
  height: '2rem',
}));

const FlexDiv = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(1, 0, 0, 0),
}));

type InsightsDetailType = {
  change_percent: number;
  change_percent_label: string;
  color: string;
  display_name: string;
  icon: string;
  name: string;
  value: number;
};
export default function InsightsList(): React.ReactElement {
  const [insightDetails, setInsightDetails] = useState<InsightsDetailType[]>([]);
  const [eventDrawer, setEventDrawer] = useState(false);

  const isMounted = useRef(false);

  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  useEffect(() => {
    const getInsightsData = async () => {
      try {
        await axios.get('/api/insights/dashboard').then((response) => {
          if (!isMounted.current) {
            const { data } = response.data;
            setInsightDetails(data);
          }
        });
      } catch (error) {
        enqueueSnackbar(error.message, { variant: 'error' });
      }
    };
    getInsightsData();
    return () => {
      isMounted.current = true;
    };
  }, [enqueueSnackbar]);

  return (
    <>
      <TitleWrapper>
        <Typography variant="h3" pr={2}>
          Insights
        </Typography>

        <Button
          color="primary"
          size="small"
          endIcon={<IconGoSVG color="#7DD78D" />}
          onClick={() => navigate(PATH_MAIN.insights)}
        >
          View All
        </Button>
      </TitleWrapper>

      {insightDetails.length !== 0 ? (
        <Grid container spacing={2}>
          {insightDetails.map((ele, i) => (
            <Grid item md={3} sm={6} xs={12} key={i}>
              <InsightsCard>
                <Box pr={2}>
                  <img src={String(ele.icon)} alt="events" />
                </Box>
                <Box>
                  <Typography pr={2} color={ele.color}>
                    {ele.value}
                  </Typography>
                  <Typography variant="h6">{ele.display_name}</Typography>
                  {ele.change_percent === 0 ? (
                    <FlexDiv>
                      {ele.change_percent > 0 ? (
                        <TrendingUpSharpIcon color="primary" />
                      ) : (
                        <TrendingDownSharpIcon color="error" sx={{ mb: 0.7 }} />
                      )}
                      <Typography
                        variant="subtitle2"
                        color={ele.change_percent > 4 ? 'primary' : 'error'}
                      >
                        {ele.change_percent}%
                      </Typography>
                      <Typography px={1} variant="subtitle2" color="grey.200">
                        {ele.change_percent_label}
                      </Typography>
                    </FlexDiv>
                  ) : (
                    <Typography variant="subtitle2" color="grey.200">
                      {/* Not enough data! */}
                    </Typography>
                  )}
                </Box>
              </InsightsCard>
            </Grid>
          ))}
        </Grid>
      ) : (
        <CardWrapper
          onClick={() => {
            setEventDrawer(true);
          }}
        >
          <Button color="primary" size="small" startIcon={<PlusIcon />}>
            Create an event
          </Button>
        </CardWrapper>
      )}
      <CreateEventDrawerView
        openDrawer={eventDrawer}
        onClose={() => {
          setEventDrawer(false);
        }}
      />
    </>
  );
}
