import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { styled, Box, Typography, TextField } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useSelector } from 'src/redux/store';

import { useSnackbar } from 'notistack';

import axios from 'src/utils/axios';

import { LoadingButton } from '@mui/lab';

type DrawerProps = {
  close: () => void;
  refreshPage: Dispatch<SetStateAction<boolean>>;
};

const Wrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(2, 3, 3, 3),
}));

const UploadWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(5),
  width: '656px',
  height: 'auto',
  margin: 'auto',
  [theme.breakpoints.down('md')]: {
    width: 'auto',
  },
}));

const TextInputStyle = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    background: 'black',
    border: 0,
    height: '3rem',
    borderRadius: '8px',
    paddingRight: theme.spacing(2.5),
  },
}));

const CloseIconStyle = styled(CloseIcon)(({ theme }) => ({
  position: 'absolute',
  cursor: 'pointer',
  zIndex: 1,
  right: '1rem',
  top: '2.3rem',
}));

const ButtonStyle = styled(LoadingButton)(({ theme }) => ({
  height: '3rem',
  margin: 0,
}));

const ButtonWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  margin: theme.spacing(2, 0, 2, 0),
}));
const TextBoxWrapper = styled('div')(({ theme }) => ({
  position: 'relative',
}));
const LinkWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(1, 2),
  background: theme.palette.common.black,
  borderRadius: '20px',
  marginBottom: theme.spacing(2),
}));
export default function UploadVideos({ close, refreshPage }: DrawerProps) {
  const [isDirty, setIsDirty] = useState<boolean>(false);
  const [videoDetails, setVideoDetails] = useState<string[]>([]);
  const [videolink, setVideoLink] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [clearInput, setClearInput] = useState<boolean>(false);

  const { enqueueSnackbar } = useSnackbar();
  const folderDetails = useSelector((state: any) => state.folder.value);

  useEffect(() => {
    setVideoDetails([]);
  }, []);

  const handleVideoShare = async () => {
    if (isDirty) {
      try {
        setLoading(true);
        await axios.post(`/api/folders/${folderDetails.id}/uploads`, {
          link: videolink,
        });
        videoDetails.push(videolink);
        setIsDirty(false);
        setVideoLink('');
        setLoading(false);
        close();
        refreshPage(true);
      } catch (error) {
        enqueueSnackbar(error.message, { variant: 'error' });
        setLoading(false);
      }
    } else {
      enqueueSnackbar('Please paste the link of the video!', { variant: 'error' });
    }
  };

  const handleVideoChange = (e: any) => {
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
      <Wrapper>
        <Typography py={2} align="center" variant="h2">
          Upload Videos
        </Typography>
        <UploadWrapper>
          <TextBoxWrapper>
            <Typography variant="h6" mb={0.5}>
              Paste link of the video
            </Typography>
            <TextInputStyle
              value={videolink}
              onChange={handleVideoChange}
              autoComplete="off"
              label=""
              variant="outlined"
              fullWidth
              focused
              onFocus={(): void => {
                setClearInput(true);
              }}
            />
            {clearInput && (
              <CloseIconStyle fontSize="medium" color="secondary" onClick={handleClearInput} />
            )}
          </TextBoxWrapper>
          <ButtonWrapper>
            <ButtonStyle loading={loading} variant="contained" onClick={handleVideoShare}>
              Upload
            </ButtonStyle>
          </ButtonWrapper>
          {videoDetails &&
            videoDetails.map((ele: any, index) => (
              <LinkWrapper key={index}>
                <Typography mb={0} variant="h6" textAlign="center">
                  {ele}
                </Typography>
              </LinkWrapper>
            ))}
          <Box mt={25}>
            <Typography variant="h6">NOTE : </Typography>
            <br />
            <Typography variant="h6">Only YouTube video links are supported.</Typography>
          </Box>
        </UploadWrapper>
      </Wrapper>
    </>
  );
}
