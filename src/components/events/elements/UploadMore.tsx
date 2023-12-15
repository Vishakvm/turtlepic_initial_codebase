import { useCallback, useState, useEffect, useRef, Dispatch, SetStateAction } from 'react';

import { Box, Button, styled, Typography } from '@mui/material';
import CircularProgress, {
  CircularProgressProps,
  circularProgressClasses,
} from '@mui/material/CircularProgress';

import { LoadingButton } from '@mui/lab';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CancelIcon from '@mui/icons-material/Cancel';
import DoneIcon from '@mui/icons-material/Done';

import axios from 'src/utils/axios';
import { useSelector } from 'react-redux';
import { useDropzone } from 'react-dropzone';

// aws sdk
import { Upload } from '@aws-sdk/lib-storage';
import { S3Client } from '@aws-sdk/client-s3';

import { useSnackbar } from 'notistack';
import { dispatch } from 'src/redux/store';
import { uploadStatusDrawer } from 'src/redux/slices/uploadDrawer';

//@ts-ignore
import { v4 as uuidv4 } from 'uuid';
import FileResizer from 'react-image-file-resizer';

type Picture = {
  path: string;
  preview: string;
  lastModified: number;
  lastModifiedDate: Object;
  name: string;
  size: number;
  type: string;
  webkitRelativePath: string;
};

type DrawerProps = {
  close: () => void;
  refreshPage: Dispatch<SetStateAction<boolean>>;
};

const Wrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(2, 0, 0, 0),
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

const Dotted = styled('div')(({ theme }) => ({
  padding: theme.spacing(4),
  border: '1px dashed #fff',
}));

const CentralWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
}));

const ImageContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  marginTop: theme.spacing(2),
}));

const UploadImgStyle = styled('div')(({ theme }) => ({
  margin: theme.spacing(0, 1.5, 2, 0),
  [theme.breakpoints.down('sm')]: {
    margin: theme.spacing(0, 0.5, 1.5, 0),
  },
}));

const ThumbImgStyle = styled('img')(({ theme }) => ({
  borderRadius: '4px',
  height: '80px',
  width: '80px',
  objectFit: 'cover',
  border: `1.5px solid ${theme.palette.common.black}`,
}));

const CancelIconStyle = styled(CancelIcon)(({ theme }) => ({
  position: 'relative',
  top: '15px',
  left: '68px',
  cursor: 'pointer',
}));

const ProgressWrapper = styled('div')(({ theme }) => ({
  textAlign: 'center',
  padding: theme.spacing(30, 5, 5, 5),
}));

type ImageType = {
  name: string;
  file_name: string;
  directory: string;
  mime_type: string;
  size: number;
};

