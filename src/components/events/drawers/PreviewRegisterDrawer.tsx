import React, { useState } from 'react';

import * as Yup from 'yup';

import { useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router';
import { useLocation } from 'react-router-dom';

import { Stack, styled, Typography, Button, Drawer, Box } from '@mui/material';
import { LoadingButton } from '@mui/lab';

import { FormProvider, RHFTextField } from 'src/components/hook-form';
import { SocialButton } from 'src/assets/shared/styles/SharedStylesComponent';

import { authType } from 'src/redux/slices/auth';
import axios from 'src/utils/axios';
import IconFacebook from 'src/assets/shared/svg/icon_facebook';
import IconGoogle from 'src/assets/shared/svg/icon_google';
import IconNextSVG from 'src/assets/shared/svg/IconNextSVG';
import IconBackSVG from 'src/assets/shared/svg/icon_back';
import { isValidPhoneNumber } from 'react-phone-number-input';

import { login } from 'src/redux/slices/user';
import OtpInput from 'react-otp-input';
import { GUEST, REGISTER } from 'src/utils/constants';
import { useDispatch, useSelector } from 'src/redux/store';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
import useResponsive from 'src/hooks/useResponsive';
import useAuth from 'src/hooks/useAuth';
import TPhoneComponent from 'src/assets/shared/elements/TPhoneComponent';
import { PATH_PRE_AUTH } from 'src/routes/paths';
import { passcodeType } from 'src/redux/slices/passcode';

type DrawerProps = {
  openDrawer: boolean;
  onClose: () => void;
};

const Wrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(5, 8),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(0, 2, 0, 2),
  },
}));

const SocialButtonContainer = styled('div')(({ theme }) => ({
  textAlign: 'center',
}));

const ButtonContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  paddingTop: theme.spacing(2),
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column-reverse',
  },
}));

const ButtonProceed = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  paddingTop: theme.spacing(2),
}));

const OtpInputWrapper = styled('div')(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    width: '260px',
    margin: 'auto',
  },
}));

const OtpResendBtn = styled('div')(({ theme }) => ({
  marginTop: theme.spacing(3),
}));

const ButtonWrapper = styled('div')(({ theme }) => ({
  float: 'right',
  paddingTop: theme.spacing(4),
}));

type FormValuesProps = {
  fullName: string;
  email: string;
  afterSubmit?: string;
};

