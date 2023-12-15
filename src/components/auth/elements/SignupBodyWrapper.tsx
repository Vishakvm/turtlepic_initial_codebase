/*
 * Sign Up Body Wrapper
 *
 */
import React from 'react';

import { Button, Grid, styled } from '@mui/material';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';

import LogoWhiteSVG from 'src/assets/shared/svg/LogoWhiteSVG';
import Page from 'src/components/Page';
import useAuth from 'src/hooks/useAuth';
import { useNavigate } from 'react-router';
import { useSnackbar } from 'notistack';
import { useSelector } from 'src/redux/store';

type PropsType = {
  image?: React.ReactElement | string;
  children?: React.ReactElement;
  title: string;
  progress?: boolean;
  progressValue?: number;
  logout?: boolean;
  onClick?: () => void;
};

// Styles

export const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  borderRadius: 0,
  height: 10,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
  },
  [`& .${linearProgressClasses.bar}`]: {
    backgroundColor: theme.palette.secondary.main,
    borderRadius: 0,
  },
}));

const ImageWrapper = styled(Grid)(({ theme }) => ({
  background: 'black',
  [theme.breakpoints.down('md')]: {
    display: 'none',
  },
}));

const LogoWrapper = styled('div')(({ theme }) => ({
  position: 'absolute',
  cursor: 'pointer',
  top: '2.5rem',
  left: '2.5rem',
  [theme.breakpoints.down('md')]: {
    position: 'unset',
    padding: theme.spacing(4, 2, 0, 4),
  },
}));

const LogOutWrapper = styled('div')(({ theme }) => ({
  position: 'absolute',
  cursor: 'pointer',
  top: '2.5rem',
  right: '2.5rem',
}));

const InnerWrapper = styled('div')(({ theme }) => ({
  height: '800px',
  overflowY: 'scroll',
  justifyContent: 'center',
  // alignItems: 'center',
  display: 'flex',
  width: '100%',
  flexDirection: 'column',
  '::-webkit-scrollbar': {
    width: '0px',
    background: 'transparent',
  },
  padding: theme.spacing(4),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  },
}));

const ImageStyle = styled('img')(({ theme }) => ({
  height: '800px',
  objectFit: 'cover',
  [theme.breakpoints.down('md')]: {
    display: 'none',
  },
}));

const PowerIcon = styled(PowerSettingsNewIcon)(({ theme }) => ({
  color: theme.palette.grey[100],
  fontSize: '1.4rem',
}));

const LogoutButton = styled(Button)(({ theme }) => ({
  color: theme.palette.common.white,
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

export default function SignupBodyWrapper(props: PropsType): React.ReactElement {
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();
  const eventSlugDetails = useSelector((state: any) => state.eventSlug.value);

  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate(`/pre-registration/${eventSlugDetails.eventSlug}/login`, { replace: true });
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Unable to logout!', { variant: 'error' });
    }
  };
  return (
    <Body>
      <Page title={props.title}>
        {props.progress && (
          <BorderLinearProgress variant="determinate" value={props.progressValue} />
        )}
        <LogoWrapper>
          <LogoWhiteSVG />
        </LogoWrapper>
        {props.logout && (
          <LogOutWrapper>
            <LogoutButton onClick={handleLogout} size="small" startIcon={<PowerIcon />}>
              Logout
            </LogoutButton>
          </LogOutWrapper>
        )}

        <Grid container>
          <ImageWrapper item xs={12} sm={12} md={5} lg={5} xl={6}>
            {/* <div>{props.image}</div> */}
            <ImageStyle src={String(props.image)} alt="Iplan" width="100%" />
          </ImageWrapper>
          <Grid item xs={12} sm={12} md={7} lg={7} xl={6}>
            <InnerWrapper>{props.children}</InnerWrapper>
          </Grid>
        </Grid>
      </Page>
    </Body>
  );
}
