/*
 * Picture Grid Element
 *
 */
import React, { useEffect, useState, useCallback, useRef } from 'react';

import {
  styled, Typography, Grid, Box, FormControl, MenuItem, Select, SelectChangeEvent, Button, Stack, Switch,
  FormControlLabel, Checkbox,
} from '@mui/material';
import CircularProgress, {
  CircularProgressProps,
  circularProgressClasses,
} from '@mui/material/CircularProgress';
import { LoadingButton } from '@mui/lab';
import { makeStyles } from '@mui/styles';

//@ts-ignore
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';

import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CircleOutlinedIcon from '@mui/icons-material/CircleOutlined';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import DoneIcon from '@mui/icons-material/Done';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import LastPageIcon from '@mui/icons-material/LastPage';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import PlayCircleFilledWhiteIcon from '@mui/icons-material/PlayCircleFilledWhite';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import AddToDriveIcon from '@mui/icons-material/AddToDrive';
import axios from 'src/utils/axios';
import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { useDropzone } from 'react-dropzone';
import { useSnackbar } from 'notistack';
import { useDispatch, useSelector } from 'src/redux/store';
import UploadMoreDrawer from 'src/components/events/drawers/UploadMoreDrawer';

import Resizer from 'react-image-file-resizer';

//@ts-ignore
import { v4 as uuidv4 } from 'uuid';

import { AGENCY, ALL, CLIENT, CUSTOM, FAVOURITES, NEXT, PHOTOS, PREV, TRANSFERRED, VIDEOS, LAST, FIRST } from 'src/utils/constants';
import ConfirmationDialog from 'src/components/dialogs/ConfirmationDialog';
import VideoElement from './VideoElement';
import { uploadStatus } from 'src/redux/slices/uploadStatus';
import useAuth from 'src/hooks/useAuth';
import useInterval from 'src/hooks/useInterval';
import UpdateFolderDrawerView from '../drawers/UpdateFolderDrawer';
import FileResizer from 'react-image-file-resizer';

type PictureGridProps = {
  onClick: () => void;
};

const useStyles = makeStyles((theme) => ({
  list: {
    padding: 0,
  },
}));

const Wrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(2, 3, 3, 3),
}));

const Actions = styled('div')(({ theme }) => ({
  position: 'absolute',
  bottom: 170,
  right: 0,
  width: '100%',
  background: 'rgba(0,0,0,0.4)',
}));
const ActionsBackground = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
}));

const CheckboxWrapper = styled('div')(({ theme }) => ({
  position: 'relative',
}));

const ActionsContainer = styled('div')(({ theme }) => ({
  position: 'relative',
  top: '170px',
}));

const HeaderActions = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer',
  [theme.breakpoints.down('md')]: {
    justifyContent: 'center',
  },
}));

const HeaderLeft = styled('div')(({ theme }) => ({
  display: 'flex',
  flexGrow: 7,
  alignItems: 'center',
}));

const HeaderForm = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  [theme.breakpoints.down('md')]: {
    justifyContent: 'center',
    padding: theme.spacing(3, 0, 3, 0),
  },
  [theme.breakpoints.down('sm')]: {
    display: 'block',
    padding: theme.spacing(1, 0, 3, 0),
  },
}));
const Header = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 0, 1, 0),
  justifyContent: 'space-between',
  [theme.breakpoints.down('md')]: {
    display: 'block',
  },
}));

const HeaderActionWraper = styled('div')(({ theme }) => ({
  display: 'flex',
  [theme.breakpoints.down('md')]: {
    justifyContent: 'center',
  },
  [theme.breakpoints.down('sm')]: {
    display: 'block',
  },
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

const SwitchWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  paddingLeft: theme.spacing(3),
  [theme.breakpoints.down('sm')]: {
    paddingLeft: 0,
  },
}));

const CentralWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
}));

const ProgressWrapper = styled('div')(({ theme }) => ({
  textAlign: 'center',
  padding: theme.spacing(5),
}));

const ImageContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  marginTop: theme.spacing(2),
}));
const Navigation = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: 30,
  [theme.breakpoints.down('md')]: {
    display: 'block',
    marginTop: 10,
  },
}));
const Nav = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}));
const Page = styled('div')(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    textAlign: 'center',
    padding: theme.spacing(4, 0, 1, 0),
  },
}));

const UploadImgStyle = styled('div')(({ theme }) => ({
  margin: theme.spacing(0, 1.5, 2, 0),
  [theme.breakpoints.down('sm')]: {
    margin: theme.spacing(0, 0.5, 1.5, 0),
  },
}));