export default function UploadMore({ close, refreshPage }: DrawerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState<File[]>([]);
  const [fileSrc, setFileSrc] = useState<Picture[] | []>([]);
  const [total, setTotal] = useState(file.length);
  const [uploaded, setUploaded] = useState(0);
  const [progress, setProgress] = useState(10);
  const [singleImage, setSingleImage] = useState(false);
  const [success, setSuccess] = useState(false);
  const [mediaPath] = useState<ImageType[]>([]);
  const [count] = useState(process.env.REACT_APP_IMAGE_PATH);

  const isMounted = useRef(false);

  window.onbeforeunload = function () {
    dispatch(
      uploadStatusDrawer({
        status: false,
        total: 0,
        progress: 0,
        success: false,
      })
    );
  };
  const { enqueueSnackbar } = useSnackbar();
  const CircularProgressWithLabel = (props: CircularProgressProps & { value: number }) => (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <Box sx={{ position: 'relative' }}>
        <CircularProgress
          variant="determinate"
          sx={{
            color: (theme) => theme.palette.grey[900],
          }}
          size={80}
          thickness={5}
          {...props}
          value={100}
        />
        <CircularProgress
          variant="determinate"
          sx={{
            animationDuration: '550ms',
            position: 'absolute',
            left: 0,
            [`& .${circularProgressClasses.circle}`]: {
              strokeLinecap: 'round',
            },
          }}
          size={80}
          thickness={5}
          {...props}
        />
      </Box>
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 5,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {success || upStats.success ? (
          <DoneIcon fontSize="large" color="primary" />
        ) : (
          <Typography variant="body1" color="primary">{`${Math.ceil(props.value) - 1
            }%`}</Typography>
        )}
      </Box>
    </Box>
  );
  const CircularProgressWithSingle = (props: CircularProgressProps) => (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <Box sx={{ position: 'relative' }}>
        <CircularProgress
          variant={!upStats.success || !success ? 'indeterminate' : 'determinate'}
          sx={{
            color: (theme) => theme.palette.primary.main,
          }}
          size={50}
          thickness={3}
          {...props}
          value={100}
        />
      </Box>
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 5,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {upStats.success || success ? <DoneIcon fontSize="large" color="primary" /> : null}
      </Box>
    </Box>
  );

  const upStats = useSelector((state: any) => state.uploadStatusDrawer.value);

  useEffect(() => {
    setProgress((upStats.progress / upStats.total) * 100);
    setUploaded(upStats.progress);
    setTotal(upStats.total);
    setSuccess(upStats.success);
    if (upStats.total === 1) {
      setSingleImage(true);
    }
  }, [total, upStats.progress, upStats.status, upStats.success, upStats.total, uploaded]);
  useEffect(
    () => () => {
      isMounted.current = true;
    },
    []
  );

  const eventDetails = useSelector((state: any) => state.createEvent.value);
  const folderDetails = useSelector((state: any) => state.folder.value);

  const onDrop = useCallback((acceptedFiles) => {
    setFile(acceptedFiles);
    const imagePreview = acceptedFiles.map((file: any) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
      })
    );
    setFileSrc(imagePreview);
  }, []);
  const { getRootProps, getInputProps, open, isDragActive, fileRejections } = useDropzone({
    onDrop,
    noClick: true,
    accept: {
      'image/jpeg': [],
      'image/png': [],
    },
  });
  const rejectedFiles = fileRejections.map(({ file, errors }) => (
    <div key={file.name}>
      {errors.map((e) => (
        <div key={e.code}>
          <Typography mt={3} align="center" color="error" variant="h6">
            Invalid File Type !!
          </Typography>
          <Typography mt={1} align="center" color="error" variant="h6">
            {e.message}
          </Typography>
        </div>
      ))}
    </div>
  ));

  const handleImagePath = async (index: number, path: any, len: number) => {
    if (index % Number(count) === 0 && index > 1) {
      const paths = path.splice(0, Number(count));
      try {
        await axios.post(`/api/folders/${folderDetails.id}/uploads`, {
          media: paths,
        });
      } catch (error) {
        enqueueSnackbar(error.message, { variant: 'error' });
      }
    } else if (index === len - 1) {
      const paths = path;
      try {
        await axios.post(`/api/folders/${folderDetails.id}/uploads`, {
          media: paths,
        });
      } catch (error) {
        enqueueSnackbar(error.message, { variant: 'error' });
      }
    }
  };

  const handleUpload = async () => {
    setIsLoading(true);

    setTotal(file.length);

    if (file.length === 1) {
      setSingleImage(true);
    }

    for (var i = 0; i < file.length; i++) {
      dispatch(
        uploadStatusDrawer({
          status: true,
          total: file.length,
          progress: i + 1,
          success: false,
        })
      );

      const imgFile = file[i];

      // aws-sdk upload
      const id = uuidv4();
      const path = `events/${eventDetails.id}/folders/${folderDetails.id}/${id}/${file[i].name}`;
      // const thumbnailPath = `events/${eventDetails.id}/folders/${folderDetails.id}/${id}/conversions/${file[i].name}-thumb.webp`;

      mediaPath.push({
        file_name: file[i].name,
        name: file[i].name.split('.')[0],
        mime_type: file[i].type,
        directory: id,
        size: file[i].size,
      });
      handleImagePath(i, mediaPath, file.length);
      const target = {
        Bucket: process.env.REACT_APP_HOST_AWS_BUCKET,
        Key: path,
        Body: imgFile,
        ContentType: 'image/jpeg',
      };
      const creds = {
        accessKeyId: process.env.REACT_APP_HOST_AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.REACT_APP_HOST_AWS_SECRET_ACCESS_KEY || '',
      };
      try {
        const parallelUploads3 = new Upload({
          client: new S3Client({
            region: process.env.REACT_APP_HOST_AWS_DEFAULT_REGION || '',
            credentials: creds,
          }),
          leavePartsOnError: true,
          partSize: 1024 * 1024 * 1000,
          params: target,
        });
        if (navigator.onLine) {
          parallelUploads3.on('httpUploadProgress', (progress: any) => { });
        } else {
          dispatch(
            uploadStatusDrawer({
              status: false,
              total: 0,
              progress: 0,
              success: false,
            })
          );
          enqueueSnackbar(
            'You are not connected to the internet! Try uploading when you are back online.',
            { variant: 'error' }
          );
        }
        // console.log(1); // remove

        await parallelUploads3.done();
        // console.log(2); // remove

        // await generateThumbnail(imgFile, thumbnailPath);
        // console.log(3); // remove

        // await sendThumbnailID(id)
        // console.log(4); // remove
      } catch (e) {
        console.error(e);
        setIsLoading(false);
        dispatch(
          uploadStatusDrawer({
            status: false,
            total: 0,
            progress: 0,
            success: false,
          })
        );
        enqueueSnackbar(
          <div>
            <Typography>Something Went Wrong! Please try again.</Typography>
            <Typography fontStyle="italic">{e?.message}</Typography>
          </div>,
          {
            variant: 'error',
          }
        );
        break;
      }
    }
    dispatch(
      uploadStatusDrawer({
        status: true,
        total: 0,
        progress: 0,
        success: true,
      })
    );
    setSuccess(upStats.success);
    setTimeout(() => {
      dispatch(
        uploadStatusDrawer({
          status: false,
          total: 0,
          progress: 0,
          success: false,
        })
      );
      setIsLoading(upStats.status);
      dispatch(
        uploadStatusDrawer({
          status: false,
          total: 0,
          progress: 0,
          success: false,
        })
      );
      close();
      refreshPage(true);
    }, 1000);
  };

