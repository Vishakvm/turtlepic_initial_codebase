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

// import background from 'src/assets/shared/images/ThankyouBanner.png';

type PropsType = {
  dialogContent: string | React.ReactElement;
  dialogId?: string;
  isDialogOpen: boolean;
  onClose: () => void;
};

const CloseIcon = styled(CancelOutlinedIcon)(({ theme }) => ({
  fontSize: '2rem',
//   position:'absolute',
//   left:'-3rem',
}));

const ContentWrapper = styled('div')(({ theme }) => ({
//   width: '80%',
  marginLeft: 'auto',
  marginRight: 'auto',
//   margin:'10px',
  [theme.breakpoints.down('sm')]: {
    width: '95%',
  },
}));


export default function PlansInfoDialog(props: PropsType): React.ReactElement {
  return (
    <Dialog
      PaperProps={{
        sx: {
          //   backgroundImage: `url(${background})`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundSize: 'contain',
        //   backgroundColor:'white'
        },
      }}
      maxWidth={'md'}
      onClose={props.onClose}
      aria-labelledby={props.dialogId}
      open={props.isDialogOpen}
    >
      <DialogTitle
        id={props.dialogId}
        sx={{
          backgroundColor: '#7dd78d',
          height: '30px',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          padding: '25px 10px 42px 25px',
        }}
      >
        <Typography variant="h4" color="black">
          Agency Vs Individual Account
        </Typography>
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
          <Typography mb={3} mt={2} variant="h6" color="white" align="left">
            Agency account offers following additional features in comparison to Individual account.
          </Typography>
          <Typography mb={2} variant="h6" color="white" align="left">
            1. Market your brand by integrating your firm's social media handles
            <br />
            2. Watermark photos to increase your brand visibility
            <br />3. Add multiple people from your organization to collaborate seamlessly in same
            account
            <br />4. Super easy pics selection with Client favorites visibility in agency admin
            panel (Coming Soon)
          </Typography>
        </ContentWrapper>
      </DialogContent>
    </Dialog>
  );
}
