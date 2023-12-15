import { Theme } from '@mui/material/styles';

// ----------------------------------------------------------------------

export default function Button(theme: Theme) {
  return {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          fontWeight: 500,
          margin: theme.spacing(1, 0, 1, 0),
          '&:hover': {
            boxShadow: 'none',
          },
        },
        sizeLarge: {
          height: 65,
          fontSize: 16,
          padding: theme.spacing(0, 4),
          [theme.breakpoints.down('sm')]: {
            height: 60,
            fontSize: 15,
          },
        },
        sizeMedium: {
          height: 50,
          fontSize: 15,
          [theme.breakpoints.down('sm')]: {
            height: 45,
            fontSize: 14,
          },
        },
        sizeSmall: {
          height: 40,
          fontSize: 14,
          [theme.breakpoints.down('sm')]: {
            height: 35,
            fontSize: 12,
          },
        },
        // contained
        containedInherit: {
          boxShadow: theme.customShadows.z8,
          '&:hover': {
            backgroundColor: theme.palette.grey[400],
          },
        },
        containedPrimary: {
          color: theme.palette.grey[300],
        },
        containedSecondary: {
          color: theme.palette.grey[300],
        },
        containedInfo: {
          color: theme.palette.grey[300],
        },
        containedSuccess: {
          color: theme.palette.grey[300],
        },
        containedWarning: {
          color: theme.palette.grey[300],
        },
        containedError: {
          color: theme.palette.grey[0],
        },
        // outlined
        outlinedInherit: {
          border: `1px solid ${theme.palette.grey[500_32]}`,
          '&:hover': {
            backgroundColor: theme.palette.action.hover,
          },
        },
        textInherit: {
          '&:hover': {
            backgroundColor: theme.palette.action.hover,
          },
        },
      },
    },
  };
}
