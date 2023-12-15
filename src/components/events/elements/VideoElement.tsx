/*
 * Video Element
 *
 */
import React, { useState, useRef, useEffect } from 'react';

import { Typography, styled, Button, TextField, Grid } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import PlayCircleFilledWhiteIcon from '@mui/icons-material/PlayCircleFilledWhite';
import { useSnackbar } from 'notistack';

import axios from 'src/utils/axios';
import { useSelector } from 'src/redux/store';
import { AGENCY, CLIENT, TRANSFERRED } from 'src/utils/constants';
import useAuth from 'src/hooks/useAuth';

type VideoProps = {
  onClick: () => void;
};

const UploadHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(2, 3),
  [theme.breakpoints.down('sm')]: {
    display: 'block',
  },
}));

const TextInputStyle = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    background: 'black',
    border: 0,
    height: '3rem',
    borderRadius: '8px',
    width: '30rem',
    paddingRight: theme.spacing(2.5),
    [theme.breakpoints.down('md')]: {
      width: '20rem',
    },
    [theme.breakpoints.down('sm')]: {
      width: '14rem',
    },
    [theme.breakpoints.down('xs')]: {
      width: '10rem',
    },
  },
}));

const CloseIconStyle = styled(CloseIcon)(({ theme }) => ({
  position: 'absolute',
  cursor: 'pointer',
  zIndex: 1,
  right: '4.5rem',
  top: '2.3rem',
}));

const ButtonStyle = styled(Button)(({ theme }) => ({
  height: '3rem',
  margin: 0,
}));

const ButtonWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-end',
  position: 'relative',
}));
const Wrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(2, 3, 3, 3),
  height: '20rem',
  overflowY: 'scroll',
  '::-webkit-scrollbar': {
    display: 'none',
  },
}));

const ImageWrapper = styled('div')(({ theme }) => ({
  position: 'relative',
}));
const ImageStyle = styled('img')(({ theme }) => ({
  opacity: '0.55',
  cursor: 'pointer',
}));
const PlayButton = styled(PlayCircleFilledWhiteIcon)(({ theme }) => ({
  position: 'absolute',
  left: '50%',
  top: '50%',
  transform: 'translate(-50%, -50%)',
  width: '3rem',
  height: '3rem',
  cursor: 'pointer',
}));

export default function VideoElement(props: VideoProps): React.ReactElement {
  const [videolink, setVideoLink] = useState<string>('');
  const [videoDetails, setVideoDetails] = useState([]);
  const [clearInput, setClearInput] = useState<boolean>(false);
  const [isDirty, setIsDirty] = useState<boolean>(false);

  const isMounted = useRef(false);
  const eventDetails = useSelector((state) => state.createEvent.value);

  const folderDetails = useSelector((state) => state.folder.value);
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuth();

  useEffect(() => {
    const getVideoDetails = async () => {
      try {
        await axios.get(`/api/folders/${folderDetails.id}/uploads`).then((response) => {
          if (!isMounted.current) {
            const { data } = response.data;
            setVideoDetails(data);
          }
        });
      } catch (error) {
        console.error(error);
        enqueueSnackbar(error.message, { variant: 'error' });
      }
    };
    getVideoDetails();
    return () => {
      isMounted.current = true;
    };
  }, [enqueueSnackbar, folderDetails.id]);

  const handleSearch = async () => {
    if (isDirty) {
      try {
        const response = await axios.post(`/api/folders/${folderDetails.id}/uploads`, {
          link: videolink,
        });
        const { data } = response.data;
        setVideoDetails(data);
        setVideoLink('');
        setIsDirty(false);
      } catch (error) {
        console.error(error);
        enqueueSnackbar(error.message, { variant: 'error' });
      }
    } else {
      enqueueSnackbar('Please paste the link of the video!', { variant: 'error' });
    }
  };
  const handleChange = (e: any) => {
    setVideoLink(e.target.value);
    setIsDirty(true);
  };
  const handleClearInput = () => {
    setVideoLink('');
    setClearInput(false);
    setIsDirty(false);
  };

  return (
    <>
      <UploadHeader>
        <Button
          size="small"
          onClick={props.onClick}
          color="primary"
          startIcon={<KeyboardArrowLeftIcon color="action" />}
        >
          {folderDetails.name}
        </Button>
        <ButtonWrapper>
          <div>
            <Typography variant="h6" mb={0.5}>
              Paste link of the video
            </Typography>
            <TextInputStyle
              value={videolink}
              onChange={handleChange}
              autoComplete="off"
              label=""
              variant="outlined"
              onFocus={(): void => {
                setClearInput(true);
              }}
            />
            {clearInput && (
              <CloseIconStyle fontSize="medium" color="secondary" onClick={handleClearInput} />
            )}
          </div>

          <ButtonStyle
            disabled={
              user?.account_type === AGENCY &&
              eventDetails.client_status === TRANSFERRED &&
              eventDetails.eventType === CLIENT
            }
            variant="contained"
            onClick={handleSearch}
          >
            Go
          </ButtonStyle>
        </ButtonWrapper>
      </UploadHeader>
      <Wrapper>
        <Grid container spacing={2}>
          {videoDetails.map((ele: any, index) => (
            <Grid item lg={3} md={4} sm={6} xs={12} key={index}>
              <ImageWrapper
                onClick={() => {
                  window.open(ele.video_url, '_blank');
                }}
              >
                <ImageStyle src={String(ele.original_url)} alt="img" width="100%" height="100%" />
                <PlayButton color="primary" />
              </ImageWrapper>
            </Grid>
          ))}
        </Grid>
      </Wrapper>
    </>
  );
}
