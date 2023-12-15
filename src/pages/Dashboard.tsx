import React, { useEffect, useRef, useState } from 'react';

import { styled, Typography, Button, Card, Grid, CardActionArea, CardContent } from '@mui/material';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import AddIcon from '@mui/icons-material/Add';
import { AGENCY, CLIENT, VERIFIED, INDIVIDUAL, WORKSPACE, TRANSFERRED } from 'src/utils/constants';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { eventDetails } from 'src/redux/slices/createEvent';

import CreateEventDrawerView from 'src/components/dashboard/CreateEventDrawerView';
import EventCardList from 'src/components/dashboard/elements/AgencyEventCardList';
import IconGoSVG from 'src/assets/shared/svg/icon_go';
import Page from '../components/Page';
import { PATH_MAIN } from 'src/routes/paths';
import InsightsList from 'src/components/dashboard/elements/InsightsList';
import useAuth from 'src/hooks/useAuth';
import IndividualEventCreated from 'src/components/dashboard/elements/IndividualEventsCreated';
import ClientEvents from 'src/components/dashboard/elements/ClientEvents';
import ClientEventReceived from 'src/components/dashboard/elements/ClientEventsReceived';
import SuccessDialog from 'src/components/dialogs/SuccessDialog';
import { useSnackbar } from 'notistack';
import axios from 'src/utils/axios';
import { useDispatch } from 'src/redux/store';

type EventDetailType = {
  name: string;
  date_display: string;
  venue: string;
  host_name: string;
  id: number;
  event_status: string;
  client_status: string;
  event_type: string;
  slug: string;
  client: {
    email: string;
  };
  upload_time_left: string;
  upload_time_percent: string;
};

const EventWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  width: '100%',
  marginBottom: theme.spacing(3),
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    width: 'auto',
  },
}));

const ButtonWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'flex-end',
  width: '100%',
}));

export const TitleWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
}));

export const CardWrapper = styled('div')(({ theme }) => ({
  width: '360px',
  height: '160px',
  backgroundColor: theme.palette.grey[300],
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
  borderRadius: '4px',
  boxShadow: '0px 20px 60px rgba(0, 23, 28, 0.5)',
  cursor: 'pointer',
}));

const VerificationWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#00171C',
  borderRadius: '4px',
  padding: theme.spacing(0, 2),
  width: '100%',
}));
const WarningIcon = styled(ReportProblemIcon)(({ theme }) => ({
  width: '1.3rem',
  height: '1.3rem',
  color: theme.palette.error.dark,
  marginRight: theme.spacing(1.5),
}));

export const PlusIcon = styled(AddIcon)(({ theme }) => ({
  fontSize: '1.6rem !important',
}));

export const EventCard = styled(Card)(({ theme }) => ({
  borderRadius: '4px',
  height: '11rem',
  background: theme.palette.grey[300],
  marginBottom: theme.spacing(2),
}));

