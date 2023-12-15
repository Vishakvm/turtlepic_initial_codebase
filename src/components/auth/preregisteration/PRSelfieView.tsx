/*
 * Selfie Landing Page
 *
 */
import React, { useCallback, useState, useRef, useEffect, ChangeEvent } from 'react';

import { useParams, useLocation } from 'react-router-dom';

import { makeStyles } from '@mui/styles';
import { useNavigate } from 'react-router';
import { useSnackbar } from 'notistack';
import Webcam from 'react-webcam';

import axios from 'src/utils/axios';
import { Button, Dialog, DialogContent, Slide, styled, Typography, Grid } from '@mui/material';
import Camera from 'src/assets/shared/images/Camera.png';
import { PATH_PRE_AUTH } from 'src/routes/paths';
import Selfie from 'src/assets/shared/images/Selfie.png';
import SignupBodyWrapper from '../elements/SignupBodyWrapper';
import IconNextSVG from 'src/assets/shared/svg/IconNextSVG';
import CameraIcon from '@mui/icons-material/Camera';
import { TransitionProps } from '@mui/material/transitions';
import CloseIcon from '@mui/icons-material/Cancel';
import { useSelector } from 'react-redux';
import { PUBLISHED } from 'src/utils/constants';
import useAuth from 'src/hooks/useAuth';
import { useDispatch } from 'src/redux/store';
import { eventSlugDetails } from 'src/redux/slices/eventSlug';

import { selfieType } from 'src/redux/slices/hasSelfie';
import { LoadingButton } from '@mui/lab';

import CollectionsIcon from '@mui/icons-material/Collections';

import Cropper, { ReactCropperElement } from 'react-cropper';
import 'cropperjs/dist/cropper.css';

const Wrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(6),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1),
  },
}));

const Content = styled('div')(({ theme }) => ({
  cursor: 'pointer',
  padding: theme.spacing(4),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  background: theme.palette.grey[300],
  borderRadius: '4px',
  [theme.breakpoints.down('sm')]: {
    display: 'block',
  },
}));
const TextWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 0, 0, 4),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2, 0, 0, 0),
  },
}));

const ButtonWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(5, 0, 0, 0),
  [theme.breakpoints.down('sm')]: {
    display: 'block',
    textAlign: 'center',
  },
}));

const CameraActionsButtonWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  marginTop: theme.spacing(1),
}));

const useStyles = makeStyles((theme) => ({
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

const ActionButton = styled(LoadingButton)(({ theme }) => ({
  margin: theme.spacing(0, 3, 0, 3),
  width: 100,
  [theme.breakpoints.down('md')]: {
    margin: theme.spacing(1),
    width: 100,
  },
  [theme.breakpoints.down('sm')]: {
    margin: theme.spacing(1),
    width: 60,
  },
}));

const CustomDialogContent = styled(DialogContent)(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    maxHeight: '500px',
  },
  [theme.breakpoints.down('sm')]: {
    maxHeight: '300px',
  },
}));

const CameraWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
}));

const Div = styled('div')(({ theme }) => ({
  maxHeight: '100%',
  overflow: 'auto',
  overflowX: 'hidden',
  overflowY: 'scroll',
  '&::-webkit-scrollbar': {
    width: '0.3em',
    backgroundColor: '#7dd78d',
  },
  '&::-webkit-scrollbar-track': {
    boxShadow: 'inset 0 0 6px rgba(0,0,0,0.1)',
    backgroundColor: '#000',
    borderRadius: '10px',
  },
  '&::-webkit-scrollbar-thumb': {
    borderRadius: '10px',
    backgroundColor: theme.palette.grey[300],
  },
}));

const videoConstraints = {
  facingMode: 'user',
};

const CameraPreview = styled('div')(({ theme }) => ({
  '.cropper-modal' : {
    backgroundColor: '#111 !important',
},
marginBottom:'20px'
}));

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="down" ref={ref} {...props} />;
});

