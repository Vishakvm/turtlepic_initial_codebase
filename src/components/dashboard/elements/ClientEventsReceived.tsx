import React, { useState, useEffect, useRef } from 'react';

import { CardActionArea, Button, Grid, Typography } from '@mui/material';
import CardContent from '@mui/material/CardContent';
import { useNavigate } from 'react-router';
import { useSnackbar } from 'notistack';

import { TitleWrapper, EventCard, CardWrapper } from 'src/pages/Dashboard';
import axios from 'src/utils/axios';
import { eventDetails } from 'src/redux/slices/createEvent';
import IconGoSVG from 'src/assets/shared/svg/icon_go';
import { PATH_MAIN } from 'src/routes/paths';
import { useDispatch, useSelector } from 'src/redux/store';
import ApproveDialog from 'src/components/dialogs/ApproveDialog';
import { ACCEPTED, PUBLISHED, REJECTED, REQUESTED, TRANSFERRED } from 'src/utils/constants';

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
};

export default function ClientEventReceived(): React.ReactElement {
  const [eventIndRceDetail, setEventDetail] = useState<EventDetailType[]>([]);
  const [dialog, setDialog] = useState(false);
  const [rejectLoader, setRejectLoader] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [eventId, setEventId] = useState<number>(0);

  const isMounted = useRef(false);

  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const event = useSelector((state) => state.createEvent.value);

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
  useEffect(() => {
    getEventArea();
    return () => {
      isMounted.current = true;
    };
  }, [enqueueSnackbar]);

  const approveEvent = async (response: string) => {
    if (response === ACCEPTED) {
      setLoading(true);
    }
    if (response === REJECTED) {
      setRejectLoader(true);
    }
    const approveData = new FormData();
    const answer = response;
    approveData.append('response_status', answer);
    try {
      const response = await axios.post(`/api/events/${eventId}/client`, approveData);
      const { message } = response.data;
      enqueueSnackbar(message, { variant: 'success' });
      setDialog(false);
      setRejectLoader(false);
      setLoading(false);
      switch (answer) {
        case ACCEPTED:
          const ID = parseInt(event.id);
          const status = ACCEPTED;
          handleAcceptEventClick(
            event.name,
            event.date,
            event.venue,
            ID,
            event.event_status,
            status,
            event.eventType,
            event.slug,
            event.client_email
          );
          navigate(PATH_MAIN.createClientEvent);
          break;
        case REJECTED:
          getEventArea();
          break;
        default:
          break;
      }
    } catch (error) {
      setRejectLoader(false);
      setLoading(false);
      setDialog(false);
      enqueueSnackbar(error.message, { variant: 'error' });
    }
  };

  const handleIndRceEventClick = (
    eventName: string,
    eventDate: string,
    eventVenue: string,
    eventId: number,
    eventStatus: string,
    clientStatus: string,
    eventType: string,
    eventSlug: string,
    clientEmail: string
  ) => {
    dispatch(
      eventDetails({
        name: eventName,
        id: eventId,
        venue: eventVenue,
        date: eventDate,
        event_status: eventStatus,
        client_status: clientStatus,
        eventType: eventType,
        slug: eventSlug,
        client_email: clientEmail,
      })
    );
    if (clientStatus === ACCEPTED || clientStatus === TRANSFERRED) {
      navigate(PATH_MAIN.createClientEvent);
    }
  };

  const handleAcceptEventClick = (
    eventName: string,
    eventDate: string,
    eventVenue: string,
    eventId: number,
    eventStatus: string,
    clientStatus: string,
    eventType: string,
    eventSlug: string,
    clientEmail: string
  ) => {
    dispatch(
      eventDetails({
        name: eventName,
        id: eventId,
        venue: eventVenue,
        date: eventDate,
        event_status: eventStatus,
        client_status: clientStatus,
        eventType: eventType,
        slug: eventSlug,
        client_email: clientEmail,
      })
    );
  };

  return (
    <>
      <TitleWrapper>
        <Typography variant="h3" pr={2}>
          Events Received
        </Typography>

        <Button
          color="primary"
          size="small"
          endIcon={<IconGoSVG color="#7DD78D" />}
          onClick={() => navigate(PATH_MAIN.events)}
        >
          View All
        </Button>
      </TitleWrapper>

      {eventIndRceDetail.length !== 0 ? (
        <Grid container spacing={2}>
          {eventIndRceDetail.map((ele, i) => (
            <Grid item md={4} sm={6} xs={12} key={i}>
              <EventCard>
                <CardActionArea
                  onClick={() => {
                    if (ele.client_status === REQUESTED) {
                      setEventId(ele.id);
                      setDialog(true);
                      handleAcceptEventClick(
                        ele.name,
                        ele.date_display,
                        ele.venue,
                        ele.id,
                        ele.event_status,
                        ele.client_status,
                        ele.event_type,
                        ele.slug,
                        ele.client.email
                      );
                    } else {
                      handleIndRceEventClick(
                        ele.name,
                        ele.date_display,
                        ele.venue,
                        ele.id,
                        ele.event_status,
                        ele.client_status,
                        ele.event_type,
                        ele.slug,
                        ele.client.email
                      );
                    }
                  }}
                >
                  <CardContent sx={{ px: 3, pt: 2, pb: 0 }}>
                    <Typography variant="h3" textTransform="capitalize">
                      {ele.name && ele.name}
                    </Typography>
                    <Typography py={0.4} color="grey.100" variant="h6">
                      {ele.date_display ? ele.date_display : 'Date not specified'}
                    </Typography>
                    <Typography textTransform="capitalize" py={0.4} color="grey.100" variant="h6">
                      {ele.venue ? ele.venue : 'Venue not specified'}
                    </Typography>
                    <Typography textTransform="capitalize" py={0.6} color="grey.100" variant="h6">
                      {ele.host_name && ele.host_name}
                    </Typography>
                    {ele.client_status && ele.client_status !== REQUESTED && (
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography
                          my={2}
                          color={ele.event_status === PUBLISHED ? 'primary' : 'info.main'}
                          align="right"
                          variant="body1"
                          textTransform="capitalize"
                        >
                          {ele.event_status && ele.event_status}
                        </Typography>
                        <Typography
                          my={2}
                          color={ele.client_status === TRANSFERRED ? 'primary' : 'grey.100'}
                          align="right"
                          variant="body1"
                          textTransform="capitalize"
                        >
                          {ele.client_status && ele.client_status}
                        </Typography>
                      </div>
                    )}
                    {ele.client_status && ele.client_status === REQUESTED && (
                      <div
                        style={{
                          marginTop: '15px',
                          display: 'flex',
                          alignItems: 'end',
                          justifyContent: 'right',
                        }}
                      >
                        <Typography color="secondary">Take Action</Typography>
                        <IconGoSVG color="#02c2d9" />
                      </div>
                    )}
                  </CardContent>
                </CardActionArea>
              </EventCard>
              <ApproveDialog
                loading={loading}
                rejectLoader={rejectLoader}
                isDialogOpen={dialog}
                dialogId="error-dialog-title"
                onClose={() => setDialog(false)}
                onApprove={() => approveEvent(ACCEPTED)}
                onReject={() => approveEvent(REJECTED)}
                dialogContent="Are you sure you want to approve the event?"
                btn1="No, disapprove"
                btn2="Approve event"
                para="Note: After approving this event, photographer will have 7 days to upload pictures and videos from the event. After that, he will be able to transfer control of the event and you’ll have the complete access."
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        <CardWrapper>
          <Typography color="secondary" variant="h6">
            No Data Found
          </Typography>
        </CardWrapper>
      )}
    </>
  );
}
