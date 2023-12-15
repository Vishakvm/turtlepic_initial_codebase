/*
 * Onboarding Page
 *
 */
import React from 'react';

import { styled, Typography, Button } from '@mui/material';

import { ButtonContainer } from 'src/assets/shared/styles/SharedStylesComponent';
import IconNextSVG from 'src/assets/shared/svg/IconNextSVG';
import Member from 'src/assets/shared/images/Member.png';
import SignupBodyWrapper from 'src/components/auth/elements/SignupBodyWrapper';
import TInputComponent from 'src/assets/shared/elements/TInputComponent';

type PropsType = {
  onClick?: () => void;
};

const Wrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(8),
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(6, 2),
  },
}));

export default function SignupOnboardView(props: PropsType): React.ReactElement {
  return (
    <SignupBodyWrapper
      title={'Onboarding'}
      image={<img src={String(Member)} alt="Iplan" height="auto" width="100%" />}
      progress={true}
      progressValue={25}
      children={
        <Wrapper>
          <Typography align="center" variant="h2">
            Welcome Onboard, Ramesh Mehra!
          </Typography>
          <Typography variant="h6" mb={8} mt={1} align="center">
            Your registration is successfull
          </Typography>
          <TInputComponent id="Contact Number" label="Contact Number" type="number" />

          <ButtonContainer>
            <Button size="large" color="primary" variant="outlined">
              skip / do it later
            </Button>
            <Button size="large" variant="contained" color="primary" endIcon={<IconNextSVG />}>
              Keep me updated
            </Button>
          </ButtonContainer>
        </Wrapper>
      }
    />
  );
}
