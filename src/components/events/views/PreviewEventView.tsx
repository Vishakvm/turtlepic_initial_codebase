/*
 * Preview Event View
 *
 */
import React, { useState, useEffect, useRef } from 'react';

import { useNavigate, useSearchParams, useParams, useLocation } from 'react-router-dom';

import {
  Typography, Button, styled, Box, ToggleButton, ToggleButtonGroup, Grid, Stack, Alert, Dialog, DialogTitle,
  DialogContent, IconButton, Tooltip, Switch, CircularProgress
} from '@mui/material';
import { LoadingButton } from '@mui/lab';

//react-share
import { FacebookShareButton, TwitterShareButton, WhatsappShareButton, FacebookIcon, TwitterIcon, WhatsappIcon } from 'react-share';

//@ts-ignore
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';

import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Camera from 'src/assets/shared/images/Camera.png';
import CloseIcon from '@mui/icons-material/Close';
import FavoriteIcon from '@mui/icons-material/Favorite';
import Facebook from 'src/assets/shared/images/Facebook.png';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import IconTickBlueSVG from 'src/assets/shared/svg/icon_tick_blue';
import InstagramIcon from 'src/assets/shared/images/Instagram.png';
import MailIcon from 'src/assets/shared/images/Mail.png';
import LastPageIcon from '@mui/icons-material/LastPage';
import LandscapeRoundedIcon from '@mui/icons-material/LandscapeRounded';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import WebIcon from 'src/assets/shared/images/Web.png';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PlayCircleFilledWhiteIcon from '@mui/icons-material/PlayCircleFilledWhite';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import YouTubeIcon from 'src/assets/shared/images/Youtube.png';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import ShareIcon from '@mui/icons-material/Share';

import axios from 'src/utils/axios';
import PreviewRegisterDrawer from '../drawers/PreviewRegisterDrawer';
import useAuth from 'src/hooks/useAuth';
import { useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import { motion } from "framer-motion"
import BannerCover from 'src/assets/shared/images/CoverA.png';
import FeedbackButtonSVG from 'src/assets/shared/svg/feedback_button';
import FeedbackSuccessDialog from 'src/components/dialogs/FeedbackSuccessDialog';


//@ts-ignore
import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';

import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { PATH_PRE_AUTH } from 'src/routes/paths';
import { AGENCY, FIRST, GUEST, LAST, NEXT, PREV } from 'src/utils/constants';
import FeedbackDialog from 'src/components/dialogs/FeedbackDialog';

const Header = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 5, 0, 5),
  display: 'flex',
  justifyContent: 'space-between',
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(1),
  },
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

const PlayButton = styled(PlayCircleFilledWhiteIcon)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -220%)',
  width: '3rem',
  height: '3rem',
  cursor: 'pointer',
}));

