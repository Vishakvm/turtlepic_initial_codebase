import { useFormContext, Controller } from 'react-hook-form';
import { FormControl, styled, FormHelperText, TextField, TextFieldProps } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

// ----------------------------------------------------------------------

interface IProps {
  name: string;
  label: string | React.ReactElement;
  focus?: boolean;
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

export default function RHFTextField({ name, focus, label, ...other }: IProps & TextFieldProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <>
          <FormControl fullWidth>
            <TextField
              autoFocus={focus}
              variant="standard"
              autoComplete="off"
              label={label}
              {...field}
              fullWidth
              error={!!error}
              {...other}
            />
            <ErrorSpace error>
              {error && (
                <>
                  <InfoIcon /> {error?.message}
                </>
              )}
            </ErrorSpace>
          </FormControl>
        </>
      )}
    />
  );
}
