import { Theme } from '@mui/material/styles';

// ----------------------------------------------------------------------

export default function Switch(theme: Theme) {
  return {
    MuiSwitch: {
      styleOverrides: {
        thumb: {
          boxShadow: theme.customShadows.z1,
        },
        track: {
          opacity: 1,
          backgroundColor: theme.palette.grey[200],
        },
        switchBase: {
          left: 0,
          right: 'auto',
          '&.Mui-disabled+.MuiSwitch-track': {
            opacity: 1,
            backgroundColor: `${theme.palette.action.disabledBackground} !important`,
          },

          '& .MuiSwitch-switchBase': {
            transitionDuration: '300ms',
            '&.Mui-checked': {
              transform: 'translateX(16px)',
              color: theme.palette.grey[300],
              '& + .MuiSwitch-track': {
                backgroundColor: theme.palette.primary.main,
                opacity: 1,
              },
            },
          },
          '& .MuiSwitch-thumb': {
            border: '2px solid #6d6d6d',
            background: theme.palette.grey[300],
            width: '23px',
            height: '21px',
          },
        },
      },
    },
  };
}
