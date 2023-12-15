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
import IconNextSVG from 'src/assets/shared/svg/IconNextSVG';
import Member from 'src/assets/shared/images/Member.png';
import { PATH_MAIN } from 'src/routes/paths';
import SignupBodyWrapper from 'src/components/auth/elements/SignupBodyWrapper';
import TPhoneComponent from 'src/assets/shared/elements/TPhoneComponent';
import useAuth from 'src/hooks/useAuth';
import { useSelector } from 'src/redux/store';

const Wrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(1, 8, 8, 8),
  [theme.breakpoints.down('lg')]: {
    padding: theme.spacing(4),
  },
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(6, 2),
  },
}));

export default function MemberLandingScreen(): React.ReactElement {
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuth();

  const registrationDetails = useSelector((state) => state.user.value);

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
      image={Member}
      title={'Onboarding'}
      logout={false}
      children={
        <Wrapper>
          <Typography align="center" variant="h1" mb={2}>
            Welcome onboard,
            {(registrationDetails.name && registrationDetails.name) ||
              (user && user.name && user.name) ||
              'User'}
            !
          </Typography>
          <Typography align="center" variant="h5" mb={10}>
            Your registration is successful.
          </Typography>

          <Typography pb={2}>Contact Number</Typography>
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
              Skip/I’ll do it later
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
