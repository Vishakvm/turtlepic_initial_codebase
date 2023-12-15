// @mui
import { styled } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import { List, Box, ListSubheader, Typography } from '@mui/material';
// type
import { NavSectionProps } from '../type';

import { PATH_AUTH, PATH_MAIN } from 'src/routes/paths';

import { NavListRoot } from './NavList';
import { useNavigate } from 'react-router';
import useAuth from 'src/hooks/useAuth';
import { useSnackbar } from 'notistack';

import NavbarAccount from 'src/layouts/dashboard/navbar/NavbarAccount';
import StorageAccount from 'src/layouts/dashboard/navbar/StorageAccount';
import UpgradeSVG from 'src/assets/shared/svg/icon_upgrade';
import LogoutSVG from 'src/assets/shared/svg/icon_logout';

import { AGENCY } from 'src/utils/constants';
// ----------------------------------------------------------------------

export const ListSubheaderStyle = styled((props) => (
  <ListSubheader disableSticky disableGutters {...props} />
))(({ theme }) => ({
  ...theme.typography.overline,
  padding: theme.spacing(2, 0, 2, 0),

  transition: theme.transitions.create('opacity', {
    duration: theme.transitions.duration.shorter,
  }),
}));

const AccountWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0),
}));

export const URL = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: 'inherit',
}));

const Wrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(16, 0, 0, 0),
  maxHeight: '100%',
  overflow: 'auto',
  overflowX: 'hidden',
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
    backgroundColor: theme.palette.grey[300],
  },
}));

const Container = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2),
}));

// ----------------------------------------------------------------------

export default function NavSectionVertical({
  navConfig,
  navStorageConfig,
  navProfileConfig,
  navManagementConfig,
  navClientConfig,
  isCollapse = false,
  ...other
}: NavSectionProps) {
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate(PATH_AUTH.login, { replace: true });
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Unable to logout!', { variant: 'error' });
    }
  };
  return (
    <Wrapper>
      <Box {...other}>
        {navConfig.map((group, index) => (
          <List key={index} disablePadding sx={{ px: 2 }}>
            {group.items.map((list) => (
              <NavListRoot key={list.title} list={list} isCollapse={isCollapse} />
            ))}
          </List>
        ))}
      </Box>
      <Box {...other}>
        {navClientConfig?.map((group, index) => (
          <List key={index} disablePadding sx={{ px: 2, pt: 0 }}>
            {user?.account_type === AGENCY && (
              <>
                {group.items.map((list) => (
                  <NavListRoot key={list.title} list={list} isCollapse={isCollapse} />
                ))}
              </>
            )}
          </List>
        ))}
      </Box>
      <Box {...other}>
        {navStorageConfig?.map((group, index) => (
          <List
            key={index}
            disablePadding
            sx={{
              px: 2,
              pt: 0,
            }}
          >
            <ListSubheaderStyle>{group.subheader}</ListSubheaderStyle>
            <AccountWrapper>
              <StorageAccount isCollapse={isCollapse} />
            </AccountWrapper>
            {!isCollapse && (
              <Container>
                <URL to={`${PATH_MAIN.settings}?to=plan`}>
                  <Typography variant="subtitle1">Upgrade Plan</Typography>
                </URL>
                <UpgradeSVG />
              </Container>
            )}
          </List>
        ))}
      </Box>
      <Box {...other}>
        {navProfileConfig?.map((group, index) => (
          <List key={index} disablePadding sx={{ px: 2, pt: 0 }}>
            <ListSubheaderStyle>{group.subheader}</ListSubheaderStyle>
            <AccountWrapper>
              <NavbarAccount isCollapse={isCollapse} />
            </AccountWrapper>
            {user?.account_type === AGENCY && (
              <>
                {group.items.map((list) => (
                  <NavListRoot key={list.title} list={list} isCollapse={isCollapse} />
                ))}
              </>
            )}
          </List>
        ))}
      </Box>
      <Box {...other}>
        {navManagementConfig?.map((group, index) => (
          <List key={index} disablePadding sx={{ px: 2, pt: 0 }}>
            {group.items.map((list) => (
              <NavListRoot key={list.title} list={list} isCollapse={isCollapse} />
            ))}
          </List>
        ))}
      </Box>

      <Box>
        <List
          sx={{
            pl: 2.4,
            pt: 0,
            cursor: 'pointer',
          }}
          onClick={handleLogout}
        >
          <Container>
            <LogoutSVG />
            {!isCollapse && (
              <Typography
                sx={{
                  '&:hover': {
                    color: '#7dd78d',
                  },
                }}
                px={2.2}
                variant="subtitle2"
              >
                Logout
              </Typography>
            )}
          </Container>
        </List>
      </Box>
    </Wrapper>
  );
}
