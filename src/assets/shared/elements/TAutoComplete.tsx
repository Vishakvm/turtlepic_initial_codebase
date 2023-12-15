import React from 'react';

import { styled, TextField, TextFieldProps, FormHelperText } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
interface IProps {
  errorFlag: boolean;
  label: string;
  errorMessage?: string;
}

const InfoIcon = styled(InfoOutlinedIcon)(({ theme }) => ({
  marginRight: theme.spacing(0.5),
  fontSize: '1.25rem',
}));

const ErrorSpace = styled(FormHelperText)(({ theme }) => ({
  height: '2.15rem',
  marginLeft: 0,
  marginTop: theme.spacing(0.2),
  display: 'flex',
  alignItems: 'center',
  fontSize: '0.8rem',
}));

export default function TAutocompleteInput({
  label,
  errorFlag,
  errorMessage,
  ...other
}: IProps & TextFieldProps) {
  return (
    <>
      <TextField
        variant="standard"
        autoComplete="off"
        label={label}
        fullWidth
        error={errorFlag}
        {...other}
      />
      <ErrorSpace error>
        {errorFlag && (
          <>
            <InfoIcon /> {errorMessage}
          </>
        )}
      </ErrorSpace>
    </>
  );
}
