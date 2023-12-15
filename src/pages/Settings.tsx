import React, { useEffect, useState } from 'react';
import { Tabs, Tab, Box, Typography, styled } from '@mui/material';

// Hooks
import useResponsive from 'src/hooks/useResponsive';

// Components
import Page from '../components/Page';

import AccountSettingView from 'src/components/setting/AccountSettingView';
import Plan from 'src/components/setting/Plan';
import { useSearchParams } from 'react-router-dom';
import useAuth from 'src/hooks/useAuth';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

export const SettingWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(3),
}));

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

export default function SettingsTabs() {
  const [value, setValue] = useState(0);
  const isDesktop = useResponsive('up', 'lg');
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();

  useEffect(() => {
    const to = searchParams.get('to');
    if (to !== null) {
      if (to === 'plan') {
        setValue(1);
        searchParams.delete('to');
        setSearchParams(searchParams);
      }
    }
  }, [searchParams, setSearchParams]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  return (
    <Page
      title="Settings"
      header={true}
      headerTitle={
        <Typography color="primary" variant="h6">
          Settings
        </Typography>
      }
    >
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          TabIndicatorProps={{
            style: {
              height: '5px',
              borderRadius: '1px',
            },
          }}
        >
          <Tab
            disabled={user?.user_plan && user?.user_plan.expired}
            label="Account Settings"
            {...a11yProps(0)}
            sx={{ px: isDesktop ? 5 : 2.5 }}
          />
          <Tab label="Plan Details" {...a11yProps(1)} sx={{ px: isDesktop ? 5 : 2.45 }} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <AccountSettingView />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Plan />
      </TabPanel>
    </Page>
  );
}
