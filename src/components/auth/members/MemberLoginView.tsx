/*
 * Members Login Page
 *
 */
import React, { useState, useEffect, useRef } from 'react';

import * as Yup from 'yup';
import { Stack, styled, Typography, Button } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { useSearchParams, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { yupResolver } from '@hookform/resolvers/yup';

import { FormProvider, RHFTextField } from '../../hook-form';
import { AGENCY } from 'src/utils/constants';
import { SocialButton, ButtonContainer } from 'src/assets/shared/styles/SharedStylesComponent';
import axios from 'src/utils/axios';
import IconFacebook from 'src/assets/shared/svg/icon_facebook';
import IconGoogle from 'src/assets/shared/svg/icon_google';
import IconNextSVG from 'src/assets/shared/svg/IconNextSVG';
import Member from 'src/assets/shared/images/Member.png';
import { PATH_PRE_AUTH } from 'src/routes/paths';
import SignupBodyWrapper from 'src/components/auth/elements/SignupBodyWrapper';
import useAuth from 'src/hooks/useAuth';
import { useDispatch } from 'src/redux/store';
import { userDetails } from 'src/redux/slices/login';

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
  agency_name: string;
};

export default function MemberLoginView(): React.ReactElement {
  const [eventDetails, setEventDetails] = useState<EventDetailType>({
    agency_name: '',
  });
  const [inviteToken, setInviteToken] = useState<string | null>(null);
  const [emailId, setEmailId] = useState<string | null>(null);

  const [searchParams] = useSearchParams();

  const isMounted = useRef(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { sendotp } = useAuth();
  let { event } = useParams();

  useEffect(() => {
    const tokenValue = searchParams.get('token');
    setInviteToken(tokenValue);
    const emailValue = searchParams.get('email');
    setEmailId(emailValue);
    const getEventDetails = async () => {
      try {
        await axios
          .post('/api/auth/invite/validate', {
            email: emailValue,
            invite_token: tokenValue,
          })
          .then((response) => {
            if (!isMounted.current) {
              const { data } = response.data;
              setEventDetails(data);
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
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const facebookSignin = async () => {
    try {
      const response = await axios.get('/api/auth/facebook/login', {
        params: { login: 1, account_type: AGENCY },
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
        params: { login: 1, account_type: AGENCY },
      });
      const { data } = response.data;
      window.location.href = data.login_url;
    } catch (error) {
      console.error(error);
      enqueueSnackbar(error.message, { variant: 'error' });
    }
  };

  const onSubmit = async (data: FormValuesProps) => {
    handleForm(data);
    try {
      await sendotp(data.email, true);
      navigate(`${PATH_PRE_AUTH}/${event}/otp`);
    } catch (error) {
      console.error(error);
      enqueueSnackbar(error.message, { variant: 'error' });
    }
  };

  const handleForm = (data: FormValuesProps) => {
    dispatch(userDetails({ email: data.email }));
  };

  const registerHandler = () => {
    navigate(`/member/auth/signup?token=${inviteToken}&email=${emailId}`);
  };

  return (
    <SignupBodyWrapper
      image={Member}
      title={'Login'}
      children={
        <Wrapper>
          <Typography
            align="center"
            color="secondary"
            variant="h4"
            mb={2}
            textTransform="capitalize"
          >
            Agency - {eventDetails.agency_name}
          </Typography>

          <Typography variant="h2" align="center" gutterBottom>
            Welcome to TurtlePic
          </Typography>
          <Typography variant="h5" align="center" mb={8}>
            Please enter your details to continue
          </Typography>
          <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Stack>
              <RHFTextField focus={true} name="fullName" label="Name" />
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
              <Button
                sx={{ width: 170 }}
                onClick={registerHandler}
                size="large"
                color="primary"
                variant="outlined"
              >
                Register
              </Button>
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
