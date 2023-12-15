/*
 * Update Theme Dialog
 */

import React, { useState, useEffect } from 'react';
import * as Yup from 'yup';
import { ChromePicker } from 'react-color';
import { LoadingButton } from '@mui/lab';
import { useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';
import { FormProvider, RHFTextField } from 'src/components/hook-form';
import axios from 'src/utils/axios';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

import {
  styled,
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Checkbox,
  FormGroup,
  FormControlLabel,
  CircularProgress,
} from '@mui/material';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';

type PropsType = {
  isDialogOpen: boolean;
  onClose: () => void;
  eventId: string;
  onSuccess: () => void;
  showProgress: boolean;
};

const CloseIcon = styled(CancelOutlinedIcon)(({ theme }) => ({
  fontSize: '2rem',
}));

const ContentWrapper = styled('div')(({ theme }) => ({
  width: '100%',
  marginLeft: 'auto',
  marginRight: 'auto',
  [theme.breakpoints.down('sm')]: {
    width: '95%',
  },
}));

const CheckBox = styled(FormGroup)(({ theme }) => ({
  padding: theme.spacing(0, 0, 2, 0),
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
}));

export default function PublishStatusDialog(props: PropsType): React.ReactElement {

   useEffect(() => {

     window.Pusher = Pusher;

     let echo = new Echo({
       broadcaster: 'pusher',
       key: 'app-key',
       wsHost: 'api.test.turtlepic.com',
       forceTLS: true,
       encrypted: false,
       disableStats: true,
       enabledTransports: ['ws'],
       cluster: 'mt1',
     });

     echo.channel('index_updates').listen('IndexEvent', (data: any) => {
       var  input_data  = data ;
       if (input_data.eventId === props.eventId) { 
        var parts = input_data.message.split(' ')[0].split('/');
        if (parts.length === 2) {
          setCurrent(current+1);
          setTotal(parseInt(parts[1], 10));

          if (current === parts[1]){
            props.onClose();
            props.onSuccess();
          }
        }
      }
     });

    //  echo.channel('media_updates').listen('MediaEvent', (data: any) => {
    //    console.log('Received data:', data);
    //  });

    //  echo.channel('folder_uploads').listen('EventFolderEvent', (data: any) => {
    //    console.log('Received data:', data);
    //  });
     return () => {
       // echo.leaveChannel('channel-name');
     };
   }, []);

  const { enqueueSnackbar } = useSnackbar();
  const [showProgress, setShowProgress] = useState(true);
  const [total, setTotal] = useState(0);
  const [current, setCurrent] = useState(0);

  const navigate = useNavigate();

  const PlanSchema = Yup.object().shape({});

  return (
    <Dialog
      open={props.isDialogOpen}
      BackdropProps={{ invisible: true }}
      hideBackdrop={true}
      disableEnforceFocus // Let the user focus on elements outside the dialog
      style={{ position: 'initial' }} // This was the key point, reset the position of the dialog, so the user can interact with other elements
      PaperProps={{
        style: {
          padding: '0',
          margin: '10px',
          backgroundColor: 'rgba(0, 0, 0, 1)', // Make the background transparent
          position: 'fixed', // Position the dialog relative to the viewport
          bottom: '50px', // Adjust top and left values as needed
          right: '30px',
          pointerEvents: 'auto', // Allow interactions with other content
        },
      }}
    >
      {/* <DialogTitle id={props.dialogId}> */}
      {/* <IconButton
          aria-label="close"
          onClick={props.onClose}
          sx={{
            float: 'right',
            padding: 0,
            color: (theme) => theme.palette.common.white,
          }}
        >
          <CloseIcon />
        </IconButton> */}
      {/* </DialogTitle> */}
      <DialogContent>
        <ContentWrapper>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', padding: '10px' }}>
            <>
              <Typography align="center">Event Publishing...</Typography>
            </>
          </Box>
          <Box
            sx={
              {
                //   border: '2px solid #000',
                //   boxShadow: 24,
                //   borderRadius: 1,
              }
            }
          >
            <div style={{ textAlign: 'center' }}>
              <CircularProgress sx={{ padding: '5px', margin: '5px' }} />
              <Typography align="center" variant="h4">
                {props.showProgress ? ( total === 0 ? '1%' : `${Math.round((current / total) * 100)} %` ) : 'Indexing in progress'}
              </Typography>
            </div>
          </Box>
        </ContentWrapper>
      </DialogContent>
    </Dialog>
  );
}
