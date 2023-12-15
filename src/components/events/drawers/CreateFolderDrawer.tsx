import React, { useState } from 'react';

import { Typography, Button, styled, Drawer, Box, Grid, Stack, Switch } from '@mui/material';

import * as Yup from 'yup';
import { FormProvider, RHFDatePicker, RHFTextField } from 'src/components/hook-form';
import { LoadingButton } from '@mui/lab';
import { useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';
import { yupResolver } from '@hookform/resolvers/yup';

import axios from 'src/utils/axios';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import IconBackSVG from 'src/assets/shared/svg/icon_back';
import useResponsive from 'src/hooks/useResponsive';
import { useSelector } from 'src/redux/store';

// @ts-ignore
import Files from 'react-files';

type DrawerProps = {
  openDrawer: boolean;
  onClose: () => void;
};

type FormValuesProps = {
  afterSubmit: string;
  name: string;
  date: Date;
};

const Wrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(5),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(0, 2, 0, 2),
  },
}));

const Div = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
}));

const Dotted = styled('div')(({ theme }) => ({
  padding: theme.spacing(2, 4),
  border: '1px dashed #fff',
  textAlign: 'center',
}));

const ThumbImgStyle = styled('img')(({ theme }) => ({
  borderRadius: '4px',
  height: '80px',
  width: '80px',
  objectFit: 'cover',
  border: `1.5px solid ${theme.palette.common.black}`,
  marginTop: theme.spacing(2),
}));

export default function CreateFolderDrawerView({
  onClose,
  openDrawer,
}: DrawerProps): React.ReactElement {
  const [file, setFile] = useState<string | Blob>('');
  const [fileName, setFileName] = useState<string>('');
  const [allowDownload, setAllowDownload] = useState<boolean>(false);
  const [skipDuplicates, setSkipDuplicates] = useState<boolean>(false);

  const isDesktop = useResponsive('up', 'lg');
  const eventDetails = useSelector((state) => state.createEvent.value);
  const { enqueueSnackbar } = useSnackbar();

  const FolderSchema = Yup.object().shape({
    name: Yup.string().required('Field is required'),
  });

  const defaultValues = {
    name: '',
  };

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(FolderSchema),
    defaultValues,
  });
  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const MAX_FILE_SIZE = 5000000000;

  const onFilesChange = (files: any) => {
    setFileName(files.map((filename: any) => filename.preview.url));
    setFile(files[0]);
  };

  const onFilesError = (error: any, file: any) => {
    console.log('error code ' + error.code + ': ' + error.message);
  };

  const handleDownload = (event: any) => {
    setAllowDownload(event.target.checked);
  };

  const handleSkipDuplicates = (event: any) => {
    setSkipDuplicates(event.target.checked);
  };

  const onSubmit = async (data: FormValuesProps) => {
    const createFolderForm = new FormData();
    if (data.date) {
      const dateValue = data.date.toISOString();
      dateValue && createFolderForm.append('date', dateValue);
    }
    createFolderForm.append('name', data.name);

    createFolderForm.append('allow_download', allowDownload ? '1' : '0');
    createFolderForm.append('skip_duplicates', skipDuplicates ? '1' : '0');
    file && createFolderForm.append('cover_picture', file);

    try {
      const response = await axios.post(`/api/events/${eventDetails.id}/folders`, createFolderForm);
      const { message } = response.data;
      onClose();
      enqueueSnackbar(message, { variant: 'success' });
      reset();
    } catch (error) {
      console.error(error);
      enqueueSnackbar(error.message, { variant: 'error' });
    }

    setAllowDownload(false);
    setSkipDuplicates(false);
    setFileName('');
  };

  const handleClose = () => {
    onClose();
    reset();
    setFileName('');
  };

  return (
    <Drawer open={openDrawer} anchor={'right'}>
      <Box
        role="presentation"
        sx={{
          width: isDesktop ? '720px' : '100%',
          maxHeight: '100%',
          overflow: 'auto',
          overflowX: 'hidden',
          overflowY: 'scroll',
          '&::-webkit-scrollbar': {
            width: '0.3em',
            backgroundColor: '#000',
          },
          '&::-webkit-scrollbar-track': {
            boxShadow: 'inset 0 0 6px rgba(0,0,0,0.1)',
            backgroundColor: '#000',
            borderRadius: '10px',
          },
          '&::-webkit-scrollbar-thumb': {
            borderRadius: '10px',
            backgroundColor: '#7dd78d',
          },
        }}
      >
        <Button
          sx={{ color: '#fff', mx: 3 }}
          onClick={() => handleClose()}
          startIcon={<IconBackSVG />}
        >
          Back
        </Button>
        <Wrapper>
          <Typography pb={6} align="center" variant="h2">
            Create new gallery
          </Typography>
          <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12} md={6} mt={1}>
                <RHFTextField name="name" label="Name of The Folder*" autoFocus />
              </Grid>
              <Grid item xs={12} sm={12} md={6}>
                <RHFDatePicker label="Date" name="date" />
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1">Allow Download</Typography>
                <Stack direction="row" py={1} alignItems="center">
                  <Typography variant="body1">Off</Typography>
                  <Switch checked={allowDownload} onChange={handleDownload} />
                  <Typography variant="body1">On</Typography>
                </Stack>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1">Skip Duplicates</Typography>
                <Stack direction="row" py={1} alignItems="center">
                  <Typography variant="body1">Off</Typography>
                  <Switch checked={skipDuplicates} onChange={handleSkipDuplicates} />
                  <Typography pr={0.5} variant="body1">
                    On
                  </Typography>
                  {skipDuplicates && (
                    <Typography variant="caption" color="grey.100">
                      {' '}
                      (upload time will increase)
                    </Typography>
                  )}
                </Stack>
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <Dotted>
                  <Div>
                    <CloudUploadIcon fontSize="large" />
                  </Div>
                  <Typography py={2} align="center" variant="body1">
                    Choose Cover Photo
                  </Typography>

                  <Typography pb={1} align="center" variant="body1">
                    or
                  </Typography>
                  <Div>
                    <Files
                      className="files-dropzone"
                      onChange={onFilesChange}
                      onError={onFilesError}
                      accepts={['image/*']}
                      maxFileSize={MAX_FILE_SIZE}
                      minFileSize={0}
                      clickable
                      multiple={false}
                    >
                      <Button variant="outlined">Browse</Button>
                    </Files>
                  </Div>
                </Dotted>
                {fileName && (
                  <ThumbImgStyle src={String(fileName)} height="100%" width="100%" alt="img" />
                )}
              </Grid>
            </Grid>

            <Box textAlign="center" my={2}>
              <LoadingButton variant="contained" loading={isSubmitting} type="submit">
                Create Folder
              </LoadingButton>
            </Box>
          </FormProvider>
        </Wrapper>
      </Box>
    </Drawer>
  );
}
