import * as React from 'react';
import { Box, Typography, Dialog, CircularProgress } from '@mui/material';

interface loaderProps {
  title: string;
  isOpen: boolean;
}

export default function Loader(props: loaderProps) {
  return (
    <Dialog
      hideBackdrop={true}
      sx={{
        '& .MuiDialog-container': {
          backgroundColor: 'rgba(0,0,0,0.5)',
          textAlign: 'center',
        },
      }}
      open={props.isOpen}
    >
      <Box
        sx={{
          border: '2px solid #000',
          boxShadow: 24,
          borderRadius: 1,
          p: 4,
          background: '#292929',
        }}
      >
        <Typography variant="h4">{props.title}</Typography>
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <CircularProgress />
        </div>
      </Box>
    </Dialog>
  );
}
