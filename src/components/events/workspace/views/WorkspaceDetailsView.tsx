/*
 * General Details View
 *
 */
import React, { useEffect, useState, useRef } from 'react';

import { Button, Grid, styled, Tooltip, Typography, Zoom } from '@mui/material';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
// @ts-ignore
import Files from 'react-files';
import InfoIcon from '@mui/icons-material/Info';
import { useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';

import moment from 'moment-timezone';

import { FormProvider, RHFTextField, RHFDatePicker } from 'src/components/hook-form';
import { AttachmentWrapper } from 'src/assets/shared/styles/SharedStylesComponent';
import axios from 'src/utils/axios';
import CreateEventFooterView from '../../elements/CreateEventFooter';
import { eventDetails } from 'src/redux/slices/createEvent';
import IconGoSVG from 'src/assets/shared/svg/icon_go';
import ShareIcon from '@mui/icons-material/Share';
import PhotoSVG from 'src/assets/shared/svg/icon_photo';
import { useDispatch, useSelector } from 'src/redux/store';

import ShareQRCodeDrawer from 'src/components/events/drawers/ShareQRCodeDrawer';
import { LoadingButton } from '@mui/lab';

import { CLIENT, PUBLISHED } from 'src/utils/constants';

interface TabNextProps {
  generalTabRedirect: (index: number) => void;
  nextIndex: number;
  preRegistrationIndex: number;
}

type FormValuesProps = {
  afterSubmit: string;
  name: string;
  date_start: Date;
  date_end: Date;
  venue: string;
  invite_message: string;
};

const Icon = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 0, 0, 2),
  cursor: 'pointer',
}));

const GDWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(4, 4, 2, 4),
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(2),
  },
}));

const FlexWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
}));

const DateWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  columnGap: theme.spacing(2),
  [theme.breakpoints.down('md')]: {
    display: 'block',
  },
}));

const BarcodeContainer = styled('div')(({ theme }) => ({
  background: theme.palette.grey[0],
  height: '93%',
  width: '100%',
  minHeight: '350px',
}));

