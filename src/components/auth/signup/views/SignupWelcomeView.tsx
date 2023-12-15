/*
 * Sign Up Welcome Page
 *
 */
import React from 'react';

import { useNavigate } from 'react-router-dom';

import { ToggleButtonGroup, Typography, ToggleButton, Button, styled } from '@mui/material';

import Agency from 'src/assets/shared/images/Agency.png';
import { INDIVIDUAL, AGENCY } from 'src/utils/constants';
import IconNextSVG from 'src/assets/shared/svg/IconNextSVG';
import { selectType } from 'src/redux/slices/userType';
import SignupBodyWrapper from 'src/components/auth/elements/SignupBodyWrapper';
import TickSVG from 'src/assets/shared/svg/signup/TickSVG';
import { useDispatch } from 'src/redux/store';
import { PATH_AUTH } from 'src/routes/paths';

const ContentWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
  marginTop: theme.spacing(8),
}));

const ToggleBtnGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  background: 'none',
  border: 'none',
  paddingTop: theme.spacing(10),
  '& .MuiToggleButton-root': {
    margin: theme.spacing(0, 4.5, 0, 4.5),
  },
}));

const ToggleBtn = styled(ToggleButton)(({ theme }) => ({
  width: '199px',
  height: '118px',
  boxShadow: `${theme.palette.primary.main} 0px 0px 3px`,
  borderRadius: 4,
  position: 'relative',
  [theme.breakpoints.down('sm')]: {
    width: '140px',
    height: '80px',
  },
}));

const TickIcon = styled('div')(({ theme }) => ({
  position: 'absolute',
  top: '-1rem',
  right: '-1rem',
}));

const ButtonContainer = styled('div')(({ theme }) => ({
  paddingTop: theme.spacing(10),
}));

export default function SignupWelcomeView(): React.ReactElement {
  const [user, setUser] = React.useState('');

  const dispatch = useDispatch();

  const navigate = useNavigate();
  const handleChange = (event: React.MouseEvent<HTMLElement>, newUser: string) => {
    setUser(newUser);
  };

  const clickHandler = () => {
    if (user !== '') {
      dispatch(selectType({ type: user }));
      navigate(PATH_AUTH.plan);
      // navigate(PATH_AUTH.details);
    }
  };

  return (
    <SignupBodyWrapper
      image={Agency}
      title={'Welcome'}
      children={
        <ContentWrapper>
          <Typography variant="h1" align="center" gutterBottom>
            Welcome To TurtlePic
          </Typography>
          <Typography variant="h3" align="center">
            Who are you?
          </Typography>
          <ToggleBtnGroup color="primary" value={user} exclusive onChange={handleChange}>
            <ToggleBtn value={AGENCY}>
              <Typography variant="h3" align="center" color="white">
                Agency
              </Typography>
              {user === AGENCY ? (
                <TickIcon>
                  <TickSVG />
                </TickIcon>
              ) : null}
            </ToggleBtn>
            <ToggleBtn value={INDIVIDUAL}>
              <Typography variant="h3" align="center" color="white">
                Individual
              </Typography>
              {user === INDIVIDUAL ? (
                <TickIcon>
                  <TickSVG />
                </TickIcon>
              ) : null}
            </ToggleBtn>
          </ToggleBtnGroup>
          <ButtonContainer>
            <Button
              size="large"
              variant="contained"
              color="primary"
              endIcon={<IconNextSVG />}
              onClick={clickHandler}
            >
              Proceed
            </Button>
          </ButtonContainer>
        </ContentWrapper>
      }
    />
  );
}
