/*
 * Error Dialog
 */

import * as React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import Typography from '@mui/material/Typography';

type PropsType = {
  buttonLabel: string;
  dialogContent: string | React.ReactElement;
  dialogId?: string;
  isDialogOpen: boolean;
  onClose: () => void;
  onClick: () => void;
};

const CloseIcon = styled(CancelOutlinedIcon)(({ theme }) => ({
  fontSize: '2rem',
}));

const ContentWrapper = styled('div')(({ theme }) => ({
  width: '75%',
  marginLeft: 'auto',
  marginRight: 'auto',
  [theme.breakpoints.down('sm')]: {
    width: '95%',
  },
}));

export default function ErrorDialog(props: PropsType): React.ReactElement {
  return (
    <Dialog
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
      <DialogActions>
        <Button size="medium" variant="contained" color="primary" onClick={props.onClick}>
          {props.buttonLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
