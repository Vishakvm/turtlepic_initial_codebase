import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { styled, Drawer, Box, Button, Tabs, Tab } from '@mui/material';

import useResponsive from 'src/hooks/useResponsive';

import IconBackSVG from 'src/assets/shared/svg/icon_back';

import UploadMore from 'src/components/events/elements/UploadMore';
import UploadVideos from '../elements/UploadVideos';
import UploadGoogleDrive from '../elements/UploadGoogleDrive';

type DrawerProps = {
  openDrawer: boolean;
  onClose: () => void;
  val: number;
  refreshPage: Dispatch<SetStateAction<boolean>>;
};
const Div = styled('div')(({ theme }) => ({
  background: theme.palette.grey[300],
  borderRadius: '3px',
}));

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

export default function UploadMoreView({
  onClose,
  refreshPage,
  openDrawer,
  val,
}: DrawerProps): React.ReactElement {
  const [value, setValue] = useState<number>(0);

  const isDesktop = useResponsive('up', 'lg');

  const handleCloseDrawer = () => {
    onClose();
  };

  const isMounted = useRef(false);

  useEffect(() => {
    if (!isMounted.current) {
      setValue(val);
    }
  }, [val]);

  function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
      <Div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && <>{children}</>}
      </Div>
    );
  }

  function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  return (
    <Drawer open={openDrawer} anchor={'right'}>
      <Box role="presentation" sx={{ width: isDesktop ? '720px' : '100%' }}>
        <Button
          sx={{ color: '#fff', mx: 3 }}
          onClick={handleCloseDrawer}
          startIcon={<IconBackSVG />}
        >
          Back
        </Button>
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
            <Tab label="Image Upload" {...a11yProps(0)} sx={{ px: isDesktop ? 5 : 2.5 }} />

            <Tab label="Video Upload" {...a11yProps(1)} sx={{ px: isDesktop ? 5 : 2.5 }} />
            <Tab label="Google Drive Upload" {...a11yProps(2)} sx={{ px: isDesktop ? 5 : 2.5 }} />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          <UploadMore refreshPage={refreshPage} close={onClose} />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <UploadVideos refreshPage={refreshPage} close={onClose} />
        </TabPanel>
        <TabPanel value={value} index={2}>
          <UploadGoogleDrive refreshPage={refreshPage} close={onClose} />
        </TabPanel>
      </Box>
    </Drawer>
  );
}
