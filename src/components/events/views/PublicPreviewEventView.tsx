/*
 * Preview Event View
 *
 */
import React, { useState, useEffect, useRef } from 'react';
import {
  Typography,
  Button,
  styled,
  Box,
  ToggleButton,
  ToggleButtonGroup,
  Grid,
  Stack,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  CircularProgress,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';

//@ts-ignore
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';

//@ts-ignore
import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';

import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Camera from 'src/assets/shared/images/Camera.png';
import CloseIcon from '@mui/icons-material/Close';
import FacebookIcon from 'src/assets/shared/images/Facebook.png';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import IconTickBlueSVG from 'src/assets/shared/svg/icon_tick_blue';
import InstagramIcon from 'src/assets/shared/images/Instagram.png';
import MailIcon from 'src/assets/shared/images/Mail.png';
import LandscapeRoundedIcon from '@mui/icons-material/LandscapeRounded';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import LastPageIcon from '@mui/icons-material/LastPage';
import WebIcon from 'src/assets/shared/images/Web.png';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PlayCircleFilledWhiteIcon from '@mui/icons-material/PlayCircleFilledWhite';
import YouTubeIcon from 'src/assets/shared/images/Youtube.png';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import ShareIcon from '@mui/icons-material/Share';

import { passcodeStatusType } from 'src/redux/slices/passcodeStatus';
import { useNavigate } from 'react-router';

import axios from 'src/utils/axios';
import PreviewRegisterDrawer from '../drawers/PreviewRegisterDrawer';
import { useSnackbar } from 'notistack';
import { motion } from "framer-motion"
import BannerCover from 'src/assets/shared/images/CoverA.png';

import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { useParams } from 'react-router-dom';
import { eventSlugDetails } from 'src/redux/slices/eventSlug';
import { useDispatch, useSelector } from 'src/redux/store';
import { FIRST, LAST, NEXT, PREV } from 'src/utils/constants';

const Header = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 5, 0, 5),
  display: 'flex',
  justifyContent: 'space-between',
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(1),
  },
}));

const PlayButton = styled(PlayCircleFilledWhiteIcon)(({ theme }) => ({
  transform: 'translate(-330%, -168%)',
  width: '3rem',
  height: '3rem',
  cursor: 'pointer',
}));

const CoverWrapper = styled('div')(({ theme }) => ({
  position: 'relative',
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
}));

const VignetteStyle = styled('div')(({ theme }) => ({
  // boxShadow: 'inset 0px -190px 100px -100px rgb(0 0 0 / 60%)',
  // width: '100%',
  // height: '100%',
}));

const CoverImage = styled('img')(({ theme }) => ({
  // width: '100%',
  width: 'auto',
  // height: '100%',
  objectFit: 'cover',
  // zIndex: '-1',
  // position: 'absolute',
  // position: 'relative',
  WebkitMaskImage: `-webkit-gradient(
        linear,
        left 80%, 
        left bottom,
        from(rgb(255, 255, 255)),
        to(rgb(29, 29, 29, 0.1))
      )`,
}));

const Title = styled(Typography)(({ theme }) => ({
  // position: 'absolute',
  position: 'relative',
  // top: '80%',
  // left: '50%',
  // transform: 'translate(-50%, -50%)',
  width: '100%',
  textAlign: 'center',
  textTransform: 'capitalize',
  paddingTop: '18px', 
  [theme.breakpoints.down('md')]: {
    // top: '75%',
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '1.5rem',
    // top: '70%',
  },
}));
const SubTitle = styled(Typography)(({ theme }) => ({
  // position: 'absolute',
  position: 'relative',
  paddingTop: '8px',
  // top: '93%',
  // left: '50%',
  width: '100%',
  textAlign: 'center',
  // transform: 'translate(-50%, -50%)',
  [theme.breakpoints.down('md')]: {
    // top: '90%',
    paddingBottom: '16px',
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '0.6rem',
    // top: '92%',
    
  },
}));

const Space = styled('span')(({ theme }) => ({
  paddingRight: theme.spacing(2),
  [theme.breakpoints.down('sm')]: {
    paddingRight: theme.spacing(0),
  },
}));

const ToggleLayoutBtnGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  background: 'none',
  border: 'none',
  '&.MuiToggleButton-root': {
    margin: theme.spacing(0, 1, 0, 1),
  },
  [theme.breakpoints.down('md')]: {
    justifyContent: 'center',
  },
  [theme.breakpoints.down('sm')]: {
    '& .MuiToggleButton-root': {
      margin: theme.spacing(0),
    },
  },
}));

const ToggleLayoutBtn = styled(ToggleButton)(({ theme }) => ({
  display: 'block',
  '&.MuiToggleButtonGroup-grouped': {
    border: 'none',
    borderRadius: '4px !important',
  },

  [theme.breakpoints.down('sm')]: {
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(1),
    },
  },
}));

const TickLayoutIcon = styled('div')(({ theme }) => ({
  position: 'absolute',
  top: '23%',
  right: '50%',
  transform: 'translate(50%)',
  [theme.breakpoints.down('sm')]: {
    top: '10%',
  },
}));

