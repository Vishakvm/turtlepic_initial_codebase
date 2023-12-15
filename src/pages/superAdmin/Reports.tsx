import { SetStateAction, useEffect, useRef, useState } from 'react';
// @mui
import {
  Typography,
  Grid,
  styled,
  Stack,
  Switch,
  Box,
  FormControl,
  Select,
  MenuItem,
} from '@mui/material';
// components
import Page from '../../components/Page';
import { ApexOptions } from 'apexcharts';
// ----------------------------------------------------------------------
import Chart from 'react-apexcharts';
import { AREA, BAR } from 'src/utils/constants';

import { useSnackbar } from 'notistack';

import axios from 'src/utils/axios';

const Wrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: '#292929',
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(1),
  },
}));

const ChartWithStyle = styled(Chart)(({ theme }) => ({
  boxShadow: '0px 0px 15px rgba(2, 194, 217, 0.1)',
  padding: theme.spacing(2),
  background: theme.palette.grey[300],
  borderRadius: '8px',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(0),
  },
}));
const UpperText = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
}));

const EmptyWrapper = styled('div')(({ theme }) => ({
  boxShadow: '0px 0px 15px rgba(2, 194, 217, 0.1)',
  padding: theme.spacing(3),
  background: theme.palette.grey[300],
  borderRadius: '8px',
  height: '100%',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  },
}));

