import React, { useEffect, useState } from 'react';

import {
  TableCell,
  Typography,
  styled,
  Button,
  Grid,
  Box,
  Tab,
  Tabs,
  List,
  ListItemAvatar,
  ListItem,
  ListItemText,
  ListItemButton,
} from '@mui/material';
import Chart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import useResponsive from 'src/hooks/useResponsive';
import { PATH_MAIN_ADMIN } from 'src/routes/paths';
import IconGoSVG from 'src/assets/shared/svg/icon_go';
import Star from 'src/assets/shared/images/Star.png';

import { DONUT } from 'src/utils/constants';
import Page from 'src/components/Page';
import UsersAccordian from 'src/components/super-admin/UsersAccordian';
import KycUploaded from 'src/components/super-admin/kyc/Uploaded';
import KycDetailView from 'src/components/super-admin/dashboard/KycDetailsView';
import KycAll from 'src/components/super-admin/kyc/All';
import axios from 'src/utils/axios';
import { ApexOptions } from 'apexcharts';

export const CardWrapper = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.grey[300],
  borderRadius: '4px',
  boxShadow: '0px 20px 60px rgba(0, 23, 28, 0.5)',
  cursor: 'pointer',
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

export const TitleWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  width: '100%',
}));

export const TableWrapper = styled(Box)(({ theme }) => ({
  height: '400px',
}));

export const TableBackground = styled('div')(({ theme }) => ({
  background: theme.palette.grey[300],
  padding: theme.spacing(2),
}));

export const CustomTableCell = styled(TableCell)(({ theme }) => ({
  padding: theme.spacing(1),
}));
export const CustomTableHeader = styled(TableCell)(({ theme }) => ({
  padding: theme.spacing(1),
  color: theme.palette.grey[100],
}));
const ChartWithStyle = styled(Chart)(({ theme }) => ({
  padding: theme.spacing(2),
  background: theme.palette.grey[300],
  borderRadius: '8px',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(0),
  },
  fontSize: '3px',
}));

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <div
          style={{
            background: '#292929',
            borderRadius: '3px',
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}
export interface KycListProps {
  id: number;
  name: string;
  contact: string;
  email: string;
  gst_no: string;
  pan: number;
  address_line_1: string;
  created_at: string;
  city: string;
  verification_status: string;
}

type InsightsType = {
  display_name: string;
  timeline_label: string;
  timeline_type: string;
  timeline: {
    x: Array<string>;
    y: Array<any>;
  };
};

export default function DashboardView() {
  const navigate = useNavigate();
  const theme = useTheme();
  const PRIMARY_MAIN = theme.palette.primary.main;

  const [value, setValue] = useState(0);
  const [showTabs, setShowTabs] = useState(false);
  const [insightsDetails, setInsightsDetails] = useState<InsightsType[]>([]);

  const isDesktop = useResponsive('up', 'lg');

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  useEffect(() => {
    const getInsightsData = async () => {
      try {
        await axios.get('/api/insights/dashboard').then((response) => {
          const { data } = response.data;
          setInsightsDetails(data);
        });
      } catch (error) {}
    };
    getInsightsData();
  }, []);

  return (
    <Page
      title="Dashboard"
      header={true}
      headerTitle={
        <Typography color="primary" variant="h6">
          Home
        </Typography>
      }
    >
      <>
        <KycDetailView />

        <TitleWrapper sx={{ marginTop: '50px' }}>
          <Typography variant="h3" pr={2}>
            Total Users Onboarded
          </Typography>
          <Button
            color="primary"
            size="small"
            endIcon={<IconGoSVG color={PRIMARY_MAIN} />}
            onClick={() => navigate(PATH_MAIN_ADMIN.users)}
          >
            View All
          </Button>
        </TitleWrapper>
        <Grid container>
          <Grid item lg={4} md={6} sm={12} xs={12}>
            <UsersAccordian userType="Agency" />
          </Grid>
          <Grid item lg={4} md={6} sm={12} xs={12}>
            <UsersAccordian userType="Individual" />
          </Grid>
        </Grid>

        <TitleWrapper sx={{ marginTop: '50px' }}>
          <Typography variant="h3" pr={2}>
            Insights
          </Typography>
          <Button
            color="primary"
            size="small"
            endIcon={<IconGoSVG color={PRIMARY_MAIN} />}
            onClick={() => navigate(PATH_MAIN_ADMIN.reports)}
          >
            View All
          </Button>
        </TitleWrapper>

        <Grid container spacing={1}>
          {insightsDetails.map((ele: any, i) => {
            if (ele.timeline) {
              if (ele.timeline.x !== null && ele.timeline.y !== null) {
                if (ele.timeline_type === 'bullets') {
                  return (
                    <Grid key={i} item xs={12} sm={6} md={6} lg={4} xl={4}>
                      <CardWrapper sx={{ p: 2, height: '100%' }}>
                        <Typography
                          variant="h4"
                          align="center"
                          sx={{
                            fontFamily: 'Inter,sans-serif',
                          }}
                        >
                          Most No. of Events Created By
                        </Typography>

                        <List sx={{ mt: 2 }}>
                          {ele.timeline.map((event: any, i: number) => (
                            <ListItem
                              sx={{
                                '.MuiListItemText-root': {
                                  textTransform: 'capitalize',
                                },
                              }}
                              key={i}
                              disablePadding
                            >
                              <ListItemAvatar>
                                <img src={String(Star)} alt="star" width={20} />
                              </ListItemAvatar>
                              <ListItemButton>
                                <ListItemText primary={event.x} />
                                <ListItemText
                                  primaryTypographyProps={{
                                    fontSize: '12px',
                                    textAlign: 'end',
                                  }}
                                  primary={`(${event.y})`}
                                />
                              </ListItemButton>
                            </ListItem>
                          ))}
                        </List>
                      </CardWrapper>
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
                          size: '60%',
                        },
                      },
                    },
                    dataLabels: {
                      enabled: false,
                    },
                    title: {
                      text: ele.display_name,
                      align: 'center',
                      style: {
                        fontSize: '17px',
                        fontFamily: 'Inter,sans-serif',
                      },
                    },

                    labels: ele.timeline.x,
                    series: ele.timeline.y,
                    colors: [
                      '#7dd78d',
                      '#f7da75',
                      '#02c2d9',
                      '#fff',
                      '#325638',
                      '#0966D0',
                      '#9D7A00',
                      '#7A7A7A',
                    ],
                    stroke: {
                      show: false,
                    },
                    legend: {
                      width: 150,
                      height: 55,
                      labels: {
                        colors: '#fff',
                      },
                      offsetX: 0,
                      offsetY: 40,
                      markers: {
                        offsetX: 0,
                        offsetY: 1.5,
                      },
                    },
                  };

                  return (
                    <Grid
                      key={i}
                      item
                      xs={12}
                      sm={6}
                      md={6}
                      lg={4}
                      xl={4}
                      sx={{ textTransform: 'capitalize' }}
                    >
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
                  <Grid key={i} item xs={12} sm={6} md={6} lg={4} xl={4}>
                    <EmptyWrapper sx={{ height: 300 }}>
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
                <Grid key={i} item xs={12} sm={6} md={6} lg={4} xl={4}>
                  <EmptyWrapper sx={{ height: 300 }}>
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
      </>
    </Page>
  );
}