const ImgWrapper = styled('div')(({ theme }) => ({
  width: '12rem',
  height: '10rem',
  borderRadius: '6px',
  background: theme.palette.common.black,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  [theme.breakpoints.down('sm')]: {
    width: '5rem',
    height: '5rem',
    margin: 'auto',
  },
}));
const TextWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  [theme.breakpoints.down('sm')]: {
    display: 'block',
    textAlign: 'left',
    padding: theme.spacing(1, 0, 1, 0),
  },
}));

export const Date = styled('div')(({ theme }) => ({
  height: '1rem',
}));

const Content = styled('div')(({ theme }) => ({
  cursor: 'pointer',
  marginTop: theme.spacing(1.8),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  background: theme.palette.grey[900],
  borderRadius: '4px',
  [theme.breakpoints.down('md')]: {
    margin: 'auto',
  },
  [theme.breakpoints.down('md')]: {
    marginTop: theme.spacing(4),
  },
}));

const TextContainer = styled('div')(({ theme }) => ({
  padding: theme.spacing(2),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2, 0, 0, 0),
  },
}));
const Footer = styled('div')(({ theme }) => ({
  position: 'fixed',
  bottom: 0,
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(2),
  left: 0,
  width: '100%',
  background: theme.palette.grey[900],
}));

const FooterWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
}));

const ImgStyle = styled('img')(({ theme }) => ({
  objectFit: 'cover',
  borderRadius: '4px',
  height: '100%',
  width: '100%',
}));

const ActionsContainer = styled('div')(({ theme }) => ({
  position: 'relative',
  top: 160,
}));

const Actions = styled('div')(({ theme }) => ({
  position: 'absolute',
  bottom: 160,
  right: 0,
  width: '100%',
  background: 'rgba(0,0,0,0.4)',
  textAlign: 'right',
}));

const Video = styled('div')(({ theme }) => ({
  position: 'absolute',
  bottom: 170,
  right: 0,
  width: '100%',
  textAlign: 'right',
}));

const BackgroundTheme = styled('div')(({ theme }) => ({
  backgroundSize: 'contain',
  // backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center center',
  [theme.breakpoints.down('sm')]: {
     backgroundSize: 'auto',
    backgroundPosition: 'center top',
  },
}));


const CarouselHeader = styled(Grid)(({ theme }) => ({
  padding: theme.spacing(1),
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  [theme.breakpoints.down('sm')]: {
    justifyContent: 'center',
    padding: theme.spacing(0),
  },
}));
const CarouselHeader1 = styled(Grid)(({ theme }) => ({
  padding: theme.spacing(1),
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  [theme.breakpoints.down('sm')]: {
    [theme.breakpoints.down('sm')]: {
      justifyContent: 'center',
      paddingBottom: 0.5,
    },
  },
}));
const CarouselHeaderIcons = styled('div')(({ theme }) => ({
  background: theme.palette.grey[300],
  padding: theme.spacing(0.5),
  borderRadius: '4px',
  display: 'flex',
  justifyContent: 'space-around',
  [theme.breakpoints.down('sm')]: {
    margin: theme.spacing(0.5),
  },
}));

const ButtonContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  flexDirection: 'column',
  color: theme.palette.common.white,
}));

const SocialWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer',
  color: theme.palette.common.black,
  marginBottom: theme.spacing(2),
  '&:hover': {
    color: theme.palette.secondary.main,
  },
}));

const HeaderContent = styled('div')(({ theme }) => ({
  width: '100%',
  display: 'flex',
  justifyContent: 'space-between',
  [theme.breakpoints.down('sm')]: {
    display: 'block',
    padding: theme.spacing(1),
  },
}));
const HeaderTitle = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  [theme.breakpoints.down('sm')]: {
    justifyContent: 'space-between',
  },
}));

interface Props {
  onClick: () => void;
  isPlaying?: boolean;
}
type EventType = {
  date_display: string;
  name: string;
  venue: string;
  host_name: string;
  cover_picture: {
    original_url: string;
  };
  selected_layout: {
    id: number;
  };
  selected_theme: {
    accent_color: string;
    image: {
      original_url: string;
    };
    display_name: string;
  };
  photo_count: number;
  video_count: number;
  published_by: string;
  agency_brand: {
    instagram_url: string;
    youtube_url: string;
    facebook_url: string;
    domain: string;
    official_email: string;
  };
  privacy_setting: {
    public_view: boolean;
    right_click: boolean;
  };
};

type ImgProps = {
  original: string;
  thumbnail: string;
};

type ImageListType = {
  file_name: string;
  name: string;
  thumbnail_url: string;
  original_url: string;
  video_url: string;
  id: number;
  favorite: boolean;
  allow_download: boolean;
};
type PreviewFoldersList = {
  name: string;
  is_default: boolean;
  id: number;
  photo_count: number;
  video_count: number;
};

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  minWidth: 90,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  margin: theme.spacing(3, 0, 0, 0),
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
    background: '#fff',
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
    background: '#fff',
  },
}));

