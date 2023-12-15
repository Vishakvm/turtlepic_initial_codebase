/*
 * PR Login Page
 *
 */
import React, { useEffect, useState, useRef } from 'react';

import * as Yup from 'yup';
import { Stack, styled, Typography, Button, Box } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { useLocation } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { yupResolver } from '@hookform/resolvers/yup';

import { FormProvider, RHFTextField } from '../../hook-form';
import { LOGIN, GUEST } from 'src/utils/constants';
import {
  ButtonContainer,
  SocialButton,
  EventDetailBox,
  MiddleBorder,
} from 'src/assets/shared/styles/SharedStylesComponent';
import { authType } from 'src/redux/slices/auth';
import axios from 'src/utils/axios';
import IconFacebook from 'src/assets/shared/svg/icon_facebook';
import IconGoogle from 'src/assets/shared/svg/icon_google';
import IconNextSVG from 'src/assets/shared/svg/IconNextSVG';
import LandingImage from 'src/assets/shared/images/PrLoginView.png';
import { PATH_PRE_AUTH } from 'src/routes/paths';
import SignupBodyWrapper from 'src/components/auth/elements/SignupBodyWrapper';
import { eventSlugDetails } from 'src/redux/slices/eventSlug';
import { passcodeType } from 'src/redux/slices/passcode';
import useAuth from 'src/hooks/useAuth';
import { useDispatch } from 'src/redux/store';
import { userDetails } from 'src/redux/slices/login';
import OtpInput from 'react-otp-input';

type FormValuesProps = {
  email: string;
  afterSubmit?: string;
};

const Wrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(8),
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(6, 2),
  },
}));

