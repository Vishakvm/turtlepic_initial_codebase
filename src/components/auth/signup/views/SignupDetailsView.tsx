/*
 * Sign Up Details Page
 *
 */
import React, { useEffect } from 'react';

import * as Yup from 'yup';

import { useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';
import { yupResolver } from '@hookform/resolvers/yup';

import { Stack, styled, Typography, Button } from '@mui/material';
import { LoadingButton } from '@mui/lab';

import { FormProvider, RHFTextField } from 'src/components/hook-form';
import { ButtonContainer, SocialButton } from 'src/assets/shared/styles/SharedStylesComponent';
import { PATH_AUTH } from 'src/routes/paths';

import { authType } from 'src/redux/slices/auth';
import axios from 'src/utils/axios';
import ErrorDialog from 'src/components/dialogs/ErrorDialog';
import IconFacebook from 'src/assets/shared/svg/icon_facebook';
import IconGoogle from 'src/assets/shared/svg/icon_google';
import IconNextSVG from 'src/assets/shared/svg/IconNextSVG';
import Iplan from 'src/assets/shared/images/Iplan.png';
import { login } from 'src/redux/slices/user';
import { REGISTER } from 'src/utils/constants';
import SignupBodyWrapper from 'src/components/auth/elements/SignupBodyWrapper';
import useAuth from 'src/hooks/useAuth';
import { useDispatch, useSelector } from 'src/redux/store';
import useIsMountedRef from 'src/hooks/useIsMountedRef';

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

export default function SignupDetailsView(): React.ReactElement {
  const [openError, setErrorOpen] = React.useState<boolean>(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();
  const { sendotp } = useAuth();

  const isMountedRef = useIsMountedRef();

  const registrationType = useSelector((state) => state.userType.value);
  const planDetails = useSelector((state) => state.prePlan.value);

  useEffect(() => {
    if (!registrationType.type) {
      // navigate(PATH_AUTH.welcome);
      navigate(PATH_AUTH.plan);
      return;
    }
  }, [navigate, registrationType.type]);

  const RegisterSchema = Yup.object().shape({
    fullName: Yup.string().required('Full Name is required'),
    email: Yup.string()
      .email('Email must be a valid email address')
      .required('Email is required')
      .trim(),
  });

  const errorHandler = () => {
    // navigate(PATH_AUTH.welcome);
    navigate(PATH_AUTH.plan);
    setErrorOpen(false);
  };

  const loginHandler = () => {
    navigate(PATH_AUTH.login);
  };

  const facebookSignin = async () => {
    try {
      const response = await axios.get('/api/auth/facebook/login', {
        params: { login: 0, plan_id: planDetails.planId, account_type: registrationType.type },
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
        params: { login: 0, plan_id: planDetails.planId, account_type: registrationType.type },
      });
      const { data } = response.data;
      window.location.href = data.login_url;
    } catch (error) {
      enqueueSnackbar(error.message, { variant: 'error' });
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
      if (!registrationType.type) {
        setErrorOpen(true);
      } else {
        await sendotp(data.email, false, data.fullName);
        navigate(PATH_AUTH.otp);
      }
    } catch (error) {
      enqueueSnackbar(error.message, { variant: 'error' });
      reset();

      if (isMountedRef.current) {
        setError('afterSubmit', { ...error, message: error.message });
      }
    }
  };

  useEffect(() => {
    dispatch(authType({ type: REGISTER }));
  }, [dispatch]);

  return (
    <SignupBodyWrapper
      image={Iplan}
      title={'Details'}
      progress={true}
      progressValue={50}
      children={
        <Wrapper>
          <Typography align="center" variant="h2" mb={8}>
            Let's set up your free account
          </Typography>
          <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Stack>
              {/* {!!errors.afterSubmit && <Alert severity="error">{errors.afterSubmit.message}</Alert>} */}

              <RHFTextField name="fullName" label="Full Name*" />
              <RHFTextField name="email" label="Email*" />
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
              <Typography
                sx={{ cursor:'pointer',margin:'auto 0' }}
                onClick={loginHandler}
                // size="large"
                color="primary"
                // variant="outlined"
              >
                <u>Existing Users Login Here</u>
              </Typography>
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
          <ErrorDialog
            isDialogOpen={openError}
            buttonLabel="Go to home"
            dialogContent="Please tell us who you are!"
            dialogId="error-dialog-title"
            onClick={errorHandler}
            onClose={() => setErrorOpen(false)}
          />
        </Wrapper>
      }
    />
  );
}