const NoDataWrapper = styled('div')(({ theme }) => ({
  height: '200px',
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
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

const CustomCheckBox = styled(Checkbox)(({ theme }) => ({
  zoom: '2',
  position: 'absolute',
  left: '50%',
  top: '45%',
  transform: 'translate(-50%, -50%)',
  borderRadius: 0,
  height: '90%',
  width: '100%',
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

const HeaderActions2 = styled('div')(({ theme }) => ({
  display: 'flex',
  padding: theme.spacing(0, 2, 0, 2),
  alignItems: 'center',
  [theme.breakpoints.down('sm')]: {
    justifyContent: 'center',
  },
}));

const Div = styled('div')(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  [theme.breakpoints.down('sm')]: {
    justifyContent: 'center',
  },
}));

type ImageListType = {
  file_name: string;
  name: string;
  thumbnail_url: string;
  original_url: string;
  id: number;
  video_url: string;
  favorite: boolean;
};
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

type ImageType = {
  name: string;
  file_name: string;
  directory: string;
  mime_type: string;
  size: number;
};

export default function PictureGridElement(props: PictureGridProps): React.ReactElement {
  const [photosSelectionType, setSelectPhotosSelectionType] = useState('');
  const [selectPhotoCategory, setSelectPhotoCategory] = useState('');
  const [imageDetails, setImageDetails] = useState<ImageListType[]>([]);
  const [photosOnly, setPhotosOnly] = useState<ImageListType[]>([]);
  const [videosOnly, setVideosOnly] = useState<ImageListType[]>([]);
  const [allMedia, setAllMedia] = useState<ImageListType[]>([]);
  const [file, setFile] = useState<File[]>([]);
  const [allowDownload, setAllowDownload] = useState<boolean>(false);
  const [skipDuplicates, setSkipDuplicates] = useState<boolean>(false);
  const [isDefault, setIsDefault] = useState<boolean>(false);
  const [fileSrc, setFileSrc] = useState<Picture[] | []>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadMoreDrawer, setUploadMoreDrawer] = React.useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isChecked, setIsChecked] = useState(false);

  const [selectedView, setSelectedView] = useState(false);
  const [imageIds, setImageIds] = useState<number[]>([]);
  const [selectedValue, setSelectedValue] = useState<string>('');
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const folderDetails = useSelector((state: any) => state.folder.value);
  const eventDetails = useSelector((state: any) => state.createEvent.value);
  const [paginateMeta, setPaginateMeta] = useState(Object);
  const [checkPage, setCheckPage] = useState(Object);
  const [picturePage, setPicturePage] = useState(1);

  const [toggleFav, setToggleFav] = useState<boolean>(false);
  const [noFav, setNoFav] = useState<boolean>(false);
  const [favCount, setFavCount] = useState(0);
  const classes = useStyles();
  const [total, setTotal] = useState(file.length);
  const [uploaded, setUploaded] = useState(0);
  const [progress, setProgress] = useState(10);
  const [singleImage, setSingleImage] = useState(false);
  const [success, setSuccess] = useState(false);
  const [mediaPath] = useState<ImageType[]>([]);
  const [delay, setDelay] = useState<number | null>(null);
  const [isDone, setIsDone] = useState<boolean>(true);
  const [processed, setProcessed] = useState<number>(0);
  const [totalUploads, setTotalUploads] = useState<number>(0);
  const [statusCall, setStatusCall] = useState<boolean>(true);
  const [folderDrawer, setFolderDrawer] = useState(false);
  const [val, setVal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingPhotos, setLoadingPhotos] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [downloading, setDownloading] = useState<boolean>(false);
  const [downloadId, setDownloadId] = useState<number>(0);

  const [loadNext, setLoadNext] = useState(false);
  const [loadPrev, setLoadPrev] = useState(false);
  const [loadLast, setLoadLast] = useState(false);
  const [loadFirst, setLoadFirst] = useState(false);

  const [count] = useState(process.env.REACT_APP_IMAGE_PATH);

  const isMounted = useRef(false);
  const dispatch = useDispatch();
  const { user } = useAuth();
  const limit = 24;

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
  const upStats = useSelector((state: any) => state.uploadStatus.value);

  window.onbeforeunload = function () {
    dispatch(
      uploadStatus({
        status: false,
        total: 0,
        progress: 0,
        success: false,
      })
    );
  };
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

  const { enqueueSnackbar } = useSnackbar();

  const getPhotoGrid = async (page?: number) => {
    setLoadingPhotos(true);
    try {
      const response = await axios.get(`/api/folders/${folderDetails.id}/uploads?limit=${limit}`, {
        params: {
          page: page,
        },
      });
      const { data, meta, links } = response.data;
      setPaginateMeta(meta);
      setImageDetails(data);
      setCheckPage(links);

      let photos = data.filter((ele: any, index: any) => ele.video_url === null);
      let videos = data.filter((ele: any, index: any) => ele.video_url !== null);
      setPhotosOnly(photos);
      setVideosOnly(videos);
      setAllMedia(data);
      let result = data.map((a: any) => a.id);
      setImageIds(result);
      setLoadingPhotos(false);
      setRefresh(false);
      setLoadFirst(false);
      setLoadNext(false);
      setLoadPrev(false);
      setLoadLast(false);
      scrollTop();
    } catch (error) {
      setLoadingPhotos(false);
      setLoadFirst(false);
      setLoadNext(false);
      setLoadPrev(false);
      setLoadLast(false);
      console.error(error);
      if (navigator.onLine) {
        enqueueSnackbar(error.message, { variant: 'error' });
      }
    }
  };

  const getPollingStatus = async () => {
    setPicturePage(picturePage);
    if (statusCall) {
      try {
        const response = await axios.get(`/api/folders/${folderDetails.id}/upload-status`);
        const { data } = response.data;
        if (data.uploaded || data.processed === data.total) {
          setIsDone(true);
          setDelay(null);
        } else {
          setTotalUploads(data.total);
          setProcessed(data.processed);
          setIsDone(data.uploaded);
          setDelay(3000);
        }
      } catch (error) {
        setIsDone(true);
        setDelay(null);
        console.error(error);
        if (navigator.onLine) {
          enqueueSnackbar(error.message, { variant: 'error' });
        }
      }
    }
  };

  useInterval(
    async () => {
      try {
        const response = await axios.get(`/api/folders/${folderDetails.id}/upload-status`);
        const { data } = response.data;
        if (data.uploaded || data.processed === data.total) {
          if (data.error) {
            enqueueSnackbar(data.error, { variant: 'error' });
          }
          setDelay(null);
          setIsDone(true);
          getPhotoGrid(picturePage);
        } else {
          setStatusCall(false);
          setTotalUploads(data.total);
          setProcessed(data.processed);
          setIsDone(data.uploaded);
          getPhotoGrid(picturePage);
        }
      } catch (error) {
        console.error(error);
        setIsDone(true);
        setDelay(null);
        if (navigator.onLine) {
          enqueueSnackbar(error.message, { variant: 'error' });
        }
      }
    },
    !isDone ? delay : null
  );

  useEffect(() => {
    if (!isMounted.current) {
      getPhotoGrid(picturePage);
    }
    getFavouriteCount();
    getPollingStatus();
    setAllowDownload(folderDetails.allow_download);
    setSkipDuplicates(folderDetails.skip_duplicates);
    setIsDefault(folderDetails.is_default);
  }, [refresh, showAll]);

  const isCheckboxChecked = (e: React.ChangeEvent<HTMLInputElement>, selection: number) => {
    if (!selectedIds.includes(selection)) {
      setSelectedIds([...selectedIds, selection]);
    } else if (selectedIds.includes(selection)) {
      const index = selectedIds.indexOf(selection);
      if (index !== -1) {
        selectedIds.splice(index, 1);
        setSelectedIds([...selectedIds]);
      }
    }
  };

  const handleChangePhotos = (event: SelectChangeEvent) => {
    setSelectPhotoCategory(event.target.value);
    const selectionType = event.target.value;
    switch (true) {
      case selectionType === ALL:
        setImageDetails(allMedia);
        let resultAll = allMedia.map((a: any) => a.id);
        setImageIds(resultAll);
        setNoFav(false);
        break;
      case selectionType === PHOTOS:
        setImageDetails(photosOnly);
        let resultPhotos = photosOnly.map((a: any) => a.id);
        setImageIds(resultPhotos);
        setNoFav(false);
        break;
      case selectionType === VIDEOS:
        if (videosOnly.length !== 0) {
          setImageDetails(videosOnly);
          let resultVideos = videosOnly.map((a: any) => a.id);
          setImageIds(resultVideos);
        } else {
          setNoFav(true);
        }
        break;
      case selectionType === '':
        setImageDetails(allMedia);
        let resultDefault = allMedia.map((a: any) => a.id);
        setImageIds(resultDefault);
        setNoFav(false);
        break;
      default:
        return;
    }
  };

  const handlePhotoSelection = (event: SelectChangeEvent) => {
    setSelectPhotosSelectionType(event.target.value);
    setSelectedView(true);

    const selectionType = event.target.value;
    switch (true) {
      case selectionType === ALL:
        setSelectedValue(ALL);
        setSelectedIds([]);
        setIsChecked(true);
        break;
      case selectionType === CUSTOM:
        setSelectedValue(CUSTOM);
        setSelectedIds([]);
        setIsChecked(false);
        break;
      case selectionType === FAVOURITES:
        break;
      case selectionType === '':
        setIsChecked(false);
        setSelectedView(false);
        setSelectedValue('');
        break;
      default:
        return;
    }
  };
  const deletionHandler = () => {
    if (selectedValue === '') {
      enqueueSnackbar('Please select the photos to delete!', { variant: 'error' });
    } else {
      setDialogOpen(true);
    }
  };
  const dialogHandler = () => {
    handleDelete();
    setDialogOpen(false);
  };
  const handleDelete = async () => {
    if (selectedValue === ALL) {
      try {
        await axios.delete(`/api/folders/${folderDetails.id}/uploads/batch`, {
          data: { resources: imageIds },
        });
        enqueueSnackbar('Successfully Deleted', { variant: 'success' });
        setIsChecked(false);
        setSelectedView(false);
        setImageIds([]);
        setSelectPhotosSelectionType('');
        setSelectedValue('');
        getPhotoGrid(picturePage);
        handleRemoval();
      } catch (error) {
        enqueueSnackbar(error.message, { variant: 'error' });
      }
    } else if (selectedValue === CUSTOM) {
      try {
        await axios.delete(`/api/folders/${folderDetails.id}/uploads/batch`, {
          data: { resources: selectedIds },
        });

        const toBeRemoved = new Set(selectedIds);

        const updatedImages = imageDetails.filter((img, i) => !toBeRemoved.has(img.id));
        setImageDetails(updatedImages);
        setSelectPhotosSelectionType('');
        setSelectedIds([]);
        setSelectedView(false);
        setSelectedValue('');
        getPhotoGrid(picturePage);
        handleRemoval();
        enqueueSnackbar('Successfully Deleted', { variant: 'success' });
      } catch (error) {
        console.error(error);
        enqueueSnackbar(error.message, { variant: 'error' });
      }
    }
  };
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
  const handleDownload = async (event: any) => {
    setAllowDownload(event.target.checked);
    const allow_download = event.target.checked ? '1' : '0';
    try {
      const response = await axios.patch(
        `/api/events/${eventDetails.id}/folders/${folderDetails.id}`,
        { allow_download }
      );
      const { message } = response.data;
      enqueueSnackbar(message, { variant: 'success' });
    } catch (error) {
      enqueueSnackbar(error.message, { variant: 'error' });
    }
  };

  const handleSkipDuplicates = async (event: any) => {
    setSkipDuplicates(event.target.checked);
    const skip_duplicates = event.target.checked ? '1' : '0';
    try {
      const response = await axios.patch(
        `/api/events/${eventDetails.id}/folders/${folderDetails.id}`,
        { skip_duplicates }
      );
      const { message } = response.data;
      enqueueSnackbar(message, { variant: 'success' });
    } catch (error) {
      console.error(error);
      enqueueSnackbar(error.message, { variant: 'error' });
    }
  };

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
      const imgFile = file[i];
      const id = uuidv4();
      const path = `events/${eventDetails.id}/folders/${folderDetails.id}/${id}/${file[i].name}`;

      mediaPath.push({
        file_name: file[i].name,
        name: file[i].name.slice(0, file[i].name.lastIndexOf('.')),
        mime_type: file[i].type,
        directory: id,
        size: file[i].size,
      });
      handleImagePath(i, mediaPath, file.length);
      dispatch(
        uploadStatus({
          status: true,
          total: file.length,
          progress: i + 1,
          success: false,
        })
      );

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
            uploadStatus({
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
          uploadStatus({
            status: false,
            total: 0,
            progress: 0,
            success: false,
          })
        );
        enqueueSnackbar(
          <div>
            <Typography>Something Went Wrong! Please try again.</Typography>
            <Typography mt={1} align="center" fontStyle="italic">
              {e.message}
            </Typography>
          </div>,
          {
            variant: 'error',
          }
        );
        break;
      }
    }

    dispatch(
      uploadStatus({
        status: true,
        total: 0,
        progress: 0,
        success: true,
      })
    );
    setSuccess(upStats.success);
    setTimeout(() => {
      dispatch(
        uploadStatus({
          status: false,
          total: 0,
          progress: 0,
          success: false,
        })
      );
      setIsLoading(upStats.status);
      dispatch(
        uploadStatus({
          status: false,
          total: 0,
          progress: 0,
          success: false,
        })
      );
      setShowAll(true);
      // UploadThumbnail();
    }, 1000);
  };

  // const generateThumbnail = (file: File, path: any) =>
  //   new Promise((resolve, reject) => {
  //     FileResizer.imageFileResizer(
  //       file,
  //       800,
  //       480,
  //       "webp",
  //       75,
  //       0,
  //       async (uri: any) => {
  //         console.log('inside', 1); // remove
  //         console.log(uri);

  //         const creds = {
  //           accessKeyId: process.env.REACT_APP_HOST_AWS_ACCESS_KEY_ID || '',
  //           secretAccessKey: process.env.REACT_APP_HOST_AWS_SECRET_ACCESS_KEY || '',
  //         };

  //         const target = {
  //           Bucket: process.env.REACT_APP_HOST_AWS_BUCKET,
  //           Key: path,
  //           Body: uri,
  //           ContentType: 'image/webp',
  //         };

  //         try {
  //           const parallelUploads3 = new Upload({
  //             client: new S3Client({
  //               region: process.env.REACT_APP_HOST_AWS_DEFAULT_REGION || '',
  //               credentials: creds,
  //             }),
  //             leavePartsOnError: true,
  //             partSize: 1024 * 1024 * 1000,
  //             params: target,
  //           });

  //           await parallelUploads3.done();

  //           resolve(uri);

  //           console.log('inside done', 2); // remove
  //         } catch (e) {
  //           console.error(e);
  //           reject();
  //         }
  //       },
  //       "file"
  //     );
  //   });

  // const sendThumbnailID = async (id: string) => {
  //   await axios.post(`/api/events/convchange`, { directory: id })
  //     .then(res => {
  //       if (res.data?.status == 'success') {
  //         console.log(res.data);
  //       } else {
  //         throw TypeError("Error @sendThumbnailID")
  //       }
  //     })
  //     .catch(error => {
  //       console.log(error);
  //       throw TypeError("Error @sendThumbnailID")
  //     })
  // }

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

  const handleDownloadPicture = async (imageId: number, name: string) => {
    setDownloadId(imageId);
    const ids = [imageId];
    if (allowDownload) {
      setDownloading(true);
      try {
        await axios
          .post(
            `/api/folders/${folderDetails.id}/download`,
            { resources: ids },
            { responseType: 'blob' }
          )
          .then(({ data: blob }) => {
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.href = url;
            link.download = name;
            link.click();
          });
        setDownloading(false);
      } catch (error) {
        setDownloading(false);
        enqueueSnackbar('Something went wrong!', { variant: 'error' });
      }
    } else {
      enqueueSnackbar(
        'Downloading media is not allowed in this folder. You can change it in privacy settings.',
        { variant: 'error' }
      );
    }
  };

  const handleFavourite = async (favorite: boolean, imageId: number) => {
    const favoriteStatus = favorite ? '0' : '1';

    await axios.patch(`/api/folders/${folderDetails.id}/uploads/${imageId}`, { favorite: favoriteStatus })
      .then(res => {
        if (res.data.success) {
          const updateImgDetailsArr = [...imageDetails]
          const updateImageIndex = imageDetails?.findIndex(img => img.id == imageId);
          if (updateImageIndex === -1) return enqueueSnackbar('Something Went Wrong, Please Try Again !!!', { variant: 'error' });

          if (toggleFav) {
            updateImgDetailsArr.splice(updateImageIndex, 1)
          } else {
            updateImgDetailsArr[updateImageIndex] = res.data.data;
          }

          setFavCount(!favorite ? favCount + 1 : favCount - 1)
          setImageDetails(updateImgDetailsArr)
        } else {
          enqueueSnackbar('Something Went Wrong, Please Try Again !!!', { variant: 'error' });
        }
      })
      .catch(err => {
        console.log(err);
        enqueueSnackbar(err.message, { variant: 'error' });
      })
  };

  const filterFavourite = async (page: number) => {
    setNoFav(false);
    if (toggleFav) {
      setToggleFav(false);
      getPhotoGrid(picturePage);
    } else {
      setToggleFav(true);
      filterFavouritePaginate(page);
    }
  };
  const filterFavouritePaginate = async (page: number) => {
    try {
      const response = await axios.post(
        `/api/folders/${folderDetails.id}/uploads/search?limit=${limit}&page=${page}`,
        {
          scopes: [{ name: 'favoritesOnly' }],
        }
      );
      const { data, meta, links } = response.data;
      if (data.length !== 0) {
        setImageDetails(data);
        setPaginateMeta(meta);
        setCheckPage(links);
        let result = data.map((a: any) => a.id);
        setImageIds(result);
        setLoadFirst(false);
        setLoadNext(false);
        setLoadPrev(false);
        setLoadLast(false);
        scrollTop();
      } else {
        setLoadFirst(false);
        setLoadNext(false);
        setLoadPrev(false);
        setLoadLast(false);
        scrollTop();
        setNoFav(true);
      }
    } catch (error) {
      console.error(error);
      enqueueSnackbar(error.message, { variant: 'error' });
    }
  };

  const getFavouriteCount = async () => {
    await axios.post(`/api/folders/${folderDetails.id}/uploads/search?limit=1&page=1`, { scopes: [{ name: 'favoritesOnly' }] })
      .then(res => {
        setFavCount(res.data.meta.total);
      })
      .catch(error => {
        console.error(error);
        enqueueSnackbar(error.message, { variant: 'error' });
      })
  };

  const handlePaginate = async (action: string) => {
    const nav = action;
    if (toggleFav) {
      switch (nav) {
        case NEXT:
          setLoadNext(true);
          setPicturePage(picturePage + 1);
          const next = picturePage + 1;
          filterFavouritePaginate(next);
          break;
        case PREV:
          setLoadPrev(true);
          setPicturePage(picturePage - 1);
          const prev = picturePage - 1;
          filterFavouritePaginate(prev);
          break;
        case FIRST:
          setLoadFirst(true);
          setPicturePage(1);
          const first = 1;
          filterFavouritePaginate(first);
          break;
        case LAST:
          setLoadLast(true);
          setPicturePage(paginateMeta.last_page);
          const last = paginateMeta.last_page;
          filterFavouritePaginate(last);
          break;
        default:
          break;
      }
    } else {
      switch (nav) {
        case NEXT:
          setLoadNext(true);
          setPicturePage(picturePage + 1);
          const next = picturePage + 1;
          getPhotoGrid(next);
          break;
        case PREV:
          setLoadPrev(true);
          setPicturePage(picturePage - 1);
          const prev = picturePage - 1;
          getPhotoGrid(prev);
          break;
        case FIRST:
          setLoadFirst(true);
          setPicturePage(1);
          const first = 1;
          getPhotoGrid(first);
          break;
        case LAST:
          setLoadLast(true);
          setPicturePage(paginateMeta.last_page);
          const last = paginateMeta.last_page;
          getPhotoGrid(last);
          break;
        default:
          break;
      }
    }
  };

  const handleDownloadAll = async () => {
    if (allowDownload) {
      setLoading(true);
      try {
        await axios
          .post(
            `/api/folders/${folderDetails.id}/download`,
            { download_all: true },
            { responseType: 'blob' }
          )
          .then(({ data: blob }) => {
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.href = url;
            link.download = `${folderDetails.name}.zip`;
            link.click();
          });
        setLoading(false);
      } catch (error) {
        setLoading(false);
        enqueueSnackbar('Something went wrong!', { variant: 'error' });
      }
    } else {
      enqueueSnackbar(
        'Downloading media is not allowed in this folder. You can change it in privacy settings.',
        { variant: 'error' }
      );
    }
  };

  const handleUploadDrawer = () => {
    setUploadMoreDrawer(true);
  };

  const scrollTop = () => {
    document?.getElementById('view')?.scrollIntoView();
  };

  return (
    <>
      {folderDetails.photo_count === 0 &&
        folderDetails.video_count === 0 &&
        eventDetails.client_status === TRANSFERRED ? (
        <>
          <Button
            size="small"
            sx={{ ml: 2 }}
            onClick={props.onClick}
            color="primary"
            startIcon={<KeyboardArrowLeftIcon color="action" />}
          >
            {folderDetails.name}
          </Button>
          <NoDataWrapper>
            <Typography color="primary" variant="h5">
              No Photos or Videos Found !
            </Typography>
          </NoDataWrapper>
        </>
      ) : (
        <>
          {showAll || !isDefault ? (
            showAll || imageDetails?.length > 0 ? (
              <Wrapper>
                <Header>
                  <HeaderLeft>
                    <Button
                      onClick={props.onClick}
                      size="small"
                      startIcon={<KeyboardArrowLeftIcon color="action" />}
                    >
                      {folderDetails.name}
                    </Button>
                    {user?.account_type === AGENCY &&
                      eventDetails.client_status === TRANSFERRED &&
                      eventDetails.eventType === CLIENT ? null : (
                      <>
                        <Button
                          sx={{ ml: 5 }}
                          size="small"
                          color="secondary"
                          onClick={() => setFolderDrawer(true)}
                        >
                          Edit Folder
                        </Button>
                        <UpdateFolderDrawerView
                          openDrawer={folderDrawer}
                          onBack={() => {
                            setFolderDrawer(false);
                          }}
                          onClose={() => {
                            setFolderDrawer(false);
                          }}
                        />
                      </>
                    )}
                  </HeaderLeft>

                  <HeaderActionWraper>
                    {user?.account_type === AGENCY &&
                      eventDetails.client_status === TRANSFERRED &&
                      eventDetails.eventType === CLIENT ? null : (
                      <>
                        <HeaderActions>
                          <LoadingButton
                            loading={loading}
                            onClick={handleDownloadAll}
                            startIcon={<CloudDownloadIcon color="primary" />}
                            sx={{ color: '#fff', mr: 2 }}
                            size="small"
                          >
                            Download All
                          </LoadingButton>
                        </HeaderActions>
                        <HeaderActions>
                          <Button
                            onClick={() => {
                              handleUploadDrawer();
                            }}
                            size="small"
                            sx={{ color: '#fff', mr: 2 }}
                            startIcon={<CloudUploadIcon color="primary" />}
                          >
                            Upload More
                          </Button>

                          <UploadMoreDrawer
                            openDrawer={uploadMoreDrawer}
                            refreshPage={setRefresh}
                            onClose={() => {
                              setUploadMoreDrawer(false);
                            }}
                            val={val}
                          />
                        </HeaderActions>
                        <HeaderActions>
                          <Button
                            size="small"
                            sx={{ color: '#fff', mr: 2 }}
                            onClick={deletionHandler}
                            startIcon={<DeleteOutlineIcon color="error" />}
                          >
                            Delete
                          </Button>
                        </HeaderActions>
                      </>
                    )}
                    <HeaderActions>
                      <Button
                        size="small"
                        sx={{ color: '#fff', mr: 2 }}
                        onClick={() => filterFavourite(1)}
                        startIcon={<FavoriteIcon sx={{ color: toggleFav ? '#ff2066' : '#fff' }} />}
                      >
                        Favourites ({favCount})
                      </Button>
                    </HeaderActions>
                  </HeaderActionWraper>
                  <HeaderForm>
                    <Box sx={{ minWidth: 90, pb: { xs: 3, sm: 0 } }}>
                      <FormControl fullWidth>
                        <Select
                          MenuProps={{ classes: { list: classes.list } }}
                          sx={{
                            '.MuiOutlinedInput-input': {
                              p: '4px 0px 1px 18px',
                            },
                            '.MuiOutlinedInput-notchedOutline': {
                              border: 'none',
                            },
                          }}
                          value={selectPhotoCategory}
                          onChange={handleChangePhotos}
                          displayEmpty
                        >
                          <MenuItem value="">
                            <Typography variant="h6">Filter</Typography>
                          </MenuItem>
                          <MenuItem value="all">All</MenuItem>
                          <MenuItem value="photos">Photos</MenuItem>
                          <MenuItem value="videos">Videos</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                    <Box sx={{ minWidth: 90 }}>
                      <FormControl fullWidth>
                        <Select
                          MenuProps={{ classes: { list: classes.list } }}
                          sx={{
                            '.MuiOutlinedInput-input': {
                              p: '4px 0px 1px 18px',
                            },
                            '.MuiOutlinedInput-notchedOutline': {
                              border: 'none',
                            },
                          }}
                          value={photosSelectionType}
                          onChange={handlePhotoSelection}
                          displayEmpty
                        >
                          <MenuItem value="">
                            <Typography variant="h6">Select</Typography>
                          </MenuItem>
                          <MenuItem value="all">Select all</MenuItem>
                          <MenuItem value="custom">Select custom</MenuItem>
                          <MenuItem value="favourites">Select favorites</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                  </HeaderForm>
                </Header>
                <ConfirmationDialog
                  isDialogOpen={dialogOpen}
                  buttonMainLabel="No, I will keep them"
                  buttonSecondaryLabel="Yes, delete"
                  dialogContent="Are you sure you want to delete the selected photos?"
                  dialogId="error-dialog-title"
                  onClick={dialogHandler}
                  onClose={() => setDialogOpen(false)}
                />
                {!noFav ? (
                  <div id="view">
                    <ResponsiveMasonry
                      columnsCountBreakPoints={{
                        300: 1,
                        600: 2,
                        900: 3,
                        1200: 4,
                      }}
                    >
                      <Masonry columnsCount={3} gutter="10px">
                        {imageDetails.map((ele: any, i: number) => (
                          <CheckboxWrapper key={i}>
                            <div>
                              <img
                                alt="img"
                                key={i}
                                src={
                                  ele.thumbnail_url && ele.thumbnail_url
                                    ? ele.thumbnail_url
                                    : ele.original_url
                                }
                                style={{ borderRadius: '5px', width: '100%', display: 'block' }}
                              />

                              {ele.video_url && (
                                <PlayButton
                                  onClick={() => {
                                    window.open(ele.video_url, '_blank');
                                  }}
                                  color="primary"
                                />
                              )}
                              <ActionsContainer>
                                <Actions>
                                  <ActionsBackground>
                                    <div
                                      style={{
                                        width: '7rem',
                                        padding: '3px',
                                      }}
                                    >
                                      <Typography
                                        textTransform="capitalize"
                                        noWrap
                                        px={2}
                                        variant="subtitle2"
                                      >
                                        {ele.name}
                                      </Typography>
                                    </div>

                                    {eventDetails.client_status === TRANSFERRED &&
                                      eventDetails.eventType === CLIENT &&
                                      user?.account_type === AGENCY ? null : (
                                      <div
                                        style={{
                                          display: 'flex',
                                          alignItems: 'center',
                                          padding: '5px',
                                        }}
                                      >
                                        {!ele.video_url && (
                                          <>
                                            {downloading && ele.id === downloadId ? (
                                              <CircularProgress
                                                sx={{ mr: 1 }}
                                                color="inherit"
                                                size="1rem"
                                              />
                                            ) : (
                                              <FileDownloadOutlinedIcon
                                                fontSize="medium"
                                                onClick={() =>
                                                  handleDownloadPicture(ele.id, ele.file_name)
                                                }
                                                sx={{
                                                  mr: 1,
                                                  cursor: 'pointer',
                                                }}
                                              />
                                            )}
                                          </>
                                        )}
                                        <FavoriteIcon
                                          onClick={() => handleFavourite(ele.favorite, ele.id)}
                                          sx={{
                                            mr: 1,
                                            color: ele.favorite ? '#d10303' : 'none',
                                            cursor: 'pointer',
                                          }}
                                          fontSize="medium"
                                        />
                                      </div>
                                    )}
                                  </ActionsBackground>
                                </Actions>
                              </ActionsContainer>
                            </div>

                            {selectedView &&
                              (isChecked ? (
                                <FormControlLabel
                                  key={i}
                                  label=""
                                  control={
                                    <CustomCheckBox
                                      style={{
                                        background: isChecked ? 'rgba(125, 221, 141, 0.3)' : 'none',
                                      }}
                                      checkedIcon={<CheckCircleIcon />}
                                      icon={<CircleOutlinedIcon />}
                                      value={ele.id}
                                      checked={true}
                                      color="primary"
                                    />
                                  }
                                />
                              ) : (
                                <>
                                  <FormControlLabel
                                    key={i}
                                    label=""
                                    control={
                                      <CustomCheckBox
                                        style={{
                                          background: selectedIds.some((id) => id === ele.id)
                                            ? 'rgba(125, 221, 141, 0.3)'
                                            : 'none',
                                        }}
                                        checkedIcon={<CheckCircleIcon />}
                                        icon={<CircleOutlinedIcon />}
                                        checked={selectedIds.some((id) => id === ele.id)}
                                        value={ele.id}
                                        color="primary"
                                        onChange={(e) => isCheckboxChecked(e, ele.id)}
                                      />
                                    }
                                  />
                                </>
                              ))}
                          </CheckboxWrapper>
                        ))}
                      </Masonry>
                    </ResponsiveMasonry>
                    {!isDone && imageDetails.length < limit && (
                      <Grid
                        item
                        lg={3}
                        md={4}
                        sm={6}
                        xs={12}
                        sx={{
                          display: 'flex',
                          justifyContent: 'center',
                        }}
                      >
                        <div
                          style={{
                            height: '13rem',
                          }}
                        >
                          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 9 }}>
                            <CircularProgress />
                          </Box>
                          <Box>
                            <Typography align="center" variant="h5" mt={3}>
                              Processing files ({processed}/{totalUploads})
                            </Typography>
                          </Box>
                        </div>
                      </Grid>
                    )}
                    {paginateMeta.total > limit && (
                      <Navigation>
                        <Page>
                          <Typography variant="h5">
                            {paginateMeta.from} - {paginateMeta.to} of {paginateMeta.total}
                          </Typography>
                        </Page>

                        <Nav>
                          <LoadingButton
                            loading={loadFirst}
                            disabled={checkPage?.prev === null}
                            onClick={() => {
                              handlePaginate('first');
                            }}
                            startIcon={<FirstPageIcon fontSize="large" sx={{ color: '#fff' }} />}
                          />
                          <LoadingButton
                            loading={loadPrev}
                            disabled={checkPage?.prev === null}
                            onClick={() => handlePaginate('prev')}
                            startIcon={<ArrowBackIosIcon sx={{ color: '#fff' }} fontSize="small" />}
                          />
                          <LoadingButton
                            loading={loadNext}
                            disabled={checkPage?.next === null || imageDetails.length < 24}
                            onClick={() => handlePaginate('next')}
                            endIcon={
                              <ArrowForwardIosIcon sx={{ color: '#fff' }} fontSize="small" />
                            }
                          />
                          <LoadingButton
                            loading={loadLast}
                            disabled={checkPage?.next === null || imageDetails.length < 24}
                            onClick={() => {
                              handlePaginate('last');
                            }}
                            endIcon={<LastPageIcon fontSize="large" sx={{ color: '#fff' }} />}
                          />
                        </Nav>
                      </Navigation>
                    )}
                  </div>
                ) : (
                  <NoDataWrapper>
                    <Typography color="primary" variant="h5">
                      No Data Found!
                    </Typography>
                  </NoDataWrapper>
                )}
              </Wrapper>
            ) : (
              <>
                <Div>
                  <div>
                    {isLoading || upStats.status ? (
                      <Button size="large" disabled>
                        {folderDetails.name}
                      </Button>
                    ) : (
                      <>
                        <Button
                          size="small"
                          onClick={props.onClick}
                          color="primary"
                          startIcon={<KeyboardArrowLeftIcon color="action" />}
                        >
                          {folderDetails.name}
                        </Button>
                        {user?.account_type === AGENCY &&
                          eventDetails.client_status === TRANSFERRED &&
                          eventDetails.eventType === CLIENT ? null : (
                          <>
                            <Button
                              sx={{ mx: 5 }}
                              size="small"
                              color="secondary"
                              onClick={() => setFolderDrawer(true)}
                            >
                              Edit Folder
                            </Button>
                            <UpdateFolderDrawerView
                              openDrawer={folderDrawer}
                              onBack={() => {
                                setFolderDrawer(false);
                              }}
                              onClose={() => {
                                setFolderDrawer(false);
                              }}
                            />
                          </>
                        )}
                      </>
                    )}
                  </div>

                  <HeaderActions2>
                    <Button
                      onClick={() => {
                        setVal(1);
                        handleUploadDrawer();
                      }}
                      size="small"
                      sx={{ color: '#fff', mr: 2 }}
                      startIcon={<PlayCircleIcon sx={{ cursor: 'pointer' }} color="primary" />}
                    >
                      Video Upload
                    </Button>

                    <UploadMoreDrawer
                      refreshPage={setRefresh}
                      openDrawer={uploadMoreDrawer}
                      onClose={() => {
                        setUploadMoreDrawer(false);
                      }}
                      val={val}
                    />
                    <Button
                      onClick={() => {
                        setVal(2);
                        handleUploadDrawer();
                      }}
                      size="small"
                      sx={{ color: '#fff', mr: 2 }}
                      startIcon={<AddToDriveIcon sx={{ cursor: 'pointer' }} color="primary" />}
                    >
                      Google Drive Upload
                    </Button>
                  </HeaderActions2>
                  <SwitchWrapper>
                    <Typography variant="body1" pr={1.5}>
                      Skip Duplicates
                    </Typography>

                    <Stack direction="row" py={1} alignItems="center">
                      <Typography variant="body1">No</Typography>
                      <Switch checked={skipDuplicates} onChange={handleSkipDuplicates} />
                      <Typography pr={0.5} variant="body1">
                        Yes
                      </Typography>
                    </Stack>
                    {skipDuplicates && (
                      <Typography variant="caption" color="grey.100">
                        {' '}
                        (upload time will increase)
                      </Typography>
                    )}
                  </SwitchWrapper>

                  <SwitchWrapper>
                    <Typography variant="body1" pr={1.5}>
                      Allow Download
                    </Typography>

                    <Stack direction="row" py={1} alignItems="center">
                      <Typography variant="body1">No</Typography>
                      <Switch checked={allowDownload} onChange={handleDownload} />
                      <Typography variant="body1">Yes</Typography>
                    </Stack>
                  </SwitchWrapper>
                </Div>
                <UploadWrapper>
                  <Grid container spacing={4}>
                    <Grid item xs={12} sm={12} md={12} lg={12} sx={{ minHeight: '250px' }}>
                      {isLoading || upStats.status ? (
                        <ProgressWrapper>
                          {singleImage ? (
                            <CircularProgressWithSingle />
                          ) : (
                            <CircularProgressWithLabel value={progress} />
                          )}
                          {success ? (
                            <Typography mt={3} variant="h4" color="primary">
                              {file.length <= 1
                                ? 'Image Uploaded Successfully'
                                : 'Images Uploaded Successfully'}
                            </Typography>
                          ) : (
                            <Typography mt={3} variant="h4" color="primary">
                              Uploading... {`${uploaded} of ${total}`}
                            </Typography>
                          )}
                        </ProgressWrapper>
                      ) : (
                        <>
                          {loadingPhotos ? (
                            <Box sx={{ textAlign: 'center', py: 10 }}>
                              <CircularProgress />
                            </Box>
                          ) : (
                            <>
                              <Dotted {...getRootProps()}>
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
                            </>
                          )}

                          <div>
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
                                    onClick={() => {
                                      if (navigator.onLine) {
                                        handleUpload();
                                      } else {
                                        enqueueSnackbar('No, Internet Connection', { variant: 'error' });
                                      }
                                    }}
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
                          </div>
                        </>
                      )}
                    </Grid>
                  </Grid>
                </UploadWrapper>
              </>
            )
          ) : (
            <VideoElement onClick={props.onClick} />
          )}
        </>
      )}
    </>
  );
}
