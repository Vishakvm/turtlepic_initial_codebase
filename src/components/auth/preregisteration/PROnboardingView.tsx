/*
 * Onboarding Page
 *
 */
import React, { useEffect, useState, useRef } from 'react';

import 'react-phone-number-input/style.css';

import { useParams, useLocation } from 'react-router-dom';

import { useNavigate } from 'react-router';
import { useSnackbar } from 'notistack';

import { styled, Typography, Button } from '@mui/material';
import { isValidPhoneNumber } from 'react-phone-number-input';

import { LoadingButton } from '@mui/lab';

import { ButtonContainer } from 'src/assets/shared/styles/SharedStylesComponent';
import axios from 'src/utils/axios';
import IconNextSVG from 'src/assets/shared/svg/IconNextSVG';
import PrOnboard from 'src/assets/shared/images/PrOnboard.png';
import { PATH_PRE_AUTH } from 'src/routes/paths';
import SignupBodyWrapper from 'src/components/auth/elements/SignupBodyWrapper';
import TPhoneComponent from 'src/assets/shared/elements/TPhoneComponent';
import useAuth from 'src/hooks/useAuth';
import { useSelector, useDispatch } from 'src/redux/store';
import { eventSlugDetails } from 'src/redux/slices/eventSlug';

const Wrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(18, 8, 8, 8),
  [theme.breakpoints.down('lg')]: {
    padding: theme.spacing(8),
  },
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(6, 2),
  },
}));

export default function LandingScreen(): React.ReactElement {
  const [phoneNumber, setPhoneNumber] = useState<string>('');

  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuth();
  let { event } = useParams();
  let { pathname } = useLocation();
  const dispatch = useDispatch();

  const registrationDetails = useSelector((state) => state.user.value);

  const isMounted = useRef(false);

  const getEventDetails = async (slug: string) => {
    try {
      await axios.get(`/api/events/${slug}/pre-registration`).then((response) => {
        if (!isMounted.current) {
          const { data } = response.data;

          if (process.env.REACT_APP_SHOW_SUBDOMAIN === 'true') {
            data &&
              data.domain &&
              !window.location.host.includes(data.domain) &&
              window.location.replace(
                `https://${data.domain}.${process.env.REACT_APP_MAIN_DOMAIN}/pre-registration/${event}/login`
              );
          }
          data.id &&
            dispatch(
              eventSlugDetails({
                eventId: data.id,
                eventSlug: event,
                eventStatus: data.event_status,
                hostName: data.host_name,
                isProtected: data.passcode,
              })
            );
        }
      });
    } catch (error) {
      enqueueSnackbar('Something went wrong!', { variant: 'error' });
    }
  };
  useEffect(() => {
    const slug = pathname.split('/')[2];

    getEventDetails(slug);
  }, [pathname]);

  const handlePhoneSubmit = async () => {
    if (phoneNumber) {
      if (isValidPhoneNumber(phoneNumber)) {
        try {
          await axios.post('/api/user/profile', {
            phone_number: phoneNumber,
          });
          navigate(`${PATH_PRE_AUTH}/${event}/selfie-filtering`);
        } catch (error) {
          console.error(error);
          enqueueSnackbar(error.message, { variant: 'error' });
        }
      } else {
        enqueueSnackbar('Please enter a valid phone number!', { variant: 'error' });
      }
    } else {
      enqueueSnackbar('Please enter phone number!', { variant: 'error' });
    }
  };

  return (
    <SignupBodyWrapper
      image={PrOnboard}
      title={'Onboarding'}
      logout={true}
      children={
        <Wrapper>
          <Typography align="center" variant="h2" mb={2}>
            Welcome onboard,{' '}
            {(registrationDetails.name && registrationDetails.name) ||
              (user && user.name && user.name) ||
              'User'}
            !
          </Typography>
          <Typography align="center" variant="h5">
            Your registration is successful.
          </Typography>
          <Typography align="center" variant="h5" mb={4}>
            You will get an email when the event gets published.
          </Typography>

          <Typography pb={1}>
            Enter your number to get updates on Whatsapp about this event
          </Typography>
          <TPhoneComponent
            value={phoneNumber}
            defaultCountry="IN"
            onChange={(phone: any) => setPhoneNumber(phone)}
            error={
              phoneNumber
                ? isValidPhoneNumber(phoneNumber)
                  ? undefined
                  : 'Invalid phone number'
                : 'Phone number required'
            }
          />

          <ButtonContainer>
            <Button
              sx={{ width: 200 }}
              size="large"
              color="primary"
              variant="outlined"
              onClick={() => {
                navigate(`${PATH_PRE_AUTH}/${event}/selfie-filtering`);
              }}
            >
              I’ll do it later
            </Button>
            <LoadingButton
              sx={{ width: 200 }}
              size="large"
              variant="contained"
              color="primary"
              endIcon={<IconNextSVG />}
              onClick={handlePhoneSubmit}
            >
              Keep me updated
            </LoadingButton>
          </ButtonContainer>
        </Wrapper>
      }
    />
  );
}
