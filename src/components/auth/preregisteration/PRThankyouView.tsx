/*
 * Thankyou Page
 *
 */
import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';

import { styled, Typography, Button } from '@mui/material';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';

import background from '../../../assets/shared/images/ThankyouBanner.png';
import useAuth from 'src/hooks/useAuth';
import { useSelector } from 'src/redux/store';
import { useNavigate } from 'react-router';
import { useSnackbar } from 'notistack';
import { PATH_PRE_AUTH } from 'src/routes/paths';
import { PUBLISHED } from 'src/utils/constants';
import axios from 'src/utils/axios';

const Wrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
}));
const Section = styled('div')(({ theme }) => ({
  height: '100vh',
  backgroundImage: `url(${background})`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  position: 'relative',
}));

const LogOutWrapper = styled('div')(({ theme }) => ({
  position: 'absolute',
  cursor: 'pointer',
  top: '2.5rem',
  right: '2.5rem',
}));

const PowerIcon = styled(PowerSettingsNewIcon)(({ theme }) => ({
  color: theme.palette.grey[100],
  fontSize: '1.4rem',
}));

const LogoutButton = styled(Button)(({ theme }) => ({
  color: theme.palette.common.white,
}));

export default function PRThankyouView(): React.ReactElement {
  const [status, setStatus] = useState('');
  const [eventName, setEventName] = useState('');

  const { user, logout } = useAuth();
  const registrationDetails = useSelector((state) => state.user.value);
  const navigate = useNavigate();
  let { event } = useParams();
  const { pathname } = useLocation();

  const { enqueueSnackbar } = useSnackbar();

  const getEventDetails = async (slug: string) => {
    try {
      await axios.get(`/api/events/${slug}/pre-registration`).then((response) => {
        const { data } = response.data;
        setStatus(data.event_status);
        setEventName(data.name);
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const eventSlug = pathname.split('/')[2];
    if (eventSlug) {
      getEventDetails(eventSlug);
    }
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate(`/pre-registration/${event}/login`, { replace: true });
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Unable to logout!', { variant: 'error' });
    }
  };

  return (
    <>
      <Section>
        <LogOutWrapper>
          <LogoutButton onClick={handleLogout} size="small" startIcon={<PowerIcon />}>
            Logout
          </LogoutButton>
        </LogOutWrapper>
        <Wrapper>
          <Typography mb={3} mt={22} variant="h2" textAlign="center">
            Thank you,{' '}
            {(registrationDetails.name && registrationDetails.name) ||
              (user && user.name && user.name) ||
              'User'}
            !
          </Typography>
          <Typography textAlign="center" variant="h5">
            You have successfully registered for {eventName || 'Event'}{' '}
          </Typography>
          <Typography textAlign="center" variant="h5">
            and you'll be notified by the host when photos are published.
          </Typography>
          {/* <Typography textAlign="center" variant="h5">
            the event saving you from all the unnecessary filtering.
          </Typography> */}
          {status === PUBLISHED && (
            <Button
              sx={{ m: 3 }}
              onClick={() => navigate(`${PATH_PRE_AUTH}/${event}/preview?to=allphotos`)}
            >
              Go to Preview
            </Button>
          )}
        </Wrapper>
      </Section>
    </>
  );
}
