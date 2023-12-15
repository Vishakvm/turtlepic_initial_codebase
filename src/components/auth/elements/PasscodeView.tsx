/*
 * PR Signup Page
 *
 */
import React, { useState } from 'react';

import { styled, Typography, Box, Grid } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useNavigate, useParams } from 'react-router';
import LogoWhiteSVG from 'src/assets/shared/svg/LogoWhiteSVG';

import { useSnackbar } from 'notistack';
import OtpInput from 'react-otp-input';

import axios from 'src/utils/axios';
import IconNextSVG from 'src/assets/shared/svg/IconNextSVG';
import LandingImage from 'src/assets/shared/images/Passcode.jpg';
import { useDispatch, useSelector } from 'src/redux/store';
import { passcodeStatusType } from 'src/redux/slices/passcodeStatus';

const LogoWrapper = styled('div')(({ theme }) => ({
  position: 'absolute',
  cursor: 'pointer',
  top: '2.5rem',
  left: '2.5rem',
  [theme.breakpoints.down('md')]: {
    position: 'unset',
    padding: theme.spacing(4, 2, 0, 4),
  },
}));

const ImageStyle = styled('img')(({ theme }) => ({
  objectFit: 'cover',
  height: '100%',
  [theme.breakpoints.down('md')]: {
    display: 'none',
  },
}));
export default function PasscodeView(): React.ReactElement {
  const [code, setCode] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  let { slug } = useParams();

  const dispatch = useDispatch();

  const { enqueueSnackbar } = useSnackbar();

  const eventDetails = useSelector((state: any) => state.eventSlug.value);

  const onSubmit = async () => {
    setLoading(true);
    const passcodeData = new FormData();
    passcodeData.append('event_id', eventDetails.eventId);
    passcodeData.append('passcode', code);
    try {
      await axios.post(`/api/events/${slug}/validate`, passcodeData);
      dispatch(passcodeStatusType({ passcode: true }));
      navigate(`/public/${slug}/preview`);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error(error);
      enqueueSnackbar(error.message, { variant: 'error' });
    }
  };
  const handlePasscode = (code: string) => {
    setCode(code);
  };

  return (
    <Grid sx={{ height: '100%' }} container>
      <Grid item xs={12} sm={12} md={5} lg={5} xl={6}>
        <LogoWrapper>
          <LogoWhiteSVG />
        </LogoWrapper>
        <ImageStyle src={String(LandingImage)} alt="Iplan" />
      </Grid>
      <Grid
        sx={{ p: 25, display: 'flex', justifyContent: 'center' }}
        item
        xs={12}
        sm={12}
        md={7}
        lg={7}
        xl={6}
      >
        <Box>
          <div>
            <Typography align="center" variant="h1" mb={6}>
              Enter Passcode
            </Typography>
          </div>
          <div>
            <OtpInput
              value={code}
              isInputNum={true}
              onChange={handlePasscode}
              shouldAutoFocus
              inputStyle={{
                width: '4rem',
                height: '4rem',
                fontSize: '1rem',
                borderRadius: 6,
                border: '1px solid #6D6D6D',
                background: 'none',
                marginRight: '1rem',
                color: '#fff',
              }}
              focusStyle={{
                outline: '1px solid #7DD78D',
                caretColor: '#7dd78d',
              }}
              numInputs={4}
            />
          </div>
          <Box sx={{ textAlign: 'center' }}>
            <LoadingButton
              sx={{ mt: 6 }}
              size="large"
              variant="contained"
              loading={loading}
              color="primary"
              endIcon={<IconNextSVG />}
              onClick={() => onSubmit()}
            >
              Proceed
            </LoadingButton>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}
