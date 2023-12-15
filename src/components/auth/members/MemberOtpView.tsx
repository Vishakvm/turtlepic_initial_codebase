/*
 * Member Login OTP Page
 *
 */
import React, { useState } from 'react';

import { useNavigate } from 'react-router';

import { Button, Typography, styled } from '@mui/material';
import OtpInput from 'react-otp-input';
import { useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';
import { useParams } from 'react-router-dom';

import { REGISTER, LOGIN, GUEST } from 'src/utils/constants';
import { PATH_PRE_AUTH } from 'src/routes/paths';

import { FormProvider } from 'src/components/hook-form';
import IconNextSVG from 'src/assets/shared/svg/IconNextSVG';
import Member from 'src/assets/shared/images/Member.png';
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

export default function MemberLoginOtpView(): React.ReactElement {
  const [OTP, setOTP] = useState<string>('');
  const [disableBtn] = useState<boolean>(false);

  let { event } = useParams();

  const navigate = useNavigate();

  const { verifyotp } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const registrationDetails = useSelector((state) => state.user.value);
  const loginDetails = useSelector((state) => state.login.value);
  const auth = useSelector((state) => state.auth.value);
  const eventSlugDetails = useSelector((state: any) => state.eventSlug.value);

  const handleOtpChange = (otp: string) => {
    setOTP(otp);
  };

  const resendPassword = async () => {};

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
          'plan',
          eventSlugDetails.eventId
        );
      } else if (auth.type === LOGIN) {
        await verifyotp(loginDetails.email, OTP, '', GUEST, '', eventSlugDetails.eventId);
      }
      navigate(`${PATH_PRE_AUTH}/${event}/onboarding`);
    } catch (error) {
      console.error(error);
      enqueueSnackbar(error.message, { variant: 'error' });
      setOTP('');
    }
  };
  return (
    <SignupBodyWrapper
      title={'OTP'}
      image={Member}
      children={
        <OuterWrapper>
          <OtpWrapper>
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
