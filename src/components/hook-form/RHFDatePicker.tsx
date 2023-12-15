import React from 'react';

import { useFormContext, Controller } from 'react-hook-form';
import { styled, TextField, InputLabel, FormHelperText } from '@mui/material';

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

type TDatePickerProps = {
  label: string;
  name: string;
};

const InputWrapper = styled('div')(({ theme }) => ({
  width: '100%',
}));
const LabelStyle = styled(InputLabel)(({ theme }) => ({
  fontSize: '14px',
}));
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

export default function RHFDatePicker({ label, name }: TDatePickerProps): React.ReactElement {
  const { control } = useFormContext();
  return (
    <>
      <InputWrapper>
        <LabelStyle>{label}</LabelStyle>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Controller
            name={name}
            control={control}
            defaultValue={null}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <DatePicker
                disablePast
                label=""
                value={value}
                onChange={onChange}
                inputFormat="MM/dd/yyyy"
                renderInput={(params) => (
                  <>
                    <TextField {...params} fullWidth error={!!error} variant="standard" />
                    <ErrorSpace error>
                      {error && (
                        <>
                          <InfoIcon /> Field is required
                        </>
                      )}
                    </ErrorSpace>
                  </>
                )}
              />
            )}
          />
        </LocalizationProvider>
      </InputWrapper>
    </>
  );
}
