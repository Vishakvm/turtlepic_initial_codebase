/*
 * Selfie Landing Page
 *
 */
import React, { useCallback, useState, useRef } from 'react';

import { Button, styled, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useNavigate } from 'react-router';
import { useSnackbar } from 'notistack';
import Webcam from 'react-webcam';

import axios from 'src/utils/axios';
import CameraIcon from '@mui/icons-material/Camera';
import { PATH_MAIN } from 'src/routes/paths';
import { useSelector } from 'react-redux';

const CameraActionsButtonWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  marginTop: theme.spacing(1),
}));

const useStyles = makeStyles(() => ({
  camera: {
    height: '100%',
    width: '100%',
    padding: '20px 0px 0px 0px',
    objectFit: 'fill',
  },
}));

const Header = styled('div')(({ theme }) => ({
  padding: theme.spacing(2),
  background: theme.palette.common.black,
  width: '100%',
}));

const CameraAdjust = styled('div')(({ theme }) => ({
  width: '50%',
  [theme.breakpoints.down('lg')]: {
    width: '90%',
  },
}));

const CameraWrapper = styled('div')(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
}));

const videoConstraints = {
  facingMode: 'user',
};

export default function CameraView(): React.ReactElement {
  const webcamRef = useRef<Webcam>(null);
  const [url, setUrl] = useState<string | null>(null);
  const [file, setFile] = useState<string | Blob>('');
  const classes = useStyles();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const eventDetails = useSelector((state: any) => state.eventSlug.value);


  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      urltoFile(imageSrc, 'selfie.png').then(function (file) {
        setFile(file);
      });

      setUrl(imageSrc);
    }

    //return a promise that resolves with a File instance
    async function urltoFile(url: string, filename: string) {
      const res = await fetch(url);
      const buf = await res.arrayBuffer();
      return new File([buf], filename);
    }
  }, [webcamRef]);

  const handlePictureUpload = async () => {
    const selfieForm = new FormData();
    file && selfieForm.append('image', file);
    selfieForm.append('event_id', eventDetails.eventId);
    try {
      await axios.post('/api/guest/selfie', selfieForm);
      navigate(PATH_MAIN.previewEvent);
    } catch (error) {
      enqueueSnackbar(error.message, { variant: 'error' });
    }
  };

  return (
    <React.Fragment>
      {url ? (
        <CameraWrapper>
          <Header>
            <Typography variant="h4">Selfie Photo Filtering</Typography>
          </Header>
          <CameraAdjust>
            <img className={classes.camera} src={url} alt="CapturedImage" />
          </CameraAdjust>
          <CameraActionsButtonWrapper>
            <Button
              variant="contained"
              size="medium"
              onClick={() => {
                setUrl(null);
              }}
              sx={{ mx: 3, width: '100px' }}
            >
              Delete
            </Button>
            <Button
              variant="contained"
              size="medium"
              onClick={handlePictureUpload}
              sx={{ mx: 3, width: '100px' }}
            >
              Next
            </Button>
          </CameraActionsButtonWrapper>
        </CameraWrapper>
      ) : (
        <CameraWrapper>
          <Header>
            <Typography variant="h4">Selfie Photo Filtering</Typography>
          </Header>
          <CameraAdjust>
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={videoConstraints}
              screenshotQuality={1}
              imageSmoothing
              className={classes.camera}
            />
          </CameraAdjust>
          <Button
            sx={{ mx: 5 }}
            variant="contained"
            size="medium"
            startIcon={<CameraIcon />}
            onClick={capture}
          >
            Capture
          </Button>
        </CameraWrapper>
      )}
    </React.Fragment>
  );
}
