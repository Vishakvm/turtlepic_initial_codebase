import React, { useState, useEffect, useRef } from 'react';

import { CardActionArea, styled, Button, Grid, Typography, CardContent, Card } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router';
import { useSnackbar } from 'notistack';

import axios from 'src/utils/axios';
import CreateEventDrawerView from 'src/components/dashboard/CreateEventDrawerView';
import { eventDetails } from 'src/redux/slices/createEvent';
import IconGoSVG from 'src/assets/shared/svg/icon_go';
import { PATH_MAIN } from 'src/routes/paths';
import { useDispatch } from 'src/redux/store';
import { WORKSPACE } from 'src/utils/constants';

const EventCard = styled(Card)(({ theme }) => ({
  borderRadius: '4px',
  height: '11rem',
  background: theme.palette.grey[300],
  marginBottom: theme.spacing(2),
}));

const TitleWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
}));

const CardWrapper = styled('div')(({ theme }) => ({
  width: '360px',
  height: '160px',
  backgroundColor: theme.palette.grey[300],
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: theme.spacing(4.5),
  borderRadius: '4px',
  boxShadow: '0px 20px 60px rgba(0, 23, 28, 0.5)',
  cursor: 'pointer',
}));
const PlusIcon = styled(AddIcon)(({ theme }) => ({
  width: '2rem',
  height: '2rem',
}));

type EventDetailType = {
  name: string;
  date_display: string;
  venue: string;
  host_name: string;
  id: number;
  event_status: string;
  event_type: string;
  slug: string;
};
export default function EventList(): React.ReactElement {
  const [eventDetail, setEventDetail] = useState<EventDetailType[]>([]);
  const [eventDrawer, setEventDrawer] = useState(false);

  const isMounted = useRef(false);

  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  useEffect(() => {
    const getEventArea = async () => {
      try {
        await axios
          .post(`/api/events/search?limit=3`, {
            filters: [{ field: 'event_type', operator: '=', value: 'workspace' }],
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
    getEventArea();
    return () => {
      isMounted.current = true;
    };
  }, [enqueueSnackbar]);

  const handleEventClick = (
    eventName: string,
    eventDate: string,
    eventVenue: string,
    eventId: number,
    eventStatus: string,
    eventType: string,
    eventSlug: string
  ) => {
    dispatch(
      eventDetails({
        name: eventName,
        id: eventId,
        venue: eventVenue,
        date: eventDate,
        event_status: eventStatus,
        eventType: eventType,
        slug: eventSlug,
      })
    );
    eventType === WORKSPACE
      ? navigate(PATH_MAIN.createWorkspaceEvent)
      : navigate(PATH_MAIN.createClientEvent);
  };

  return (
    <>
      <TitleWrapper>
        <Typography variant="h3" pr={2}>
          Workspace Events
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
                    ele.slug
                  );
                }}
              >
                <CardActionArea>
                  <CardContent>
                    <Typography variant="h3" textTransform="capitalize">
                      {ele.name && ele.name}
                    </Typography>
                    <Typography py={0.4} color="grey.100" variant="h6" textTransform="capitalize">
                      {ele.date_display ? ele.date_display : 'Date not specified'}
                    </Typography>
                    <Typography textTransform="capitalize" py={0.4} color="grey.100" variant="h6">
                      {ele.venue ? ele.venue : 'Venue not specified'}
                    </Typography>
                    <Typography textTransform="capitalize" py={0.4} color="grey.100" variant="h6">
                      {ele.host_name && ele.host_name}
                    </Typography>

                    <Typography
                      mt={1}
                      color={ele.event_status === 'published' ? 'primary' : 'info.main'}
                      align="right"
                      variant="body1"
                      textTransform="capitalize"
                    >
                      {ele.event_status && ele.event_status}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </EventCard>
            </Grid>
          ))}
        </Grid>
      ) : (
        <CardWrapper
          onClick={() => {
            setEventDrawer(true);
          }}
        >
          <Button color="primary" size="small" startIcon={<PlusIcon />}>
            Start Creating Now
          </Button>
        </CardWrapper>
      )}

      <CreateEventDrawerView
        openDrawer={eventDrawer}
        onClose={() => {
          setEventDrawer(false);
        }}
      />
    </>
  );
}
