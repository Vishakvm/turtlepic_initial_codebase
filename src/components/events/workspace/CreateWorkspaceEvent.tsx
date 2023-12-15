import React, { useState, useEffect } from 'react';

import {
  Tabs,
  Tab,
  Box,
  Typography,
  Grid,
  Button,
  styled,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';

import { useNavigate } from 'react-router';
import { useSnackbar } from 'notistack';

// Hooks
import useResponsive from 'src/hooks/useResponsive';

// Components
import axios from 'src/utils/axios';
import ChooseTemplateView from '../views/ChooseTemplateView';
import { EVENTPANEL, PUBLISHED, CLIENT } from 'src/utils/constants';
import { eventDetails } from 'src/redux/slices/createEvent';
import WorkspaceDetailsView from './views/WorkspaceDetailsView';
import IconNextSVG from 'src/assets/shared/svg/IconNextSVG';
import IconPrevSVG from 'src/assets/shared/svg/IconPrevSVG';
import Page from 'src/components/Page';
import { PATH_MAIN } from 'src/routes/paths';
import PreregisteredGuestsView from './views/PreregisteredGuestsView';
import PrivacySettingsView from '../views/PrivacySettingsView';
import PublishEventDrawerView from '../drawers/PublishEventDrawer';
import UploadPicturesView from '../views/UploadPicturesView';
import ShareEventView from './views/ShareEventView';
import { successMessage } from 'src/redux/slices/successMessage';

// icons
import ConfirmationDialog from 'src/components/dialogs/ConfirmationDialog';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { useDispatch, useSelector } from 'src/redux/store';

import InsightsView from './views/Insights';
import useAuth from 'src/hooks/useAuth';
import { LoadingButton } from '@mui/lab';
import PublishStatusDialog from 'src/components/dialogs/PublishStatusDialog';
import { useLocation } from 'react-router-dom';

const Line = styled('div')(({ theme }) => ({
  border: `0.5px solid #6D6D6D`,
  margin: theme.spacing(0.5, 0, 0, 0),
}));

const Collapse = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'end',
  cursor: 'pointer',
}));

const Status = styled('div')(({ theme }) => ({
  display: 'flex',
  padding: theme.spacing(3, 0, 5, 0),
}));

const Cell = styled('div')(({ theme }) => ({}));
const Hr = styled('div')(({ theme }) => ({
  border: '0.5px solid #6D6D6D',
  margin: theme.spacing(0, 4, 0, 4),
}));

const Btn = styled(Button)(({ theme }) => ({
  height: 'auto',
  margin: 0,
  padding: theme.spacing(0, 0.2, 0, 0.2),
}));
const Title = styled(Typography)(({ theme }) => ({
  color: theme.palette.grey[500],
}));
const SubTitle = styled(Typography)(({ theme }) => ({
  color: '#7DD78D',
  textTransform: 'capitalize',
}));
const Text = styled(Typography)(({ theme }) => ({
  color: theme.palette.grey[0],
  padding: theme.spacing(2, 7, 0, 0),
}));

const Div = styled('div')(({ theme }) => ({
  background: theme.palette.grey[300],
  borderRadius: '3px',
}));

const HeaderTitleWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
}));

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <Div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <>{children}</>}
    </Div>
  );
}

function eventTabProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function CreateWorkspaceView() {
  const [value, setValue] = useState(0);
  const [currentIndexedStatus, setCurrentIndexedStatus] = useState('');
  const [expanded, setExpanded] = useState<string | false>(EVENTPANEL);
  const [publishDrawer, setPublishDrawer] = React.useState(false);
  const [publishDialogOpen, setPublishDialogOpen] = useState<boolean>(false);
  const [unpublishDialogOpen, setUnpublishDialogOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [publishStatusDialogOpen, setPublishStatusDialogOpen] = useState<boolean>(false);
  const [showProgress, setShowProgress] = useState<boolean>(false);

  const isDesktop = useResponsive('up', 'lg');
  const dispatch = useDispatch();

  const eventDetail = useSelector((state) => state.createEvent.value);

  const { user } = useAuth();

  const { enqueueSnackbar } = useSnackbar();

  const navigate = useNavigate();
  const location = useLocation();


  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleNextRedirect = (index: React.SetStateAction<number>) => {
    setValue(index);
  };

  const handlePublishEvent = async () => {
    setLoading(true);
    try {
      await axios.post(`/api/events/${eventDetail.id}/publish`).then((response) => {
        const { data, message } = response.data;
        setCurrentIndexedStatus(data.indexed_status);
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
        if (data.indexed_status === 'false' && data.event_status === 'published') {
          setShowProgress(true);
          setPublishStatusDialogOpen(true);
          const indexingQueueStr = localStorage.getItem('indexingQueue');
          const indexingQueue: number[] = JSON.parse(indexingQueueStr || '[]');
          indexingQueue.push(parseInt(eventDetail.id));
          const updatedIndexingQueue = JSON.stringify(indexingQueue);
          localStorage.setItem('indexingQueue', updatedIndexingQueue);
          setPublishStatusDialogOpen(true);
        }
        setLoading(false);
        
        // publishStatusDialogHandler();
        dispatch(successMessage({ message: message }));
        // navigate(PATH_MAIN.success);
      });
    } catch (error) {
      setLoading(false);
      enqueueSnackbar(error.message, { variant: 'error' });
    }
  };

  const handleUnpublishEvent = async () => {
    setLoading(true);
    try {
      await axios.post(`/api/events/${eventDetail.id}/unpublish`).then((response) => {
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
        setLoading(false);
        enqueueSnackbar(message, { variant: 'success' });
      });
    } catch (error) {
      setLoading(false);
      enqueueSnackbar(error.message, { variant: 'error' });
    }
  };

  const publishDialogHandler = () => {
    handlePublishEvent();
    setPublishDialogOpen(false);
    // setPublishStatusDialogOpen(true);
    
  };

  const unpublishDialogHandler = () => {
    handleUnpublishEvent();
    setUnpublishDialogOpen(false);
  };
console.log(currentIndexedStatus);

  const publishStatusDialogHandler = () => {
      // setPublishStatusDialogOpen(true);

    if (currentIndexedStatus === 'false' && eventDetail.event_status === 'published') {
      setShowProgress(true);
      const indexingQueueStr = localStorage.getItem('indexingQueue');
      const indexingQueue: number[] = JSON.parse(indexingQueueStr || '[]');
      indexingQueue.push(parseInt(eventDetail.id));
      const updatedIndexingQueue = JSON.stringify(indexingQueue);
      localStorage.setItem('indexingQueue', updatedIndexingQueue);
      setPublishStatusDialogOpen(true);
    }
  };

  const handleAccordionChange =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
    };

  useEffect(() => {
    const getEventDetails = async () => {
      try {
        await axios.get(`/api/events/${eventDetail.id}`).then((response) => {
          const { data } = response.data;
          setCurrentIndexedStatus(data.indexed_status);

          if (data.indexed_status === 'false' && data.event_status === 'published') {
            setPublishStatusDialogOpen(true);
          } else if (data.indexed_status === 'true' && data.event_status === 'published') {
            const indexingQueueStr = localStorage.getItem('indexingQueue');
            const indexingQueue: number[] = JSON.parse(indexingQueueStr || '[]');
            const doesContainValue = indexingQueue?.includes(parseInt(eventDetail.id));
            if (doesContainValue) {
              enqueueSnackbar('Event Published Successfully', { variant: 'success' });
              const updatedArray: number[] = indexingQueue.filter(
                (item) => item !== parseInt(eventDetail.id)
              );
              const updatedIndexingQueue = JSON.stringify(updatedArray);
              localStorage.setItem('indexingQueue', updatedIndexingQueue);
            }
          }
        });
      } catch (error) {
        enqueueSnackbar('Something went wrong!', { variant: 'error' });
      }
    };
    getEventDetails();
  }, [eventDetail.id, location.pathname]);

  return (
    <Page
      title="Events"
      sx={{ p: 1 }}
      header={true}
      headerTitle={
        <HeaderTitleWrapper>
          <Typography variant="h6">
            {!eventDetail.is_event_list ? 'Create Event' : 'Event'} &gt;&nbsp;
          </Typography>
          <Typography variant="h6" textTransform="capitalize">
            {eventDetail.eventType} &gt;&nbsp;
          </Typography>
          <SubTitle>{eventDetail.name}</SubTitle>
        </HeaderTitleWrapper>
      }
      headerAction={
        <Btn
          onClick={() => window.open(PATH_MAIN.previewEvent, '_blank')}
          color="secondary"
          size="small"
          startIcon={<VisibilityOutlinedIcon />}
        >
          Preview Event
        </Btn>
      }
    >
      <Grid container spacing={3}>
        <Grid item xs={6} sm={6} md={6} lg={6}>
          <div>
            <Title>Event</Title>
            <SubTitle>{eventDetail.name}</SubTitle>
          </div>
        </Grid>
        {user?.account_type !== CLIENT ? (
          <Grid item xs={6} sm={6} md={6} lg={6} textAlign="end">
            {eventDetail.event_status === PUBLISHED ? (
              <LoadingButton
                loading={loading}
                onClick={(): void => {
                  setUnpublishDialogOpen(true);
                }}
                variant="contained"
                color="error"
                size="small"
                startIcon={<IconPrevSVG />}
              >
                Unpublish Event
              </LoadingButton>
            ) : (
              <LoadingButton
                loading={loading}
                onClick={(): void => {
                  setPublishDialogOpen(true);
                  // setPublishStatusDialogOpen(true);
                }}
                variant="contained"
                size="small"
                endIcon={<IconNextSVG />}
              >
                Publish Event
              </LoadingButton>
            )}
          </Grid>
        ) : (
          <Grid item xs={6} sm={6} md={6} lg={6} textAlign="end">
            {eventDetail.event_status === PUBLISHED ? (
              <LoadingButton
                loading={loading}
                onClick={(): void => {
                  setUnpublishDialogOpen(true);
                }}
                variant="contained"
                color="error"
                size="small"
                startIcon={<IconPrevSVG />}
              >
                Unpublish Event
              </LoadingButton>
            ) : (
              <>
                <LoadingButton
                  loading={loading}
                  onClick={(): void => {
                    setPublishDialogOpen(true);
                  }}
                  variant="contained"
                  size="small"
                  endIcon={<IconNextSVG />}
                >
                  Publish Event
                </LoadingButton>
              </>
            )}
          </Grid>
        )}
      </Grid>

      <PublishStatusDialog
        isDialogOpen={publishStatusDialogOpen}
        onClose={() => {
          setPublishStatusDialogOpen(false);
        }}
        eventId={eventDetail.id}
        onSuccess={() => {
          enqueueSnackbar('Event Published Successfully', { variant: 'success' });
        }}
        showProgress={showProgress}
      />

      <ConfirmationDialog
        isDialogOpen={publishDialogOpen}
        buttonMainLabel="No, Save as draft"
        buttonSecondaryLabel="Yes, Publish"
        dialogContent="Are you sure you want to 
        publish the event?"
        dialogId="error-dialog-title"
        onClick={publishDialogHandler}
        onClose={() => setPublishDialogOpen(false)}
      />
      <ConfirmationDialog
        isDialogOpen={unpublishDialogOpen}
        buttonMainLabel="No, cancel"
        buttonSecondaryLabel="Yes, Unpublish"
        dialogContent="Are you sure you want to 
        unpublish the event?"
        dialogId="error-dialog-title"
        onClick={unpublishDialogHandler}
        onClose={() => setUnpublishDialogOpen(false)}
      />
      <PublishEventDrawerView
        openDrawer={publishDrawer}
        onClose={() => {
          setPublishDrawer(false);
        }}
      />

      <Accordion expanded={expanded === EVENTPANEL} onChange={handleAccordionChange(EVENTPANEL)}>
        <AccordionSummary
          expandIcon={<KeyboardArrowUpIcon color="secondary" />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Collapse>
            <Typography variant="h6">{expanded ? 'Collapse' : 'Expand'}</Typography>
          </Collapse>
        </AccordionSummary>
        <AccordionDetails>
          <Line />
          <Status>
            <Cell>
              <Title variant="h5">Venue</Title>
              <Text variant="h6">
                {eventDetail.venue ? eventDetail.venue : 'Venue not specified'}
              </Text>
            </Cell>
            <Hr />

            <Cell>
              <Title variant="h5">Date</Title>
              <Text variant="h6">{eventDetail.date ? eventDetail.date : 'Date not specified'}</Text>
            </Cell>
            <Hr />

            <Cell>
              <Title variant="h5">Status</Title>
              <Typography variant="h6" pt={2} color="info.main" textTransform="capitalize">
                {eventDetail.event_status}
              </Typography>
            </Cell>
          </Status>
        </AccordionDetails>
      </Accordion>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', overflowX: 'auto' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons={true}
          allowScrollButtonsMobile
          TabIndicatorProps={{
            style: {
              height: '5px',
              borderRadius: '1px',
            },
          }}
        >
          <Tab label="General Details" {...eventTabProps(0)} sx={{ px: isDesktop ? 3 : 2 }} />
          <Tab label="Upload Pictures" {...eventTabProps(1)} sx={{ px: isDesktop ? 2 : 3 }} />
          <Tab label="Choose Template" {...eventTabProps(2)} sx={{ px: isDesktop ? 2 : 2 }} />
          <Tab label="Privacy Settings" {...eventTabProps(3)} sx={{ px: isDesktop ? 3 : 2 }} />
          <Tab label="Share Event" {...eventTabProps(4)} sx={{ px: isDesktop ? 3 : 3 }} />
          <Tab label="Registered Guests" {...eventTabProps(5)} sx={{ px: isDesktop ? 2 : 2 }} />
          {eventDetail.event_status === PUBLISHED && (
            <Tab label="Insights" {...eventTabProps(6)} sx={{ px: isDesktop ? 2 : 2 }} />
          )}
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <WorkspaceDetailsView
          generalTabRedirect={handleNextRedirect}
          nextIndex={1}
          preRegistrationIndex={5}
        />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <UploadPicturesView uploadTemplateTabRedirect={handleNextRedirect} nextIndex={2} />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <ChooseTemplateView
          chooseTemplateTabRedirect={handleNextRedirect}
          nextIndex={3}
          prevIndex={1}
        />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <PrivacySettingsView privacyTabRedirect={handleNextRedirect} nextIndex={4} prevIndex={2} />
      </TabPanel>
      <TabPanel value={value} index={4}>
        <ShareEventView shareTabRedirect={handleNextRedirect} nextIndex={5} prevIndex={3} />
      </TabPanel>
      <TabPanel value={value} index={5}>
        <PreregisteredGuestsView
          preRegisterTabRedirect={handleNextRedirect}
          nextIndex={6}
          prevIndex={4}
        />
      </TabPanel>
      <TabPanel value={value} index={6}>
        <InsightsView />
      </TabPanel>
    </Page>
  );
}
