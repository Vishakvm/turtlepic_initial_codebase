import React from 'react';
import { styled } from '@mui/material';
const individual = () => {
  const Wrapper = styled('div')(({ theme }) => ({
    height: '400px',
  }));
  return <Wrapper />;
};

export default individual;
