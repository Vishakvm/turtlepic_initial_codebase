/*
 * Confirmation Dialog
 */

import * as React from 'react';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import { Button } from '@mui/material';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import Typography from '@mui/material/Typography';
import TickSVG from 'src/assets/shared/svg/signup/TickSVG';

import background from 'src/assets/shared/images/ThankyouBanner.png';

type PropsType = {
  isDialogOpen: boolean;
  onClose: () => void;
};

const TickIcon = styled('div')(({ theme }) => ({
    display:'flex',
    justifyContent :'center'
}));

const ContentWrapper = styled('div')(({ theme }) => ({
  width: '80%',
  marginLeft: 'auto',
  marginRight: 'auto',
  [theme.breakpoints.down('sm')]: {
    width: '95%',
  },
}));

const DoneButton = styled(Button)(({ theme }) => ({
  color: 'black',
  height: '30px',
  // marginTop:'20px'
  // backgroundColor: '#E9E9E8',
  // '&:hover': {
  //   backgroundColor: '#5DBD6F',
  //   color: '#FFFFFF',
  // },
}));

export default function FeedbackSuccessDialog(props: PropsType): React.ReactElement {
  return (
    <Dialog
      PaperProps={{
        sx: {
          backgroundColor: 'white',
        },
      }}
      maxWidth={'xs'}
      onClose={props.onClose}
      open={props.isDialogOpen}
    >
      <DialogTitle
        sx={{
          backgroundColor: '#7DD78D',
          padding: 3,
        }}
      >
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
        <TickIcon>
          <TickSVG size="50" />
        </TickIcon>
      </DialogTitle>
      <DialogContent sx={{paddingBottom:'10px'}}>
        <ContentWrapper>
          <Typography m={2} variant="h4" color="black" align="center">
            Thank You!
            <br /> We Appreciate Your Feedback.
          </Typography>
          <div style={{textAlign:'center'}}>
            <DoneButton color="primary" variant="contained" onClick={props.onClose}>
              Done
            </DoneButton>
          </div>
        </ContentWrapper>
      </DialogContent>
    </Dialog>
  );
}
