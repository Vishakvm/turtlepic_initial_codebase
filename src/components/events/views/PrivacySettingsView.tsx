import React, { useState, useEffect } from 'react';

import {
  Grid,
  Button,
  styled,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useSnackbar } from 'notistack';

import axios from 'src/utils/axios';
import CreateEventFooterView from '../elements/CreateEventFooter';
import IconBackDarkSVG from 'src/assets/shared/svg/icon_back_dark';
import PrivacySwitchElement from '../elements/PrivacySwitch';
import PrivacyDayElement from '../elements/PrivacyDay';
import { useSelector } from 'src/redux/store';

interface TabNextProps {
  privacyTabRedirect: (index: number) => void;
  nextIndex: number;
  prevIndex: number;
}

const GridWrapper = styled(Grid)(({ theme }) => ({
  padding: theme.spacing(3),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1, 1, 0, 1),
  },
}));

const Hr = styled('div')(({ theme }) => ({
  border: '0.5px solid #6D6D6D',
  marginTop: theme.spacing(1),
}));

const AllowDownloadHeader = styled(Accordion)(({ theme }) => ({
  '& .MuiAccordionSummary-root': {
    width: 'fit-content',
    paddingTop: theme.spacing(2),
  },
}));

type FolderListType = {
  name: string;
  allow_download: boolean;
  id: number;
};

