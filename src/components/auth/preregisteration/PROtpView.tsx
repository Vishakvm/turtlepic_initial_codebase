/*
 * Sign Up OTP Page
 *
 */
import React, { useState, useEffect } from 'react';

import { useNavigate } from 'react-router';

import { useParams } from 'react-router-dom';

import { Button, Typography, styled } from '@mui/material';
import OtpInput from 'react-otp-input';
import { useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';

import { REGISTER, LOGIN, GUEST, PUBLISHED } from 'src/utils/constants';
import { PATH_PRE_AUTH } from 'src/routes/paths';

import axios from 'src/utils/axios';
import { FormProvider } from 'src/components/hook-form';
import IconNextSVG from 'src/assets/shared/svg/IconNextSVG';
import PrOtp from 'src/assets/shared/images/PrOtp.png';
import SignupBodyWrapper from 'src/components/auth/elements/SignupBodyWrapper';
import useAuth from 'src/hooks/useAuth';
import { useDispatch, useSelector } from 'src/redux/store';
import { passcodeType } from 'src/redux/slices/passcode';

type FormValuesProps = {
  otp: string;
  afterSubmit?: string;
};

const OtpWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(8),
  width: '650px',
  maxWidth: '100%',
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(6, 2),
  },
}));

const OtpInputWrapper = styled('div')(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    width: '260px',
    margin: 'auto',
  },
}));

const OuterWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
}));

const OtpResendBtn = styled('div')(({ theme }) => ({
  marginTop: theme.spacing(3),
}));

const ButtonWrapper = styled('div')(({ theme }) => ({
  float: 'right',
  paddingTop: theme.spacing(4),
}));

export default function LandingOtpView(): React.ReactElement {
  const [OTP, setOTP] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [, setErrorOpen] = React.useState<boolean>(false);
  const [disableBtn, setDisableBtn] = useState<boolean>(false);
  const [hasSelfie, setHasSelfie] = useState<boolean>(false);

  const navigate = useNavigate();

  const { user, verifyotp } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  let { event } = useParams();

  const registrationDetails = useSelector((state) => state.user.value);
  const loginDetails = useSelector((state) => state.login.value);
  const passcodeDetails = useSelector((state) => state.passcode.value);

  const auth = useSelector((state) => state.auth.value);
  const eventSlugDetails = useSelector((state: any) => state.eventSlug.value);

  useEffect(() => {
    user && setPhoneNumber(user.phone_number);
    user && setHasSelfie(user.has_selfie);
  }, [eventSlugDetails.eventSlug, navigate, user]);

  const handleOtpChange = (otp: string) => {
    setOTP(otp);
  };

  const resendPassword = async () => {
    try {
      if (!auth.type) {
        setErrorOpen(true);
        return;
      }
      if (auth.type === REGISTER) {
        await axios.post('/api/auth/otp/send', {
          email: registrationDetails,
          login: false,
          name: registrationDetails.name,
        });
      } else if (auth.type === LOGIN) {
        await axios.post('/api/auth/otp/send', {
          email: loginDetails.email,
          login: true,
        });
      }
    } catch (error) {
      enqueueSnackbar(error.message, { variant: 'error' });
    }
    setDisableBtn(true);
    setTimeout(() => {
      setDisableBtn(false);
    }, 10000);
  };

  const defaultValues = {
    otp: '',
  };

  const methods = useForm<FormValuesProps>({
    defaultValues,
  });

  const { handleSubmit } = methods;

  const onSubmit = async () => {
    try {
      if (auth.type === REGISTER) {
        await verifyotp(
          registrationDetails.email,
          OTP,
          registrationDetails.name,
          GUEST,
          '',
          eventSlugDetails.eventId,
          null,
          passcodeDetails.passcode
        );
        if (passcodeDetails.passcode !== '') {
          dispatch(
            passcodeType({
              passcode: '',
            })
          );
        }
            navigate(`${PATH_PRE_AUTH}/${event}/selfie-filtering`);
            // navigate(`${PATH_PRE_AUTH}/${event}/onboarding`);
      } else if (auth.type === LOGIN) {
        await verifyotp(
          loginDetails.email,
          OTP,
          '',
          GUEST,
          '',
          eventSlugDetails.eventId,
          null,
          passcodeDetails.passcode
        );
        if (passcodeDetails.passcode !== '') {
          dispatch(
            passcodeType({
              passcode: '',
            })
          );
        }
        // if (phoneNumber) {
          if (hasSelfie) {
            if (eventSlugDetails.eventStatus === PUBLISHED) {
              navigate(`${PATH_PRE_AUTH}/${event}/preview`);
            } else {
              navigate(`${PATH_PRE_AUTH}${event}/thankyou`);
            }
          } else {
            navigate(`${PATH_PRE_AUTH}/${event}/selfie-filtering`);
          }
        // } else {
        //   navigate(`${PATH_PRE_AUTH}/${event}/onboarding`);
        // }
      }
    } catch (error) {
      enqueueSnackbar(error.message, { variant: 'error' });

      setOTP('');
    }
  };
  return (
    <SignupBodyWrapper
      title={'OTP'}
      image={PrOtp}
      children={
        <OuterWrapper>
          <OtpWrapper>
            {auth.type === REGISTER && (
              <Typography variant="h3" mb={8}>
                Hi,{' '}
                {(registrationDetails.name && registrationDetails.name) ||
                  (user && user.name && user.name) ||
                  'User'}
              </Typography>
            )}
            {auth.type === LOGIN && (
              <Typography variant="h3" mb={8}>
                Hi,{' '}
                {(loginDetails.name && loginDetails.name) ||
                  (user && user.name && user.name) ||
                  'User'}
              </Typography>
            )}
            <Typography variant="h5" mb={1.5}>
              Please enter OTP received on your email to verify
            </Typography>
            <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
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
                    cursor: 'pointer',
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
          </OtpWrapper>
        </OuterWrapper>
      }
    />
  );
}