export default function PreviewRegisterDrawer(props: DrawerProps): React.ReactElement {
  const eventSlugDetails = useSelector((state: any) => state.eventSlug.value);

  const [OTP, setOTP] = useState<string>('');
  const [disableBtn, setDisableBtn] = useState<boolean>(false);
  const [previewRegister, setPreviewRegister] = useState(true);
  const [previewOtp, setPreviewOtp] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [passcode, setPasscode] = useState<string>('');
  const { pathname } = useLocation();
  const event = pathname.split('/')[2];

  const [isProtected] = useState(eventSlugDetails.isProtected);

  const [previewOnboard, setPreviewOnboard] = useState(false);
  const dispatch = useDispatch();

  const { enqueueSnackbar } = useSnackbar();

  const isMountedRef = useIsMountedRef();

  const { sendotp, verifyotp, user } = useAuth();

  const registrationDetails = useSelector((state) => state.user.value);

  const passcodeDetails = useSelector((state) => state.passcode.value);

  const isDesktop = useResponsive('up', 'lg');
  const navigate = useNavigate();

  const handleOtpChange = (otp: string) => {
    setOTP(otp);
  };
  const handlePasscodeChange = (code: string) => {
    setPasscode(code);
  };

  const RegisterSchema = Yup.object().shape({
    fullName: Yup.string().required('Full Name is required'),
    email: Yup.string()
      .email('Email must be a valid email address')
      .required('Email is required')
      .trim(),
  });

  const facebookSignin = async () => {
    dispatch(authType({ type: REGISTER }));

    if (passcode !== '') {
      try {
        const response = await axios.get('/api/auth/facebook/login', {
          params: { login: 0, account_type: GUEST, event_id: eventSlugDetails.eventId, passcode },
        });
        const { data } = response.data;
        window.location.href = data.login_url;
      } catch (error) {
        enqueueSnackbar(error.message, { variant: 'error' });
      }
    } else {
      try {
        const response = await axios.get('/api/auth/facebook/login', {
          params: { login: 0, account_type: GUEST, event_id: eventSlugDetails.eventId },
        });
        const { data } = response.data;
        window.location.href = data.login_url;
      } catch (error) {
        enqueueSnackbar(error.message, { variant: 'error' });
      }
    }
  };

  const googleSignin = async () => {
    dispatch(authType({ type: REGISTER }));

    if (passcode !== '') {
      try {
        const response = await axios.get('/api/auth/google/login', {
          params: { login: 0, account_type: GUEST, event_id: eventSlugDetails.eventId, passcode },
        });
        const { data } = response.data;
        window.location.href = data.login_url;
      } catch (error) {
        enqueueSnackbar(error.message, { variant: 'error' });
      }
    } else {
      try {
        const response = await axios.get('/api/auth/google/login', {
          params: { login: 0, account_type: GUEST, event_id: eventSlugDetails.eventId },
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
    dispatch(authType({ type: REGISTER, guest: true }));

    handleForm(data);
    try {
      if (eventSlugDetails.isProtected) {
        await sendotp(data.email, false, data.fullName, passcode, eventSlugDetails.eventId);
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
      setPreviewRegister(false);
      setPreviewOtp(true);
    } catch (error) {
      console.error(error);
      enqueueSnackbar(error.message, { variant: 'error' });
      reset();
      dispatch(login({ name: '', email: '' }));

      if (isMountedRef.current) {
        setError('afterSubmit', { ...error, message: error.message });
      }
    }
  };
  const otpSubmit = async (data: FormValuesProps) => {
    dispatch(authType({ type: REGISTER, guest: true }));
    handleForm(data);
    try {
      await verifyotp(
        data.email,
        'tpic',
        data.fullName,
        GUEST,
        '',
        eventSlugDetails.eventId,
        null,
        // passcodeDetails.passcode
        passcode

      );
      if (passcodeDetails.passcode !== '') {
        dispatch(
          passcodeType({
            passcode: '',
          })
        );
      }
      navigate(`${PATH_PRE_AUTH}/${event}/selfie-filtering`);


      // setPreviewOtp(false);
      // setPreviewOnboard(true);
    } catch (error) {
      enqueueSnackbar(error.message, { variant: 'error' });
      // setOTP('');
      reset();
      dispatch(login({ name: '', email: '' }));
    }
  };

  const onPhoneSubmit = async () => {
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
  const resendPassword = async () => {
    try {
      await axios.post('/api/auth/otp/send', {
        email: registrationDetails,
        login: false,
        name: registrationDetails.name,
      });
    } catch (error) {
      console.error(error);
      enqueueSnackbar(error.message, { variant: 'error' });
    }
    setDisableBtn(true);
    setTimeout(() => {
      setDisableBtn(false);
    }, 10000);
  };

  const handleResetForm = () => {
    props.onClose();
    setPreviewRegister(true);
    setPreviewOtp(false);
    setPreviewOnboard(false);
    reset();
    setPasscode('');
  };

  return (
    <Drawer open={props.openDrawer} anchor={'right'}>
      {previewRegister ? (
        <Box role="presentation" sx={{ width: isDesktop ? '720px' : '100%' }}>
          <Button
            sx={{ color: '#fff', mx: 3 }}
            onClick={() => {
              handleResetForm();
            }}
            startIcon={<IconBackSVG />}
          >
            Back
          </Button>
          <Wrapper>
            <Typography pb={10} align="center" variant="h2">
              Register with us to access this feature
            </Typography>
            <FormProvider methods={methods} onSubmit={handleSubmit(otpSubmit)}>
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
                      onChange={handlePasscodeChange}
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

              <ButtonProceed>
                {/* <Button
                  onClick={() => navigate(`/pre-registration/${eventSlugDetails.eventSlug}/login`)}
                  size="large"
                  variant="contained"
                  color="primary"
                  sx={{ width: 150 }}
                >
                  Login
                </Button> */}

                <div></div>

                {/* div Added to keep the layout */}

                <LoadingButton
                  size="large"
                  sx={{ width: 150 }}
                  type="submit"
                  variant="contained"
                  loading={isSubmitting}
                  color="primary"
                  endIcon={<IconNextSVG />}
                >
                  Proceed
                </LoadingButton>
              </ButtonProceed>
            </FormProvider>
          </Wrapper>
        </Box>
      ) : null}
      {previewOtp ? (
        <Box role="presentation" sx={{ width: isDesktop ? '720px' : '100%' }}>
          <Button
            sx={{ color: '#fff', mx: 3 }}
            onClick={() => {
              handleResetForm();
            }}
            startIcon={<IconBackSVG />}
          >
            Back
          </Button>
          <Wrapper>
            <Typography variant="h3" mb={8}>
              Hi,
              {(registrationDetails.name && registrationDetails.name) ||
                (user && user.name && user.name) ||
                'User'}
              !
            </Typography>
            <Typography variant="h5" mb={1.5}>
              Please enter OTP received on your email to verify
            </Typography>
            <FormProvider methods={methods} onSubmit={handleSubmit(otpSubmit)}>
              <OtpInputWrapper>
                <OtpInput
                  value={OTP}
                  isInputNum={true}
                  onChange={handleOtpChange}
                  shouldAutoFocus={true}
                  inputStyle={{
                    width: '4rem',
                    height: '4rem',
                    margin: '0.5rem',
                    fontSize: '1.6rem',
                    borderRadius: 6,
                    border: '1px solid #6D6D6D',
                    background: '#111',
                    color: '#fff',
                  }}
                  focusStyle={{
                    outline: '2px solid #7DD78D',
                    caretColor: '#7dd78d',
                  }}
                  containerStyle={{
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                  }}
                  numInputs={4}
                />
              </OtpInputWrapper>
              <OtpResendBtn>
                <Button size="small" onClick={resendPassword} disabled={disableBtn}>
                  Re-send OTP
                </Button>
              </OtpResendBtn>
              <ButtonWrapper>
                <Button
                  size="large"
                  variant="contained"
                  color="primary"
                  endIcon={<IconNextSVG />}
                  type="submit"
                >
                  Verify
                </Button>
              </ButtonWrapper>
            </FormProvider>
          </Wrapper>
        </Box>
      ) : null}
      {previewOnboard ? (
        <Box role="presentation" sx={{ width: isDesktop ? '720px' : '100%' }}>
          <Button
            sx={{ color: '#fff', mx: 3 }}
            onClick={() => {
              handleResetForm();
            }}
            startIcon={<IconBackSVG />}
          >
            Back
          </Button>
          <Wrapper>
            <Typography align="center" variant="h2" mb={2}>
              {(registrationDetails.name && registrationDetails.name) ||
                (user && user.name && user.name) ||
                'User'}
              !
            </Typography>
            <Typography align="center" variant="h6" fontSize="18px">
              Your registration is successful.
            </Typography>
            <Typography align="center" variant="h6" fontSize="18px" mb={5}>
              You will get an email when the event gets published.
            </Typography>

            <FormProvider methods={methods} onSubmit={handleSubmit(onPhoneSubmit)}>
              <Stack>
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
              </Stack>

              <ButtonContainer>
                <Button
                  size="large"
                  color="primary"
                  variant="outlined"
                  onClick={() => navigate(`${PATH_PRE_AUTH}/${event}/selfie-filtering`)}
                >
                  Skip / Do it later
                </Button>
                <LoadingButton
                  size="large"
                  type="submit"
                  variant="contained"
                  loading={isSubmitting}
                  color="primary"
                  endIcon={<IconNextSVG />}
                >
                  Keep me updated
                </LoadingButton>
              </ButtonContainer>
            </FormProvider>
          </Wrapper>
        </Box>
      ) : null}
    </Drawer>
  );
}