//  const generateThumbnail = (file: File, path: any) =>
//     new Promise((resolve, reject) => {
//       FileResizer.imageFileResizer(
//         file,
//         800,
//         480,
//         "webp",
//         75,
//         0,
//         async (uri: any) => {
//           console.log('inside', 1); // remove
//           console.log(uri);

//           const creds = {
//             accessKeyId: process.env.REACT_APP_HOST_AWS_ACCESS_KEY_ID || '',
//             secretAccessKey: process.env.REACT_APP_HOST_AWS_SECRET_ACCESS_KEY || '',
//           };

//           const target = {
//             Bucket: process.env.REACT_APP_HOST_AWS_BUCKET,
//             Key: path,
//             Body: uri,
//             ContentType: 'image/webp',
//           };

//           try {
//             const parallelUploads3 = new Upload({
//               client: new S3Client({
//                 region: process.env.REACT_APP_HOST_AWS_DEFAULT_REGION || '',
//                 credentials: creds,
//               }),
//               leavePartsOnError: true,
//               partSize: 1024 * 1024 * 1000,
//               params: target,
//             });

//             await parallelUploads3.done();

//             resolve(uri);

//             console.log('inside done', 2); // remove
//           } catch (e) {
//             console.error(e);
//             reject();
//           }
//         },
//         "file"
//       );
//     });

//   const sendThumbnailID = async (id: string) => {
//     await axios.post(`/api/events/convchange`, { directory: id })
//       .then(res => {
//         if (res.data?.status == 'success') {
//           console.log(res.data);
//         } else {
//           throw TypeError("Error @sendThumbnailID")
//         }
//       })
//       .catch(error => {
//         console.log(error);
//         throw TypeError("Error @sendThumbnailID")
//       })
//   }
 

  const handleRemoval = () => {
    setFileSrc([]);
    setFile([]);
  };

  const handleRemoveSelected = (imageName: string) => {
    const update = fileSrc.filter((f: any) => f.name !== imageName);
    setFileSrc(update);
    const updateUpload = file.filter((f: any) => f.name !== imageName);
    setFile(updateUpload);
  };

  return (
    <Wrapper>
      {isLoading || upStats.status ? (
        <ProgressWrapper>
          {singleImage ? (
            <CircularProgressWithSingle />
          ) : (
            <CircularProgressWithLabel value={progress} />
          )}
          {success ? (
            <Typography mt={3} variant="h4" color="primary">
              {file.length <= 1 ? 'Image Uploaded Successfully' : 'Images Uploaded Successfully'}
            </Typography>
          ) : (
            <>
              <Typography mt={3} variant="h4" color="primary">
                Uploading... {`${uploaded} of ${total}`}
              </Typography>
            </>
          )}
        </ProgressWrapper>
      ) : (
        <>
          <Typography py={2} align="center" variant="h2">
            Upload more pictures
          </Typography>
          <UploadWrapper>
            <Dotted style={{ zIndex: 44444 }} {...getRootProps()}>
              <CentralWrapper>
                <CloudUploadIcon fontSize="large" />
              </CentralWrapper>
              {isDragActive ? (
                <Typography py={2} align="center" variant="body1">
                  Drop your files here...
                </Typography>
              ) : (
                <Typography py={2} align="center" variant="body1">
                  Drag &amp; Drop your files
                </Typography>
              )}

              <Typography py={1} align="center" variant="body1">
                or
              </Typography>
              <CentralWrapper>
                <Button onClick={open} variant="outlined">
                  Browse
                </Button>
              </CentralWrapper>
              <input {...getInputProps()} />
            </Dotted>

            {fileSrc.length !== 0 && (
              <>
                <ImageContainer>
                  {fileSrc
                    .filter((item, index) => index < 5)
                    .map((ele: any, index) => (
                      <UploadImgStyle key={index}>
                        <CancelIconStyle
                          fontSize="small"
                          color="primary"
                          onClick={() => handleRemoveSelected(ele.name)}
                        />
                        <ThumbImgStyle
                          src={String(ele.preview)}
                          height="100%"
                          width="100%"
                          alt="img"
                        />
                      </UploadImgStyle>
                    ))}
                  {fileSrc.length > 5 && (
                    <Typography variant="h5" fontWeight={600} color="primary">
                      + {fileSrc.length - 5} more
                    </Typography>
                  )}
                </ImageContainer>
                <CentralWrapper>
                  <Button
                    variant="outlined"
                    sx={{ mx: 1, width: 100 }}
                    onClick={handleRemoval}
                    size="small"
                  >
                    Remove all
                  </Button>
                  <LoadingButton
                    onClick={handleUpload}
                    loading={isLoading}
                    size="small"
                    variant="contained"
                    sx={{ mx: 1, width: 100 }}
                  >
                    Upload
                  </LoadingButton>
                </CentralWrapper>
              </>
            )}
            {fileRejections.length > 0 && rejectedFiles}
          </UploadWrapper>
        </>
      )}
    </Wrapper>
  );
}
