import React, { useState } from 'react';

import {
  Tabs,
  Tab,
  Box,
  Typography,
  Grid,
  Button,
  styled,
  LinearProgress,
  linearProgressClasses,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { useNavigate } from 'react-router';
import { useSnackbar } from 'notistack';

import ClientDetailsView from './views/ClientDetailsView';
import ChooseTemplateView from '../views/ChooseTemplateView';
import { EVENTPANEL, PUBLISHED, AGENCY, CLIENT, TRANSFERRED, ACCEPTED } from 'src/utils/constants';
import UploadPicturesView from '../views/UploadPicturesView';
import IconNextSVG from 'src/assets/shared/svg/IconNextSVG';
import { PATH_MAIN } from 'src/routes/paths';
import PrivacySettingsView from '../views/PrivacySettingsView';
import Page from 'src/components/Page';
import useResponsive from 'src/hooks/useResponsive';
import { dispatch, useSelector } from 'src/redux/store';
import InsightsView from '../workspace/views/Insights';
import axios from 'src/utils/axios';
import ApproveDialog from 'src/components/dialogs/ApproveDialog';
import useAuth from 'src/hooks/useAuth';
import IconPrevSVG from 'src/assets/shared/svg/IconPrevSVG';
import ConfirmationDialog from 'src/components/dialogs/ConfirmationDialog';
import PublishEventDrawerView from '../drawers/PublishEventDrawer';
import { successMessage } from 'src/redux/slices/successMessage';
import { eventDetails } from 'src/redux/slices/createEvent';
import { LoadingButton } from '@mui/lab';
import ShareEventView from '../workspace/views/ShareEventView';
import PreregisteredGuestsView from '../workspace/views/PreregisteredGuestsView';
import PublishStatusDialog from 'src/components/dialogs/PublishStatusDialog';

const Line = styled('div')(({ theme }) => ({
  border: `0.2px solid #6D6D6D`,
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
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(2, 0, 1, 0),
  },
}));

const StatusWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  [theme.breakpoints.down('lg')]: {
    flexDirection: 'column',
  },
}));
const StatusInnerWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
  },
}));

const Cell = styled('div')(({ theme }) => ({
  padding: theme.spacing(0.5, 3, 0.5, 0),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(0.5, 1.5, 0.5, 0),
  },
}));
const Hr = styled('div')(({ theme }) => ({
  border: '0.5px solid #6D6D6D',
  margin: theme.spacing(0, 4, 0, 0),
}));

const Btn = styled(Button)(({ theme }) => ({
  height: 'auto',
  margin: 0,
  padding: theme.spacing(0, 0.2, 0, 0.2),
}));
const Title = styled(Typography)(({ theme }) => ({
  color: theme.palette.grey[500],
  paddingBottom: theme.spacing(1),
}));

const Div = styled('div')(({ theme }) => ({
  background: theme.palette.grey[300],
  borderRadius: '3px',
}));

const HeaderTitleWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
}));
const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 5,
  borderRadius: 5,
  marginTop: theme.spacing(2),
  width: '9rem',
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[100],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: theme.palette.error.main,
  },
}));

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Div>{children}</Div>}
    </div>
  );
}

function eventTabProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function CreateClientView() {
  const [value, setValue] = useState(0);
  const [expanded, setExpanded] = useState<string | false>(EVENTPANEL);
  const [dialog, setDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [publishDrawer, setPublishDrawer] = React.useState(false);
  const [publishDialogOpen, setPublishDialogOpen] = useState<boolean>(false);
  const [unpublishDialogOpen, setUnpublishDialogOpen] = useState<boolean>(false);
  const [publishStatusDialogOpen, setPublishStatusDialogOpen] = useState<boolean>(false);

  const navigate = useNavigate();
  const isDesktop = useResponsive('up', 'lg');
  const eventDetail = useSelector((state: any) => state.createEvent.value);

  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuth();

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleRedirect = (index: number) => {
    setValue(index);
  };

  const handleAccordionChange =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
    };
  const handleTransferControl = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`/api/events/${eventDetail.id}/transfer`);
      const { message } = response.data;
      setDialog(false);
      enqueueSnackbar(message, { variant: 'success' });
      setLoading(false);
      navigate(PATH_MAIN.dashboard);
    } catch (error) {
      console.error(error);
      setLoading(false);
      setDialog(false);
      enqueueSnackbar(error.message, { variant: 'error' });
    }
  };

  const handlePublishEvent = async () => {
    setLoading(true);
    try {
      await axios.post(`/api/events/${eventDetail.id}/publish`).then((response) => {
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
        dispatch(successMessage({ message: message }));
        navigate(PATH_MAIN.success);
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
        enqueueSnackbar(message, { variant: 'success' });
        setLoading(false);
      });
    } catch (error) {
      setLoading(false);
      enqueueSnackbar(error.message, { variant: 'error' });
    }
  };

  const publishDialogHandler = () => {
    handlePublishEvent();

    setPublishDialogOpen(false);
  };

  const unpublishDialogHandler = () => {
    handleUnpublishEvent();
    setUnpublishDialogOpen(false);
  };

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
            {eventDetail.eventType}
            &nbsp;&gt;&nbsp;
          </Typography>
          <Typography variant="h6" color="primary" textTransform="capitalize">
            {eventDetail.name}
          </Typography>
        </HeaderTitleWrapper>
      }
      headerAction={
        <>
          {user?.account_type === AGENCY && (
            <Btn
              color="secondary"
              onClick={() => window.open(PATH_MAIN.previewEvent, '_blank')}
              size="small"
              startIcon={<VisibilityOutlinedIcon />}
            >
              Preview Event
            </Btn>
          )}
          {user?.account_type === CLIENT && (
            <Btn
              color="secondary"
              disabled={eventDetail.client_status !== TRANSFERRED}
              onClick={() => window.open(PATH_MAIN.previewEvent, '_blank')}
              size="small"
              startIcon={<VisibilityOutlinedIcon />}
            >
              Preview Event
            </Btn>
          )}
        </>
      }
    >
      <Grid container spacing={3}>
        <Grid item xs={6} sm={6} md={6} lg={6}>
          <div>
            <Typography variant="h4" color="grey.500">
              Event
            </Typography>
            <Typography variant="h3" color="primary">
              {eventDetail.name}
            </Typography>
          </div>
        </Grid>
        <Grid item xs={6} sm={6} md={6} lg={6} textAlign="end">
          {user?.account_type === AGENCY && (
            <>
              {eventDetail.client_status === ACCEPTED && (
                <LoadingButton
                  loading={loading}
                  onClick={() => setDialog(true)}
                  color="info"
                  variant="contained"
                  size="small"
                  endIcon={<IconNextSVG />}
                >
                  Transfer Control
                </LoadingButton>
              )}
              {(eventDetail.client_status !== ACCEPTED &&
                eventDetail.client_status !== TRANSFERRED) ||
                (eventDetail.upload_time_percent === '100' && (
                  <LoadingButton
                    loading={loading}
                    onClick={() => setDialog(true)}
                    color="info"
                    variant="contained"
                    size="small"
                    endIcon={<IconNextSVG />}
                    disabled
                  >
                    Transfer Control
                  </LoadingButton>
                ))}
              {eventDetail.client_status === TRANSFERRED && (
                <LoadingButton
                  loading={loading}
                  color="info"
                  variant="contained"
                  size="small"
                  endIcon={<IconNextSVG />}
                  disabled
                >
                  Transferred
                </LoadingButton>
              )}
            </>
          )}
          {user?.account_type === CLIENT &&
            eventDetail.eventType === CLIENT &&
            eventDetail.client_status === TRANSFERRED && (
              <>
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
                    Unpublisth Event
                  </LoadingButton>
                ) : (
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
                )}
              </>
            )}

          <ApproveDialog
            loading={loading}
            isDialogOpen={dialog}
            dialogId="error-dialog-title"
            onClose={() => setDialog(false)}
            onApprove={handleTransferControl}
            onReject={() => setDialog(false)}
            dialogContent="Are you sure you want to transfer the event?"
            btn1="No"
            btn2="Yes"
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
        </Grid>
      </Grid>

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
          <StatusWrapper>
            <Status>
              <Cell>
                <Title variant="h5">Venue</Title>
                <Typography variant="h6">
                  {eventDetail.venue ? eventDetail.venue : 'Venue not specified'}
                </Typography>
              </Cell>
              <Hr />

              <Cell>
                <Title variant="h5">Date</Title>
                <Typography variant="h6">
                  {eventDetail.date ? eventDetail.date : 'Date not specified'}
                </Typography>
              </Cell>
              <Hr />

              <Cell>
                <Title variant="h5">Status</Title>
                <Typography variant="h6" color="info.main" textTransform="capitalize">
                  {eventDetail.event_status}
                </Typography>
              </Cell>

              <Hr />
            </Status>
            <StatusInnerWrapper>
              <Status>
                <Cell>
                  <Title variant="h5">Client</Title>
                  <Typography variant="h6" textTransform="capitalize">
                    {eventDetail.name}
                  </Typography>
                </Cell>
                <Hr />

                <Cell>
                  <Title variant="h5">Client’s email</Title>
                  <Typography variant="h6">{eventDetail.client_email}</Typography>
                </Cell>
                <Hr />
              </Status>
              <Status>
                <Cell>
                  <Title variant="h5">Request Status</Title>
                  <Typography variant="h6" textTransform="capitalize">
                    {eventDetail.client_status}
                  </Typography>
                </Cell>

                {eventDetail.upload_time_left && (
                  <>
                    <Hr />
                    <Cell>
                      <Typography variant="h5">{eventDetail.upload_time_left}</Typography>
                      <BorderLinearProgress
                        variant="determinate"
                        value={parseInt(eventDetail.upload_time_percent)}
                      />
                    </Cell>
                  </>
                )}
              </Status>
            </StatusInnerWrapper>
          </StatusWrapper>
        </AccordionDetails>
      </Accordion>

      {user?.account_type === AGENCY && eventDetail.client_status !== TRANSFERRED && (
        <>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', overflowX: 'auto' }}>
            <Tabs
              value={value}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons={false}
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
              {eventDetail.event_status === PUBLISHED && (
                <Tab label="Insights" {...eventTabProps(4)} sx={{ px: isDesktop ? 2 : 2 }} />
              )}
            </Tabs>
          </Box>
          <TabPanel value={value} index={0}>
            <ClientDetailsView generalTabRedirect={handleRedirect} nextIndex={1} />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <UploadPicturesView uploadTemplateTabRedirect={handleRedirect} nextIndex={2} />
          </TabPanel>
          <TabPanel value={value} index={2}>
            <ChooseTemplateView
              chooseTemplateTabRedirect={handleRedirect}
              nextIndex={3}
              prevIndex={1}
            />
          </TabPanel>
          <TabPanel value={value} index={3}>
            <PrivacySettingsView privacyTabRedirect={handleRedirect} nextIndex={0} prevIndex={2} />
          </TabPanel>
          <TabPanel value={value} index={4}>
            <InsightsView />
          </TabPanel>
        </>
      )}
      {user?.account_type === AGENCY && eventDetail.client_status === TRANSFERRED && (
        <>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', overflowX: 'auto' }}>
            <Tabs
              value={value}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons={false}
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

              {eventDetail.event_status === PUBLISHED && (
                <Tab label="Insights" {...eventTabProps(2)} sx={{ px: isDesktop ? 2 : 2 }} />
              )}
            </Tabs>
          </Box>
          <TabPanel value={value} index={0}>
            <ClientDetailsView generalTabRedirect={handleRedirect} nextIndex={1} />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <UploadPicturesView uploadTemplateTabRedirect={handleRedirect} nextIndex={2} />
          </TabPanel>

          <TabPanel value={value} index={2}>
            <InsightsView />
          </TabPanel>
        </>
      )}

      {user?.account_type === CLIENT && eventDetail.client_status !== TRANSFERRED && (
        <>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', overflowX: 'auto' }}>
            <Tabs
              value={value}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons={false}
              allowScrollButtonsMobile
              TabIndicatorProps={{
                style: {
                  height: '5px',
                  borderRadius: '1px',
                },
              }}
            >
              <Tab label="General Details" {...eventTabProps(0)} sx={{ px: isDesktop ? 3 : 2 }} />
              {eventDetail.event_status === PUBLISHED && (
                <Tab label="Insights" {...eventTabProps(4)} sx={{ px: isDesktop ? 2 : 2 }} />
              )}
            </Tabs>
          </Box>
          <TabPanel value={value} index={0}>
            <ClientDetailsView generalTabRedirect={handleRedirect} nextIndex={1} />
          </TabPanel>
        </>
      )}
      {user?.account_type === CLIENT && eventDetail.client_status === TRANSFERRED && (
        <>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', overflowX: 'auto' }}>
            <Tabs
              value={value}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons={false}
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
            <ClientDetailsView generalTabRedirect={handleRedirect} nextIndex={1} />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <UploadPicturesView uploadTemplateTabRedirect={handleRedirect} nextIndex={2} />
          </TabPanel>
          <TabPanel value={value} index={2}>
            <ChooseTemplateView
              chooseTemplateTabRedirect={handleRedirect}
              nextIndex={3}
              prevIndex={1}
            />
          </TabPanel>
          <TabPanel value={value} index={3}>
            <PrivacySettingsView privacyTabRedirect={handleRedirect} nextIndex={4} prevIndex={2} />
          </TabPanel>
          <TabPanel value={value} index={4}>
            <ShareEventView shareTabRedirect={handleRedirect} nextIndex={5} prevIndex={3} />
          </TabPanel>
          <TabPanel value={value} index={5}>
            <PreregisteredGuestsView
              preRegisterTabRedirect={handleRedirect}
              nextIndex={6}
              prevIndex={4}
            />
          </TabPanel>
          <TabPanel value={value} index={6}>
            <InsightsView />
          </TabPanel>
        </>
      )}
    </Page>
  );
}
