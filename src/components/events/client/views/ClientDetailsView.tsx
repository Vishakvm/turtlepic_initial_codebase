/*
 * General Details View
 *
 */
import React, { useEffect, useState, useRef } from 'react';

import { Button, Grid, styled, Typography } from '@mui/material';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
// @ts-ignore
import Files from 'react-files';
import { useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';

import { FormProvider, RHFTextField, RHFDatePicker } from 'src/components/hook-form';
import { AttachmentWrapper } from 'src/assets/shared/styles/SharedStylesComponent';
import axios from 'src/utils/axios';
import ClientDetailTimeline from '../../elements/ClientDetailTimeline';
import CreateEventFooterView from '../../elements/CreateEventFooter';
import { eventDetails } from 'src/redux/slices/createEvent';
import IconGoSVG from 'src/assets/shared/svg/icon_go';
import { useDispatch, useSelector } from 'src/redux/store';
import PhotoSVG from 'src/assets/shared/svg/icon_photo';
import { LoadingButton } from '@mui/lab';
import { ACCEPTED, AGENCY, CLIENT, PUBLISHED, TRANSFERRED } from 'src/utils/constants';
import useAuth from 'src/hooks/useAuth';
import QrCode2Icon from '@mui/icons-material/QrCode2';
interface TabNextProps {
  generalTabRedirect: (index: number) => void;
  nextIndex: number;
}

type FormValuesProps = {
  afterSubmit: string;
  name: string;
  date_start: Date;
  date_end: Date;
  venue: string;
};

const GDWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(1, 4, 2, 4),
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(2),
  },
}));

const DateWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  columnGap: theme.spacing(2),
  [theme.breakpoints.down('md')]: {
    display: 'block',
  },
}));

const FilesWrapper = styled('div')(({ theme }) => ({
  marginBottom: theme.spacing(4),
  width: 'fit-content',
}));

const Note = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 6.5, 0, 6.5),
}));

const AttachmentThumbnail = styled('div')(({ theme }) => ({
  background: theme.palette.grey[900],
  borderRadius: '15px',
  // height: '8rem',
  width: '100%',
  marginBottom: theme.spacing(1),
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}));

const ThumbImgStyle = styled('img')(({ theme }) => ({
  borderRadius: '15px',
  // height: '8rem',
  width: '100%',
  objectFit: 'cover',
}));

