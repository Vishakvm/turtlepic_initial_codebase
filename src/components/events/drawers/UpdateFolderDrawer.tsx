import React, { useState, useEffect, useRef } from 'react';

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
import { dispatch, useSelector } from 'src/redux/store';
import { folderDetails } from 'src/redux/slices/folderDetails';

// @ts-ignore
import Files from 'react-files';

type DrawerProps = {
  openDrawer: boolean;
  onClose: () => void;
  onBack: () => void;
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
  padding: theme.spacing(4),
  border: '1px dashed #fff',
}));

const ThumbImgStyle = styled('img')(({ theme }) => ({
  borderRadius: '4px',
  height: '80px',
  width: '80px',
  objectFit: 'cover',
  border: `1.5px solid ${theme.palette.common.black}`,
  marginTop: theme.spacing(2),
}));

export default function UpdateFolderDrawerView({
  onClose,
  onBack,
  openDrawer,
}: DrawerProps): React.ReactElement {
  const [file, setFile] = useState<string | Blob>('');
  const [fileName, setFileName] = useState<string>('');
  const [allowDownload, setAllowDownload] = useState<boolean>(false);
  const [skipDuplicates, setSkipDuplicates] = useState<boolean>(false);

  const isDesktop = useResponsive('up', 'lg');
  const eventDetails = useSelector((state) => state.createEvent.value);

  const { enqueueSnackbar } = useSnackbar();
  const isMounted = useRef(false);
  const folderDetail = useSelector((state) => state.folder.value);

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
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = methods;

  const MAX_FILE_SIZE = 500000000000;

  const onFilesChange = (files: any) => {
    setFileName(files.map((filename: any) => filename.preview.url));
    setFile(files[0]);
  };

  useEffect(() => {
    folderDetail.date && setValue('date', new Date(folderDetail.date));
    folderDetail.name ? setValue('name', folderDetail.name) : setValue('name', '');
    if (folderDetail.cover_picture !== null) {
      folderDetail.cover_picture && setFileName(folderDetail.cover_picture);
    }
    setAllowDownload(folderDetail.allow_download);
    setSkipDuplicates(folderDetail.skip_duplicates);
  }, []);

  useEffect(
    () => () => {
      isMounted.current = true;
    },
    []
  );

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
    const updateFolderForm = new FormData();
    if (data.date) {
      if (typeof data.date === 'string') {
        updateFolderForm.append('date', data.date);
      } else {
        const startDateValue = data.date;
        startDateValue && updateFolderForm.append('date', startDateValue.toISOString());
      }
    }
    updateFolderForm.append('name', data.name);
    updateFolderForm.append('allow_download', allowDownload ? '1' : '0');
    updateFolderForm.append('skip_duplicates', skipDuplicates ? '1' : '0');
    file && updateFolderForm.append('cover_picture', file);
    updateFolderForm.append('_method', 'PATCH');

    try {
      const response = await axios.post(
        `/api/events/${eventDetails.id}/folders/${folderDetail.id}`,
        updateFolderForm
      );
      const { message } = response.data;

      dispatch(
        folderDetails({
          id: folderDetail.id,
          name: data.name,
          allow_download: allowDownload,
          skip_duplicates: skipDuplicates,
          video_count: folderDetail.video_count,
          photo_count: folderDetail.photo_count,
          is_default: folderDetail.is_default,
          date: data.date,
          cover_picture: fileName,
        })
      );
      onClose();
      enqueueSnackbar(message, { variant: 'success' });
    } catch (error) {
      console.error(error);
      enqueueSnackbar(error.message, { variant: 'error' });
    }

    setAllowDownload(false);
    setSkipDuplicates(false);
    setFileName('');
  };

  const handleClose = () => {
    onBack();
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
          <Typography pb={10} align="center" variant="h2">
            Update Gallery
          </Typography>
          <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={4}>
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
                  <Typography py={1} align="center" variant="body1">
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

            <Box textAlign="center" mt={5}>
              <LoadingButton variant="contained" loading={isSubmitting} type="submit">
                Update Folder
              </LoadingButton>
            </Box>
          </FormProvider>
        </Wrapper>
      </Box>
    </Drawer>
  );
}
