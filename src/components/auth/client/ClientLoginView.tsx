/*
 * Sign Up Details Page
 *
 */
import React, { useEffect, useState, useRef } from 'react';

import * as Yup from 'yup';
import { Stack, styled, Typography, Button } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { yupResolver } from '@hookform/resolvers/yup';

import { FormProvider, RHFTextField } from '../../hook-form';
import { ButtonContainer, SocialButton } from 'src/assets/shared/styles/SharedStylesComponent';
import axios from 'src/utils/axios';
import Clientauth from 'src/assets/shared/images/Clientauth.png';
import IconFacebook from 'src/assets/shared/svg/icon_facebook';
import IconGoogle from 'src/assets/shared/svg/icon_google';
import IconNextSVG from 'src/assets/shared/svg/IconNextSVG';
import { PATH_CLIENT_AUTH } from 'src/routes/paths';
import SignupBodyWrapper from 'src/components/auth/elements/SignupBodyWrapper';
import useAuth from 'src/hooks/useAuth';
import { useDispatch } from 'src/redux/store';
import { userDetails } from 'src/redux/slices/login';
import useIsMountedRef from 'src/hooks/useIsMountedRef';

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

const EventWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
}));

const SocialButtonContainer = styled('div')(({ theme }) => ({
  textAlign: 'center',
}));

type EventDetailType = {
  agency: { name: string };
  event: { name: string };
};

export default function LoginView(): React.ReactElement {
  const [eventDetails, setEventDetails] = useState<EventDetailType>({
    agency: { name: '' },
    event: { name: '' },
  });
  const [emailId, setEmailId] = useState<string>('');
  const [agencyId, setAgencyId] = useState<string>('');
  const [eventId, setEventId] = useState<string>('');

  const [searchParams] = useSearchParams();

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { sendotp } = useAuth();

  const isMountedRef = useIsMountedRef();
  const isMounted = useRef(false);

  useEffect(() => {
    const agencyIdValue = searchParams.get('agency_id');
    agencyIdValue && setAgencyId(agencyIdValue);
    const eventIdValue = searchParams.get('event_id');
    eventIdValue && setEventId(eventIdValue);
    const emailValue = searchParams.get('email');
    emailValue && setEmailId(emailValue);
    const getEventDetails = async () => {
      try {
        await axios
          .post('/api/auth/client/validate', {
            email: emailValue,
            event_id: eventIdValue,
            agency_id: agencyIdValue,
          })
          .then((response) => {
            if (!isMounted.current) {
              const { data } = response.data;
              setEventDetails(data);
            }
          });
      } catch (error) {
        enqueueSnackbar(error.message, { variant: 'error' });
      }
    };
    getEventDetails();
    return () => {
      isMounted.current = true;
    };
  }, [enqueueSnackbar, searchParams]);

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
    reset,
    setError,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const handleForm = (data: FormValuesProps) => {
    dispatch(userDetails({ email: data.email }));
  };

  const registerHandler = () => {
    navigate(`/client/auth/signup?email=${emailId}&agency_id=${agencyId}&event_id=${eventId}`);
  };

  const facebookSignin = async () => {
    try {
      const response = await axios.get('/api/auth/facebook/login', {
        params: { login: 1 },
      });
      const { data } = response.data;
      window.location.href = data.login_url;
    } catch (error) {
      console.error(error);
      enqueueSnackbar(error.message, { variant: 'error' });
    }
  };

  const googleSignin = async () => {
    try {
      const response = await axios.get('/api/auth/google/login', {
        params: { login: 1 },
      });
      const { data } = response.data;
      window.location.href = data.login_url;
    } catch (error) {
      enqueueSnackbar(error.message, { variant: 'error' });
    }
  };

  const onSubmit = async (data: FormValuesProps) => {
    handleForm(data);
    try {
      await sendotp(data.email, true);
      navigate(PATH_CLIENT_AUTH.otp);
    } catch (error) {
      enqueueSnackbar(error.message, { variant: 'error' });
      reset();

      if (isMountedRef.current) {
        setError('afterSubmit', { ...error, message: error.message });
      }
    }
  };

  return (
    <SignupBodyWrapper
      image={Clientauth}
      title={'Login'}
      progress={true}
      progressValue={50}
      children={
        <Wrapper>
          <Typography variant="h2" align="center" gutterBottom>
            Welcome back!
          </Typography>
          <Typography variant="h5" align="center" mb={4}>
            Please login to access your account
          </Typography>
          <EventWrapper>
            <Typography align="center" variant="h4" mb={4} color="secondary">
              Event - {eventDetails.event.name}
            </Typography>
            <Typography align="center" variant="h4" mb={4} color="secondary">
              Agency - {eventDetails.agency.name}
            </Typography>
          </EventWrapper>
          <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Stack>
              <RHFTextField focus={true} name="email" label="Email*" />
            </Stack>

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
              {/* <Button onClick={registerHandler} size="large" color="primary" variant="outlined">
                Register
              </Button> */}
              <Typography
                sx={{ cursor: 'pointer', margin: 'auto 0' }}
                onClick={registerHandler}
                // size="large"
                color="primary"
                // variant="outlined"
              >
                <u>Create New Account</u>
              </Typography>
              <LoadingButton
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
