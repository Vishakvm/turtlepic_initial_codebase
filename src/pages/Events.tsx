import React, { useState } from 'react';

import { Typography, Box, Tab, Tabs, styled, Grid } from '@mui/material';

import { AGENCY, CLIENT, INDIVIDUAL } from 'src/utils/constants';
import ClientEventsTab from 'src/components/events/eventlist/ClientEventsTabView';
import Page from '../components/Page';
import useAuth from 'src/hooks/useAuth';
import WorkspaceEventsTab from 'src/components/events/eventlist/WorkspaceEventsTabView';
import TransferredEventsTab from 'src/components/events/eventlist/TransferredEventsTab';
import RequestedEventsTab from 'src/components/events/eventlist/RequestedEventsTabView';

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
      {value === index && <TabWrapper>{children}</TabWrapper>}
    </div>
  );
}

function teamTabProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const TabWrapper = styled('div')(({ theme }) => ({
  background: theme.palette.grey[300],
  borderRadius: '3px',
}));

export const Wrapper = styled('div')(({ theme }) => ({
  background: theme.palette.grey[300],
  borderRadius: '3px',
  padding: theme.spacing(4),
  height: '70vh',
  overflowY: 'scroll',
  '::-webkit-scrollbar': {
    width: '0px',
    background: 'transparent',
  },
}));

export const ImgWrapper = styled('div')(({ theme }) => ({
  width: '13rem',
  height: '10rem',
}));

export const ImgStyle = styled('img')(({ theme }) => ({
  objectFit: 'cover',
  width: '100%',
  height: '100%',
}));

export const Folder = styled('div')(({ theme }) => ({
  position: 'relative',
  cursor: 'pointer',
  width: '13rem',
}));
export const LabelStyle = styled('div')(({ theme }) => ({
  background: theme.palette.secondary.main,
  padding: theme.spacing(0.15, 2.5),
  width: 'fit-content',
}));
export const LabelWrapper = styled('div')(({ theme }) => ({
  position: 'absolute',
  top: '-10px',
  left: '-10px',
}));
export const Triangle = styled('div')(({ theme }) => ({
  borderBottom: `8px solid ${theme.palette.secondary.main}`,
  borderLeft: '5px solid rgba(0, 0, 0, 0)',
  borderRight: '5px solid rgba(0, 0, 0, 0)',
  display: 'inline-block',
  height: 0,
  verticalAlign: 'top',
  width: 0,
  transform: 'rotate(180deg)',
}));

export const ActionWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
}));

export const GridStyle = styled(Grid)(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    justifyContent: 'center',
  },
}));

export const EmptyState = styled('div')(({ theme }) => ({
  height: '70vh',
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}));

export type EventDetailType = {
  name: string;
  date_display: string;
  venue: string;
  host_name: string;
  id: number;
  event_status: string;
  event_type: string;
  slug: string;
  video_count: number;
  photo_count: number;
  folder_count: number;
  cover_picture: {
    thumbnail_url: string;
  };
  client_status: string;
  client: {
    name: string;
    email: string;
  };
  upload_time_left: string;
  upload_time_percent: string;
};

export default function EventsPage() {
  const [value, setValue] = useState(0);
  const { user } = useAuth();

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Page
      title="Events"
      header={true}
      headerTitle={
        <Typography color="primary" variant="h6">
          Events
        </Typography>
      }
    >
      {user?.account_type === AGENCY && (
        <Box sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={value}
              onChange={handleChange}
              variant="scrollable"
              scrollButtons={false}
              allowScrollButtonsMobile
              TabIndicatorProps={{
                style: {
                  height: '5px',
                  borderRadius: '1px',
                },
              }}
            >
              <Tab label="Workspace Events" {...teamTabProps(0)} sx={{ px: 4 }} />
              <Tab label="Client Events" {...teamTabProps(1)} sx={{ px: 4 }} />
            </Tabs>
          </Box>

          <TabPanel value={value} index={0}>
            <WorkspaceEventsTab />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <ClientEventsTab />
          </TabPanel>
        </Box>
      )}
      {user?.account_type === CLIENT && (
        <Box sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={value}
              onChange={handleChange}
              variant="scrollable"
              scrollButtons={false}
              allowScrollButtonsMobile
              TabIndicatorProps={{
                style: {
                  height: '5px',
                  borderRadius: '1px',
                },
              }}
            >
              <Tab label="Workspace Events" {...teamTabProps(0)} sx={{ px: 4 }} />
              <Tab label="Requested Events" {...teamTabProps(1)} sx={{ px: 4 }} />
              <Tab label="Transferred Events" {...teamTabProps(2)} sx={{ px: 4 }} />
            </Tabs>
          </Box>

          <TabPanel value={value} index={0}>
            <WorkspaceEventsTab />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <RequestedEventsTab />
          </TabPanel>
          <TabPanel value={value} index={2}>
            <TransferredEventsTab />
          </TabPanel>
        </Box>
      )}
      {user?.account_type === INDIVIDUAL && (
        <Box sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={value}
              onChange={handleChange}
              variant="scrollable"
              scrollButtons={false}
              allowScrollButtonsMobile
              TabIndicatorProps={{
                style: {
                  height: '5px',
                  borderRadius: '1px',
                },
              }}
            >
              <Tab label="Workspace Events" {...teamTabProps(0)} sx={{ px: 4 }} />
            </Tabs>
          </Box>

          <TabPanel value={value} index={0}>
            <WorkspaceEventsTab />
          </TabPanel>
        </Box>
      )}
    </Page>
  );
}
