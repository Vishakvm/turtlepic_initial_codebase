import React, { useState } from 'react';

import { Typography, Box, Tab, Tabs } from '@mui/material';
import useResponsive from 'src/hooks/useResponsive';

import Page from 'src/components/Page';
import KycUploaded from 'src/components/super-admin/kyc/Uploaded';
import KycAll from 'src/components/super-admin/kyc/All';

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

export default function KycRequestList() {
  const [value, setValue] = useState(0);

  const isDesktop = useResponsive('up', 'lg');

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Page
      title="KycRequestList"
      header={true}
      headerTitle={
        <Typography color="primary" variant="h6">
          KYC
        </Typography>
      }
    >
      <>
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
            <Tab label="Uploaded" {...a11yProps(0)} sx={{ px: isDesktop ? 5 : 2.5 }} />
            <Tab label="All" {...a11yProps(1)} sx={{ px: isDesktop ? 5 : 2.5 }} />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          <KycUploaded />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <KycAll />
        </TabPanel>
      </>
    </Page>
  );
}
