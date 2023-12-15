import * as React from 'react';

import { Tabs, Tab, Box, Typography } from '@mui/material';

import Agency from 'src/components/super-admin/configurations/AgencyConfigView';
import Individual from 'src/components/super-admin/configurations/IndividualConfigView';
import Page from '../../components/Page';
import useResponsive from 'src/hooks/useResponsive';

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

export default function Configurations() {
  const [value, setValue] = React.useState(0);
  const isDesktop = useResponsive('up', 'lg');

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  return (
    <Page
      title="Branding"
      header={true}
      headerTitle={
        <Typography color="primary" variant="h6">
          Configurations
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
          <Tab label="Agency" {...a11yProps(0)} sx={{ px: isDesktop ? 5 : 2.5 }} />
          <Tab label="Individual" {...a11yProps(1)} sx={{ px: isDesktop ? 5 : 2.45 }} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <Agency />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Individual />
      </TabPanel>
    </Page>
  );
}
