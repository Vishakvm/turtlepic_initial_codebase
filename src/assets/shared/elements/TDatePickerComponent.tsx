import React from 'react';

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { styled, TextField, InputLabel } from '@mui/material';

type TDatePickerProps = {
  label: string;
  value: Date | null;
  onChange: (date: any, keyboardInputValue?: string | undefined) => void;
};

const InputWrapper = styled('div')(({ theme }) => ({
  marginBottom: theme.spacing(3),
  width: '100%',
}));
const LabelStyle = styled(InputLabel)(({ theme }) => ({
  fontSize: '14px',
}));

export default function TDatePickerComponent({
  label,
  value,
  onChange,
}: TDatePickerProps): React.ReactElement {
  return (
    <>
      <InputWrapper>
        <LabelStyle>{label}</LabelStyle>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label=""
            value={value}
            onChange={onChange}
            renderInput={(params) => <TextField fullWidth variant="standard" {...params} />}
          />
        </LocalizationProvider>
      </InputWrapper>
    </>
  );
}
