import React from 'react';

import { FormControl, styled, TextField, TextFieldProps } from '@mui/material';

type TInputComponentProps = {
  id: string;
  label?: string | React.ReactElement;
  value?: string;
};

const InputWrapper = styled('div')(({ theme }) => ({
  marginBottom: theme.spacing(3),
}));

export default function TInputComponent({
  id,
  label,
  value,
  ...other
}: TInputComponentProps & TextFieldProps): React.ReactElement {
  return (
    <>
      <InputWrapper>
        <FormControl fullWidth>
          <TextField
            id={id}
            autoComplete="off"
            variant="standard"
            label={label}
            {...other}
            value={value}
            aria-describedby={id}
            sx={{ caretColor: '#7dd78d' }}
          />
        </FormControl>
      </InputWrapper>
    </>
  );
}