const CoverWrapper = styled('div')(({ theme }) => ({
  position: 'relative',
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
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
    padding: theme.spacing(1),
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
  height: "30px",
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
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
const SelectTheme = styled(Box)(({ theme }) => ({
  minWidth: 90,
  display: 'flex',
  alignItems: 'center',
  margin: theme.spacing(3, 0, 0, 0),
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
    justifyContent: 'center',
  },
}));

const CarouselHeaderIcons = styled('div')(({ theme }) => ({
  background: theme.palette.grey[300],
  padding: theme.spacing(0.5),
  borderRadius: '4px',
  display: 'flex',
  justifyContent: 'space-around',
  alignItems: 'center',
  [theme.breakpoints.down('sm')]: {
    marginBottom: theme.spacing(1),
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

const PowerIcon = styled(PowerSettingsNewIcon)(({ theme }) => ({
  color: theme.palette.grey[100],
  fontSize: '1.4rem',
}));

const LogoutButton = styled(Button)(({ theme }) => ({
  color: theme.palette.common.white,
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

const Nav = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(0, 3, 0, 3),
  [theme.breakpoints.down('sm')]: {
    display: 'block',
    textAlign: 'center',
    padding: theme.spacing(2),
  },
}));

const PhotoActions = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  [theme.breakpoints.down('sm')]: {
    justifyContent: 'center',
  },
}));

const FeedbackButton = styled('div')(({ theme }) => ({
  position: 'fixed',
  right: '0',
  bottom: '40%',
  zIndex: '100',
  cursor: 'pointer',
}));

type EventType = {
  id: string | undefined;
  date_display: string;
  name: string;
  venue: string;
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

type ImgProps = {
  original: string;
  thumbnail: string;
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
export interface DialogTitleProps {
  id: string;
  children?: React.ReactNode;
  onClose: () => void;
}
interface Props {
  onClick: () => void;
  isPlaying?: boolean;
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
  const [favCount, setFavCount] = useState(0);
  const [checkPage, setCheckPage] = useState(Object);
  const [showActions, setShowActions] = useState(false);
  const [imgs, setImgs] = useState<ImgProps[]>([]);

  const [loading, setLoading] = useState(false);
  const [loadNext, setLoadNext] = useState(true);
  const [loadPrev, setLoadPrev] = useState(false);
  const [loadLast, setLoadLast] = useState(false);
  const [loadFirst, setLoadFirst] = useState(false);
  const [openShare, setOpenShare] = useState(false);

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
  const [open, setOpen] = React.useState(false);
  const [selectedFolder, setSelectedFolder] = useState('');
  const [folders, setFolders] = useState<Array<PreviewFoldersList>>([]);
  const [imageDetails, setImageDetails] = useState<Array<ImageListType>>([]);

  const [previewMeta, setPreviewMeta] = useState(Object);
  const [allowDownload, setAllowDownload] = useState<boolean[]>([]);
  const [isMandatory, setIsMandatory] = useState<boolean>(false);
  const [toggleFav, setToggleFav] = useState<boolean>(false);
  const [noFav, setNoFav] = useState<boolean>(false);

  const [all, setAll] = useState(false);

  const playRef = useRef<ImageGallery>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const [showSuccess, setShowSuccess] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [shownFeedback, setShownFeedback] = useState(false);


  const { enqueueSnackbar } = useSnackbar();

  const [eventDetails, setEventDetails] = useState<EventType>({
    id: '',
    date_display: '',
    name: '',
    venue: '',
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

  const eventDetail = useSelector((state: any) => state.createEvent.value);

  const auth = useSelector((state: any) => state.auth.value);
  const selfie = useSelector((state: any) => state.hasSelfie.value);
  const eventSlugDetails = useSelector((state: any) => state.eventSlug.value);
  const [carouselFav, setCarouselFav] = useState<boolean[]>([]);
  const [itemId, setItemId] = useState<number[]>([]);
  const [folderId, setFolderId] = useState('');
  const [previewPhotoPage, setPreviewPhotoPage] = useState(1);
  const [emptyPhotos, setEmptyPhotos] = useState(false);
  const [emptyFolders, setEmptyFolders] = useState(false);
  const [isSelfiePresent, setIsSelfiePresent] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const [hoverImageId, setHoverImageId] = useState(0);
  const [imageName, setImageName] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState<string[]>([]);
  const [downloadId, setDownloadId] = useState<number>(0);

  const [allPhotos, setAllPhotos] = useState(0);
  const [showButton, setShowButton] = useState(false);

  const isMounted = useRef(false);
  const scrollableDivRef = useRef<HTMLDivElement>(null);
  let { event } = useParams();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const { logout, user } = useAuth();

  const isMobile = window.innerWidth <= 767;

  // UseEffect
  useEffect(() => {
    const to = searchParams.get('to');
    if (to !== null && !(user && user.has_selfie)) {
      if (to === 'allphotos') {
        setAll(true);
        searchParams.delete('to');
        setSearchParams(searchParams);
      }
    } else {
      searchParams.delete('to');
      setSearchParams('');
    }
  }, [searchParams, setSearchParams, user]);

  useEffect(() => {
    // alert(JSON.stringify(user));
    const slug = pathname.split('/')[2];
    let eventName: string;
    if (eventDetail.slug === '') {
      eventName = slug;
    } else {
      eventName = eventDetail.slug;
    }
    const getPreviewEvent = async (event_slug: string) => {
      try {
        console.log('userType from user object', user?.account_type);
        user?.account_type === GUEST || auth.guest
          ? await axios.get(`/api/events/${event_slug}/preview`).then((response) => {
            if (!isMounted.current) {
              const { data } = response.data;
              setIsMandatory(data.privacy_setting.selfie_filtering);
              if (
                data.privacy_setting.selfie_filtering ||
                (user && user.has_selfie) ||
                selfie.has_selfie
              ) {
                setAllPhotos(0);
              } else {
                setAllPhotos(1);
              }
              const { folders } = data;
              if (folders[0].video_count === 0) {
                const filteredFolders = folders.slice(1).reverse();
                setFolders(filteredFolders);

                if (filteredFolders.length > 0) {
                  const strId = filteredFolders[0].id;
                  if (
                    data.privacy_setting.selfie_filtering ||
                    (user && user.has_selfie) ||
                    selfie.has_selfie
                  ) {
                    getPhotoGrid(strId, previewPhotoPage, 0);
                  } else {
                    getPhotoGrid(strId, previewPhotoPage, 1);
                  }
                  setSelectedFolder(strId);
                  setStore(strId);
                  setEmptyFolders(false);
                } else {
                  setEmptyFolders(true);
                }
              } else {
                setFolders(folders.reverse());

                if (folders.length > 0) {
                  const strId = folders[0].id;
                  setSelectedFolder(strId);
                  setStore(strId);
                  if (data.privacy_setting.selfie_filtering || (user && user.has_selfie)) {
                    getPhotoGrid(strId, previewPhotoPage, 0);
                  } else {
                    getPhotoGrid(strId, previewPhotoPage, 1);
                  }
                  setEmptyFolders(false);
                } else {
                  setEmptyFolders(true);
                }
              }

              setEventDetails(data);
            }
          })
          : await axios.get(`/api/events/${eventName}/preview`).then((response) => {
            if (!isMounted.current) {
              const { data } = response.data;
              const { folders } = data;
              if (folders[0].video_count === 0) {
                const filteredFolders = folders.splice(1).reverse();
                setFolders(filteredFolders);
                if (filteredFolders.length > 0) {
                  const strId = filteredFolders[0].id;
                  setStore(strId);
                  // getPhotoGrid(strId);
                  getPhotoGrid(strId, 1, 0);
                  setEmptyFolders(false);
                } else {
                  setEmptyFolders(true);
                }
              } else {
                setFolders(folders.reverse());

                if (folders.length > 0) {
                  const strId = folders[0].id;
                  // getPhotoGrid(strId);
                  getPhotoGrid(strId, 1, 0);
                  setStore(strId);
                  setEmptyFolders(false);
                } else {
                  setEmptyFolders(true);
                }
              }

              setEventDetails(data);
            }
          });
      } catch (error) {
        console.error(error);
      }
    };


    getPreviewEvent(slug);

    return () => {
      isMounted.current = true;
    };
  }, []);

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


  const handleChangeFolder = (event: React.MouseEvent<HTMLElement>, day: string) => {
    if (day !== null) {
      setToggleFav(false);
      setPreviewPhotoPage(1);
      setSelectedFolder(day);
      getPhotoGrid(day, 1, allPhotos, true);
      setShowTick(true);
    }
  };
  const handleSelfie = () => {
    if (user?.account_type === GUEST || auth.guest) {
      navigate(`${PATH_PRE_AUTH}/${event}/selfie-filtering`);
    }
  };

  const handleOpenCarousel = (index: any) => {
    console.log("Index", index)
    setImgIndex(index);
    setOpen(true);

    setCarouselFav(imageDetails.map((img) => img.favorite));
    setItemId(imageDetails.map((img) => img.id));
    setImageName(imageDetails.map((img) => img.file_name));
    setImageUrl(imageDetails.map((img) => img.original_url));
    setAllowDownload(imageDetails.map((img) => img.allow_download));
  };

  const handleClose = () => {
    setOpen(false);
    setIsPlaying(false);
  };

  const handleFavourite = async (favorite: boolean, imageId: number) => {
    const favoriteStatus = favorite ? '0' : '1';
    await axios.patch(`/api/folders/${folderId}/uploads/${imageId}`, { favorite: favoriteStatus })
      .then(res => {
        if (res.data.success) {
          const updateImgDetailsArr = [...imageDetails]
          const updateImageIndex = imageDetails?.findIndex(img => img.id == imageId);
          if (updateImageIndex === -1) return enqueueSnackbar('Something Went Wrong, Please Try Again !!!', { variant: 'error' });

          if (toggleFav) {
            updateImgDetailsArr.splice(updateImageIndex, 1)
            setPreviewMeta({ ...previewMeta, total: previewMeta?.total - 1, to: previewMeta?.to - 1 })
          } else {
            updateImgDetailsArr[updateImageIndex] = res.data.data;
          }

          setImageDetails(updateImgDetailsArr)
          setFavCount(!favorite ? favCount + 1 : favCount - 1)

          const updateCarouselFav = [...carouselFav]
          updateCarouselFav[updateImageIndex] = res.data.data.favorite;
          setCarouselFav(updateCarouselFav);
        } else {
          enqueueSnackbar('Something Went Wrong, Please Try Again !!!', { variant: 'error' });
        }
      })
      .catch(err => {
        console.log(err);
        enqueueSnackbar(err.message, { variant: 'error' });
      })
  };

  const getPhotoGrid = async (id: string, page?: number, val?: number, folderChange?: boolean) => {
    getFavouriteCount(id);
    setFolderId(id);
    if (id !== '') {
      try {
        const response = await axios.get(`/api/folders/${id}/uploads?limit=6`, {
          params: {
            page: page,
            all_photos: val,
          },
        });
        const { data, meta, links } = response.data;

        if (!data.length) {
          setEmptyPhotos(true);
        } else {
          if (((user && user.has_selfie) || selfie.has_selfie) && !val) {
            setIsSelfiePresent(true);
          }
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
        setTimeout(() => {
          setLoadFirst(false);
          setLoadNext(false);
          setLoadPrev(false);
          setLoadLast(false);
        }, 1000);
        // if (!page) scrollTop();
      } catch (error) {
        setTimeout(() => {
          setLoadFirst(false);
          setLoadNext(false);
          setLoadPrev(false);
          setLoadLast(false);
        }, 1000);
        console.error(error);
        setEmptyPhotos(true);
        enqueueSnackbar(error.message, { variant: 'error' });
      }
    } else {
      enqueueSnackbar('No Folders Found', { variant: 'error' });
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate(`/pre-registration/${event}/login`, { replace: true });
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Unable to logout!', { variant: 'error' });
    }
  };

  const handleDownloadPicture = async (imageId: number, downloadFlag: boolean, name: string) => {
    setDownloadId(imageId);
    const ids = [imageId];
    if (downloadFlag) {
      setLoading(true);
      try {
        await axios
          .post(`/api/folders/${folderId}/download`, { resources: ids }, { responseType: 'blob' })
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

  const getFavouriteCount = async (id: any) => {
    await axios.post(`/api/public/folders/${id}/uploads/search?limit=1&page=1`, { scopes: [{ name: 'favoritesOnly' }] })
      .then(res => {
        setFavCount(res.data.meta.total);
      })
      .catch(error => {
        console.error(error);
        enqueueSnackbar(error.message, { variant: 'error' });
      })
  };

  const filterFavourite = async (id: string, page: number) => {
    setNoFav(false);
    if (toggleFav) {
      setToggleFav(false);
      getPhotoGrid(selectedFolder, 1, allPhotos, true);
    } else {
      setToggleFav(true);
      filterFavouritePaginate(id, page, true);
      setPreviewPhotoPage(1)
    }
  };

  const filterFavouritePaginate = async (id: string, page: number, folderChange?: boolean) => {
    try {
      const response = await axios.post(`/api/public/folders/${id}/uploads/search?limit=6&page=${page}`, { scopes: [{ name: 'favoritesOnly' }] });

      const { data, meta, links } = response.data;
      if (data.length !== 0) {
        if (folderChange) {
          setImageDetails(data);
        } else {
          setImageDetails([...imageDetails, ...data]);
        }
        setPreviewMeta(meta);
        setCheckPage(links);
      } else {
        setNoFav(true);
      }
      setCarouselFav(data.map((img: any) => img.favorite));
      setLoadFirst(false);
      setLoadNext(false);
      setLoadPrev(false);
      setLoadLast(false);
      scrollTop();
    } catch (error) {
      setLoadFirst(false);
      setLoadNext(false);
      setLoadPrev(false);
      setLoadLast(false);
      console.error(error);
      setToggleFav(false);
      enqueueSnackbar(error.message, { variant: 'error' });
    }
  };

  const handlePaginate = async (action: string) => {
    const nav = action;
    if (toggleFav) {
      switch (nav) {
        case NEXT:
          setLoadNext(true);
          setPreviewPhotoPage(previewPhotoPage + 1);
          const next = previewPhotoPage + 1;
          filterFavouritePaginate(folderId, next);
          break;
        case PREV:
          setLoadPrev(true);
          setPreviewPhotoPage(previewPhotoPage - 1);
          const prev = previewPhotoPage - 1;
          filterFavouritePaginate(folderId, prev);
          break;
        case FIRST:
          setLoadFirst(true);
          setPreviewPhotoPage(1);
          const first = 1;
          filterFavouritePaginate(folderId, first);
          break;
        case LAST:
          setLoadLast(true);
          setPreviewPhotoPage(previewMeta.last_page);
          const last = previewMeta.last_page;
          filterFavouritePaginate(folderId, last);
          break;
        default:
          break;
      }
    } else {
      switch (nav) {
        case NEXT:
          setLoadNext(true);
          setPreviewPhotoPage(previewPhotoPage + 1);
          const next = previewPhotoPage + 1;
          getPhotoGrid(folderId, next, allPhotos);
          break;
        case PREV:
          setLoadPrev(true);
          setPreviewPhotoPage(previewPhotoPage - 1);
          const prev = previewPhotoPage - 1;
          getPhotoGrid(folderId, prev, allPhotos);
          break;
        case FIRST:
          setLoadFirst(true);
          setPreviewPhotoPage(1);
          const first = 1;
          getPhotoGrid(folderId, first, allPhotos);
          break;
        case LAST:
          setLoadLast(true);
          setPreviewPhotoPage(previewMeta.last_page);
          const last = previewMeta.last_page;
          getPhotoGrid(folderId, last, allPhotos);
          break;
        default:
          break;
      }
    }
  };

  const handlePhotoFilter = (e: any) => {
    setToggleFav(false);
    setAll(e.target.checked);
    setPreviewPhotoPage(1);
    let val;
    if (e.target.checked) {
      setAllPhotos(1);
      val = 1;
    } else {
      val = 0;
      setAllPhotos(0);
    }
    getPhotoGrid(folderId, 1, val, true);
  };

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

  const handleShare = () => {
    setOpenShare(!openShare);
  };

  const scrollTop = () => {
    document?.getElementById('view')?.scrollIntoView();
  };

  const scrollWindowTop = () => {
    scrollableDivRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const onScroll = (e: any) => {
    if (emptyPhotos) return;

    if (!loadNext && imageDetails.length < previewMeta.total) {
      if (Math.ceil(e.target.scrollHeight - e.target.scrollTop) === e.target.clientHeight || Math.floor(e.target.scrollHeight - e.target.scrollTop) === e.target.clientHeight) {
        handlePaginate('next');
      }
    }
  };

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    function onStateChange() {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        if (
          (user?.account_type === GUEST || auth.guest) &&
          ((user && user.has_selfie) || selfie.has_selfie) &&
          !emptyPhotos &&
          isSelfiePresent &&
          !shownFeedback
        )
          setShowFeedback(true);
          setShownFeedback(true);
      }, 40000);
    }
    onStateChange();
    return () => {
      clearTimeout(timeoutId);
    };
  }, [selfie.has_selfie, user?.has_selfie, isSelfiePresent]);

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
          doubleClick={{ disabled: true }}
          initialScale={1}
          initialPositionX={1}
          initialPositionY={1}
        >
          {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
            <>
              <Grid container>
                <CarouselHeader1
                  item
                  sx={{ justifyContent: 'flex-start' }}
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
                  item
                  sx={{ justifyContent: 'flex-end' }}
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
                        onClick={() => handleFavourite(carouselFav[imgIndex], itemId[imgIndex])}
                        sx={{
                          mx: 1,
                          color: carouselFav[imgIndex] ? '#d10303' : '#7dd78d',
                          cursor: 'pointer',
                        }}
                      />
                      {user?.account_type === GUEST ||
                        (auth.guest && (
                          <Tooltip
                            arrow
                            open={openShare}
                            onClick={handleShare}
                            componentsProps={{
                              tooltip: {
                                sx: {
                                  mr: 1.5,
                                  bgcolor: 'rgba(0,0,0,0.4)',
                                  '& .MuiTooltip-arrow': {
                                    color: 'rgba(0,0,0,0.4)',
                                  },
                                },
                              },
                            }}
                            placement="bottom"
                            title={
                              <Box my={0.5}>
                                <Box>
                                  <WhatsappShareButton url={imageUrl[imgIndex]}>
                                    <WhatsappIcon size={32} round />
                                  </WhatsappShareButton>
                                </Box>
                                <Box py={0.5}>
                                  <FacebookShareButton url={imageUrl[imgIndex]}>
                                    <FacebookIcon size={32} round />
                                  </FacebookShareButton>
                                </Box>
                                <Box>
                                  <TwitterShareButton url={imageUrl[imgIndex]}>
                                    <TwitterIcon size={32} round />
                                  </TwitterShareButton>
                                </Box>
                              </Box>
                            }
                          >
                            <ShareIcon
                              color="primary"
                              sx={{
                                mx: 1,
                                cursor: 'pointer',
                              }}
                            />
                          </Tooltip>
                        ))}

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
             
                  infinite={true}
                  lazyLoad={true}
                />
              </TransformComponent>
            </>
          )}
        </TransformWrapper>
      </Dialog>
      <FeedbackDialog
        isDialogOpen={showFeedback}
        onClose={() => setShowFeedback(false)}
        eventId={eventDetails?.id}
        onFeedbackSuccess={() => setShowSuccess(true)}
        onFeedbackFailure={() => enqueueSnackbar('Something went wrong!', { variant: 'error' })}
      />
      <FeedbackSuccessDialog isDialogOpen={showSuccess} onClose={() => setShowSuccess(false)} />  
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
          '@media only screen and (-webkit-min-device-pixel-ratio: 1.5), only screen and (-o-min-device-pixel-ratio: 3/2), only screen and (min--moz-device-pixel-ratio: 1.5), only screen and (min-device-pixel-ratio: 1.5)':
            {
              html: {
                width: '100%',
                overflowX: 'hidden',
              },
              body: {
                width: '100%',
                overflowX: 'hidden',
              },
            },
        }}
        onScroll={onScroll}
        ref={scrollableDivRef}
      >
        {(user?.account_type === GUEST || auth.guest) &&
          ((user && user.has_selfie) || selfie.has_selfie) &&
          !emptyPhotos &&
          isSelfiePresent && (
            <FeedbackButton onClick={() => setShowFeedback(true)}>
              <FeedbackButtonSVG />
            </FeedbackButton>
          )}

        <div id="topView">
          <div style={{ backgroundColor: '#292929' }}>
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
            <SubTitle variant="h5">
              {eventDetails.photo_count} Photos |&nbsp; {eventDetails.video_count} Videos{' '}
              {eventDetails.venue && (
                <>
                  <Space /> {eventDetails.venue} <Space />
                </>
              )}
              {eventDetails.date_display}
            </SubTitle>
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
              <ToggleLayoutBtnGroup
                exclusive
                value={selectedFolder || store}
                onChange={handleChangeFolder}
              >
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
                      (selectedFolder === folder.id || store === folder.id ? (
                        <TickLayoutIcon>
                          <IconTickBlueSVG
                            accent_color={`${eventDetails.selected_theme.accent_color}`}
                          />
                        </TickLayoutIcon>
                      ) : null)}
                    {showTick &&
                      (selectedFolder === folder.id ? (
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
                  {(user && user.has_selfie) || selfie.has_selfie ? (
                    <Typography variant="h3" gutterBottom>
                      Take selfie again
                    </Typography>
                  ) : (
                    <>
                      <Typography variant="h3" gutterBottom>
                        Selfie Search
                      </Typography>
                    </>
                  )}
                  <Typography fontStyle="italic" color="grey.200" variant="body1" gutterBottom>
                    You’ll be able to see only your pictures hassle-free, with our advanced AI
                    feature.
                  </Typography>
                </TextContainer>
              </Content>
            </Grid>
          </Grid>
          <Nav>
            {previewMeta.total === 0 || emptyFolders || emptyPhotos ? (
              <div />
            ) : (
              <Typography py={!auth.guest || user?.account_type !== GUEST ? 2 : 0} variant="h6">
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
            )}

            {/* {user?.account_type === GUEST ||
              (auth.guest && ( */}

            {/* Error in fetching the value of guest  */}

            {(user?.account_type === GUEST || user?.account_type === AGENCY || auth.guest) && (
              <PhotoActions>
                {!isMandatory && (
                  <>
                    <Typography variant="h6">Your Photos</Typography>
                    <Switch disabled={isMandatory} onChange={handlePhotoFilter} checked={all} />
                    <Typography variant="h6">All Photos</Typography>
                  </>
                )}
                <Button
                  size="medium"
                  sx={{ color: '#fff', ml: 2 }}
                  onClick={() => filterFavourite(folderId, 1)}
                  startIcon={<FavoriteIcon sx={{ color: toggleFav ? '#ff2066' : '#fff' }} />}
                >
                  Favourites ({favCount})
                </Button>
              </PhotoActions>
            )}
          </Nav>
          <BackgroundTheme
            style={{
              backgroundImage: `url(${eventDetails?.selected_theme?.image?.original_url}) `,
              backgroundSize: isMobile? 'auto' : emptyPhotos || emptyFolders || noFav ? 'cover' : 'contain',
            }}
          >
            {emptyPhotos || emptyFolders || noFav ? (
              <div>
                <Stack sx={{ width: '30%', margin: 'auto', py: 10 }} spacing={2}>
                  <Alert
                    icon={false}
                    sx={{
                      backgroundColor: `#0E74DA`,
                      display: 'flex',
                      justifyContent: 'center',
                      py: 1.5,
                    }}
                  >
                    {noFav && <Typography variant="h5">No Favourites Found !</Typography>}
                    {emptyPhotos && <Typography variant="h5">No Photos Found !</Typography>}
                    {emptyFolders && <Typography variant="h5">No Data Found !</Typography>}
                  </Alert>
                </Stack>
              </div>
            ) : null}

            {!emptyPhotos && !emptyFolders && !noFav ? (
              <Box
                onContextMenu={(e) => {
                  if (eventDetails.privacy_setting.right_click) {
                    return e.preventDefault();
                  }
                }}
                id="view"
                sx={{ py: 1.3, px: 1.3 }}
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
                    {imageDetails.map((ele: any, i: number) => (
                      <div
                        key={i}
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
                              handleOpenCarousel(i);
                            }
                          }}
                          alt="img"
                          key={i}
                          src={
                            ele.thumbnail_url && ele.thumbnail_url
                              ? ele.thumbnail_url
                              : ele.original_url
                          }
                          style={{ borderRadius: '5px', width: '100%', display: 'block' }}
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
                              {showActions && ele.id === hoverImageId && (
                                <div
                                  style={{
                                    display: 'block',
                                    marginLeft: 'auto',
                                    maxWidth: 'max-content',
                                  }}
                                >

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
                                    onClick={() => handleFavourite(ele.favorite, ele.id)}
                                    sx={{
                                      mx: 1,
                                      mt: 1,
                                      color: ele.favorite ? '#d10303' : 'none',
                                      cursor: 'pointer',
                                    }}
                                  />

                                  {console.log("Ele", ele.favorite)} 
                                  
                                  {user?.account_type === GUEST ||
                                    (auth.guest && (
                                      <Tooltip
                                        open={openShare}
                                        onClick={handleShare}
                                        arrow
                                        componentsProps={{
                                          tooltip: {
                                            sx: {
                                              mr: 1.5,
                                              bgcolor: 'rgba(0,0,0,0.4)',
                                              '& .MuiTooltip-arrow': {
                                                color: 'rgba(0,0,0,0.4)',
                                              },
                                            },
                                          },
                                        }}
                                        placement="top"
                                        title={
                                          <Box my={0.5}>
                                            <Box>
                                              <WhatsappShareButton url={ele.original_url}>
                                                <WhatsappIcon size={32} round />
                                              </WhatsappShareButton>
                                            </Box>
                                            <Box py={0.5}>
                                              <FacebookShareButton url={ele.original_url}>
                                                <FacebookIcon size={32} round />
                                              </FacebookShareButton>
                                            </Box>
                                            <Box>
                                              <TwitterShareButton url={ele.original_url}>
                                                <TwitterIcon size={32} round />
                                              </TwitterShareButton>
                                            </Box>
                                          </Box>
                                        }
                                      >
                                        <ShareIcon
                                          sx={{
                                            mx: 1,
                                            cursor: 'pointer',
                                          }}
                                        />
                                      </Tooltip>
                                    ))}
                                  {/* </Actions>
                                  </ActionsContainer> */}
                                </div>
                              )}
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
                    ))}
                  </Masonry>
                </ResponsiveMasonry>
              </Box>
            ) : null}

            {/* Added Progress To Show New Images Loader */}
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

          <PreviewRegisterDrawer
            openDrawer={registrationDrawer}
            onClose={() => {
              setRegistrationDrawer(false);
            }}
          />
        </div>
      </BoxStyle>
    </>
  );
}
