import React, { useState, useEffect, useRef } from 'react';

import { Grid, styled, Typography } from '@mui/material';
import { ApexOptions } from 'apexcharts';
import Chart from 'react-apexcharts';
import { useSnackbar } from 'notistack';

import axios from 'src/utils/axios';
import { useSelector } from 'src/redux/store';

import { DONUT, AREA } from 'src/utils/constants';

const Wrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(2),
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(1),
  },
}));

const ChartWithStyle = styled(Chart)(({ theme }) => ({
  boxShadow: '0px 0px 15px rgba(2, 194, 217, 0.1)',
  padding: theme.spacing(2),
  background: theme.palette.grey[900],
  borderRadius: '8px',
  height: '100%',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(0),
  },
}));

const EmptyWrapper = styled('div')(({ theme }) => ({
  boxShadow: '0px 0px 15px rgba(2, 194, 217, 0.1)',
  padding: theme.spacing(3),
  background: theme.palette.grey[900],
  borderRadius: '8px',
  height: '100%',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  },
}));

type InsightsType = {
  display_name: string;
  timeline_label: string;
  timeline: {
    x: Array<string>;
    y: Array<any>;
  };
};

export default function InsightsView() {
  const [insightsDetails, setInsightsDetails] = useState<InsightsType[]>([]);

  const isMounted = useRef(false);

  const eventDetail = useSelector((state) => state.createEvent.value);

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const getInshights = async () => {
      try {
        await axios.get(`/api/insights/event/${eventDetail.id}`).then((response) => {
          if (!isMounted.current) {
            const { data } = response.data;
            setInsightsDetails(data);
          }
        });
      } catch (error) {
        enqueueSnackbar(error.message, { variant: 'error' });
      }
    };
    getInshights();
    return () => {
      isMounted.current = true;
    };
  }, [enqueueSnackbar, eventDetail.id]);

  return (
    <Wrapper>
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
              } else if (ele.timeline_type === DONUT) {
                const donutChartOptions: ApexOptions = {
                  chart: {
                    foreColor: '#fff',
                    toolbar: {
                      show: false,
                    },
                  },
                  plotOptions: {
                    pie: {
                      donut: {
                        size: '45%',
                      },
                    },
                  },
                  dataLabels: {
                    enabled: false,
                  },
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
                  labels: ele.timeline.x,
                  series: ele.timeline.y,
                  colors: ['#7dd78d', '#f7da75', '#02c2d9'],
                  stroke: {
                    show: false,
                  },
                  legend: {
                    labels: {
                      colors: '#fff',
                    },
                    offsetX: 0,
                    offsetY: 100,
                  },
                };

                return (
                  <Grid key={i} item xs={12} sm={12} md={6} lg={6} xl={4}>
                    <ChartWithStyle
                      options={donutChartOptions}
                      series={donutChartOptions.series}
                      type="donut"
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
          }
        })}
      </Grid>
    </Wrapper>
  );
}
