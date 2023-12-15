/*
 * Client OTP Page
 *
 */
import React, { useState } from 'react';

import { Button, Typography, styled } from '@mui/material';
import Clientauth from 'src/assets/shared/images/Clientauth.png';
import OtpInput from 'react-otp-input';
import { useForm } from 'react-hook-form';

import { FormProvider } from 'src/components/hook-form';
import IconNextSVG from 'src/assets/shared/svg/IconNextSVG';
import SignupBodyWrapper from 'src/components/auth/elements/SignupBodyWrapper';
import useAuth from 'src/hooks/useAuth';
import { useSelector } from 'src/redux/store';

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

export default function ClientOtpView(): React.ReactElement {
  const [OTP, setOTP] = useState<string>('');
  const [disableBtn] = useState<boolean>(false);

  const { user } = useAuth();

  const registrationDetails = useSelector((state) => state.user.value);

  const handleOtpChange = (otp: string) => {
    setOTP(otp);
  };

  const defaultValues = {
    otp: '',
  };

  const methods = useForm<FormValuesProps>({
    defaultValues,
  });

  return (
    <SignupBodyWrapper
      title={'OTP'}
      image={Clientauth}
      children={
        <OuterWrapper>
          <OtpWrapper>
            <Typography variant="h3" mb={8}>
              Hi,{' '}
              {(registrationDetails.name && registrationDetails.name) ||
                (user && user.name && user.name) ||
                'User'}
            </Typography>
            <Typography variant="h5" mb={1.5}>
              Please enter OTP received on your email
            </Typography>
            <FormProvider methods={methods}>
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
                <Button size="small" disabled={disableBtn}>
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
                  Proceed
                </Button>
              </ButtonWrapper>
            </FormProvider>
          </OtpWrapper>
        </OuterWrapper>
      }
    />
  );
}