export default function PrivacySettingsView({
  privacyTabRedirect,
  nextIndex,
  prevIndex,
}: TabNextProps): React.ReactElement {
  const [protection, setProtection] = useState(false);
  const [photoFiltering, setPhotoFiltering] = useState(false);
  const [registeredUser, setRegisteredUser] = useState(false);
  const [selfieUploading, setSelfieUpladoing] = useState(false);
  const [folderItem, setFolderItem] = useState<Array<FolderListType>>([]);

  const eventDetails = useSelector((state: any) => state.createEvent.value);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const getPrivacySettings = async () => {
      try {
        const response = await axios.get(`/api/events/${eventDetails.id}/privacy-setting`);
        const { data } = response.data;
        setProtection(data.right_click);
        setPhotoFiltering(data.selfie_filtering);
        setSelfieUpladoing(data.media_selection)
        setRegisteredUser(!data.public_view);
        setFolderItem(data.folders);
      } catch (error) {
        console.error(error);
        enqueueSnackbar(error.message, { variant: 'error' });
      }
    };
    getPrivacySettings();
  }, [enqueueSnackbar, eventDetails.id]);

  const [permission, setPermission] = useState(folderItem);

  const isSwitchOn = async (switchIdx: number, e: boolean) => {
    const updatedPermission = folderItem[switchIdx];
    updatedPermission.allow_download = e;
    const newPermission = [...folderItem];
    newPermission[switchIdx] = updatedPermission;
    setPermission(newPermission);

    const privacyData = new FormData();
    newPermission.forEach((ele) => {
      privacyData.append(`allow_download[${ele.id}]`, ele.allow_download ? '1' : '0');
    });
    privacyData.append('_method', 'PATCH');

    try {
      const response = await axios.post(
        `/api/events/${eventDetails.id}/privacy-setting`,
        privacyData
      );
      const { message } = response.data;
      enqueueSnackbar(message, { variant: 'success' });
    } catch (error) {
      console.error(error);
      enqueueSnackbar(error.message, { variant: 'error' });
    }
  };

  const handleProtectionChange = async (event: any) => {
    setProtection(event.target.checked);
    const privacyData = new FormData();
    privacyData.append('right_click', event.target.checked ? '1' : '0');
    privacyData.append('_method', 'PATCH');

    try {
      const response = await axios.post(
        `/api/events/${eventDetails.id}/privacy-setting`,
        privacyData
      );
      const { message } = response.data;
      enqueueSnackbar(message, { variant: 'success' });
    } catch (error) {
      console.error(error);
      enqueueSnackbar(error.message, { variant: 'error' });
    }
  };
  const handleFilteringChange = async (event: any) => {
    setPhotoFiltering(event.target.checked);
    const privacyData = new FormData();
    privacyData.append('selfie_filtering', event.target.checked ? '1' : '0');
    privacyData.append('_method', 'PATCH');

    try {
      const response = await axios.post(
        `/api/events/${eventDetails.id}/privacy-setting`,
        privacyData
      );
      const { message } = response.data;
      enqueueSnackbar(message, { variant: 'success' });
    } catch (error) {
      console.error(error);
      enqueueSnackbar(error.message, { variant: 'error' });
    }
  };
  const handleUserChange = async (event: any) => {
    setRegisteredUser(event.target.checked);
    const privacyData = new FormData();
    privacyData.append('public_view', event.target.checked ? '0' : '1');
    privacyData.append('_method', 'PATCH');

    try {
      const response = await axios.post(
        `/api/events/${eventDetails.id}/privacy-setting`,
        privacyData
      );
      const { message } = response.data;
      enqueueSnackbar(message, { variant: 'success' });
    } catch (error) {
      console.error(error);
      enqueueSnackbar(error.message, { variant: 'error' });
    }
  };
    const handleSelfieUploadChange = async (event: any) => {
      setSelfieUpladoing(event.target.checked);
      const privacyData = new FormData();
      privacyData.append('media_selection', event.target.checked ? '1' : '0');
      privacyData.append('_method', 'PATCH');

      try {
        const response = await axios.post(
          `/api/events/${eventDetails.id}/privacy-setting`,
          privacyData
        );
        const { message } = response.data;
        enqueueSnackbar(message, { variant: 'success' });
      } catch (error) {
        console.error(error);
        enqueueSnackbar(error.message, { variant: 'error' });
      }
    };

  const handleBack = () => {
    privacyTabRedirect(prevIndex);
  };

  return (
    <>
      <Grid container>
        <GridWrapper item xs={12} sm={12} md={5} lg={5}>
          <PrivacySwitchElement
            offLabel="No"
            onLabel="Yes"
            label="Right Click Protection"
            name="right_click_protection"
            checked={protection}
            onChange={handleProtectionChange}
            info="Protects right click action"
          />
          <PrivacySwitchElement
            offLabel="Off"
            onLabel="On"
            label="Mandatory Selfie Search"
            name="mandatory_selfie_photo_filtering"
            checked={photoFiltering}
            onChange={handleFilteringChange}
            info="Photo filtering is mandatory for the event. People can only see the pictures matching to their selfie."
          />
          <PrivacySwitchElement
            offLabel="No"
            onLabel="Yes"
            label="Only registered users can view"
            name="only_registered_users_can_view"
            checked={registeredUser}
            onChange={handleUserChange}
            info="Users who pre-register to the event will have the access. No registrations will be allowed after the event is published."
          />
          <PrivacySwitchElement
            offLabel="No"
            onLabel="Yes"
            label="Allow Uploading for Selfie Filtering"
            name="allow_uploading_for_selfie_filtering"
            checked={selfieUploading}
            onChange={handleSelfieUploadChange}
            info="Users will be able to select image from the gallery for selfie filtering"
          />
          <AllowDownloadHeader defaultExpanded>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography pr={1} variant="h6">
                Allow download
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Hr />
              {folderItem &&
                folderItem.map((item, index) => (
                  <div key={item.id}>
                    <PrivacyDayElement
                      offLabel="No"
                      onLabel="Yes"
                      label={item.name}
                      name={item.name}
                      checked={item.allow_download}
                      onChange={(e) => {
                        isSwitchOn(index, !item.allow_download);
                      }}
                    />
                  </div>
                ))}
            </AccordionDetails>
          </AllowDownloadHeader>
        </GridWrapper>
      </Grid>

      <CreateEventFooterView
        footerAction={
          <Button onClick={handleBack} size="small" color="inherit" startIcon={<IconBackDarkSVG />}>
            Back
          </Button>
        }
      />
    </>
  );
}
