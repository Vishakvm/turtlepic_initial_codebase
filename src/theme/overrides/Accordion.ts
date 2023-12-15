import { Theme } from '@mui/material/styles';

// ----------------------------------------------------------------------

export default function Accordion(theme: Theme) {
  return {
    MuiAccordion: {
      styleOverrides: {
        root: {
          backgroundColor: 'transparent',
          '&.Mui-expanded': {
            boxShadow: 'none',
            borderRadius: 0,
            minHeight: 'auto',
            margin: 0,
          },
          '&.Mui-disabled': {
            backgroundColor: 'transparent',
          },
          '&::before': {
            backgroundColor: 'transparent',
          },
        },
      },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          paddingLeft: theme.spacing(0),
          paddingRight: theme.spacing(0),
          minHeight: 'auto',
          '&.Mui-expanded': {
            minHeight: 'auto',
          },
          '&.Mui-disabled': {
            opacity: 1,
            color: theme.palette.action.disabled,
            '& .MuiTypography-root': {
              color: 'inherit',
            },
          },
        },
        content: {
          margin: 0,
          justifyContent: 'flex-end',
          '&.Mui-expanded': {
            minHeight: 'auto',
            margin: 0,
          },
        },
        expandIconWrapper: {
          color: 'inherit',
        },
      },
    },
    MuiAccordionDetails: {
      styleOverrides: {
        root: {
          padding: 0,
        },
      },
    },
  };
}
