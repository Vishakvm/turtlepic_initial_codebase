/*
 * Sign Up OTP Page
 *
 */
import React, { useState, useEffect } from 'react';

import { useNavigate } from 'react-router';

import { Button, Typography, styled } from '@mui/material';
import OtpInput from 'react-otp-input';
import { useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';

import { REGISTER, LOGIN, INDIVIDUAL, AGENCY } from 'src/utils/constants';
import { PATH_AUTH, PATH_MAIN, PATH_PLAN } from 'src/routes/paths';

import axios from 'src/utils/axios';
import ErrorDialog from 'src/components/dialogs/ErrorDialog';
import { FormProvider } from 'src/components/hook-form';
import IconNextSVG from 'src/assets/shared/svg/IconNextSVG';
import Iplan from 'src/assets/shared/images/Iplan.png';
import SignupBodyWrapper from 'src/components/auth/elements/SignupBodyWrapper';
import useAuth from 'src/hooks/useAuth';
import { useSelector } from 'src/redux/store';
import LoadingButton from '@mui/lab/LoadingButton';
import { BUYPLAN } from 'src/utils/constants';

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

export default function SignupOtpView(): React.ReactElement {
  const [accountType, setAccountType] = useState<string>('');
  const [OTP, setOTP] = useState<string>('');
  const [openError, setErrorOpen] = React.useState<boolean>(false);
  const [disableBtn, setDisableBtn] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [autoFocus, setAutoFocus] = useState(true);
  const { planStatus } = useSelector((state: any) => state.prePlan.value);
  const navigate = useNavigate();

  const { user, verifyotp } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const registrationDetails = useSelector((state) => state.user.value);
  const loginDetails = useSelector((state) => state.login.value);
  const auth = useSelector((state) => state.auth.value);
  const planDetails = useSelector((state) => state.prePlan.value);
  const registrationType = useSelector((state) => state.userType.value);

  useEffect(() => {
    user && setAccountType(user.account_type);
  }, [user]);

  const handleOtpChange = (otp: string) => {
    setOTP(otp);
  };

  const errorHandler = () => {
    navigate(PATH_AUTH.plan);
    setErrorOpen(false);
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
    setLoading(true);
    try {
      if (!auth.type) {
        setErrorOpen(true);
        return;
      }
      if (auth.type === REGISTER) {
        await verifyotp(
          registrationDetails.email,
          OTP,
          registrationDetails.name,
          registrationType.type,
          planDetails.planId
        );
        // if (registrationType.type === AGENCY) {
        //   navigate(PATH_AUTH.agencyBrand);
        // } else if (registrationType.type === INDIVIDUAL) {
        //   navigate(PATH_AUTH.individualBrand);
        // }
        if (planStatus === BUYPLAN) {
          try {
            const response = await axios.get('/api/subscription/checkout/');
            const { data } = response.data;
            const { hosted_page } = data;
            window.location.replace(`${hosted_page.url}`);
          } catch (e) {
            console.error(e);
            enqueueSnackbar(e.message, { variant: 'error' });
          }
          setLoading(false);
        } else {
          navigate('/main/dashboard');
        }
      } else if (auth.type === LOGIN) {
        if (user?.user_plan) {
          if (user?.user_plan.expired) {
            await verifyotp(loginDetails.email, OTP, '', accountType);
            navigate(PATH_PLAN.root);
          } else {
            await verifyotp(loginDetails.email, OTP, '', accountType);
            navigate(PATH_MAIN.dashboard);
          }
        } else {
          await verifyotp(loginDetails.email, OTP, '', accountType);
          navigate(PATH_MAIN.dashboard);
        }
      }
    } catch (error) {
      enqueueSnackbar(error.message, { variant: 'error' });
      setLoading(false);
      setOTP('');
      setAutoFocus(true);
    }
  };
  return (
    <SignupBodyWrapper
      title={'OTP'}
      progress={true}
      progressValue={75}
      image={Iplan}
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
                  shouldAutoFocus={autoFocus}
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
                <LoadingButton
                  size="large"
                  variant="contained"
                  color="primary"
                  endIcon={<IconNextSVG />}
                  type="submit"
                  loading={loading}
                >
                  Verify
                </LoadingButton>
              </ButtonWrapper>
            </FormProvider>
          </OtpWrapper>

          <ErrorDialog
            isDialogOpen={openError}
            buttonLabel="Go to home"
            dialogContent="Please enter the email on which you want your OTP to be sent!"
            dialogId="error-dialog-title"
            onClick={errorHandler}
            onClose={() => setErrorOpen(false)}
          />
        </OuterWrapper>
      }
    />
  );
}