export default function ClientDetailsView({
  generalTabRedirect,
  nextIndex,
}: TabNextProps): React.ReactElement {
  const [fileSrc, setFileSrc] = useState<string>('');
  const [file, setFile] = useState<string | Blob>('');
  const [dirtyForm, setDirtyForm] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  const isMounted = useRef(false);

  const dispatch = useDispatch();
  const eventDetail = useSelector((state) => state.createEvent.value);
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuth();

  const defaultValues = {
    name: '',
    venue: '',
  };

  const MAX_FILE_SIZE = 500000000000;

  const onFilesChange = (files: any) => {
    setFileSrc(files.map((filename: any) => filename.preview.url));
    setFile(files[0]);
    setDirtyForm(true);
  };

  const onFilesError = (error: any, file: any) => {
    console.log('error code ' + error.code + ': ' + error.message);
  };

  const methods = useForm<FormValuesProps>({
    defaultValues,
  });

  const {
    handleSubmit,
    setValue,
    formState: { isDirty },
  } = methods;

  const onSubmit = async (data: FormValuesProps) => {
    setLoading(true);
    const detailsForm = new FormData();
    if (data.date_start) {
      if (typeof data.date_start === 'string') {
        detailsForm.append('date_start', data.date_start);
      } else {
        const startDateValue = data.date_start.toISOString();
        startDateValue && detailsForm.append('date_start', startDateValue);
      }
    }
    if (data.date_end) {
      if (typeof data.date_end === 'string') {
        detailsForm.append('date_end', data.date_end);
      } else {
        const endDateValue = data.date_end.toISOString();
        endDateValue && detailsForm.append('date_end', endDateValue);
      }
    }
    detailsForm.append('name', data.name);
    detailsForm.append('venue', data.venue);
    detailsForm.append('_method', 'PATCH');
    file && detailsForm.append('cover_picture', file);

    if (isDirty || dirtyForm) {
      try {
        const response = await axios.post(`/api/events/${eventDetail.id}`, detailsForm);
        const { data, message } = response.data;
        dispatch(
          eventDetails({
            name: data.name,
            id: data.id,
            venue: data.venue,
            date: data.date_display,
            event_status: data.event_status,
            eventType: data.event_type,
            client_name: data.client.name,
            client_email: data.client.email,
            client_status: data.client_status,
            slug: data.slug,
          })
        );
        setLoading(false);
        setDirtyForm(false);
        enqueueSnackbar(message, { variant: 'success' });
        generalTabRedirect(nextIndex);
      } catch (error) {
        setLoading(false);
        console.error(error);
       if (error.message === 'The cover picture failed to upload.') {
         enqueueSnackbar('Please upload a banner with 1920*760 dimensions', { variant: 'error' });
       } else {
         enqueueSnackbar(error.message, { variant: 'error' });
       }
      }
    } else {
      generalTabRedirect(nextIndex);
    }
  };

  useEffect(() => {
    const getEventDetails = async () => {
      try {
        await axios.get(`/api/events/${eventDetail.id}`).then((response) => {
          if (!isMounted.current) {
            const { data } = response.data;
            setStatus(data.client_status);
            data.name ? setValue('name', data.name) : setValue('name', '');
            data.date_start && setValue('date_start', data.date_start);
            data.date_start && setValue('date_end', data.date_end);
            data.venue ? setValue('venue', data.venue) : setValue('venue', '');
            data.cover_picture &&
              (data.cover_picture.thumbnail_url
                ? setFileSrc(data.cover_picture.thumbnail_url)
                : setFileSrc(data.cover_picture.original_url));
          }
        });
      } catch (error) {
        enqueueSnackbar('Something went wrong!', { variant: 'error' });
      }
    };
    getEventDetails();
    return () => {
      isMounted.current = true;
    };
  }, [enqueueSnackbar, eventDetail.id, isMounted, setValue]);

  const handleDownloadQR = async () => {
    try {
      await axios
        .get(`/api/events/${eventDetail.id}/pre-registration/download`, {
          responseType: 'blob',
        })
        .then((response) => {
          window.open(URL.createObjectURL(response.data));
        });
    } catch (error) {
      if (eventDetail.event_status === PUBLISHED) {
        enqueueSnackbar(
          'Pre-Registration for this event is closed, since its already published. Please Share the Event instead.',
          { variant: 'error' }
        );
      }
      console.error(error);
    }
  };
  return (
    <>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <GDWrapper>
          <Grid container spacing={1}>
            <Grid item sm={12} md={6} mt={3.5}>
              <FilesWrapper>
                <Files
                  className="files-dropzone"
                  onChange={onFilesChange}
                  onError={onFilesError}
                  accepts={['image/*']}
                  maxFileSize={MAX_FILE_SIZE}
                  minFileSize={0}
                  multiple={false}
                >
                  <div>
                    <AttachmentThumbnail color="primary">
                      {fileSrc ? <ThumbImgStyle src={String(fileSrc)} alt="img" /> : <PhotoSVG />}
                    </AttachmentThumbnail>
                    <AttachmentWrapper>
                      <AddBoxOutlinedIcon color="primary" sx={{ ml: 1 }} />
                      <Typography px={1} variant="body2">
                        Upload cover picture
                      </Typography>
                      <Typography variant="caption" fontStyle="italic" pl={0.5} mt={0.5}>
                        (The image should be of 1920*760 dimensions!)
                      </Typography>
                    </AttachmentWrapper>
                  </div>
                </Files>
              </FilesWrapper>

              <RHFTextField name="name" label="Event Name" />
              <DateWrapper>
                <RHFDatePicker name="date_start" label="Start Date (mm/dd/yyyy)" />
                <RHFDatePicker name="date_end" label="End Date (mm/dd/yyyy)" />
              </DateWrapper>
              <RHFTextField name="venue" label="Venue" />
            </Grid>
            <Grid item sm={12} md={6} sx={{ width: '100%' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '30px',
                }}
              >
                <div>
                  <Note>
                    {user?.account_type === AGENCY && (
                      <Typography
                        sx={{
                          mt: eventDetail.client_status === TRANSFERRED ? 2.5 : 0,
                        }}
                        variant="h5"
                      >
                        Request Status
                      </Typography>
                    )}
                    {user?.account_type === CLIENT && (
                      <Typography
                        sx={{
                          mt: eventDetail.client_status !== TRANSFERRED ? 2.5 : 0,
                        }}
                        variant="h5"
                      >
                        Request Status
                      </Typography>
                    )}
                  </Note>
                </div>
                {user?.account_type === CLIENT && eventDetail.client_status === ACCEPTED && (
                  <Button
                    onClick={handleDownloadQR}
                    size="large"
                    sx={{ m: 0 }}
                    endIcon={<QrCode2Icon fontSize="large" sx={{ color: '#fff' }} />}
                  >
                    Download QR Code
                  </Button>
                )}
                {user?.account_type === AGENCY && eventDetail.client_status !== TRANSFERRED && (
                  <Button
                    sx={{ m: 0 }}
                    onClick={handleDownloadQR}
                    size="large"
                    endIcon={<QrCode2Icon fontSize="large" sx={{ color: '#fff' }} />}
                  >
                    Download QR Code
                  </Button>
                )}
              </div>

              <ClientDetailTimeline status={status} />
              <Note>
                <Typography variant="caption" fontStyle="italic" color="grey.100">
                  Note - You can only transfer control once the client has accepted shared request.
                </Typography>
              </Note>
            </Grid>
          </Grid>
        </GDWrapper>
        {user?.account_type === AGENCY && (
          <CreateEventFooterView
            footerAction={
              <LoadingButton
                loading={loading}
                disabled={status === TRANSFERRED}
                size="small"
                type="submit"
                color="primary"
                endIcon={<IconGoSVG color="#7DD78D" />}
              >
                Save and Proceed
              </LoadingButton>
            }
          />
        )}
        {user?.account_type === CLIENT && (
          <CreateEventFooterView
            footerAction={
              <LoadingButton
                loading={loading}
                disabled={status !== TRANSFERRED}
                size="small"
                type="submit"
                color="primary"
                endIcon={<IconGoSVG color="#7DD78D" />}
              >
                Save and Proceed
              </LoadingButton>
            }
          />
        )}
      </FormProvider>
    </>
  );
}
