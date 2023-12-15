/*
 * Create Event Footer View
 *
 */
import React, { useState } from 'react';

import { Grid, Button, styled } from '@mui/material';
import { useNavigate } from 'react-router';
import { useSnackbar } from 'notistack';

import axios from 'src/utils/axios';
import ConfirmationDialog from 'src/components/dialogs/ConfirmationDialog';
import { PATH_MAIN } from 'src/routes/paths';
import { useSelector } from 'src/redux/store';
import { AGENCY, CLIENT, TRANSFERRED, WORKSPACE } from 'src/utils/constants';
import useAuth from 'src/hooks/useAuth';

type FooterProps = {
  footerAction: React.ReactElement;
};

const BottomWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 2, 0, 2),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(0, 1, 0, 1),
  },
}));

const Line = styled(Grid)(({ theme }) => ({
  background: theme.palette.grey[900],
  height: '14px',
}));

export default function CreateEventFooterView(props: FooterProps): React.ReactElement {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const { user } = useAuth();

  const eventDetails = useSelector((state) => state.createEvent.value);

  const dialogHandler = () => {
    handleDeleteEvent();
    setDialogOpen(false);
  };

  const handleDeleteEvent = async () => {
    try {
      const response = await axios.delete(`/api/events/${eventDetails.id}`);
      const { message } = response.data;
      enqueueSnackbar(message, { variant: 'success' });
      let keysToRemove = ['redux-createEvent', 'redux-folder'];
      keysToRemove.forEach((k) => localStorage.removeItem(k));
      navigate(PATH_MAIN.dashboard);
    } catch (error) {
      console.error(error);
      enqueueSnackbar(error.message, { variant: 'error' });
    }
  };
  return (
    <>
      <Line />
      <Grid item xs={12} sm={12} md={12}>
        <BottomWrapper>
          {eventDetails.eventType === WORKSPACE && (
            <Button
              size="small"
              color="error"
              onClick={(): void => {
                setDialogOpen(true);
              }}
            >
              Delete Event
            </Button>
          )}
          {user?.account_type === AGENCY && eventDetails.eventType !== WORKSPACE && (
            <Button
              size="small"
              color="error"
              disabled={eventDetails.client_status === TRANSFERRED}
              onClick={(): void => {
                setDialogOpen(true);
              }}
            >
              Delete Event
            </Button>
          )}
          {user?.account_type === CLIENT && eventDetails.eventType !== WORKSPACE && (
            <Button
              size="small"
              color="error"
              disabled={eventDetails.client_status !== TRANSFERRED}
              onClick={(): void => {
                setDialogOpen(true);
              }}
            >
              Delete Event
            </Button>
          )}
          {props.footerAction}
        </BottomWrapper>
      </Grid>
      <ConfirmationDialog
        isDialogOpen={dialogOpen}
        buttonMainLabel="No, save in drafts"
        buttonSecondaryLabel="Yes, discard"
        dialogContent="Are you sure you want to Cancel and discard event?"
        dialogId="error-dialog-title"
        onClick={dialogHandler}
        onClose={() => setDialogOpen(false)}
      />
    </>
  );
}
