import { Theme } from '@mui/material/styles';

// ----------------------------------------------------------------------

export default function Timeline(theme: Theme) {
  return {
    MuiTimelineDot: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          padding: 0,
          borderWidth: 0,
          background: 'transparent',
          margin: theme.spacing(0.6, 0),
        },
      },
    },

    MuiTimelineConnector: {
      styleOverrides: {
        root: {
          backgroundColor: theme.palette.divider,
        },
      },
    },

    MuiTimelineItem: {
      styleOverrides: {
        root: {
          minHeight: '100px',
          '&:before': {
            flex: 0,
          },
        },
      },
    },
  };
}