const BacktoTopButton = styled('div')(({ theme }) => ({
  position: 'fixed',
  bottom: '20px',
  right: '20px',
  backgroundColor: `${theme.palette.primary.main}`,
  color: 'white',
  border: `2px solid ${theme.palette.common.white}`,
  cursor: 'pointer',
  zIndex: 100,
  borderRadius: '50%',
  width: '30px',
  height: '30px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}));

const BoxStyle = styled(Box)(({ theme }) => ({
  maxHeight: '100%',
  overflow: 'auto',
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
}));

export interface DialogTitleProps {
  id: string;
  children?: React.ReactNode;
  onClose: () => void;
}
const BootstrapDialogTitle = (props: DialogTitleProps) => {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

export default function PreviewEventView(): React.ReactElement {
  const [showTick, setShowTick] = useState(false);
  const [store, setStore] = useState('');
  const [openModal, setOpenModal] = React.useState(false);
  const [registrationDrawer, setRegistrationDrawer] = React.useState(false);
  const [imgIndex, setImgIndex] = useState(0);
  const [checkPage, setCheckPage] = useState(Object);
  const [showActions, setShowActions] = useState(false);

  const [open, setOpen] = React.useState(false);
  const [selectedDay, setSelectedDay] = useState('');
  const [folders, setFolders] = useState<Array<PreviewFoldersList>>([]);
  const [imageDetails, setImageDetails] = useState<Array<ImageListType>>([]);
  const [previewMeta, setPreviewMeta] = useState(Object);
  const [allowDownload, setAllowDownload] = useState<boolean[]>([]);
  const [imageName, setImageName] = useState<string[]>([]);
  const [isMandatory, setIsMandatory] = useState(false);
  const [loading, setLoading] = useState(false);
  const [downloadId, setDownloadId] = useState<number>(0);

  const [carouselFav, setCarouselFav] = useState<boolean[]>([]);
  const [showButton, setShowButton] = useState(false);
  const playRef = useRef<ImageGallery>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const isPasscode = useSelector((state) => state.passcodeStatus.value);

  const { enqueueSnackbar } = useSnackbar();

  const [eventDetails, setEventDetails] = useState<EventType>({
    date_display: '',
    name: '',
    venue: '',
    host_name: '',
    cover_picture: {
      original_url: '',
    },
    selected_layout: {
      id: 1,
    },
    selected_theme: {
      accent_color: '',
      image: {
        original_url: '',
      },
      display_name: '',
    },
    photo_count: 0,
    video_count: 0,
    published_by: '',
    agency_brand: {
      instagram_url: '',
      youtube_url: '',
      facebook_url: '',
      domain: '',
      official_email: '',
    },
    privacy_setting: {
      public_view: false,
      right_click: false,
    },
  });

  const [itemId, setItemId] = useState<number[]>([]);
  const [folderId, setFolderId] = useState('');
  const [previewPhotoPage, setPreviewPhotoPage] = useState(1);
  const [emptyPhotos, setEmptyPhotos] = useState(false);
  const [emptyFolders, setEmptyFolders] = useState(false);
  const [imgs, setImgs] = useState<ImgProps[]>([]);

  const [loadNext, setLoadNext] = useState(false);
  const [loadPrev, setLoadPrev] = useState(false);
  const [loadLast, setLoadLast] = useState(false);
  const [loadFirst, setLoadFirst] = useState(false);

  const [hoverImageId, setHoverImageId] = useState(0);
  const dispatch = useDispatch();

  const isMounted = useRef(false);
  const scrollableDivRef = useRef<HTMLDivElement>(null);

  let { slug } = useParams();

  const navigate = useNavigate();

  const isMobile = window.innerWidth <= 767;

  const handleChangeDay = (event: React.MouseEvent<HTMLElement>, day: string) => {
    if (day !== null) {
      setPreviewPhotoPage(1);
      setSelectedDay(day);
      getPhotoGrid(day, 1, true);
      setShowTick(true);
    }
  };
  const handleSelfie = () => {
    setRegistrationDrawer(true);
  };

  const handleOpenCarousel = (index: any) => {
    setImgIndex(index);
    setOpen(true);

    setItemId(imageDetails.map((img) => img.id));
    setImageName(imageDetails.map((img) => img.file_name));
    setAllowDownload(imageDetails.map((img) => img.allow_download));
  };

  const handleClose = () => {
    setOpen(false);
    setIsPlaying(false);
  };

  const getPhotoGrid = async (id: string, page?: number, folderChange?: boolean) => {
    setFolderId(id);
    try {
      const response = await axios.get(`/api/public/folders/${id}/uploads?limit=6`, {
        params: {
          page: page,
        },
      });
      const { data, meta, links } = response.data;
      if (!data.length) {
        setEmptyPhotos(true);
      } else {
        setEmptyPhotos(false);
      }
      // setImageDetails(data); REPEATED TWICE
      let imgsData = [];
      let len = data.length;
      for (var i = 0; i < len; i++) {
        imgsData.push({
          original: data[i].original_url,
          thumbnail: data[i].thumbnail_url,
        });
      }

      if (folderChange) {
        setImageDetails(data);
        setImgs(imgsData);
      } else {
        setImageDetails([...imageDetails, ...data]);
        setImgs([...imgs, ...imgsData]);
      }

      setPreviewMeta(meta);
      setCheckPage(links);
      setCarouselFav(data.map((img: any) => img.favorite));
      setLoadFirst(false);
      setLoadNext(false);
      setLoadPrev(false);
      setLoadLast(false);
      // scrollTop();
    } catch (error) {
      setLoadFirst(false);
      setLoadNext(false);
      setLoadPrev(false);
      setLoadLast(false);
      console.error(error);
      enqueueSnackbar(error.message, { variant: 'error' });
    }
  };

  const getPreviewEvent = async () => {
    try {
      await axios.get(`/api/events/${slug}/public-preview`).then((response) => {
        if (!isMounted.current) {
          const { data } = response.data;
          const { folders } = data;
          setIsMandatory(data.privacy_setting.selfie_filtering);
          if (data.privacy_setting.selfie_filtering) {
            navigate(`/pre-registration/${slug}/signup`); //To Show signup page by default on share link
            // navigate(`/pre-registration/${slug}/login`);
          } else {
            if (folders[0].video_count === 0) {
              const filteredFolders = folders.slice(1).reverse();
              setFolders(filteredFolders);
              if (filteredFolders.length > 0) {
                const strId = filteredFolders[0].id;
                getPhotoGrid(strId);
                setStore(strId);
                setEmptyFolders(false);
              } else {
                setEmptyFolders(true);
              }
            } else {
              setFolders(folders.reverse());

              if (folders.length > 0) {
                const strId = folders[0].id;
                setStore(strId);
                getPhotoGrid(strId);
                setEmptyFolders(false);
              } else {
                setEmptyFolders(true);
              }
            }
            setEventDetails(data);
          }
        }
      });
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    const getEventDetails = async () => {
      try {
        await axios.get(`/api/events/${slug}/pre-registration`).then((response) => {
          if (!isMounted.current) {
            const { data } = response.data;
            if (data.passcode && !isPasscode.passcode) {
              navigate(`/public/preview/${slug}/passcode`);
            }

            if (process.env.REACT_APP_SHOW_SUBDOMAIN === 'true') {
              data &&
                data.domain &&
                !window.location.host.includes(data.domain) &&
                window.location.replace(
                  `https://${data.domain}.${process.env.REACT_APP_MAIN_DOMAIN}/public/${slug}/preview`
                );
            }
            if (data.public_view) {
              getPreviewEvent();
            } else {
              navigate(`/pre-registration/${slug}/signup`); //To Show signup page by default on share link
              // navigate(`/pre-registration/${slug}/login`); 
            }
            data.id &&
              dispatch(
                eventSlugDetails({
                  eventId: data.id,
                  eventSlug: slug,
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
    getEventDetails();
    return () => {
      isMounted.current = true;
    };
  }, [dispatch, slug]);

  useEffect(
    () => () => {
      isMounted.current = true;
      dispatch(passcodeStatusType({ passcode: false }));
    },
    []
  );

  useEffect(() => {
    function handleScroll() {
      if (scrollableDivRef.current?.scrollTop) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    }

    scrollableDivRef.current?.addEventListener('scroll', handleScroll);

    return () => {
      scrollableDivRef.current?.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleClickOpen = () => {
    if (
      eventDetails.agency_brand.domain ||
      eventDetails.agency_brand.facebook_url ||
      eventDetails.agency_brand.instagram_url ||
      eventDetails.agency_brand.official_email ||
      eventDetails.agency_brand.youtube_url
    ) {
      setOpenModal(true);
    }
  };
  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleDownloadPicture = async (imageId: number, downloadFlag: boolean, name: string) => {
    setDownloadId(imageId);

    const ids = [imageId];
    if (downloadFlag) {
      setLoading(true);
      try {
        await axios
          .post(
            `/api/public/folders/${folderId}/download`,
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

  const handlePaginate = async (action: string) => {
    switch (action) {
      case NEXT:
        setLoadNext(true);
        setPreviewPhotoPage(previewPhotoPage + 1);
        const next = previewPhotoPage + 1;
        getPhotoGrid(folderId, next);
        break;
      case PREV:
        setLoadPrev(true);
        setPreviewPhotoPage(previewPhotoPage - 1);
        const prev = previewPhotoPage - 1;
        getPhotoGrid(folderId, prev);
        break;
      case FIRST:
        setLoadFirst(true);
        setPreviewPhotoPage(1);
        const first = 1;
        getPhotoGrid(folderId, first);
        break;
      case LAST:
        setLoadLast(true);
        setPreviewPhotoPage(previewMeta.last_page);
        const last = previewMeta.last_page;
        getPhotoGrid(folderId, last);
        break;
      default:
        break;
    }
  };
  const RightNav = React.memo(({ onClick }: Props) => {
    const handleNext = () => {
      if (imgIndex < imageDetails.length - 1) {
        setImgIndex(imgIndex + 1);
      } else {
        setImgIndex(0);
      }
      onClick();
    };
    return (
      <Button className="image-gallery-icon image-gallery-right-nav" onClick={handleNext}>
        <ArrowForwardIosIcon color="primary" />
      </Button>
    );
  });

  const LeftNav = React.memo(({ onClick }: Props) => {
    const handlePrev = () => {
      if (imgIndex >= 1) {
        setImgIndex(imgIndex - 1);
      } else {
        setImgIndex(imageDetails.length - 1);
      }
      onClick();
    };
    return (
      <Button className="image-gallery-icon image-gallery-left-nav" onClick={handlePrev}>
        <ArrowBackIosIcon color="primary" />
      </Button>
    );
  });

  const playOrPause = () => {
    if (playRef) {
      setIsPlaying((prev) => {
        if (playRef.current) {
          playRef.current[prev ? 'pause' : 'play']();
        }
        return !prev;
      });
    }
  };

  const handleIndex = (index: any) => {
    setImgIndex(index);
  };

  const scrollTop = () => {
    document?.getElementById('view')?.scrollIntoView();
  };

   const scrollWindowTop = () => {
     scrollableDivRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
   };
  const onScroll = (e: any) => {
     if (e.target.scrollHeight > 1300) {
       setShowButton(true);
       console.log(document.getElementById('topView')?.scrollTop);
     } else if (document.getElementById('topView')?.scrollTop === 0) {
       setShowButton(false);
     }
  if (!loadNext && imageDetails.length < previewMeta.total) {
      if (Math.ceil(e.target.scrollHeight - e.target.scrollTop) === e.target.clientHeight || Math.floor(e.target.scrollHeight - e.target.scrollTop) === e.target.clientHeight) {
        handlePaginate('next');
      }
    }
  };

  return (
    <>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropProps={{ invisible: true }}
        sx={{
          '.MuiDialog-paperFullScreen': {
            boxShadow: 'none',
            backgroundColor: 'rgba(0,0,0,0.8)',
            m: 0,
            p: 0,
          },
        }}
      >
        <TransformWrapper
          doubleClick={{
            disabled: true,
          }}
          initialScale={1}
          initialPositionX={1}
          initialPositionY={1}
        >
          {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
            <>
              <Grid container>
                <CarouselHeader1
                  sx={{ justifyContent: 'flex-start' }}
                  item
                  xs={12}
                  sm={4}
                  md={4}
                  lg={4}
                >
                  <Typography textTransform="capitalize" variant="h4">
                    {eventDetails.name}
                  </Typography>
                </CarouselHeader1>
                <CarouselHeader sx={{ justifyContent: 'center' }} item xs={12} sm={4} md={4} lg={4}>
                  <Typography variant="h4" color="primary">
                    {imgIndex + 1} / {imageDetails.length}
                  </Typography>
                </CarouselHeader>

                <CarouselHeader
                  sx={{ justifyContent: 'flex-end' }}
                  item
                  xs={12}
                  sm={4}
                  md={4}
                  lg={4}
                >
                  <CarouselHeaderIcons>
                    {isPlaying ? (
                      <PauseCircleIcon
                        onClick={playOrPause}
                        sx={{ cursor: 'pointer', mx: 1 }}
                        color="primary"
                      />
                    ) : (
                      <PlayArrowIcon
                        onClick={playOrPause}
                        sx={{ cursor: 'pointer', mx: 1 }}
                        color="primary"
                      />
                    )}

                    <ZoomOutIcon
                      onClick={() => zoomOut()}
                      sx={{ mx: 1, cursor: 'pointer' }}
                      color="primary"
                    />
                    <ZoomInIcon
                      onClick={() => zoomIn()}
                      sx={{ mx: 1, cursor: 'pointer' }}
                      color="primary"
                    />
                    <>
                      {loading && itemId[imgIndex] === downloadId ? (
                        <CircularProgress sx={{ mx: 1 }} color="success" size="1rem" />
                      ) : (
                        <FileDownloadOutlinedIcon
                          onClick={() =>
                            handleDownloadPicture(
                              itemId[imgIndex],
                              allowDownload[imgIndex],
                              imageName[imgIndex]
                            )
                          }
                          sx={{ mx: 1, cursor: 'pointer' }}
                          color="primary"
                        />
                      )}
                      <FavoriteIcon
                        onClick={() => {
                          setRegistrationDrawer(true);
                          setOpen(false);
                        }}
                        sx={{
                          mx: 1,
                          color: carouselFav[imgIndex] ? '#d10303' : '#7dd78d',
                        }}
                      />
                      <ShareIcon
                        onClick={() => {
                          setRegistrationDrawer(true);
                          setOpen(false);
                        }}
                        sx={{ mx: 1, cursor: 'pointer' }}
                        color="primary"
                      />
                      <CloseIcon
                        sx={{ mx: 1, cursor: 'pointer' }}
                        color="primary"
                        onClick={handleClose}
                      />
                    </>
                  </CarouselHeaderIcons>
                </CarouselHeader>
              </Grid>

              <TransformComponent
                wrapperStyle={{ width: '100%', height: '100%' }}
                contentStyle={{ width: '100%', display: 'block', height: '100%' }}
              >
                <ImageGallery
                  showThumbnails={false}
                  showFullscreenButton={false}
                  showPlayButton={false}
                  startIndex={imgIndex}
                  items={imgs}
                  ref={playRef}
                  onSlide={(index: any) => handleIndex(index)}
                  renderLeftNav={(onClick: any) => <LeftNav onClick={onClick} />}
                  renderRightNav={(onClick: any) => <RightNav onClick={onClick} />}
                  infinite={true}
                  lazyLoad={true}
                />
              </TransformComponent>
            </>
          )}
        </TransformWrapper>
      </Dialog>
      {showButton && (
        <BacktoTopButton className="back-to-top-button" onClick={() => scrollWindowTop()}>
          <KeyboardArrowUpIcon fontSize="large" />
        </BacktoTopButton>
      )}
      <BoxStyle
        sx={{
          '&::-webkit-scrollbar-thumb': {
            borderRadius: '10px',
            backgroundColor: `${eventDetails.selected_theme.accent_color}`,
          },
        }}
        onScroll={onScroll}
        ref={scrollableDivRef}
      >
        {/* <Header>
          <HeaderContent>
            <HeaderTitle>
              <Typography textTransform="capitalize" variant="h6">
                {eventDetails.name}
              </Typography>
              <Typography variant="h6" pl={3} textTransform="capitalize">
                Host - {eventDetails.host_name}
              </Typography>
            </HeaderTitle>
            <HeaderTitle>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="h6">Published By -</Typography>
                <Button size="small" color="primary" onClick={handleClickOpen}>
                  {eventDetails.published_by}
                </Button>
              </div>
            </HeaderTitle>
          </HeaderContent>

          <BootstrapDialog
            onClose={handleCloseModal}
            aria-labelledby="customized-dialog-title"
            open={openModal}
          >
            <BootstrapDialogTitle id="customized-dialog-title" onClose={handleCloseModal}>
              Photo and Publish Credits
            </BootstrapDialogTitle>
            <DialogContent dividers>
              <Typography textTransform="capitalize" gutterBottom color="primary" variant="h3">
                {eventDetails.published_by}
              </Typography>

              <ButtonContainer>
                {eventDetails.agency_brand && (
                  <SocialWrapper
                    onClick={() => {
                      window.open(eventDetails.agency_brand.instagram_url, '_blank');
                    }}
                  >
                    <img src={String(InstagramIcon)} alt="instagram icon" />
                    <Typography variant="h6" pl={1.5}>
                      {eventDetails.agency_brand.instagram_url}
                    </Typography>
                  </SocialWrapper>
                )}

                {eventDetails.agency_brand && (
                  <SocialWrapper
                    onClick={() => {
                      window.open(eventDetails.agency_brand.youtube_url, '_blank');
                    }}
                  >
                    <img src={String(YouTubeIcon)} alt="youtube icon" />
                    <Typography variant="h6" pl={1.5}>
                      {eventDetails.agency_brand.youtube_url}
                    </Typography>
                  </SocialWrapper>
                )}

                {eventDetails.agency_brand && (
                  <SocialWrapper
                    onClick={() => {
                      window.open(eventDetails.agency_brand.facebook_url, '_blank');
                    }}
                  >
                    <img src={String(FacebookIcon)} alt="facebook icon" />
                    <Typography variant="h6" pl={1.5}>
                      {eventDetails.agency_brand.facebook_url}
                    </Typography>
                  </SocialWrapper>
                )}

                {eventDetails.agency_brand && (
                  <SocialWrapper
                    onClick={() => {
                      window.open(eventDetails.agency_brand.domain, '_blank');
                    }}
                  >
                    <img src={String(WebIcon)} alt="web icon" />
                    <Typography variant="h6" pl={1.5}>
                      {eventDetails.agency_brand.domain}
                    </Typography>
                  </SocialWrapper>
                )}

                {eventDetails.agency_brand && (
                  <SocialWrapper
                    onClick={() => {
                      window.open(eventDetails.agency_brand.official_email, '_blank');
                    }}
                  >
                    <img src={String(MailIcon)} alt="mail icon" />
                    <Typography variant="h6" pl={1.5}>
                      {eventDetails.agency_brand.official_email}
                    </Typography>
                  </SocialWrapper>
                )}
              </ButtonContainer>
            </DialogContent>
          </BootstrapDialog>
        </Header> */}

        <div id="topView" style={{ backgroundColor: '#292929' }}>
          <CoverWrapper>
            {eventDetails.cover_picture ? (
              <VignetteStyle>
                <CoverImage src={String(eventDetails.cover_picture.original_url)} alt="Banner" />
              </VignetteStyle>
            ) : (
              <CoverImage src={String(BannerCover)} alt="Banner" />
            )}
          </CoverWrapper>
          <Title variant="h1">{eventDetails.name}</Title>
          {!isMandatory && (
            <SubTitle variant="h5">
              {eventDetails.photo_count} Photos |&nbsp; {eventDetails.video_count} Videos
              {eventDetails.venue && (
                <>
                  <Space /> {eventDetails.venue} <Space />
                </>
              )}
              {eventDetails.date_display}
            </SubTitle>
          )}
        </div>
        <Grid container sx={{ p: { xs: 1, md: 3 }, background: '#292929' }}>
          <Grid
            item
            xs={12}
            sm={12}
            md={7}
            xl={7}
            sx={{
              maxHeight: '100%',
              overflow: 'auto',
              overflowY: 'hidden',
              '&::-webkit-scrollbar': {
                backgroundColor: '#000',
                height: '0.3em',
              },
              '&::-webkit-scrollbar-track': {
                boxShadow: 'inset 0 0 6px rgba(0,0,0,0.1)',
                backgroundColor: '#000',
                borderRadius: '10px',
              },
              '&::-webkit-scrollbar-thumb': {
                borderRadius: '10px',
                backgroundColor: `${eventDetails.selected_theme.accent_color}`,
              },
            }}
          >
            <ToggleLayoutBtnGroup exclusive value={selectedDay || store} onChange={handleChangeDay}>
              {folders?.map((folder: any, i: number) => (
                <ToggleLayoutBtn
                  sx={{
                    '&.Mui-selected, &.Mui-selected:hover': {
                      backgroundColor: `${eventDetails.selected_theme.accent_color}`,
                    },
                  }}
                  key={i}
                  value={folder.id}
                  disabled={!folder.id}
                >
                  <ImgWrapper>
                    {folder.cover_picture?.thumbnail_url ? (
                      <ImgStyle
                        src={String(folder.cover_picture?.thumbnail_url)}
                        alt="cover photo"
                      />
                    ) : (
                      <LandscapeRoundedIcon
                        sx={{
                          color: `${eventDetails.selected_theme.accent_color}`,
                          fontSize: '2.5rem',
                        }}
                      />
                    )}
                  </ImgWrapper>
                  {!showTick &&
                    (selectedDay === folder.id || store === folder.id ? (
                      <TickLayoutIcon>
                        <IconTickBlueSVG
                          accent_color={`${eventDetails.selected_theme.accent_color}`}
                        />
                      </TickLayoutIcon>
                    ) : null)}
                  {showTick &&
                    (selectedDay === folder.id ? (
                      <TickLayoutIcon>
                        <IconTickBlueSVG
                          accent_color={`${eventDetails.selected_theme.accent_color}`}
                        />
                      </TickLayoutIcon>
                    ) : null)}
                  <TextWrapper>
                    <div style={{ width: '6rem' }}>
                      <Typography color="grey.0" py={0.5} variant="body1" noWrap textAlign="left">
                        {folder.name}
                      </Typography>
                    </div>
                    <Date>
                      <Typography variant="caption" color="grey.100" py={1}>
                        {folder.date}
                      </Typography>
                    </Date>
                  </TextWrapper>
                  {/* <Typography align="left" py={0.5} variant="subtitle2">
                    Subfolder
                  </Typography> */}
                  <Typography align="left" variant="subtitle2" py={0.5}>
                    {!folder.is_default &&
                      (folder.photo_count ? folder.photo_count + ' Photos | ' : '0 Photos | ')}
                    {folder.video_count ? folder.video_count : '0'} Videos
                  </Typography>
                </ToggleLayoutBtn>
              ))}
            </ToggleLayoutBtnGroup>
          </Grid>
          <Grid px={1.6} item xs={12} sm={12} md={5} xl={5}>
            <Content onClick={handleSelfie}>
              <img src={String(Camera)} alt="Camera" />
              <TextContainer>
                <Typography variant="h3" gutterBottom>
                  Selfie Search
                </Typography>
                <Typography fontStyle="italic" color="grey.200" variant="body1" gutterBottom>
                  You’ll be able to see only your pictures hastle-free, with our advanced AI
                  feature.
                </Typography>
              </TextContainer>
            </Content>
          </Grid>
        </Grid>
        <div>
          {previewMeta.total === 0 || emptyFolders || isMandatory ? null : (
            <>
              <Typography px={5} py={2} variant="h6">
                Viewing
                <span
                  style={{
                    paddingRight: '0.3rem',
                    paddingLeft: '0.3rem',

                    color: `${eventDetails.selected_theme.accent_color}`,
                  }}
                >
                  {previewMeta.to === null ? 0 : previewMeta.to}
                </span>
                of {previewMeta.total}
              </Typography>
            </>
          )}
        </div>
        <BackgroundTheme
          style={{
            backgroundImage: `url(${eventDetails?.selected_theme?.image?.original_url}) `,
            backgroundSize: isMobile
              ? 'auto'
              : emptyPhotos || emptyFolders
              ? 'cover'
              : 'contain',
          }}
        >
          {emptyPhotos || emptyFolders ? (
            <div>
              <Stack sx={{ width: '30%', margin: 'auto', py: 10 }} spacing={2}>
                <Alert
                  icon={false}
                  sx={{
                    backgroundColor: `${eventDetails.selected_theme.accent_color}`,
                    display: 'flex',
                    justifyContent: 'center',
                    py: 1.5,
                  }}
                >
                  {emptyPhotos ? (
                    <Typography variant="h5">No Photos Found !</Typography>
                  ) : (
                    <Typography variant="h5">No Data Found !</Typography>
                  )}
                </Alert>
              </Stack>
            </div>
          ) : null}

          <Box
            onContextMenu={(e) => {
              if (eventDetails.privacy_setting.right_click) {
                return e.preventDefault();
              }
            }}
            id="view"
            sx={{
              py: 1.3,
              px: 1.3,
            }}
          >
            <ResponsiveMasonry
              columnsCountBreakPoints={{
                200: 2,
                // 600: 2,
                900: 3,
                1200:
                  (eventDetails.selected_layout.id === 1 && 3) ||
                  (eventDetails.selected_layout.id === 2 && 6) ||
                  (eventDetails.selected_layout.id === 3 && 4) ||
                  (!eventDetails.selected_layout.id && 3),
              }}
            >
              <Masonry gutter="10px">
                {imageDetails.map((ele, index) => (
                  <div key={index}>
                    <div
                      onMouseOver={() => {
                        setHoverImageId(ele.id);
                        setShowActions(true);
                      }}
                      onMouseLeave={() => setShowActions(false)}
                      style={{ position: 'relative' }}
                    >
                      <motion.img
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.75 }}
                        onClick={() => {
                          if (ele.video_url) {
                          } else {
                            handleOpenCarousel(index);
                          }
                        }}
                        src={
                          ele.thumbnail_url && ele.thumbnail_url
                            ? ele.thumbnail_url
                            : ele.original_url
                        }
                        style={{ borderRadius: '5px', width: '100%', display: 'block' }}
                        alt="img"
                      />
                      <div>
                        {!ele.video_url ? (
                          <div
                            style={{
                              position: 'absolute',
                              bottom: 0,
                              backgroundColor: 'rgba(0, 0, 0, 0.5)',
                              width: '100%',
                            }}
                          >
                            {showActions && ele.id === hoverImageId ? (
                              <div
                                style={{
                                  display: 'block',
                                  marginLeft: 'auto',
                                  maxWidth: 'max-content',
                                }}
                              >
                                {/* <ActionsContainer>
                                  <Actions> */}
                                {ele.video_url && (
                                  <PlayButton
                                    sx={{
                                      color: `${eventDetails.selected_theme.accent_color}`,
                                    }}
                                    onClick={() => {
                                      window.open(ele.video_url, '_blank');
                                    }}
                                  />
                                )}

                                {loading && ele.id === downloadId ? (
                                  <CircularProgress
                                    sx={{ mb: 0.5, mx: 1 }}
                                    color="inherit"
                                    size="1rem"
                                  />
                                ) : (
                                  <FileDownloadOutlinedIcon
                                    onClick={() =>
                                      handleDownloadPicture(
                                        ele.id,
                                        ele.allow_download,
                                        ele.file_name
                                      )
                                    }
                                    sx={{ mt: 1, mx: 1, cursor: 'pointer' }}
                                  />
                                )}
                                <FavoriteIcon
                                  onClick={() => setRegistrationDrawer(true)}
                                  sx={{ mt: 1, mr: 2, color: ele.favorite ? '#d10303' : 'none' }}
                                />
                                <ShareIcon
                                  onClick={() => setRegistrationDrawer(true)}
                                  sx={{ mt: 1, mr: 2, cursor: 'pointer' }}
                                />
                                {/* </Actions>
                                </ActionsContainer> */}
                              </div>
                            ) : null}
                          </div>
                        ) : (
                          <ActionsContainer>
                            <Video>
                              {ele.video_url ? (
                                <PlayButton
                                  sx={{
                                    color: `${eventDetails.selected_theme.accent_color}`,
                                  }}
                                  onClick={() => {
                                    window.open(ele.video_url, '_blank');
                                  }}
                                />
                              ) : null}
                            </Video>
                          </ActionsContainer>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </Masonry>
            </ResponsiveMasonry>
          </Box>

          {/* Added Progress To Show New Images Loader */}
          {/* <div style={{ paddingBottom: 5 }}>
            {loadNext && <CircularProgress sx={{ display: 'block', margin: '125px auto' }} />}
          </div> */}

          {loadNext && (
            <div style={{ height: '500px', position: 'relative' }}>
              {/* {loadNext && <CircularProgress sx={{ display: 'block', margin: '100px auto' }} />} */}
              {loadNext && (
                <CircularProgress
                  sx={{ position: 'relative', left: 'calc(50% - 20px)', top: 'calc(80px)' }}
                  size={40}
                />
              )}
            </div>
          )}

          {/* REMOVED PAGINATION */}
          {/* <Grid container>
            <Grid
              item
              xs={12}
              sm={12}
              md={12}
              lg={12}
              px={5}
              sx={{
                display: { xs: 'block', sm: 'flex' },
                justifyContent: { xs: 'center', sm: 'space-between' },
                marginBottom: '4rem',
                alignItems: 'center',
                p: { xs: 1, sm: 2 },
              }}
            >
              {previewMeta.total === 0 || emptyFolders ? null : (
                <>
                  <div>
                    <Typography
                      variant="h5"
                      sx={{
                        textAlign: { xs: 'center' },
                        color: `${eventDetails.selected_theme.accent_color}`,
                      }}
                    >
                      {previewMeta.from === null ? 0 : previewMeta.from} -{' '}
                      {previewMeta.to === null ? 0 : previewMeta.to} of {previewMeta.total}
                    </Typography>
                  </div>
                  <div style={{ textAlign: 'center' }}>
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
                      sx={{
                        '&:hover': {
                          backgroundColor: `${eventDetails.selected_theme.accent_color}`,
                        },
                      }}
                      startIcon={
                        <ArrowBackIosIcon
                          sx={{
                            color: `#fff`,
                          }}
                        />
                      }
                    />
                    <LoadingButton
                      loading={loadNext}
                      sx={{
                        '&:hover': {
                          backgroundColor: `${eventDetails.selected_theme.accent_color}`,
                        },
                      }}
                      disabled={checkPage?.next === null}
                      onClick={() => handlePaginate('next')}
                      endIcon={
                        <ArrowForwardIosIcon
                          sx={{
                            color: `#fff`,
                          }}
                        />
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
                  </div>
                </>
              )}
            </Grid>
          </Grid> */}
        </BackgroundTheme>
        <Footer sx={{ position: 'initial' }}>
          <Typography color="grey.200" variant="subtitle2">
            2022 © turtlepic.com
          </Typography>
          <FooterWrapper>
            <Typography pl={2} color="grey.200" sx={{ cursor: 'pointer' }} variant="subtitle2">
              About TurtlePic
            </Typography>
            <Typography pl={2} color="grey.200" sx={{ cursor: 'pointer' }} variant="subtitle2">
              Privacy Policy
            </Typography>
          </FooterWrapper>
        </Footer>

        {/* Registration drawer */}
        <PreviewRegisterDrawer
          openDrawer={registrationDrawer}
          onClose={() => {
            setRegistrationDrawer(false);
          }}
        />
      </BoxStyle>
    </>
  );
}
