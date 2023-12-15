import React, { useState, useEffect, useRef } from 'react';

import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  styled,
  Typography,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useSnackbar } from 'notistack';

import AddFolder from 'src/assets/shared/images/AddFolder.png';
import axios from 'src/utils/axios';
import CreateFolderDrawerView from '../drawers/CreateFolderDrawer';
import Default from 'src/assets/shared/images/Default.png';
import VideoCoverPhoto from 'src/assets/shared/images/Cover.png';
import { useSelector, useDispatch } from 'src/redux/store';
import { folderDetails } from 'src/redux/slices/folderDetails';
import { AGENCY, ALL, CLIENT, CUSTOM, TRANSFERRED } from 'src/utils/constants';
import useAuth from 'src/hooks/useAuth';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CircleOutlinedIcon from '@mui/icons-material/CircleOutlined';
import ConfirmationDialog from 'src/components/dialogs/ConfirmationDialog';

type FolderProps = {
  onClick: () => void;
};

const useStyles = makeStyles((theme) => ({
  list: {
    padding: 0,
  },
}));

const Header = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(1, 4, 1, 4),
  justifyContent: 'end',
}));
const Folder = styled('div')(({ theme }) => ({
  position: 'relative',
  cursor: 'pointer',
  color: theme.palette.grey[200],
}));
const TextWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
}));
const Content = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 3, 3, 3),
  display: 'flex',
  flexWrap: 'wrap',
  [theme.breakpoints.down('sm')]: {
    justifyContent: 'center',
    padding: theme.spacing(0),
  },
}));
const Image = styled('img')(({ theme }) => ({
  position: 'absolute',
  top: '-10px',
  left: '-10px',
}));
const FolderWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(3),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(3, 3, 0, 3),
  },
}));

const ImgWrapper = styled('div')(({ theme }) => ({
  width: '11rem',
  height: '8rem',
}));

const ImgStyle = styled('img')(({ theme }) => ({
  objectFit: 'cover',
  width: '100%',
  height: '100%',
}));

const CheckboxWrapper = styled('div')(({ theme }) => ({
  position: 'relative',
}));

const CustomCheckBox = styled(Checkbox)(({ theme }) => ({
  zIndex: 43,
}));

const HeaderActions = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer',
}));

type FolderListType = {
  is_default: boolean;
  name: string;
  event_id: number;
  video_count: number;
  photo_count: number;
  cover_picture: {
    thumbnail_url: string;
    original_url: string;
  };
  allow_download: boolean;
  date: string;
  skip_duplicates: boolean;
  id: number;
};

