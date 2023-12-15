import { Theme } from '@mui/material/styles';

// ----------------------------------------------------------------------

export default function Datepicker(theme: Theme) {
  return {
    MuiCalendarPicker: {
      styleOverrides: {
        root: {
          background: theme.palette.grey[900],
          borderRadius: 5,
          border: `0.5px solid ${theme.palette.primary.main}`,
        },
      },
    },
    MuiPickersDay: {
      styleOverrides: {
        root: {
          background: theme.palette.grey[900],
        },
      },
    },
  };
}
