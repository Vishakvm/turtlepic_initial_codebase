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

export default function UploadGoogleDrive({ close, refreshPage }: DrawerProps) {
  const [gdlink, setGdLink] = useState<string>('');
  const [gdLinkDetails, setGdLinkDetails] = useState<string[]>([]);
  const [clearInput, setClearInput] = useState<boolean>(false);
  const [isGdDirty, setIsGdDirty] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);

  const folderDetails = useSelector((state: any) => state.folder.value);

  const { enqueueSnackbar } = useSnackbar();
  useEffect(() => {
    setGdLink('');
    setGdLinkDetails([]);
  }, []);
  const handleGdShare = async () => {
    if (isGdDirty) {
      try {
        setLoading(true);
        await axios.post(`/api/folders/${folderDetails.id}/uploads`, {
          drive_link: gdlink,
        });
        gdLinkDetails.push(gdlink);
        setIsGdDirty(false);
        setGdLink('');
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

  const handleClearInput = () => {
    setGdLink('');
    setClearInput(false);
  };

  const handleGdChange = (e: any) => {
    setGdLink(e.target.value);
    setIsGdDirty(true);
  };

  return (
    <>
      <Wrapper>
        <Typography py={2} align="center" variant="h2">
          Upload folder from Google Drive
        </Typography>
        <UploadWrapper>
          <TextBoxWrapper>
            <Typography variant="h6" mb={0.5}>
              Please paste the link
            </Typography>
            <TextInputStyle
              value={gdlink}
              onChange={handleGdChange}
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
            <ButtonStyle loading={loading} variant="contained" onClick={handleGdShare}>
              Upload
            </ButtonStyle>
          </ButtonWrapper>
          {gdLinkDetails &&
            gdLinkDetails.map((ele: any, index) => (
              <LinkWrapper key={index}>
                <Typography my={2} variant="h4" textAlign="center">
                  Uploading From :
                </Typography>
                <Typography mb={0} variant="h6" textAlign="center">
                  {ele}
                </Typography>
              </LinkWrapper>
            ))}
          <Box mt={25}>
            <Typography variant="h6">NOTE : </Typography>
            <br />
            <Typography variant="h6">
              1. Only shared folder links are supported. Link to a file is not allowed.
            </Typography>
            <Typography variant="h6" mt={1}>
              2. Please make sure the drive folder is not empty and public share access is enabled.
            </Typography>
          </Box>
        </UploadWrapper>
      </Wrapper>
    </>
  );
}