type InsightsType = {
  display_name: string;
  timeline_label: string;
  timeline_type: string;
  timeline: {
    x: Array<string>;
    y: Array<any>;
  };
};
export default function ReportsView() {
  const [filter, setFilter] = useState<boolean>(false);
  const [insightsDetails, setInsightsDetails] = useState<InsightsType[]>([]);
  const [selectTimeline, setSelectTimeline] = useState('month');

  const isMounted = useRef(false);

  const { enqueueSnackbar } = useSnackbar();

  useEffect(
    () => () => {
      isMounted.current = true;
    },
    []
  );

  const handleFilter = (event: any) => {
    setFilter(event.target.checked);
  };

  const handleChangeTimeline = (event: { target: { value: SetStateAction<string> } }) => {
    setSelectTimeline(event.target.value);
  };

  useEffect(() => {
    const getInsights = async () => {
      try {
        await axios.get(`/api/insights/timelines?scope=${selectTimeline}`).then((response) => {
          if (!isMounted.current) {
            const { data } = response.data;
            setInsightsDetails(data);
          }
        });
      } catch (error) {
        enqueueSnackbar(error.message, { variant: 'error' });
      }
    };
    getInsights();
  }, [enqueueSnackbar, selectTimeline]);

  useEffect(
    () => () => {
      isMounted.current = true;
    },
    []
  );

  return (
    <Page
      title="Insights"
      header={true}
      headerTitle={
        <Typography color="primary" variant="h6">
          Insights
        </Typography>
      }
    >
      <Wrapper>
        <UpperText>
          <Box sx={{ minWidth: 90 }}>
            <FormControl>
              <Select
                sx={{
                  '.MuiOutlinedInput-notchedOutline': {
                    border: 'none',
                  },
                }}
                value={selectTimeline}
                onChange={handleChangeTimeline}
                displayEmpty
              >
                <MenuItem value="month">Monthly</MenuItem>
                <MenuItem value="week">Weekly</MenuItem>
                <MenuItem value="year">Yearly</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Stack direction="row" spacing={1} py={1} alignItems="center">
            <Typography variant="h6">Per event</Typography>
            <Switch name="selfie_filtering" checked={filter} onChange={handleFilter} />
            <Typography variant="h6">Cumulative</Typography>
          </Stack>
        </UpperText>
        <Grid container spacing={2}>
          {insightsDetails.map((ele: any, i) => {
            if (ele.timeline) {
              if (ele.timeline.x.length !== 0 && ele.timeline.y !== 0) {
                if (ele.timeline_type === AREA) {
                  const areaChartData: ApexOptions = {
                    chart: {
                      foreColor: '#fff',
                      toolbar: {
                        show: false,
                      },
                      zoom: {
                        enabled: false,
                      },
                    },
                    labels: ele.timeline.x,
                    xaxis: {
                      labels: {
                        format: 'dd/MM',
                      },
                    },
                    yaxis: {
                      labels: {
                        formatter: (value) => value.toFixed(0),
                      },
                    },
                    fill: {
                      type: 'gradient',
                      gradient: {
                        shade: 'dark',
                        type: 'vertical',
                        shadeIntensity: 0.1,
                        gradientToColors: undefined,
                        inverseColors: false,
                        opacityFrom: 0.6,
                        opacityTo: 0.4,
                        stops: [0, 50, 100],
                        colorStops: [],
                      },
                    },
                    tooltip: {
                      followCursor: false,
                      theme: 'dark',
                      x: {
                        show: false,
                      },
                    },
                    title: {
                      text: ele.display_name,
                      align: 'left',
                      style: {
                        fontSize: '16px',
                        fontWeight: 600,
                      },
                    },
                    subtitle: {
                      text: ele.timeline_label,
                      align: 'left',
                      style: {
                        fontSize: '13px',
                      },
                    },
                    dataLabels: {
                      enabled: false,
                    },
                    colors: ['#02c2d9'],
                    markers: {
                      size: 5,
                      colors: '#02c2d9',
                      strokeColors: '#02c2d9',
                      hover: {
                        size: 10,
                      },
                    },
                    stroke: {
                      curve: 'straight',
                      width: 1,
                    },
                    grid: {
                      borderColor: '#000',
                      strokeDashArray: 0,
                      xaxis: {
                        lines: {
                          show: true,
                        },
                      },
                      yaxis: {
                        lines: {
                          show: false,
                        },
                      },
                    },
                    series: [
                      {
                        name: ele.display_name,
                        data: ele.timeline.y,
                      },
                    ],
                  };

                  return (
                    <Grid key={i} item xs={12} sm={12} md={6} lg={6} xl={4}>
                      <ChartWithStyle
                        options={areaChartData}
                        series={areaChartData.series}
                        type="area"
                        height={300}
                      />
                    </Grid>
                  );
                } else if (ele.timeline_type === BAR) {
                  const barChartOptions: ApexOptions = {
                    chart: {
                      foreColor: '#fff',
                      toolbar: {
                        show: false,
                      },
                      type: ele.timeline_type,
                      height: 350,
                      stacked: true,
                      zoom: {
                        enabled: true,
                      },
                    },
                    colors: ['#02c2d9', '#111111'],
                    title: {
                      text: ele.display_name,
                      align: 'left',
                      style: {
                        fontSize: '17px',
                      },
                    },
                    subtitle: {
                      text: ele.timeline_label,
                      align: 'left',
                      style: {
                        fontSize: '13px',
                      },
                    },
                    dataLabels: {
                      enabled: false,
                    },

                    responsive: [
                      {
                        breakpoint: 480,
                        options: {
                          legend: {
                            position: 'bottom',
                            offsetX: -10,
                            offsetY: 0,
                          },
                        },
                      },
                    ],
                    plotOptions: {
                      bar: {
                        horizontal: false,
                        borderRadius: 0,
                        columnWidth: '50%',
                      },
                    },
                    tooltip: {
                      followCursor: false,
                      theme: 'dark',
                      x: {
                        show: false,
                      },
                    },
                    xaxis: {
                      type: 'category',
                      categories: ['Standard', 'Pro', 'Elite', 'Custom'],
                    },
                    yaxis: {
                      labels: {
                        formatter: (value) => value.toFixed(0),
                      },
                    },
                    grid: {
                      yaxis: {
                        lines: {
                          show: false,
                        },
                      },
                    },
                    legend: {
                      position: 'right',
                      offsetY: 40,
                    },
                  };

                  return (
                    <Grid key={i} item xs={12} sm={12} md={6} lg={6} xl={4}>
                      <ChartWithStyle
                        options={barChartOptions}
                        series={barChartOptions.series}
                        type="bar"
                        height={300}
                      />
                    </Grid>
                  );
                }
              } else {
                return (
                  <Grid key={i} item xs={12} sm={12} md={6} lg={6} xl={4}>
                    <EmptyWrapper>
                      <Typography variant="h4" mb={2}>
                        {ele.display_name}
                      </Typography>
                      <Typography variant="h5">Not enough data!</Typography>
                    </EmptyWrapper>
                  </Grid>
                );
              }
            } else {
              return (
                <Grid key={i} item xs={12} sm={12} md={6} lg={6} xl={4}>
                  <EmptyWrapper>
                    <Typography variant="h4" mb={2}>
                      {ele.display_name}
                    </Typography>
                    <Typography textTransform="capitalize" variant="h6">
                      Not enough data!
                    </Typography>
                  </EmptyWrapper>
                </Grid>
              );
            }
          })}
        </Grid>
      </Wrapper>
    </Page>
  );
}
