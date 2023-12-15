/*
 * Sign Up Plan Card Page
 *
 */
import React from 'react';

import { styled } from '@mui/material';
import PhoneInput from 'react-phone-number-input';

const PhoneNumber = styled(PhoneInput)(({ theme }) => ({
  '& input': {
    background: 'transparent',
    color: theme.palette.common.white,
    borderTop: 0,
    borderLeft: 0,
    borderRight: 0,
    fontSize: 14,
    borderBottom: `1px solid ${theme.palette.grey[500_56]}`,
    padding: theme.spacing(1),
    marginBottom: theme.spacing(1),
    borderRadius: 0,
    '&:focus-visible': {
      outline: 'none',
    },
    '&:disabled ': {
      color: theme.palette.grey[600],
    },
    '&::placeholder ': {
      opacity: 1,
      color: theme.palette.grey[100],
      fontStyle: 'italic',
      fontSize: '13px',
      fontWeight: 200,
    },
  },
}));
export default function TPhoneComponent(props: any): React.ReactElement {
  return (
    <PhoneNumber
      value={props.value}
      defaultCountry={props.defaultCountry}
      onChange={props.onChange}
      error={props.error}
      disabled={props.disabled}
      placeholder={props.placeholder}
    />
  );
}
