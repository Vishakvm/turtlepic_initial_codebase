/*
 * Client Signup Page
 *
 */
import React, { useEffect, useState, useRef } from 'react';

import * as Yup from 'yup';
import { styled, Typography, Button } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { useSearchParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { yupResolver } from '@hookform/resolvers/yup';

import { FormProvider, RHFTextField } from 'src/components/hook-form';
import { SocialButton, ButtonContainer } from 'src/assets/shared/styles/SharedStylesComponent';
import { REGISTER, CLIENT } from 'src/utils/constants';
import { authType } from 'src/redux/slices/auth';
import axios from 'src/utils/axios';
import Clientauth from 'src/assets/shared/images/Clientauth.png';
import IconFacebook from 'src/assets/shared/svg/icon_facebook';
import IconGoogle from 'src/assets/shared/svg/icon_google';
import IconNextSVG from 'src/assets/shared/svg/IconNextSVG';
import { login } from 'src/redux/slices/user';
import { PATH_AUTH, PATH_MAIN } from 'src/routes/paths';
import SignupBodyWrapper from 'src/components/auth/elements/SignupBodyWrapper';
import useAuth from 'src/hooks/useAuth';
import { useDispatch } from 'src/redux/store';
import useIsMountedRef from 'src/hooks/useIsMountedRef';

type FormValuesProps = {
  name: string;
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

const EventWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
}));

type EventDetailType = {
  agency: { name: string };
  event: { name: string };
};

export default function PRSignupView(): React.ReactElement {
  const [eventDetails, setEventDetails] = useState<EventDetailType>({
    agency: { name: '' },
    event: { name: '' },
  });
  const [, setEmailId] = useState<string>('');
  const [agencyId, setAgencyId] = useState<string>('');
  const [eventId, setEventId] = useState<string>('');

  const [searchParams] = useSearchParams();

  const isMounted = useRef(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();
  const { clientRegistration } = useAuth();

  const isMountedRef = useIsMountedRef();

  const RegisterSchema = Yup.object().shape({
    name: Yup.string().required('Full Name is required'),
    email: Yup.string()
      .email('Email must be a valid email address')
      .required('Email is required')
      .trim(),
  });

  const loginHandler = () => {
    navigate(PATH_AUTH.login);
  };

  const facebookSignin = async () => {
    try {
      const response = await axios.get('/api/auth/facebook/login', {
        params: { login: 0, account_type: CLIENT, event_id: eventId, agency_id: agencyId },
      });
      const { data } = response.data;
      window.location.href = data.login_url;
    } catch (error) {
      enqueueSnackbar(error.message, { variant: 'error' });
    }
  };

  const googleSignin = async () => {
    try {
      const response = await axios.get('/api/auth/google/login', {
        params: { login: 0, account_type: CLIENT, event_id: eventId, agency_id: agencyId },
      });
      const { data } = response.data;
      window.location.href = data.login_url;
    } catch (error) {
      enqueueSnackbar(error.message, { variant: 'error' });
    }
  };

  const defaultValues = {
    name: '',
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
    setValue,
    formState: { isSubmitting },
  } = methods;

  const handleForm = (data: FormValuesProps) => {
    dispatch(login({ name: data.name, email: data.email }));
  };

  const onSubmit = async (data: FormValuesProps) => {
    handleForm(data);
    try {
      await clientRegistration(data.email, data.name, eventId, agencyId, CLIENT);
      navigate(PATH_MAIN.clientOnboarding);
    } catch (error) {
      enqueueSnackbar(error.message, { variant: 'error' });
      reset();

      if (isMountedRef.current) {
        setError('afterSubmit', { ...error, message: error.message });
      }
    }
  };

  useEffect(() => {
    const agencyIdValue = searchParams.get('agency_id');
    agencyIdValue && setAgencyId(agencyIdValue);
    const eventIdValue = searchParams.get('event_id');
    eventIdValue && setEventId(eventIdValue);
    const emailValue = searchParams.get('email');
    emailValue && setEmailId(emailValue);
    emailValue && setValue('email', emailValue);
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
  }, [enqueueSnackbar, searchParams, setValue]);

  useEffect(() => {
    dispatch(authType({ type: REGISTER, client: true }));
  }, [dispatch]);

  return (
    <SignupBodyWrapper
      image={Clientauth}
      title={'Details'}
      children={
        <Wrapper>
          <Typography align="center" variant="h2" mb={2}>
            Welcome to TurtlePic
          </Typography>
          <Typography align="center" variant="h5" mb={0}>
            You have been invited to authorise for an event.
          </Typography>
          <Typography align="center" variant="h5" mb={4}>
            Please register with us to proceed
          </Typography>
          <EventWrapper>
            {eventDetails.event.name && (
              <Typography align="center" variant="h4" mb={4} color="secondary">
                Event - {eventDetails.event.name}
              </Typography>
            )}
            {eventDetails.agency.name && (
              <Typography align="center" variant="h4" mb={4} color="secondary">
                Agency - {eventDetails.agency.name}
              </Typography>
            )}
          </EventWrapper>
          <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <RHFTextField focus={true} name="name" label="Name*" />
            <RHFTextField name="email" label="Email*" />

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
              <Button
                sx={{ width: 150 }}
                size="large"
                color="primary"
                variant="outlined"
                onClick={loginHandler}
              >
                Login
              </Button>
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