export default function DashboardView(): React.ReactElement {
  const [eventDrawer, setEventDrawer] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [eventDetail, setEventDetail] = useState<EventDetailType[]>([]);
  const { user } = useAuth();
  const navigate = useNavigate();
  const isMounted = useRef(false);
  const { enqueueSnackbar } = useSnackbar();

  const dispatch = useDispatch();

  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const id = searchParams.get('checkout_success');
    if (id !== null) {
      setShowSuccess(true);
      if (id) {
        searchParams.delete('checkout_success');

        setSearchParams(searchParams);
      }
    }
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    const getEventArea = async () => {
      try {
        await axios
          .post(`/api/events/search?limit=3`, {
            filters: [{ field: 'event_type', operator: '=', value: 'client' }],
          })
          .then((response) => {
            if (!isMounted.current) {
              const { data } = response.data;
              setEventDetail(data);
            }
          });
      } catch (error) {
        enqueueSnackbar(error.message, { variant: 'error' });
      }
    };
    if (user?.account_type === AGENCY) {
      getEventArea();
    }

    return () => {
      isMounted.current = true;
    };
  }, [enqueueSnackbar, user]);

  const handleEventClick = (
    eventName: string,
    eventDate: string,
    eventVenue: string,
    eventId: number,
    eventStatus: string,
    eventType: string,
    eventSlug: string,
    clientStatus: string,
    clientEmail: string,
    uploadTimeLeft: string,
    uploadTimePercent: string
  ) => {
    dispatch(
      eventDetails({
        name: eventName,
        date: eventDate,
        venue: eventVenue,
        id: eventId,
        event_status: eventStatus,
        eventType: eventType,
        slug: eventSlug,
        client_status: clientStatus,
        client_email: clientEmail,
        upload_time_left: uploadTimeLeft,
        upload_time_percent: uploadTimePercent,
      })
    );
    eventType === WORKSPACE
      ? navigate(PATH_MAIN.createWorkspaceEvent)
      : navigate(PATH_MAIN.createClientEvent);
  };

  return (
    <Page
      title="Dashboard"
      header={true}
      headerTitle={
        <Typography color="primary" variant="h6">
          Home
        </Typography>
      }
    >
      <SuccessDialog
        isDialogOpen={showSuccess}
        dialogContent="Payment Successfull"
        dialogId="error-dialog-title"
        onClose={() => setShowSuccess(false)}
      />
      <EventWrapper>
        {user?.account_type === AGENCY && user?.kyc_status !== VERIFIED && (
          <VerificationWrapper>
            <WarningIcon />
            <Typography variant="h6" pr={2} fontWeight="300">
              Unlock other features after verifying KYC details!
            </Typography>
            <Button
              color="secondary"
              size="small"
              onClick={() => navigate(`${PATH_MAIN.branding}?to=kyc`)}
            >
              Apply Now
            </Button>
          </VerificationWrapper>
        )}
        <ButtonWrapper>
          <Button
            color="primary"
            size="medium"
            variant="contained"
            onClick={() => {
              setEventDrawer(true);
            }}
            startIcon={<PlusIcon />}
          >
            Create Event
          </Button>
        </ButtonWrapper>

        <CreateEventDrawerView
          openDrawer={eventDrawer}
          onClose={() => {
            setEventDrawer(false);
          }}
        />
      </EventWrapper>

      {user?.account_type === AGENCY && <EventCardList />}
      {user?.account_type === INDIVIDUAL && <IndividualEventCreated />}
      {user?.account_type === CLIENT && <ClientEvents />}
      {user?.account_type === CLIENT && <ClientEventReceived />}
      {user?.account_type === AGENCY && (
        <React.Fragment>
          <TitleWrapper>
            <Typography variant="h3" pr={2}>
              Client Events
            </Typography>

            <Button
              onClick={() => navigate(PATH_MAIN.events)}
              color="primary"
              size="small"
              endIcon={<IconGoSVG color="#7DD78D" />}
            >
              View All
            </Button>
          </TitleWrapper>
          {eventDetail.length !== 0 ? (
            <Grid container spacing={2}>
              {eventDetail.map((ele, i) => (
                <Grid item md={4} sm={6} xs={12} key={i}>
                  <EventCard
                    onClick={(): void => {
                      handleEventClick(
                        ele.name,
                        ele.date_display,
                        ele.venue,
                        ele.id,
                        ele.event_status,
                        ele.event_type,
                        ele.slug,
                        ele.client_status,
                        ele.client.email,
                        ele.upload_time_left,
                        ele.upload_time_percent
                      );
                    }}
                  >
                    <CardActionArea>
                      <CardContent>
                        <Typography variant="h3" textTransform="capitalize">
                          {ele.name && ele.name}
                        </Typography>
                        <Typography
                          py={0.4}
                          color="grey.100"
                          variant="h6"
                          textTransform="capitalize"
                        >
                          {ele.date_display ? ele.date_display : 'Date not specified'}
                        </Typography>
                        <Typography
                          textTransform="capitalize"
                          py={0.4}
                          color="grey.100"
                          variant="h6"
                        >
                          {ele.venue ? ele.venue : 'Venue not specified'}
                        </Typography>
                        <Typography
                          textTransform="capitalize"
                          py={0.4}
                          color="grey.100"
                          variant="h6"
                        >
                          {ele.host_name && ele.host_name}
                        </Typography>
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            marginTop: '0.5rem',
                          }}
                        >
                          <Typography
                            color={ele.event_status === 'published' ? 'primary' : 'info.main'}
                            variant="body1"
                            textTransform="capitalize"
                          >
                            {ele.event_status && ele.event_status}
                          </Typography>
                          <Typography
                            color={ele.client_status === TRANSFERRED ? 'primary' : 'grey.100'}
                            variant="body1"
                            textTransform="capitalize"
                          >
                            {ele.client_status && ele.client_status}
                          </Typography>
                        </div>
                      </CardContent>
                    </CardActionArea>
                  </EventCard>
                </Grid>
              ))}
            </Grid>
          ) : (
            <CardWrapper>
              <Button color="secondary" size="small">
                No Data Found
              </Button>
            </CardWrapper>
          )}
        </React.Fragment>
      )}
      <React.Fragment>
        <InsightsList />
      </React.Fragment>
    </Page>
  );
}
