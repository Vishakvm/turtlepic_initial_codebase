import { Theme } from '@mui/material/styles';

// ----------------------------------------------------------------------

export default function DataGrid(theme: Theme) {
  return {
    MuiDataGrid: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          border: `1px solid transparent`,
          '.MuiDataGrid-columnSeparator': {
            display: 'none',
          },
          '.MuiDataGrid-iconButtonContainer': {
            visibility: 'visible',
          },
          '.MuiDataGrid-row': {
            border: '1px solid #6d6d6d',
            marginTop: '25px',
            borderRadius: '10px ',
            cursor: 'default',
            width: '99.5%',
            '&:hover': {
              background: 'none',
            },
          },
          '& .MuiTablePagination-root': {
            borderTop: 0,
          },
          '& .MuiDataGrid-toolbarContainer': {
            padding: theme.spacing(2),
            backgroundColor: theme.palette.background.neutral,
            '& .MuiButton-root': {
              marginRight: theme.spacing(1.5),
              color: theme.palette.text.primary,
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
              },
            },
          },
          '.MuiDataGrid-cell:focus-within': {
            outline: 'none',
            cursor: 'pointer',
          },
          '.MuiDataGrid-columnHeader:focus-within': {
            outline: 'none',
          },
          '.MuiDataGrid-footerContainer': {
            display: 'none',
          },
          '.MuiDataGrid-virtualScroller': {
            '::-webkit-scrollbar': {
              width: '0px',
            },
          },
          '& .MuiDataGrid-columnSeparator': {
            color: theme.palette.divider,
          },
          '& .MuiDataGrid-columnHeaders ': {
            border: 'none',
          },
          '& .MuiDataGrid-columnHeader[data-field="__check__"]': {
            padding: 0,
          },
          '& .MuiDataGrid-virtualScrollerContent': {
            height: '5rem',
          },
        },
      },
    },
    MuiGridMenu: {
      styleOverrides: {
        root: {
          '& .MuiDataGrid-gridMenuList': {
            boxShadow: theme.customShadows.z20,
            borderRadius: theme.shape.borderRadius,
          },
          '& .MuiMenuItem-root': {
            ...theme.typography.body2,
          },
        },
      },
    },
    MuiGridFilterForm: {
      styleOverrides: {
        root: {
          padding: theme.spacing(1.5, 0),
          '& .MuiFormControl-root': {
            margin: theme.spacing(0, 0.5),
          },
          '& .MuiInput-root': {
            marginTop: theme.spacing(3),
            '&::before, &::after': {
              display: 'none',
            },
            '& .MuiNativeSelect-select, .MuiInput-input': {
              ...theme.typography.body2,
              padding: theme.spacing(0.75, 1),
              borderRadius: theme.shape.borderRadius,
              backgroundColor: theme.palette.background.neutral,
            },
            '& .MuiSvgIcon-root': {
              right: 4,
            },
          },
        },
      },
    },
    MuiGridPanelFooter: {
      styleOverrides: {
        root: {
          padding: theme.spacing(2),
          justifyContent: 'flex-end',
          '& .MuiButton-root': {
            '&:first-of-type': {
              marginRight: theme.spacing(1.5),
              color: theme.palette.text.primary,
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
              },
            },
            '&:last-of-type': {
              color: theme.palette.common.white,
              backgroundColor: theme.palette.primary.main,
              '&:hover': {
                backgroundColor: theme.palette.primary.dark,
              },
            },
          },
        },
      },
    },
  };
}
