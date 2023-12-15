/*
 * PR Signup Page
 *
 */
import React, { useEffect, useState, useRef } from 'react';

import * as Yup from 'yup';
import { Stack, styled, Typography, Button, Box } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { yupResolver } from '@hookform/resolvers/yup';
import OtpInput from 'react-otp-input';

import { FormProvider, RHFTextField } from 'src/components/hook-form';
import {
  SocialButton,
  EventDetailBox,
  MiddleBorder,
} from 'src/assets/shared/styles/SharedStylesComponent';
import { PATH_PRE_AUTH } from 'src/routes/paths';

import { authType } from 'src/redux/slices/auth';
import axios from 'src/utils/axios';
import { eventSlugDetails } from 'src/redux/slices/eventSlug';
import IconFacebook from 'src/assets/shared/svg/icon_facebook';
import IconGoogle from 'src/assets/shared/svg/icon_google';
import IconNextSVG from 'src/assets/shared/svg/IconNextSVG';
import LandingImage from 'src/assets/shared/images/PrLoginView.png';
import { login } from 'src/redux/slices/user';
import { REGISTER, GUEST } from 'src/utils/constants';
import SignupBodyWrapper from 'src/components/auth/elements/SignupBodyWrapper';
import useAuth from 'src/hooks/useAuth';
import { useDispatch } from 'src/redux/store';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
import { passcodeType } from 'src/redux/slices/passcode';

type FormValuesProps = {
  fullName: string;
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

const ButtonContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  paddingTop: theme.spacing(2),
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column-reverse',
  },
}));

type EventDetailType = {
  name: string;
  date_display: string;
  venue: string;
  host_name: string;
  id: number;
  slug: string;
};

export default function PRSignupView(): React.ReactElement {
  const [eventDetails, setEventDetails] = useState<EventDetailType>({
    name: '',
    date_display: '',
    venue: '',
    host_name: '',
    id: 0,
    slug: '',
  });

  const [passcode, setPasscode] = useState<string>('');

  const [isProtected, setIsProtected] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [eventId, setEventId] = useState(0);

  const isMounted = useRef(false);
  let { event } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();
  const { sendotp, verifyotp } = useAuth();

  const isMountedRef = useIsMountedRef();

  useEffect(() => {
    const getEventDetails = async () => {
      try {
        await axios.get(`/api/events/${event}/pre-registration`).then((response) => {
          if (!isMounted.current) {
            const { data } = response.data;

            if (process.env.REACT_APP_SHOW_SUBDOMAIN === 'true') {
              data &&
                data.domain &&
                !window.location.host.includes(data.domain) &&
                window.location.replace(
                  `https://${data.domain}.${process.env.REACT_APP_MAIN_DOMAIN}/pre-registration/${event}/signup`
                );
            }
            if (data.event_status === 'published') {
              setIsPublished(true);
            }
            setEventId(data.id);
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
    getEventDetails();
    return () => {
      isMounted.current = true;
    };
  }, [dispatch, enqueueSnackbar, event]);

  const handleOtpChange = (otp: string) => {
    setPasscode(otp);
  };

  const RegisterSchema = Yup.object().shape({
    fullName: Yup.string().required('Full Name is required'),
    email: Yup.string()
      .email('Email must be a valid email address')
      .required('Email is required')
      .trim(),
  });

  const loginHandler = () => {
    navigate(`/pre-registration/${event}/login`);
  };

  const facebookSignin = async () => {
    if (passcode !== '') {
      try {
        const response = await axios.get('/api/auth/facebook/login', {
          params: { login: 0, account_type: GUEST, event_id: eventDetails.id, passcode },
        });
        const { data } = response.data;
        window.location.href = data.login_url;
      } catch (error) {
        enqueueSnackbar(error.message, { variant: 'error' });
      }
    } else {
      try {
        const response = await axios.get('/api/auth/facebook/login', {
          params: { login: 0, account_type: GUEST, event_id: eventDetails.id },
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
          params: { login: 0, account_type: GUEST, event_id: eventDetails.id, passcode },
        });
        const { data } = response.data;
        window.location.href = data.login_url;
      } catch (error) {
        enqueueSnackbar(error.message, { variant: 'error' });
      }
    } else {
      try {
        const response = await axios.get('/api/auth/google/login', {
          params: { login: 0, account_type: GUEST, event_id: eventDetails.id },
        });
        const { data } = response.data;
        window.location.href = data.login_url;
      } catch (error) {
        enqueueSnackbar(error.message, { variant: 'error' });
      }
    }
  };

  const defaultValues = {
    fullName: '',
    email: '',
  };

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(RegisterSchema),
    defaultValues,
  });

  const {
    reset,
    setError,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const handleForm = (data: FormValuesProps) => {
    dispatch(login({ name: data.fullName, email: data.email }));
  };

  const onSubmit = async (data: FormValuesProps) => {
    handleForm(data);
    try {
      if (!isPublished) {
        dispatch(authType({ type: REGISTER, guest: true }));
        handleForm(data);
        try {
          await verifyotp(
            data.email,
            'tpic',
            data.fullName,
            GUEST,
            '',
            eventId,
            null,
            // passcodeDetails.passcode
            passcode
          );

          navigate(`${PATH_PRE_AUTH}/${event}/thank-you`);
        } catch (error) {
          enqueueSnackbar(error.message, { variant: 'error' });
          // setOTP('');
          reset();
          dispatch(login({ name: '', email: '' }));
        }
      } else {
        if (isProtected) {
          await sendotp(data.email, false, data.fullName, passcode, eventDetails.id);
        } else {
          await sendotp(data.email, false, data.fullName);
        }
        if (passcode !== '') {
          dispatch(
            passcodeType({
              passcode: passcode,
            })
          );
        }
        navigate(`${PATH_PRE_AUTH}/${event}/otp`);
      }
    } catch (error) {
      enqueueSnackbar(error.message, { variant: 'error' });
      dispatch(login({ name: '', email: '' }));
      reset();
      if (isMountedRef.current) {
        setError('afterSubmit', { ...error, message: error.message });
      }
    }
  };

  useEffect(() => {
    dispatch(authType({ type: REGISTER, guest: true }));
  }, [dispatch]);

  return (
    <SignupBodyWrapper
      image={LandingImage}
      title={'Details'}
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

          <Typography align="center" variant="h2" mb={2}>
            Welcome to TurtlePic
          </Typography>
          <Typography align="center" variant="h5" mb={0}>
            Please register with us to get notified
          </Typography>
          <Typography align="center" variant="h5" mb={4}>
            when your pictures are published
          </Typography>
          <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Stack>
              <RHFTextField focus={true} name="fullName" label="Full Name*" />
              <RHFTextField name="email" label="Email*" />
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

            {/* SOCIAL LOGIN BUTTONS */}

            
            <Typography align="center" variant="h5" mt={3}>
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
              {/* <Button
                sx={{ width: 150 }}
                onClick={loginHandler}
                size="large"
                color="primary"
                variant="outlined"
              >
                Login
              </Button> */}
              {/* <div></div> */}

              {/* div Added to keep the layout */}

              <LoadingButton
                sx={{ width: 150 }}
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
