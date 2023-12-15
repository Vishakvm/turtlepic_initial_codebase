/*
 * Confirmation Dialog
 */

import React from 'react';

import {
  styled,
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import { FormProvider, RHFTextField } from 'src/components/hook-form';

type PropsType = {
  buttonSecondaryLabel: string;
  dialogContent: string;
  dialogId?: string;
  isDialogOpen: boolean;
  methods: any;
  onSubmit: any;
  onClose: () => void;
  loading: any;
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

export default function ManageConfigurations(props: PropsType): React.ReactElement {
  return (
    <Dialog
      maxWidth={'xs'}
      onClose={props.onClose}
      aria-labelledby={props.dialogId}
      open={props.isDialogOpen}
      BackdropProps={{ invisible: true }}
      sx={{
        backgroundColor: 'rgba(0,0,0,0.5)',

        ' .MuiDialog-container .MuiPaper-root': {
          boxShadow: 'none',

          outline: 'none',
        },
      }}
    >
      <DialogTitle id={props.dialogId}>
        <IconButton
          aria-label="close"
          onClick={props.onClose}
          sx={{
            float: 'right',
            padding: 0,
            color: (theme) => theme.palette.common.white,
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <ContentWrapper>
          <Typography pb={6} variant="h4" color="white" align="center">
            {props.dialogContent}
          </Typography>
          <FormProvider methods={props.methods} onSubmit={props.onSubmit}>
            <RHFTextField
              name="upload"
              label="Upload time for the agency after request approval*"
              placeholder="7 days"
              focused
            />
            <Box textAlign="right" mt={3}>
              <LoadingButton
                variant="contained"
                type="submit"
                sx={{ width: '150px' }}
                loading={props.loading}
              >
                {props.buttonSecondaryLabel}
              </LoadingButton>
            </Box>
          </FormProvider>
        </ContentWrapper>
      </DialogContent>
    </Dialog>
  );
}