const SocialButtonContainer = styled('div')(({ theme }) => ({
  textAlign: 'center',
}));
type EventDetailType = {
  name: string;
  date_display: string;
  venue: string;
  host_name: string;
  id: number;
  slug: string;
  event_status: string;
};
export default function PRLoginView(): React.ReactElement {
  const [eventDetails, setEventDetails] = useState<EventDetailType>({
    name: '',
    date_display: '',
    venue: '',
    host_name: '',
    id: 0,
    slug: '',
    event_status: '',
  });

  const [passcode, setPasscode] = useState<string>('');

  const [isProtected, setIsProtected] = useState(false);
  const [event, setEvent] = useState('');
  const isMounted = useRef(false);
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { sendotp } = useAuth();
  let { pathname } = useLocation();

  const LoginSchema = Yup.object().shape({
    email: Yup.string()
      .email('Email must be a valid email address')
      .required('Email is required')
      .trim(),
  });

  const defaultValues = {
    email: '',
  };

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const handleOtpChange = (otp: string) => {
    setPasscode(otp);
  };
  const registerHandler = () => {
    navigate(`/pre-registration/${event}/signup`);
  };
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
          setIsProtected(data.passcode);
          setEventDetails(data);
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
    setEvent(slug);

    dispatch(authType({ type: LOGIN, guest: true }));

    getEventDetails(slug);
    return () => {
      isMounted.current = true;
    };
  }, [dispatch, pathname]);

  const facebookSignin = async () => {
    if (passcode !== '') {
      try {
        const response = await axios.get('/api/auth/facebook/login', {
          params: { login: 1, account_type: GUEST, event_id: eventDetails.id, passcode },
        });
        const { data } = response.data;
        window.location.href = data.login_url;
      } catch (error) {
        enqueueSnackbar(error.message, { variant: 'error' });
      }
    } else {
      try {
        const response = await axios.get('/api/auth/facebook/login', {
          params: { login: 1, account_type: GUEST, event_id: eventDetails.id },
        });
        const { data } = response.data;
        window.location.href = data.login_url;
      } catch (error) {
        enqueueSnackbar(error.message, { variant: 'error' });
      }
    }
  };

  const googleSignin = async () => {
    if (passcode !== '') {
      try {
        const response = await axios.get('/api/auth/google/login', {
          params: { login: 1, account_type: GUEST, event_id: eventDetails.id, passcode },
        });
        const { data } = response.data;
        window.location.href = data.login_url;
      } catch (error) {
        enqueueSnackbar(error.message, { variant: 'error' });
      }
    } else {
      try {
        const response = await axios.get('/api/auth/google/login', {
          params: { login: 1, account_type: GUEST, event_id: eventDetails.id },
        });
        const { data } = response.data;
        window.location.href = data.login_url;
      } catch (error) {
        enqueueSnackbar(error.message, { variant: 'error' });
      }
    }
  };

  const onSubmit = async (data: FormValuesProps) => {
    handleForm(data);
    try {
      if (isProtected) {
        await sendotp(data.email, true, '', passcode, eventDetails.id);
      } else {
        await sendotp(data.email, true, '');
      }
      if (passcode !== '') {
        dispatch(
          passcodeType({
            passcode: passcode,
          })
        );
      }
      navigate(`${PATH_PRE_AUTH}/${event}/otp`);
    } catch (error) {
      console.error(error);
      enqueueSnackbar(error.message, { variant: 'error' });
    }
  };

  const handleForm = (data: FormValuesProps) => {
    dispatch(userDetails({ email: data.email }));
  };

  return (
    <SignupBodyWrapper
      image={LandingImage}
      title={'Login'}
      children={
        <Wrapper>
          <Typography
            align="center"
            color="secondary"
            variant="h3"
            mb={2}
            textTransform="capitalize"
          >
            {eventDetails.name && eventDetails.name}
          </Typography>
          {(eventDetails.date_display || eventDetails.venue) && (
            <EventDetailBox
              sx={{
                justifyContent:
                  eventDetails.date_display && eventDetails.venue ? 'space-between' : 'center',
              }}
            >
              <Typography py={1} variant="h6">
                {eventDetails.date_display && eventDetails.date_display}
              </Typography>
              {eventDetails.date_display && eventDetails.venue && <MiddleBorder />}

              <Typography py={1} variant="h6">
                {eventDetails.venue && eventDetails.venue}
              </Typography>
            </EventDetailBox>
          )}

          <Typography variant="h2" align="center" gutterBottom>
            Welcome back!
          </Typography>
          <Typography variant="h5" align="center" mb={8}>
            Please login to access your account
          </Typography>
          <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Stack>
              <RHFTextField focus={true} name="email" label="Email*" />
            </Stack>
            {isProtected && (
              <>
                <Typography align="center" variant="h5">
                  Enter Passcode
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                  <OtpInput
                    value={passcode}
                    isInputNum={true}
                    onChange={handleOtpChange}
                    inputStyle={{
                      width: '3rem',
                      height: '3rem',
                      fontSize: '1rem',
                      borderRadius: 6,
                      border: '1px solid #6D6D6D',
                      background: 'none',
                      marginRight: '0.5rem',
                      color: '#fff',
                    }}
                    focusStyle={{
                      outline: '1px solid #7DD78D',
                      caretColor: '#7dd78d',
                    }}
                    numInputs={4}
                  />
                </Box>
              </>
            )}

            <Typography align="center" variant="h5" mt={isProtected ? 4 : 2}>
              or, continue with
            </Typography>
            <SocialButtonContainer>
              <SocialButton onClick={googleSignin} startIcon={<IconGoogle />}>
                <Typography color={'#fff'} variant="h6">
                  Google
                </Typography>
              </SocialButton>
              <SocialButton onClick={facebookSignin} startIcon={<IconFacebook />}>
                <Typography color={'#fff'} variant="h6">
                  Facebook
                </Typography>
              </SocialButton>
            </SocialButtonContainer>
            <ButtonContainer>
              <Typography
                sx={{ cursor: 'pointer', margin: 'auto 0' }}
                onClick={registerHandler}
                // size="large"
                color="primary"
                // variant="outlined"
              >
                <u>Create New Account</u>
              </Typography>
              {/* <Button
                sx={{ width: 170 }}
                onClick={registerHandler}
                size="large"
                color="primary"
                variant="outlined"
              >
                Register
              </Button> */}
              <LoadingButton
                sx={{ width: 170 }}
                size="large"
                type="submit"
                variant="contained"
                loading={isSubmitting}
                color="primary"
                endIcon={<IconNextSVG />}
              >
                Proceed
              </LoadingButton>
            </ButtonContainer>
          </FormProvider>
        </Wrapper>
      }
    />
  );
}
