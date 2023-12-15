import React, { useState, useEffect, useRef } from 'react';

import { DataGrid, GridColDef } from '@mui/x-data-grid';
import {
  Typography,
  Stack,
  InputAdornment,
  Button,
  ToggleButtonGroup,
  MenuItem,
  Box,
  ToggleButton,
  FormControl,
  Select,
  SelectChangeEvent,
  styled,
} from '@mui/material';
import * as Yup from 'yup';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import { TableBackground, TableWrapper } from 'src/pages/superAdmin/Dashboard';
import {
  SearchInput,
  PaginateWrapper,
  TableWidthWrapper,
  TeamHeaderWrapper,
  TeamButtonStyle,
} from 'src/assets/shared/styles/SharedStylesComponent';
import axios from 'src/utils/axios';

import MoreVertIcon from '@mui/icons-material/MoreVert';
import UpdateTheme from 'src/components/dialogs/UpdateTheme';

import { yupResolver } from '@hookform/resolvers/yup';
import { PENDING, REJECTED, UPLOADED, VERIFIED } from 'src/utils/constants';
import { PATH_MAIN_ADMIN } from 'src/routes/paths';
import { Navigate } from 'react-router';
import { useNavigate } from 'react-router-dom';
import { LoadingButton } from '@mui/lab';

const Table = styled(DataGrid)(({ theme }) => ({
  paddingLeft: 0.4,
  '.MuiDataGrid-row': {
    marginTop: 10,
  },
  '.MuiDataGrid-virtualScroller': {
    overflow: 'auto',
    '&::-webkit-scrollbar': {
      width: '0.3em',
      height: '0.3em',
      backgroundColor: '#000',
    },
    '&::-webkit-scrollbar-track': {
      boxShadow: 'inset 0 0 6px rgba(0,0,0,0.1)',
      backgroundColor: '#000',
      borderRadius: '10px',
    },
    '&::-webkit-scrollbar-thumb': {
      borderRadius: '10px',
      backgroundColor: '#6d6d6d',
    },
  },
  '& .MuiDataGrid-renderingZone': {
    maxHeight: 'none !important',
  },
  '& .MuiDataGrid-cell': {
    lineHeight: 'unset !important',
    maxHeight: 'none !important',
    whiteSpace: 'normal',
  },
  '& .MuiDataGrid-row': {
    maxHeight: 'none !important',
  },
}));

interface AllListProps {
  id: number;
  name: string;
  display_name: string;
  accent_color: number;
  active: number;
  verification_status: string;
  //   image: Array;
  selected: number;
}

function CustomUnsortedIcon() {
  return <UnfoldMoreIcon sx={{ color: '#02C2D9' }} />;
}

