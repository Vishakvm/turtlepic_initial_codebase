import * as React from 'react';

import { Tabs, Tab, Box, Typography, styled } from '@mui/material';

import ThemesView from 'src/components/super-admin/themes/ThemesView';
import Page from '../../components/Page';
import useResponsive from 'src/hooks/useResponsive';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

export const OuterWrapper = styled('div')(({ theme }) => ({
  background: theme.palette.grey[300],
  height: '33rem',
  padding: theme.spacing(2),
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

export default function ThemesPage() {
  const [value, setValue] = React.useState(0);
  const isDesktop = useResponsive('up', 'lg');

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  return (
    <Page
      title="Users"
      header={true}
      headerTitle={
        <Typography color="primary" variant="h6">
          Themes
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
          <Tab label="Themes" {...a11yProps(0)} sx={{ px: isDesktop ? 5 : 2.5 }} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <ThemesView/>
      </TabPanel>
    </Page>
  );
}
