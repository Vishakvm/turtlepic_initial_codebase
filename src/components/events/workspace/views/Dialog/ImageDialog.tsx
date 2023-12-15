import * as React from 'react';

import ClearIcon from '@mui/icons-material/Clear';
import { styled, IconButton, Dialog, Box } from '@mui/material';

const CloseIcon = styled(ClearIcon)(({ theme }) => ({
  fontSize: '2rem',
}));
const Image = styled('img')(({ theme }) => ({
  objectFit: 'cover',
  height: '100%',
  width: '100%',
}));

interface DialogProps {
  open: boolean;
  close: () => void;
  img: string;
}

export default function ImageDialog({ open, close, img }: DialogProps) {
  return (
    <Dialog
      BackdropProps={{
        invisible: true,
      }}
      sx={{
        backgroundColor: 'rgba(0,0,0,0.2)',
        ' .MuiDialog-container .MuiPaper-root': {
          boxShadow: 'none',
          outline: 'none',
          borderRadius: '10px',
        },
      }}
      open={open}
      onClose={close}
    >
      <Box sx={{ right: 0, position: 'absolute' }}>
        <IconButton aria-label="close" onClick={close}>
          <CloseIcon fontSize="small" color="primary" />
        </IconButton>
      </Box>
      <div>
        <Image src={img} alt="selfie" />
      </div>
    </Dialog>
  );
}