type FormValuesProps = {
  id: number;
  upload: number;
};
export default function ThemesView(): React.ReactElement {
  const [id, setId] = useState();
  const [allUsers, setAllUsers] = useState<AllListProps[]>([]);
  const [searchValue, setSearchValue] = useState<string>('');
  const [allMeta, setAllMeta] = useState(Object);
  const [rowData, setRowData] = useState(Object);
  const [allPage, setAllPage] = useState(1);
  const [checkPage, setCheckPage] = useState(Object);
  const [refreshlist, setRefreshList] = useState<boolean>(false);
  const navigate = useNavigate();
  const isMounted = useRef(false);

    const [actionType] = useState('');
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [dialogConfigurationOpen, setDialogConfigurationOpen] = useState<boolean>(false);



  const defaultValues = {
    upload: 10,
  };
   const AgencyUserSchema = Yup.object().shape({
     upload: Yup.string().required('Field is required'),
   });

   const methods = useForm<FormValuesProps>({
     resolver: yupResolver(AgencyUserSchema),
     defaultValues,
   });
   const {
     reset,
     handleSubmit,
     setValue,
     formState: { isSubmitting },
   } = methods;

  const getAllAgencyUsers = async () => {
    try {
      await axios.get('/api/events/0/themes').then((response) => {
        if (!isMounted.current) {
          const { data, links, meta } = response.data;
          setCheckPage(links);
          setAllMeta(meta);
          setAllUsers(data);
        }
      });
    } catch (error) {
      enqueueSnackbar(error.message, { variant: 'error' });
    }
  };
  useEffect(() => {
    getAllAgencyUsers();
    // setRefreshList(false);
  }, [allPage, refreshlist]);

  const columnsAll: GridColDef[] = [
    {
      field: 'id',
      headerName: 'ID',
      minWidth: 10,
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <Typography sx={{ whiteSpace: 'break-spaces', wordBreak: 'break-all' }} noWrap>
          {params?.row.id ? params?.row.id : '-'}
        </Typography>
      ),
    },
    {
      field: 'name',
      headerName: 'Name',
      minWidth: 150,
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <Typography sx={{ whiteSpace: 'break-spaces', wordBreak: 'break-all' }} noWrap>
          {params?.row.name ? params?.row.name : '-'}
        </Typography>
      ),
    },
    {
      field: 'display_name',
      headerName: 'Display Name',
      minWidth: 150,
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <Typography
          sx={{ textTransform: 'capitalize', whiteSpace: 'break-spaces', wordBreak: 'break-all' }}
          noWrap
        >
          {params?.row.name ? params?.row.name : '-'}
        </Typography>
      ),
    },
    {
      field: 'Color',
      headerName: 'Color',
      minWidth: 50,
      sortable: false,
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params?) => <Typography color="primary">{params?.row.accent_color}</Typography>,
    },
    {
      field: 'active',
      headerName: 'Active Status',
      minWidth: 50,
      sortable: false,
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params?) => (
        <Typography color="primary">{JSON.stringify(params.row.active)}</Typography>
      ),
    },
    {
      field: 'image',
      headerName: 'Image',
      minWidth: 130,
      sortable: false,
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params?) => {
        return <img src={params?.row.image.thumbnail_url}></img>;
      },
    },

    {
      field: 'more',
      headerName: 'More',
      minWidth: 100,
      flex: 1,
      sortable: false,
      headerAlign: 'center',
      align: 'center',

      renderCell: (params) => {
       


        const handleChange = async (id: any) => {};
        const onSubmit = async (id: any) => {};

        const handleSetUploadTime = (time: number) => {
       
        };
        return (
          <>
            <FormControl>
              <Select
                sx={{
                  '.MuiOutlinedInput-notchedOutline': {
                    border: 'none',
                  },
                  '.MuiSelect-select': {
                    padding: '0px 0px 0 0',
                  },
                }}
                value={actionType}
                onChange={() => handleChange(params.row.userId)}
                displayEmpty
                IconComponent={MoreVertIcon}
              >
                <MenuItem
                  value="manage"
                  onClick={() => {
                    setDialogConfigurationOpen(true);
                    setRowData(params.row);
                  }}
                >
                  Manage Theme
                </MenuItem>
              </Select>
              <UpdateTheme
                methods={methods}
                data={rowData}
                onSubmit={handleSubmit(onSubmit)}
                isDialogOpen={dialogConfigurationOpen}
                loading={isSubmitting}
                buttonSecondaryLabel="Save"
                dialogContent="Manage Theme"
                dialogId="update-theme"
                onClose={() =>{ setDialogConfigurationOpen(false)
                getAllAgencyUsers()}}
              />
            </FormControl>
          </>
        );
      },
    },
  ];

  const { enqueueSnackbar } = useSnackbar();

  const clearInput = () => {
    setSearchValue('');
    setRefreshList(true);
  };

  return (
    <TableWidthWrapper>
      <TableBackground>
        <TeamHeaderWrapper>
          <Button
            onClick={() => navigate(PATH_MAIN_ADMIN.createTheme)}
          
          
            variant="contained"
          >
            Create Theme
          </Button>
        </TeamHeaderWrapper>
        <TableWrapper>
          <Table
            rows={allUsers}
            columns={columnsAll}
            disableSelectionOnClick
            disableColumnMenu={true}
            components={{
              ColumnUnsortedIcon: CustomUnsortedIcon,
              ColumnSortedDescendingIcon: CustomUnsortedIcon,
              ColumnSortedAscendingIcon: CustomUnsortedIcon,
              NoRowsOverlay: () => (
                <Stack height="100%" alignItems="center" justifyContent="center">
                  <Typography color="primary" variant="h5">
                    No Data Found!
                  </Typography>
                </Stack>
              ),
            }}
          />
        </TableWrapper>
      </TableBackground>
    </TableWidthWrapper>
  );
}