const FilesWrapper = styled('div')(({ theme }) => ({
  marginBottom: theme.spacing(4),
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

export default function GeneralDetailsView({
  generalTabRedirect,
  nextIndex,
  preRegistrationIndex,
}: TabNextProps): React.ReactElement {
  const [dirtyForm, setDirtyForm] = useState<boolean>(false);
  const [fileSrc, setFileSrc] = useState<string>('');
  const [file, setFile] = useState<string | Blob>('');
  const [shareHTML, setShareHTML] = useState<string>('');
  const [qRCodeDrawer, setQrCodeDrawer] = React.useState(false);
  const [loading, setLoading] = useState(false);

  const isMounted = useRef(false);
  const eventDetail = useSelector((state) => state.createEvent.value);

  const dispatch = useDispatch();

  const { enqueueSnackbar } = useSnackbar();
  const defaultValues = {
    name: '',
    venue: '',
    invite_message: '',
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
    const detailsForm = new FormData();
    if (data.date_start) {
      if (typeof data.date_start === 'string') {
        detailsForm.append('date_start', data.date_start);
      } else {
        const startDateValue = data.date_start.toISOString();
        const val = moment(startDateValue).format('MM/DD/YYYY');
        val && detailsForm.append('date_start', val);
      }
    }
    if (data.date_end) {
      if (typeof data.date_end === 'string') {
        detailsForm.append('date_end', data.date_end);
      } else {
        const endDateValue = data.date_end.toISOString();
        const val = moment(endDateValue).format('MM/DD/YYYY');
        val && detailsForm.append('date_end', val);
      }
    }
    detailsForm.append('name', data.name);
    detailsForm.append('venue', data.venue);
    detailsForm.append('invite_message', data.invite_message);
    detailsForm.append('_method', 'PATCH');
    file && detailsForm.append('cover_picture', file);

    if (isDirty || dirtyForm) {
      setLoading(true);
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
            slug: data.slug,
          })
        );
        enqueueSnackbar(message, { variant: 'success' });
        generalTabRedirect(nextIndex);
        setLoading(false);
        setDirtyForm(false);
      } catch (error) {
        console.error(error);
        if (error.message === 'The cover picture failed to upload.') {
          enqueueSnackbar('Please upload a banner with 1920*760 dimensions', { variant: 'error' });
        } else {
          enqueueSnackbar(error.message, { variant: 'error' });
        }
        setLoading(false);
      }
    } else {
      generalTabRedirect(nextIndex);
    }
  };

  const handleDownload = async () => {
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

  useEffect(() => {
    const getEventDetails = async () => {
      try {
        await axios.get(`/api/events/${eventDetail.id}`).then((response) => {
          if (!isMounted.current) {
            const { data } = response.data;
            data.name ? setValue('name', data.name) : setValue('name', '');
            data.date_start && setValue('date_start', data.date_start);
            data.date_start && setValue('date_end', data.date_end);
            data.venue ? setValue('venue', data.venue) : setValue('venue', '');
            data.invite_message
              ? setValue('invite_message', data.invite_message)
              : setValue('invite_message', '');
            data.cover_picture &&
              (data.cover_picture.thumbnail_url
                ? setFileSrc(data.cover_picture.thumbnail_url)
                : setFileSrc(data.cover_picture.original_url));
            setShareHTML(data.pre_registration_invite_html);
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

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <GDWrapper>
        <Grid container spacing={4}>
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
            <RHFTextField
              name="invite_message"
              label="Add Custom Message for Pre-Regirtrations"
              rows={3}
              multiline
            />

            <div>
              <Button
                onClick={() => generalTabRedirect(preRegistrationIndex)}
                size="small"
                endIcon={<IconGoSVG color="#7DD78D" />}
              >
                View Pre-registered Guests
              </Button>
            </div>
          </Grid>

          {eventDetail.eventType !== CLIENT && (
            <Grid item sm={12} md={6} sx={{ width: '100%' }}>
              <FlexWrapper>
                <FlexWrapper>
                  <Typography variant="h6" pr={1}>
                    QR Code
                  </Typography>
                  <Tooltip
                    title='Share this QR code with the people to help them pre-register to the event.'
                    arrow
                    placement="bottom"
                    TransitionComponent={Zoom}
                    TransitionProps={{ timeout: 400 }}
                    componentsProps={{
                      tooltip: {
                        sx: {
                          bgcolor: 'common.black',
                          borderRadius: '4px',
                          p: 1.5,
                          fontSize: '13px',
                          fontStyle: 'italic',
                          lineHeight: '15.73px',
                          fontWeight: 200,
                          width: 200,
                          '& .MuiTooltip-arrow': {
                            color: 'common.black',
                          },
                        },
                      },
                    }}
                  >
                    <InfoIcon fontSize="small" sx={{ cursor: 'pointer' }} />
                  </Tooltip>
                </FlexWrapper>

                <FlexWrapper>
                  <Icon>
                    <FileDownloadOutlinedIcon onClick={handleDownload} sx={{ mx: 1, cursor: 'pointer' }} />

                    <ShareIcon onClick={() => setQrCodeDrawer(true)} sx={{ cursor: 'pointer' }} />

                    <ShareQRCodeDrawer openDrawer={qRCodeDrawer} onClose={() => setQrCodeDrawer(false)} />
                  </Icon>
                </FlexWrapper>
              </FlexWrapper>
              <BarcodeContainer>
                <iframe srcDoc={shareHTML} width="100%" height="100%" title="barcode" />
              </BarcodeContainer>
            </Grid>
          )}
        </Grid>
      </GDWrapper>
      <CreateEventFooterView
        footerAction={
          <LoadingButton
            loading={loading}
            size="small"
            type="submit"
            color="primary"
            endIcon={<IconGoSVG color="#7DD78D" />}
          >
            Save and Proceed
          </LoadingButton>
        }
      />
    </FormProvider>
  );
}
