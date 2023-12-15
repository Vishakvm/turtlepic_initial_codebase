import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
// @mui
import { styled, useTheme } from '@mui/material/styles';
import { Stack, Drawer } from '@mui/material';
// hooks
import useResponsive from '../../../hooks/useResponsive';
import useCollapseDrawer from '../../../hooks/useCollapseDrawer';
// utils
import cssStyles from '../../../utils/cssStyles';
// config
import { NAVBAR } from '../../../config';
// components
import Logo from '../../../components/Logo';
import SmallLogoSVG from '../../../components/Logo2';
import Title from '../../../components/Title';
import Scrollbar from '../../../components/Scrollbar';
import { NavSectionVertical } from '../../../components/nav-section';
//
import {
  navConfig,
  navStorageConfig,
  navProfileConfig,
  navManagementConfig,
  navClientConfig,
  navConfig2,
  navStorageConfig2,
  navProfileConfig2,
  navManagementConfig2,
  navClientConfig2,
} from './NavConfig';
import CollapseButton from './CollapseButton';
import { IconButtonAnimate } from 'src/components/animate';

import CloseIcon from '@mui/icons-material/Close';
import useAuth from 'src/hooks/useAuth';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('lg')]: {
    flexShrink: 0,
    transition: theme.transitions.create('width', {
      duration: theme.transitions.duration.shorter,
    }),
  },
}));

// ----------------------------------------------------------------------

type Props = {
  isOpenSidebar: boolean;
  onCloseSidebar: VoidFunction;
};

export default function NavbarVertical({ isOpenSidebar, onCloseSidebar }: Props) {
  const theme = useTheme();

  const { pathname } = useLocation();

  const isDesktop = useResponsive('up', 'lg');
  const { user } = useAuth();

  const { isCollapse, collapseClick, collapseHover, onToggleCollapse } = useCollapseDrawer();

  useEffect(() => {
    if (isOpenSidebar) {
      onCloseSidebar();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const renderContent = (
    <Scrollbar
      sx={{
        background: theme.palette.grey[900],
        height: 1,
        '& .simplebar-content': { height: 1, display: 'flex', flexDirection: 'column' },
      }}
    >
      <Stack
        spacing={3}
        sx={{
          py: 3,
          px: 2,
          flexShrink: 0,
          position: 'fixed',
          backgroundColor: '#000',
          left: '0%',
          zIndex: 2,
          ...(isCollapse && { alignItems: 'center' }),
          ...(!isDesktop && { width: NAVBAR.BASE_WIDTH }),
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          borderBottom={'0.5px solid #6D6D6D'}
          paddingBottom={'10px'}
          sx={{
            ...(isCollapse && !isDesktop && { width: '100px' }),
          }}
        >
          {isDesktop && !isCollapse && <Logo />}

          {isDesktop && !isCollapse && <Title />}
          {!isDesktop && !isCollapse && <Logo />}

          {isDesktop && !isCollapse && (
            <CollapseButton onToggleCollapse={onToggleCollapse} collapseClick={collapseClick} />
          )}

          {isCollapse && isDesktop && (
            <>
              <SmallLogoSVG />
              <CollapseButton onToggleCollapse={onToggleCollapse} collapseClick={collapseClick} />
            </>
          )}

          {!isCollapse && !isDesktop && (
            <IconButtonAnimate onClick={() => onCloseSidebar()}>
              <CloseIcon color="primary" />
            </IconButtonAnimate>
          )}
        </Stack>
      </Stack>

      {user?.user_plan && user?.user_plan.expired ? (
        <>
          <NavSectionVertical
            navManagementConfig={navManagementConfig2}
            navProfileConfig={navProfileConfig2}
            navStorageConfig={navStorageConfig2}
            navConfig={navConfig2}
            navClientConfig={navClientConfig2}
            isCollapse={isCollapse}
          />
        </>
      ) : (
        <>
          <NavSectionVertical
            navManagementConfig={navManagementConfig}
            navProfileConfig={navProfileConfig}
            navStorageConfig={navStorageConfig}
            navConfig={navConfig}
            navClientConfig={navClientConfig}
            isCollapse={isCollapse}
          />
        </>
      )}
    </Scrollbar>
  );

  return (
    <RootStyle
      sx={{
        width: {
          lg: isCollapse ? NAVBAR.DASHBOARD_COLLAPSE_WIDTH : NAVBAR.DASHBOARD_WIDTH,
        },
        ...(collapseClick && {
          position: 'absolute',
        }),
      }}
    >
      {!isDesktop && (
        <Drawer
          open={isOpenSidebar}
          onClose={onCloseSidebar}
          PaperProps={{
            sx: {
              width: NAVBAR.BASE_WIDTH,
              border: 'none',
              bgcolor: 'background.default',
              transition: (theme) =>
                theme.transitions.create('width', {
                  duration: theme.transitions.duration.standard,
                }),
              ...(isCollapse && {
                width: NAVBAR.DASHBOARD_COLLAPSE_WIDTH,
              }),
              ...(collapseHover && {
                ...cssStyles(theme).bgBlur(),
                boxShadow: (theme) => theme.customShadows.z24,
              }),
            },
          }}
        >
          {renderContent}
        </Drawer>
      )}

      {isDesktop && (
        <Drawer
          open
          variant="persistent"
          PaperProps={{
            sx: {
              width: NAVBAR.DASHBOARD_WIDTH,
              border: 'none',
              bgcolor: 'background.default',
              transition: (theme) =>
                theme.transitions.create('width', {
                  duration: theme.transitions.duration.standard,
                }),
              ...(isCollapse && {
                width: NAVBAR.DASHBOARD_COLLAPSE_WIDTH,
              }),
              ...(collapseHover && {
                ...cssStyles(theme).bgBlur(),
                boxShadow: (theme) => theme.customShadows.z24,
              }),
            },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </RootStyle>
  );
}
