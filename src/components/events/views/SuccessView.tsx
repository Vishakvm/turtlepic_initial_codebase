/*
 * Success Page
 *
 */
import React from 'react';

import { styled, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router';

import background from '../../../assets/shared/images/ThankyouBanner.png';
import { PATH_MAIN } from 'src/routes/paths';
import { useSelector } from 'src/redux/store';

const Wrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  height: '100vh',
  justifyContent: 'center',
}));
const Section = styled('div')(({ theme }) => ({
  backgroundImage: `url(${background})`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
}));

export default function SuccessView(): React.ReactElement {
  const navigate = useNavigate();

  const messageDetails = useSelector((state) => state.success.value);

  const handleNavigation = () => {
    navigate(PATH_MAIN.dashboard);
    localStorage.removeItem('redux-success');
  };
  return (
    <Section>
      <Wrapper>
        <Typography fontSize="30px" textAlign="center" mb={2} mt={20}>
          {messageDetails ? messageDetails.message : 'Success!'}
        </Typography>
        <Button variant="contained" size="medium" onClick={handleNavigation}>
          Go back to home
        </Button>
      </Wrapper>
    </Section>
  );
}
