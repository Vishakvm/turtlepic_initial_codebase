import * as React from 'react';

import { Tabs, Tab, Box, Typography } from '@mui/material';

import { AGENCY } from 'src/utils/constants';
import KycView from 'src/components/branding-details/KycView';
import Page from '../components/Page';
import ProfileView from 'src/components/branding-details/ProfileView';
import useAuth from 'src/hooks/useAuth';
import useResponsive from 'src/hooks/useResponsive';
import { useSearchParams } from 'react-router-dom';

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

export default function BrandingTabs() {
  const [value, setValue] = React.useState(0);
  const isDesktop = useResponsive('up', 'lg');
  const { user } = useAuth();

  const [searchParams, setSearchParams] = useSearchParams();

  React.useEffect(() => {
    const to = searchParams.get('to');
    if (to !== null) {
      if (to === 'kyc') {
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
      title="Branding"
      sx={{ p: 1 }}
      header={true}
      headerTitle={
        <Typography color="primary" variant="h6">
          Branding Details
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
          <Tab label="Profile Details" {...a11yProps(0)} sx={{ px: isDesktop ? 5 : 2.5 }} />
          {user?.account_type === AGENCY && (
            <Tab label="KYC Details" {...a11yProps(1)} sx={{ px: isDesktop ? 5 : 2.45 }} />
          )}
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <ProfileView />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <KycView />
      </TabPanel>
    </Page>
  );
}
