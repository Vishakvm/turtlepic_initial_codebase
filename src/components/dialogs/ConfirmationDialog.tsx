/*
 * Confirmation Dialog
 */

import * as React from 'react';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import { Button } from '@mui/material';

type PropsType = {
  buttonMainLabel: string;
  buttonSecondaryLabel: string;
  dialogContent: string | React.ReactElement;
  dialogId?: string;
  isDialogOpen: boolean;
  onClose: () => void;
  onClick: () => void;
  loading?: boolean;
};

const CloseIcon = styled(CancelOutlinedIcon)(({ theme }) => ({
  fontSize: '2rem',
}));

const ContentWrapper = styled('div')(({ theme }) => ({
  width: '80%',
  marginLeft: 'auto',
  marginRight: 'auto',
  [theme.breakpoints.down('sm')]: {
    width: '95%',
  },
}));

export default function ConfirmationDialog(props: PropsType): React.ReactElement {
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
          <Typography variant="h3" color="white" align="center">
            {props.dialogContent}
          </Typography>
        </ContentWrapper>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center' }}>
        <LoadingButton
          sx={{ width: 170 }}
          size="medium"
          variant="outlined"
          color="primary"
          onClick={props.onClick}
          loading={props.loading}
        >
          {props.buttonSecondaryLabel}
        </LoadingButton>
        <Button
          sx={{ width: 170 }}
          size="medium"
          variant="contained"
          color="primary"
          onClick={props.onClose}
        >
          {props.buttonMainLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
