/*
 * Confirmation Dialog
 */

import * as React from 'react';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import Typography from '@mui/material/Typography';

import background from 'src/assets/shared/images/ThankyouBanner.png';

type PropsType = {
  dialogContent: string | React.ReactElement;
  dialogId?: string;
  isDialogOpen: boolean;
  onClose: () => void;
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

export default function SuccessDialog(props: PropsType): React.ReactElement {
  return (
    <Dialog
      PaperProps={{
        sx: {
          backgroundImage: `url(${background})`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundSize: 'contain',
        },
      }}
      maxWidth={'xs'}
      onClose={props.onClose}
      aria-labelledby={props.dialogId}
      open={props.isDialogOpen}
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
          <Typography mb={5} variant="h3" color="primary" align="center">
            {props.dialogContent}
          </Typography>
        </ContentWrapper>
      </DialogContent>
    </Dialog>
  );
}
