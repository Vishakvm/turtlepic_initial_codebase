import { useState } from 'react';
import { Outlet } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';
// hooks
import useSettings from '../../hooks/useSettings';
import useCollapseDrawer from '../../hooks/useCollapseDrawer';
// config
import { HEADER, NAVBAR } from '../../config';
//
import DashboardHeader from './header';
import MainFooter from './footer/MainFooter';
import NavbarVertical from './navbar/NavbarVertical';

// ----------------------------------------------------------------------

type MainStyleProps = {
  collapseClick: boolean;
};

const MainStyle = styled('main', {
  shouldForwardProp: (prop) => prop !== 'collapseClick',
})<MainStyleProps>(({ collapseClick, theme }) => ({
  flexGrow: 1,
  paddingTop: 0,
  paddingBottom: HEADER.MOBILE_HEIGHT + 24,
  paddingLeft: 20,
  paddingRight: 20,
  [theme.breakpoints.up('lg')]: {
    paddingLeft: 22,
    paddingRight: 22,
    paddingTop: 0,
    paddingBottom: HEADER.DASHBOARD_DESKTOP_HEIGHT + 24,
    width: `calc(100% - ${NAVBAR.DASHBOARD_WIDTH}px)`,
    transition: theme.transitions.create('margin-left', {
      duration: theme.transitions.duration.shorter,
    }),
    ...(collapseClick && {
      marginLeft: NAVBAR.DASHBOARD_COLLAPSE_WIDTH,
    }),
  },
}));

const Body = styled('div')(({ theme }) => ({
  maxHeight: '100%',
  overflow: 'auto',
  overflowY: 'scroll',
  '&::-webkit-scrollbar': {
    width: '0.3em',
    backgroundColor: '#000',
  },
  '&::-webkit-scrollbar-track': {
    boxShadow: 'inset 0 0 6px rgba(0,0,0,0.1)',
    backgroundColor: '#000',
    borderRadius: '10px',
  },
  '&::-webkit-scrollbar-thumb': {
    borderRadius: '10px',
    backgroundColor: '#7dd78d',
  },
}));

// ----------------------------------------------------------------------

export default function DashboardLayout() {
  const { collapseClick, isCollapse } = useCollapseDrawer();

  const { themeLayout } = useSettings();

  const [open, setOpen] = useState(false);

  const verticalLayout = themeLayout === 'vertical';

  if (verticalLayout) {
    return (
      <>
        <NavbarVertical isOpenSidebar={open} onCloseSidebar={() => setOpen(false)} />

        <Box
          component="main"
          sx={{
            px: { lg: 2 },
            pt: {
              xs: `${HEADER.MOBILE_HEIGHT + 24}px`,
              lg: `${HEADER.DASHBOARD_DESKTOP_HEIGHT + 80}px`,
            },
            pb: {
              xs: `${HEADER.MOBILE_HEIGHT + 24}px`,
              lg: `${HEADER.DASHBOARD_DESKTOP_HEIGHT + 24}px`,
            },
          }}
        >
          <Outlet />
        </Box>
      </>
    );
  }

  return (
    <Body>
      <Box
        sx={{
          display: { lg: 'flex' },
          minHeight: { lg: 1 },
        }}
      >
        <DashboardHeader isCollapse={isCollapse} onOpenSidebar={() => setOpen(true)} />

        <NavbarVertical isOpenSidebar={open} onCloseSidebar={() => setOpen(false)} />

        <MainStyle collapseClick={collapseClick}>
          <Outlet />
          <MainFooter />
        </MainStyle>
      </Box>
    </Body>
  );
}
