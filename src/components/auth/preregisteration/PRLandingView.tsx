/*
 * PRLanding Page
 *
 */
import React, { useEffect, useRef, useState } from 'react';

import { styled, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';

import { EventDetailBox, MiddleBorder } from 'src/assets/shared/styles/SharedStylesComponent';
import axios from 'src/utils/axios';
import PRlanding from 'src/assets/shared/images/PRlanding.png';
import SignupBodyWrapper from 'src/components/auth/elements/SignupBodyWrapper';

const Wrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(8),
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(6, 2),
  },
}));

type EventDetailType = {
  name: string;
  date_display: string;
  venue: string;
  host_name: string;
  id: number;
  slug: string;
};

export default function PRLandingView(): React.ReactElement {
  const [eventDetails, setEventDetails] = useState<EventDetailType>({
    name: '',
    date_display: '',
    venue: '',
    host_name: '',
    id: 0,
    slug: '',
  });

  const isMounted = useRef(false);

  let { event } = useParams();

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const getEventDetails = async () => {
      try {
        await axios.get(`/api/events/${event}/pre-registration`).then((response) => {
          if (!isMounted.current) {
            const { data } = response.data;

            setEventDetails(data);
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
  }, [enqueueSnackbar, event]);
  return (
    <SignupBodyWrapper
      image={PRlanding}
      title={'Login'}
      children={
        <Wrapper>
          <Typography variant="h1" align="center" gutterBottom mb={2}>
            Welcome to TurtlePic
          </Typography>
          <Typography variant="h5" align="center">
            This is a private event.
          </Typography>
          <Typography variant="h5" align="center" mb={2}>
            Please contact the host to access.
          </Typography>
          <Typography
            align="center"
            color="secondary"
            variant="h2"
            mb={2}
            textTransform="capitalize"
          >
            {eventDetails.name && eventDetails.name}
          </Typography>
          {(eventDetails.date_display || eventDetails.venue) && (
            <EventDetailBox
              sx={{
                justifyContent:
                  eventDetails.date_display && eventDetails.venue ? 'space-between' : 'center',
              }}
            >
              <Typography py={1} variant="h6">
                {eventDetails.date_display && eventDetails.date_display}
              </Typography>
              {eventDetails.date_display && eventDetails.venue && <MiddleBorder />}

              <Typography py={1} variant="h6">
                {eventDetails.venue && eventDetails.venue}
              </Typography>
            </EventDetailBox>
          )}
          <Typography variant="h6" color="primary" align="center">
            Hosted by - {eventDetails.host_name && eventDetails.host_name}
          </Typography>
        </Wrapper>
      }
    />
  );
}
