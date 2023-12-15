import React from 'react';

import { Typography, Button, styled, Drawer, Box } from '@mui/material';

import IconBackSVG from 'src/assets/shared/svg/icon_back';
import useAuth from 'src/hooks/useAuth';
import useResponsive from 'src/hooks/useResponsive';

type DrawerProps = {
  openDrawer: boolean;
  onClose: () => void;
};

const Wrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(5),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(0, 2, 0, 2),
  },
}));

const ButtonWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  marginTop: theme.spacing(5),
}));

export default function PublishEventDrawerView(props: DrawerProps): React.ReactElement {
  const { user } = useAuth();

  const isDesktop = useResponsive('up', 'lg');

  return (
    <Drawer open={props.openDrawer} anchor={'right'}>
      <Box role="presentation" sx={{ width: isDesktop ? '720px' : '100%' }}>
        <Button sx={{ color: '#fff', mx: 3 }} onClick={props.onClose} startIcon={<IconBackSVG />}>
          Back
        </Button>
        <Wrapper>
          <Typography pb={5} align="center" variant="h2" color="primary">
            Pay before you publish
          </Typography>
          <Typography align="center" variant="h4" px={4}>
            Dear {user ? user.name : 'User'}, your storage exceeds you purchased plan, please
            upgrade your plan to publish your event.
          </Typography>
          <ButtonWrapper>
            <Button variant="contained" color="primary">
              Proceed to upgrade
            </Button>
          </ButtonWrapper>
        </Wrapper>
      </Box>
    </Drawer>
  );
}
