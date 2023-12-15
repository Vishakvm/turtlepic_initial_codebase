/*
 * Onboarding Page
 *
 */
import React, { useState } from 'react';

import 'react-phone-number-input/style.css';

import { styled, Typography, Button } from '@mui/material';
import { isValidPhoneNumber } from 'react-phone-number-input';
import { LoadingButton } from '@mui/lab';
import { useNavigate } from 'react-router';
import { useSnackbar } from 'notistack';

import axios from 'src/utils/axios';
import { ButtonContainer } from 'src/assets/shared/styles/SharedStylesComponent';
import Clientauth from 'src/assets/shared/images/Clientauth.png';
import IconNextSVG from 'src/assets/shared/svg/IconNextSVG';
import { PATH_MAIN } from 'src/routes/paths';
import SignupBodyWrapper from 'src/components/auth/elements/SignupBodyWrapper';
import TPhoneComponent from 'src/assets/shared/elements/TPhoneComponent';
import useAuth from 'src/hooks/useAuth';
import { useSelector } from 'src/redux/store';

const Wrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(18, 8, 8, 8),
  [theme.breakpoints.down('lg')]: {
    padding: theme.spacing(8),
  },
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(6, 2),
  },
}));

export default function ClientOnboardingView(): React.ReactElement {
  const [phoneNumber, setPhoneNumber] = useState<string>('');

  const registrationDetails = useSelector((state) => state.user.value);

  const { user } = useAuth();

  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const handlePhoneSubmit = async () => {
    if (phoneNumber) {
      if (isValidPhoneNumber(phoneNumber)) {
        try {
          await axios.post('/api/user/profile', {
            phone_number: phoneNumber,
          });
          navigate(PATH_MAIN.dashboard);
        } catch (error) {
          enqueueSnackbar(error.message, { variant: 'error' });
        }
      } else {
        enqueueSnackbar('Please enter a valid phone number!', { variant: 'error' });
      }
    } else {
      enqueueSnackbar('Please enter phone number!', { variant: 'error' });
    }
  };

  return (
    <SignupBodyWrapper
      image={Clientauth}
      title={'Onboarding'}
      children={
        <Wrapper>
          <Typography align="center" variant="h2">
            Welcome onboard,
            {(registrationDetails.name && registrationDetails.name) ||
              (user && user.name && user.name) ||
              'User'}
            !
          </Typography>
          <Typography align="center" variant="h5" mb={2}>
            Your registration is successful.
          </Typography>

          <Typography pb={1}>Contact Number</Typography>
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

          <ButtonContainer>
            <Button
              sx={{ width: 200 }}
              size="large"
              color="primary"
              variant="outlined"
              onClick={() => {
                navigate(PATH_MAIN.dashboard);
              }}
            >
              I’ll do it later
            </Button>
            <LoadingButton
              sx={{ width: 200 }}
              size="large"
              variant="contained"
              color="primary"
              endIcon={<IconNextSVG />}
              onClick={handlePhoneSubmit}
            >
              Keep me updated
            </LoadingButton>
          </ButtonContainer>
        </Wrapper>
      }
    />
  );
}