export default function FolderList(props: FolderProps): React.ReactElement {
  const [folderDrawer, setFolderDrawer] = React.useState(false);
  const [folderItem, setFolderItem] = useState<Array<FolderListType>>([]);
  const eventDetails = useSelector((state) => state.createEvent.value);
  const [photosSelectionType, setSelectPhotosSelectionType] = useState('');
  const [selectedView, setSelectedView] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isChecked, setIsChecked] = useState(false);
  const [selectedValue, setSelectedValue] = useState<string>('');
  const [folderIds, setFolderIds] = useState<number[]>([]);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [videoFolderId, setVideoFolderId] = useState<number>(0);

  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuth();
  const isMounted = useRef(false);
  const classes = useStyles();

  const getFolderList = async () => {
    try {
      const response = await axios.get(`/api/events/${eventDetails.id}/folders`);
      const { data } = response.data;
      if (!isMounted.current) {
        setFolderItem(data.reverse().map((item: any) => item));
        let folderIdList = data.map((a: any) => a.id).slice(1);
        setVideoFolderId(data[0].id);
        setFolderIds(folderIdList);
      }
    } catch (error) {
      console.error(error);
      if (navigator.onLine) {
        enqueueSnackbar(error.message, { variant: 'error' });
      }
    }
  };
  useEffect(() => {
    getFolderList();
  }, [enqueueSnackbar, eventDetails.id]);

  useEffect(
    () => () => {
      isMounted.current = true;
    },
    []
  );

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
      case selectionType === '':
        setIsChecked(false);
        setSelectedView(false);
        setSelectedValue('');
        break;
      default:
        return;
    }
  };

  const isCheckboxChecked = (e: React.ChangeEvent<HTMLInputElement>, selection: number) => {
    if (selection === videoFolderId) {
    } else {
      if (!selectedIds.includes(selection)) {
        setSelectedIds([...selectedIds, selection]);
      } else if (selectedIds.includes(selection)) {
        const index = selectedIds.indexOf(selection);
        if (index !== -1) {
          selectedIds.splice(index, 1);
          setSelectedIds([...selectedIds]);
        }
      }
    }
  };
  const deletionHandler = () => {
    if (selectedValue === '') {
      enqueueSnackbar('Please select a folder to delete!', { variant: 'error' });
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
        await axios.delete(`/api/events/${eventDetails.id}/folders/batch`, {
          data: { resources: folderIds },
        });
        enqueueSnackbar('Successfully Deleted', { variant: 'success' });
        setIsChecked(false);
        setSelectedView(false);
        setFolderIds([]);
        getFolderList();
        setSelectPhotosSelectionType('');
        setSelectedValue('');
      } catch (error) {
        enqueueSnackbar(error.message, { variant: 'error' });
      }
    } else if (selectedValue === CUSTOM) {
      try {
        await axios.delete(`/api/events/${eventDetails.id}/folders/batch`, {
          data: { resources: selectedIds },
        });
        const toBeRemoved = new Set(selectedIds);
        const updatedFolders = folderItem.filter((folder, i) => !toBeRemoved.has(folder.id));
        setFolderItem(updatedFolders);
        setSelectPhotosSelectionType('');
        setSelectedIds([]);
        setSelectedView(false);
        setSelectedValue('');
        getFolderList();
        enqueueSnackbar('Successfully Deleted', { variant: 'success' });
      } catch (error) {
        console.error(error);
        enqueueSnackbar(error.message, { variant: 'error' });
      }
    }
  };
  return (
    <>
      <CreateFolderDrawerView
        openDrawer={folderDrawer}
        onClose={() => {
          setFolderDrawer(false);
          getFolderList();
        }}
      />
      <ConfirmationDialog
        isDialogOpen={dialogOpen}
        buttonMainLabel="No"
        buttonSecondaryLabel="Yes, delete"
        dialogContent="Are you sure you want to delete the selected folder?"
        dialogId="error-dialog-title"
        onClick={dialogHandler}
        onClose={() => setDialogOpen(false)}
      />
      <Header>
        <>
          {user?.account_type === AGENCY &&
          eventDetails.client_status === TRANSFERRED &&
          eventDetails.eventType === CLIENT ? null : (
            <>
              <HeaderActions onClick={deletionHandler}>
                <Button
                  size="small"
                  sx={{ color: '#fff' }}
                  startIcon={<DeleteOutlineIcon color="error" />}
                >
                  Delete
                </Button>
              </HeaderActions>
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
                  </Select>
                </FormControl>
              </Box>
            </>
          )}
        </>
      </Header>
      <Content>
        {folderItem &&
          folderItem.map((item) => (
            <FolderWrapper key={item.id}>
              <CheckboxWrapper>
                {videoFolderId === item.id ? null : (
                  <>
                    {selectedView &&
                      (isChecked ? (
                        <FormControlLabel
                          sx={{
                            position: 'absolute',
                            zIndex: 5,
                            left: '55%',
                            top: '31%',
                            transform: 'translate(-50%, -50%)',
                            height: '64%',
                            width: '100%',
                            backgroundColor: 'rgba(125, 221, 141, 0.3)',
                          }}
                          label=""
                          control={
                            <CustomCheckBox
                              sx={{
                                position: 'absolute',
                                zIndex: 5,
                                left: '50%',
                                top: '50%',
                                transform: 'translate(-50%, -50%)',
                              }}
                              checkedIcon={<CheckCircleIcon fontSize="large" />}
                              icon={<CircleOutlinedIcon fontSize="large" />}
                              value={item.id}
                              checked={true}
                              color="primary"
                            />
                          }
                        />
                      ) : (
                        <>
                          <FormControlLabel
                            sx={{
                              position: 'absolute',
                              zIndex: 5,
                              left: '55%',
                              top: '31%',
                              transform: 'translate(-50%, -50%)',
                              height: '64%',
                              width: '100%',
                              backgroundColor: selectedIds.some((id) => id === item.id)
                                ? 'rgba(125, 221, 141, 0.3)'
                                : 'none',
                            }}
                            label=""
                            control={
                              <CustomCheckBox
                                sx={{
                                  position: 'absolute',
                                  zIndex: 5,
                                  left: '50%',
                                  top: '50%',
                                  transform: 'translate(-50%, -50%)',
                                }}
                                checkedIcon={<CheckCircleIcon fontSize="large" />}
                                icon={<CircleOutlinedIcon fontSize="large" />}
                                checked={selectedIds.some((id) => id === item.id)}
                                value={item.id}
                                color="primary"
                                onChange={(e) => isCheckboxChecked(e, item.id)}
                              />
                            }
                          />
                        </>
                      ))}
                  </>
                )}
                <Folder
                  onClick={(): void => {
                    props.onClick();
                    dispatch(
                      folderDetails({
                        id: item.id,
                        name: item.name,
                        allow_download: item.allow_download,
                        skip_duplicates: item.skip_duplicates,
                        video_count: item.video_count,
                        photo_count: item.photo_count,
                        is_default: item.is_default,
                        date: item.date,
                        cover_picture: item.cover_picture?.thumbnail_url,
                      })
                    );
                  }}
                >
                  {item.is_default && <Image src={String(Default)} alt="Default" />}

                  {item.cover_picture ? (
                    <ImgWrapper>
                      <ImgStyle
                        src={String(
                          item.cover_picture.thumbnail_url
                            ? item.cover_picture.thumbnail_url
                            : item.cover_picture.original_url
                        )}
                        alt="VideoCoverPhoto"
                      />
                    </ImgWrapper>
                  ) : (
                    <ImgWrapper>
                      <ImgStyle src={String(VideoCoverPhoto)} alt="VideoCoverPhoto" />
                    </ImgWrapper>
                  )}

                  <TextWrapper>
                    <div style={{ width: '6rem' }}>
                      <Typography textTransform="capitalize" noWrap py={0.5} variant="body1">
                        {item.name}
                      </Typography>
                    </div>

                    <Typography py={0.5} variant="body1">
                      {item.date && item.date.split('-').reverse().join('.')}
                    </Typography>
                  </TextWrapper>
                  <Typography py={0.5} variant="subtitle2">
                    Subfolder
                  </Typography>
                  <Typography variant="subtitle2">
                    {!item.is_default &&
                      (item.photo_count ? item.photo_count + ' Photos | ' : '0 Photos | ')}
                    {item.video_count ? item.video_count : '0'} Videos
                  </Typography>
                </Folder>
              </CheckboxWrapper>
            </FolderWrapper>
          ))}

        {user?.account_type === AGENCY &&
        eventDetails.client_status === TRANSFERRED &&
        eventDetails.eventType === CLIENT ? null : (
          <FolderWrapper>
            <Folder
              onClick={() => {
                setFolderDrawer(true);
              }}
            >
              <ImgWrapper>
                <ImgStyle src={String(AddFolder)} alt="AddFolder" />
              </ImgWrapper>
              <Typography py={0.5} variant="body1">
                Create New Folder
              </Typography>
            </Folder>
          </FolderWrapper>
        )}
      </Content>
    </>
  );
}
