import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { FormProvider, RHFTextField, RHFDatePicker } from 'src/components/hook-form';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import IconBackSVG from 'src/assets/shared/svg/icon_back';
import {
  ToggleButtonGroup,
  Typography,
  ToggleButton,
  Button,
  styled,
  Drawer,
  Box,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useSnackbar } from 'notistack';

import { WORKSPACE, CLIENT, AGENCY } from 'src/utils/constants';

import axios from 'src/utils/axios';
import { eventDetails } from 'src/redux/slices/createEvent';
import IconTickSVG from 'src/assets/shared/svg/icon_tick';
import { PATH_MAIN } from 'src/routes/paths';
import useResponsive from 'src/hooks/useResponsive';
import useAuth from 'src/hooks/useAuth';
import { useDispatch } from 'src/redux/store';

type DrawerProps = {
  openDrawer: boolean;
  onClose: () => void;
};

type FormValuesProps = {
  afterSubmit: string;
  name: string;
  venue: string;
  client_name: string;
  client_email: string;
  date_start: Date;
  date_end: Date;
};

const Wrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 20, 0, 20),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(0, 2, 0, 2),
  },
}));
const ToggleBtnGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  background: 'none',
  border: 'none',
  padding: theme.spacing(3, 0, 6, 0),
  '& .MuiToggleButton-root': {
    margin: theme.spacing(0, 4.5, 0, 4.5),
  },
  '& .MuiToggleButtonGroup-grouped:not(:first-of-type)': {
    marginRight: 0,
  },
  '.MuiToggleButtonGroup-grouped:not(:last-of-type)': {
    marginLeft: 0,
  },

  [theme.breakpoints.down('sm')]: {
    '& .MuiToggleButtonGroup-grouped:not(:first-of-type)': {
      marginLeft: '26px',
      marginRight: 0,
    },
    '.MuiToggleButtonGroup-grouped:not(:last-of-type)': {
      marginLeft: 0,
    },
  },
  [theme.breakpoints.up('lg')]: {
    '& .MuiToggleButtonGroup-grouped:not(:first-of-type)': {
      marginLeft: '65px',
      marginRight: 0,
    },
    '.MuiToggleButtonGroup-grouped:not(:last-of-type)': {
      marginLeft: 0,
    },
  },
}));

const ToggleBtn = styled(ToggleButton)(({ theme }) => ({
  width: '150px',
  height: '58px',
  position: 'relative',
  [theme.breakpoints.down('sm')]: {
    width: '110px',
    height: '50px',
  },
  '&.MuiToggleButtonGroup-grouped': {
    borderRadius: '4px !important',
    border: '1px solid #6d6d6d !important',
    background: 'none !important',
  },
  '&.MuiToggleButtonGroup-grouped:focus': {
    border: '1px solid #7dd78d !important',
  },
}));

const TickIcon = styled('div')(({ theme }) => ({
  position: 'absolute',
  top: '-1.7rem',
  right: '-1.7rem',
}));