export default function PRSelfieView(): React.ReactElement {
  const [openCamera, setOpenCamera] = useState<boolean>(true);
  const webcamRef = useRef<Webcam>(null);
  const [url, setUrl] = useState<string | null>(null);
  const [file, setFile] = useState<string | Blob>('');
  const [isMandatory, setIsMandatory] = useState<boolean>(false);
  const [selfieUploading, setSelfieUploading] = useState<boolean>(false);
  const [hasSelfie, setHasSelfie] = useState<boolean>(false);
  const [hasGrantedPermission, setHasGrantedPermission] = useState(false);
  const [loading, setLoading] = useState(false);
  const classes = useStyles();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuth();
  const dispatch = useDispatch();
  let { event } = useParams();
  const isMounted = useRef(false);
  const [open, setOpen] = React.useState(false);
  let { pathname } = useLocation();

  const [hasSelected, setHasSelected] = React.useState(false);
  const [cropper, setCropper] = useState<any>();

  const cropperRef = useRef<ReactCropperElement>(null);
  const onCrop = () => {
    const cropper = cropperRef.current?.cropper;
  };

  const eventDetails = useSelector((state: any) => state.eventSlug.value);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const getEventDetails = async (slug: string) => {
    try {
      await axios.get(`/api/events/${slug}/pre-registration`).then((response) => {
        if (!isMounted.current) {
          const { data } = response.data;

          if (process.env.REACT_APP_SHOW_SUBDOMAIN === 'true') {
            data &&
              data.domain &&
              !window.location.host.includes(data.domain) &&
              window.location.replace(
                `https://${data.domain}.${process.env.REACT_APP_MAIN_DOMAIN}/pre-registration/${event}/login`
              );
          }
          data.id &&
            dispatch(
              eventSlugDetails({
                eventId: data.id,
                eventSlug: event,
                eventStatus: data.event_status,
                hostName: data.host_name,
                isProtected: data.passcode,
              })
            );
        }
      });
    } catch (error) {
      enqueueSnackbar('Something went wrong!', { variant: 'error' });
    }
  };
  useEffect(() => {
    const slug = pathname.split('/')[2];

    getEventDetails(slug);
  }, [pathname]);

  const handleClose = () => {
    setOpen(false);
  };

  navigator.mediaDevices
    .getUserMedia({ video: true })
    .then((stream) => {
      setHasGrantedPermission(true);
    })
    .catch((error) => {
      setHasGrantedPermission(false);
    });

  const askForPermission = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        setHasGrantedPermission(true);
      })
      .catch((error) => {
        if (error.name === 'NotAllowedError') {
          //Code if camera is blocked
        } else {
        }
      });
  };

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

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

      reader.onload = (e: ProgressEvent<FileReader>) => {
        const imageSrc = e.target?.result as string;
        setUrl(imageSrc);
        setHasSelected(true);
      };

    reader.readAsDataURL(file);
  }, []);

  const handlePictureCrop = () => {

    var cropDataUrl: string = '';
    if (typeof cropper !== "undefined") {
      cropDataUrl = cropper.getCroppedCanvas().toDataURL((url?.split(',')[0].match(/:(.*?);/) || [null, 'image/png'])[1]);
    }
    setHasSelected(false);
   
        if (cropDataUrl) {
            urlToFile(cropDataUrl).then((convertedFile) => {
            setFile(convertedFile);
            setUrl(cropDataUrl);
          });
        }

        // const dataURLtoFile = (dataurl, filename) => {
        //   console.log(filename);

        //   var arr = dataurl.split(','),
        //     mime = arr[0].match(/:(.*?);/)[1],
        //     bstr = atob(arr[1]),
        //     n = bstr.length,
        //     u8arr = new Uint8Array(n);

        //   while (n--) {
        //     u8arr[n] = bstr.charCodeAt(n);
        //   }

        //   return new File([u8arr], filename, { type: mime });
        // };

          async function urlToFile(url: string): Promise<File> {
            const res = await fetch(url);
            const buf = await res.arrayBuffer();
            const fileType = url.split(';')[0].split('/')[1];
            const filename = `selfie.${fileType}`;
            console.log(filename);
            return new File([buf], filename, { type: `image/${fileType}` });

            // const arr = url.split(',');
            // const match = arr[0].match(/:(.*?);/);
            // const mime = match ? match[1] : 'application/octet-stream';
            // const bstr = atob(arr[1]);
            // const n = bstr.length;
            // const u8arr = new Uint8Array(n);
            // const fileType = match ? match[1] : 'application/octet-stream';
            // const filename = `selfie.${fileType}`;

            // for (let i = 0; i < n; i++) {
            //   u8arr[i] = bstr.charCodeAt(i);
            // }
            // console.log(u8arr);
            // console.log(filename);
            // console.log(mime);

            // return new File([u8arr], filename, { type: mime });
          }

    };


  const handleCam = () => {
    setOpenCamera(true);
  };
  const handlePictureUpload = async () => {
    setLoading(true);
    const selfieForm = new FormData();
    file && selfieForm.append('image', file);
    selfieForm.append('event_id', eventDetails.eventId);
    try {
      const response = await axios.post('/api/guest/selfie', selfieForm);
      enqueueSnackbar(response.data.message, { variant: 'success' });
      dispatch(selfieType({ has_selfie: true }));
      if (eventDetails.eventStatus === PUBLISHED) {
        navigate(`${PATH_PRE_AUTH}/${event}/preview`);
      } else {
        navigate(`${PATH_PRE_AUTH}/${event}/thank-you`);
      }
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
      // enqueueSnackbar(error.message, { variant: 'error' });
      enqueueSnackbar("Image failed to upload, Please try again with another image", { variant: 'error' });
    }
  };

  const handleSkip = () => {
    if (hasSelfie) {
      navigate(`${PATH_PRE_AUTH}/${event}/preview?to=allphotos`);
    } else {
      navigate(`${PATH_PRE_AUTH}/${event}/no-filter/thank-you`);
    }
  };

  useEffect(() => {
    const getSelfieMandatory = async () => {
      try {
        const response = await axios.get(`/api/events/${event}/preview`);
        const { data } = response.data;
        setIsMandatory(data.privacy_setting.selfie_filtering);
        setSelfieUploading(data.privacy_setting.media_selection);
      } catch (error) {
        console.error(error);
      }
    };
    getSelfieMandatory();
    user && setHasSelfie(user.has_selfie);
  }, [event, user]);
  return (
    <>
      {openCamera ? (
        <Div>
          {url ? (
            <CameraWrapper>
              <Header>
                <Typography variant="h4">Selfie Photo Filtering</Typography>
              </Header>
              <CameraAdjust>
                <Dialog
                  fullScreen
                  open={open}
                  onClose={handleClose}
                  TransitionComponent={Transition}
                  sx={{ '.MuiDialog-paperFullScreen': { backgroundColor: 'rgba(0,0,0,0.6)' } }}
                >
                  <CustomDialogContent
                    sx={{
                      p: 0,
                      maxHeight: '100%',
                      overflow: 'auto',
                      overflowX: 'hidden',
                      overflowY: 'scroll',
                      '&::-webkit-scrollbar': {
                        width: '0.3em',
                        backgroundColor: '#7dd78d',
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
                    <CloseIcon
                      sx={{ position: 'absolute', left: '50%', top: '1%' }}
                      fontSize="large"
                      color="primary"
                      onClick={handleClose}
                    />
                    <img height="100%" width="100%" src={url} alt="CapturedImage" />
                  </CustomDialogContent>
                </Dialog>

                {hasSelected ? (
                  <CameraPreview>
                    <Cropper
                      ref={cropperRef}
                      style={{ height: 400, width: '100%', backgroundColor: '#111 !important' }}
                      preview=".img-preview"
                      src={url}
                      viewMode={1}
                      minCropBoxHeight={10}
                      minCropBoxWidth={10}
                      background={false}
                      responsive={true}
                      autoCropArea={1}
                      checkOrientation={true}
                      guides={false}
                      zoomOnWheel={false}
                      onInitialized={(instance) => {
                        setCropper(instance);
                      }}
                    />
                  </CameraPreview>
                ) : (
                  <img className={classes.camera} src={url} alt="CapturedImage" />
                )}
              </CameraAdjust>

              {hasSelected ? (
                <CameraActionsButtonWrapper>
                  <ActionButton variant="contained" onClick={handlePictureCrop} size="small">
                    Crop
                  </ActionButton>
                </CameraActionsButtonWrapper>
              ) : (
                <CameraActionsButtonWrapper>
                  <ActionButton
                    variant="contained"
                    size="small"
                    onClick={() => {
                      setUrl(null);
                    }}
                  >
                    Delete
                  </ActionButton>
                  <ActionButton
                    loading={loading}
                    variant="contained"
                    size="small"
                    onClick={handlePictureUpload}
                  >
                    Next
                  </ActionButton>
                  <ActionButton variant="contained" onClick={handleClickOpen} size="small">
                    FullScreen
                  </ActionButton>
                </CameraActionsButtonWrapper>
              )}
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
              <Grid container alignItems="center" justifyContent="center">
                <Button
                  sx={{ mx: 5 }}
                  variant="contained"
                  size="medium"
                  startIcon={<CameraIcon />}
                  onClick={capture}
                >
                  Capture
                </Button>
                {selfieUploading && (
                  <>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={handleFileUpload}
                    />
                    <Button
                      sx={{ mx: 5 }}
                      variant="contained"
                      size="medium"
                      startIcon={<CollectionsIcon />}
                      onClick={handleClick}
                    >
                      Upload from Gallery
                    </Button>
                  </>
                )}
              </Grid>

              {!hasGrantedPermission && (
                <>
                  <Typography variant="h5" align="left" gutterBottom sx={{ marginTop: '15px' }}>
                    Please allow camera permission to click selfie
                  </Typography>
                  {/* <Button size="large" variant="outlined" onClick={() => askForPermission()}>
                    Allow Camera
                  </Button> */}
                </>
              )}
            </CameraWrapper>
          )}
        </Div>
      ) : (
        <>
          <SignupBodyWrapper
            image={Selfie}
            title={'Selfie Filtering'}
            progress={false}
            logout={true}
            children={
              <Wrapper>
                <Typography py={6} variant="h2" align="center" gutterBottom>
                  Selfie Filtering
                </Typography>
                <Content onClick={handleCam}>
                  <img src={String(Camera)} alt="Camera" />
                  <TextWrapper>
                    {hasSelfie ? (
                      <Typography variant="h3" align="left" gutterBottom>
                        Take selfie again
                      </Typography>
                    ) : (
                      <Typography variant="h3" align="left" gutterBottom>
                        Take selfie for photo filtering
                      </Typography>
                    )}
                    <Typography variant="h5" align="left" gutterBottom>
                      You’ll be able to see only your pictures hastle-free, with our advanced AI
                      feature.
                    </Typography>
                  </TextWrapper>
                </Content>
                <ButtonWrapper>
                  {hasSelfie ? (
                    <Button size="large" variant="outlined" onClick={handleSkip}>
                      Skip/Do it later
                    </Button>
                  ) : (
                    <>
                      {isMandatory ? (
                        <Button size="large" variant="outlined" disabled>
                          Skip/Do it later
                        </Button>
                      ) : (
                        <Button size="large" variant="outlined" onClick={handleSkip}>
                          Skip/Do it later
                        </Button>
                      )}
                    </>
                  )}

                  <Button
                    onClick={handleCam}
                    size="large"
                    variant="contained"
                    endIcon={<IconNextSVG />}
                  >
                    Take Selfie
                  </Button>
                </ButtonWrapper>
              </Wrapper>
            }
          />
        </>
      )}
    </>
  );
}
