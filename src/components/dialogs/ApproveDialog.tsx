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
import { LoadingButton } from '@mui/lab';

type PropsType = {
  btn1: string;
  btn2: string;
  para?: string;
  dialogContent: string | React.ReactElement;
  dialogId?: string;
  isDialogOpen: boolean;
  onClose: () => void;
  onApprove: () => void;
  onReject: () => void;
  loading?: boolean;
  rejectLoader?: boolean;
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

export default function ApproveDialog(props: PropsType): React.ReactElement {
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
          loading={props.rejectLoader}
          onClick={props.onReject}
          size="medium"
          variant="outlined"
          color="primary"
        >
          {props.btn1}
        </LoadingButton>
        <LoadingButton
          loading={props.loading}
          onClick={props.onApprove}
          size="medium"
          variant="contained"
          color="primary"
        >
          {props.btn2}
        </LoadingButton>
      </DialogActions>
      <Typography color="white" align="center" padding={2} fontStyle="italic" fontSize={13}>
        {props.para}
      </Typography>
    </Dialog>
  );
}