export default function CreateEventDrawerView(props: DrawerProps): React.ReactElement {
  const [eventFor, setEventFor] = useState(WORKSPACE);

  const isDesktop = useResponsive('up', 'lg');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const WorkspaceSchema = Yup.object().shape({
    name: Yup.string().required('Field is required'),
  });

  const ClientSchema = Yup.object().shape({
    name: Yup.string().required('Field is required'),
    client_name: Yup.string().required('Field is required'),
    client_email: Yup.string()
      .email('Email must be a valid email address')
      .required('Field is required')
      .trim(),
  });

  const defaultValues = {
    name: '',
    venue: '',
    client_name: '',
    client_email: '',
  };

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(eventFor === CLIENT ? ClientSchema : WorkspaceSchema),
    defaultValues,
  });
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data: FormValuesProps) => {
    const { name } = data;
    const { venue } = data;
    const { client_name } = data;
    const { client_email } = data;
    const { date_start } = data;
    const { date_end } = data;
    const event_type = eventFor;
    if (data.date_start > data.date_end) {
      enqueueSnackbar('Start date should be less than end date!', { variant: 'error' });
    } else {
      if (eventFor === CLIENT) {
        try {
          const response = await axios.post('/api/events', {
            name,
            venue,
            date_start,
            date_end,
            event_type,
            client_email,
            client_name,
          });
          const { message, data } = response.data;
          dispatch(
            eventDetails({
              name: data.name,
              id: data.id,
              venue: data.venue,
              date: data.date_display,
              event_status: data.event_status,
              eventType: data.event_type,
              client_name: data.client.name,
              client_email: data.client.email,
              client_status: data.client_status,
              slug: data.slug,
            })
          );
          enqueueSnackbar(message, { variant: 'success' });
          data.event_type === WORKSPACE
            ? navigate(PATH_MAIN.createWorkspaceEvent)
            : navigate(PATH_MAIN.createClientEvent);
        } catch (error) {
          enqueueSnackbar(error.message, { variant: 'error' });
        }
      } else {
        try {
          const response = await axios.post('/api/events', {
            name,
            venue,
            date_start,
            date_end,
            event_type,
          });
          const { message } = response.data;
          const { data } = response.data;
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
          data.event_type === WORKSPACE
            ? navigate(PATH_MAIN.createWorkspaceEvent)
            : navigate(PATH_MAIN.createClientEvent);
        } catch (error) {
          console.error(error);
          enqueueSnackbar(error.message, { variant: 'error' });
        }
      }
    }
  };

  const handleChange = (event: React.MouseEvent<HTMLElement>, selected: string) => {
    if (selected !== null) {
      setEventFor(selected);
    }
  };
  return (
    <Drawer open={props.openDrawer} anchor={'right'}>
      <Box
        role="presentation"
        sx={{
          width: isDesktop ? '720px' : '100%',
          maxHeight: '100%',
          overflow: 'auto',
          overflowX: 'hidden',
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
          '&::-webkit-scrollbar-thumb': {
            borderRadius: '10px',
            backgroundColor: '#7dd78d',
          },
        }}
      >
        <Button sx={{ color: '#fff', mx: 3 }} onClick={props.onClose} startIcon={<IconBackSVG />}>
          Back
        </Button>
        <Wrapper>
          <Typography py={2} align="center" variant="h2">
            {user?.account_type === AGENCY ? 'Create event for' : 'Create Event'}
          </Typography>
          <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            {user?.account_type === AGENCY && (
              <ToggleBtnGroup color="primary" exclusive value={eventFor} onChange={handleChange}>
                <ToggleBtn value={WORKSPACE}>
                  <Typography
                    variant={eventFor === WORKSPACE ? 'h4' : 'body1'}
                    align="center"
                    color={eventFor === WORKSPACE ? '#7dd78d' : '#fff'}
                  >
                    Workspace
                  </Typography>
                  {eventFor === WORKSPACE ? (
                    <TickIcon>
                      <IconTickSVG />
                    </TickIcon>
                  ) : null}
                </ToggleBtn>
                <ToggleBtn value={CLIENT}>
                  <Typography
                    variant={eventFor === CLIENT ? 'h4' : 'body1'}
                    align="center"
                    color={eventFor === CLIENT ? '#7dd78d' : '#fff'}
                  >
                    Client
                  </Typography>
                  {eventFor === CLIENT ? (
                    <TickIcon>
                      <IconTickSVG />
                    </TickIcon>
                  ) : null}
                </ToggleBtn>
              </ToggleBtnGroup>
            )}

            <RHFTextField name="name" label="Event Name*" autoFocus />
            {eventFor === CLIENT && (
              <>
                <RHFTextField name="client_name" label="Client's Name*" />
                <RHFTextField name="client_email" label="Client's Email*" />
              </>
            )}

            <RHFDatePicker label="From (mm/dd/yyyy)" name="date_start" />
            <RHFDatePicker label="To (mm/dd/yyyy)" name="date_end" />

            <RHFTextField name="venue" label="Venue" />

            <Box textAlign="center">
              <LoadingButton
                variant="contained"
                loading={isSubmitting}
                type="submit"
                sx={{ width: '200px' }}
              >
                Create event
              </LoadingButton>
            </Box>
          </FormProvider>
        </Wrapper>
      </Box>
    </Drawer>
  );
}
