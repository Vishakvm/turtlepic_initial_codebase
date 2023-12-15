import React, { useEffect, useState, useRef } from 'react';

import {
  Typography,
  Stack,
  InputAdornment,
  FormControl,
  Select,
  MenuItem,
  ToggleButtonGroup,
  ToggleButton,
  styled,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CloseIcon from '@mui/icons-material/Close';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';
import { useSnackbar } from 'notistack';
import {
  SearchInput,
  TeamHeaderWrapper,
  TeamButtonStyle,
  TableWidthWrapper,
  PaginateWrapper,
} from 'src/assets/shared/styles/SharedStylesComponent';
import IconDownloadSVG from 'src/assets/shared/svg/icon_download';
import axios from 'src/utils/axios';
import IndividualDialog from 'src/components/dialogs/IndividualDialog';
import { TableBackground, TableWrapper } from 'src/pages/superAdmin/Dashboard';

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
  email: string;
  contact: string;
  event_count: number;
  joined_at: string;
  plan: string;
}

function CustomUnsortedIcon() {
  return <UnfoldMoreIcon sx={{ color: '#02C2D9' }} />;
}

export default function IndividualUsers(): React.ReactElement {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [allUsers, setAllUsers] = useState<AllListProps[]>([]);
  const [searchValue, setSearchValue] = useState<string>('');
  const [allMeta, setAllMeta] = useState(Object);
  const [click, setClick] = useState<string | null>('');
  const [allPage, setAllPage] = useState(1);
  const [checkPage, setCheckPage] = useState(Object);
  const [id, setId] = useState();
  const [refreshlist, setRefreshList] = useState<boolean>(false);
  const [selectStatus] = useState('');

  const isMounted = useRef(false);

  const handlePaginate = (event: React.MouseEvent<HTMLElement>, newClick: string | null) => {
    setClick(newClick);
  };

  const { enqueueSnackbar } = useSnackbar();

  const getAllUsers = async () => {
    try {
      await axios
        .get('/api/admin/users', {
          params: {
            page: allPage,
          },
        })
        .then((response) => {
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
    getAllUsers();
  }, [allPage, enqueueSnackbar, refreshlist]);

  useEffect(
    () => () => {
      isMounted.current = true;
    },
    []
  );

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchInput = e.target.value;
    setSearchValue(e.target.value);
    if (e.target.value === '') {
      setRefreshList(true);
      getAllUsers();
    }
    if (e.target.value.length > 2) {
      try {
        const response = await axios.post('/api/admin/users/search', {
          search: {
            value: searchInput,
          },
        });
        const { data } = response.data;
        setAllUsers(data);
      } catch (error) {
        enqueueSnackbar(error.message, { variant: 'error' });
      }
    }
  };
  const handleDownload = async () => {
    try {
      await axios
        .get('/api/admin/users/export/', {
          responseType: 'blob',
        })
        .then((response) => {
          window.open(URL.createObjectURL(response.data));
          enqueueSnackbar('Downloaded successfully!', { variant: 'success' });
        });
    } catch (error) {
      enqueueSnackbar(error.message, { variant: 'error' });
    }
  };

  const clearInput = () => {
    setSearchValue('');
    setRefreshList(true);
    getAllUsers();
  };

  const columnsAll: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Name',
      minWidth: 130,
      flex: 1,
      renderCell: (params) => (
        <Typography
          sx={{ textTransform: 'capitalize', whiteSpace: 'break-spaces', wordBreak: 'break-all' }}
        >
          {params.row.name ? params.row.name : '-'}
        </Typography>
      ),
    },
    {
      field: 'email',
      headerName: 'Email',
      minWidth: 200,
      sortable: false,
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (params.row.email ? params.row.email : '-'),
    },

    {
      field: 'phone_number',
      headerName: 'Contact',
      minWidth: 150,
      sortable: false,
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (params.row.phone_number ? params.row.phone_number : '-'),
    },

    {
      field: 'event_count',
      headerName: 'Events',
      minWidth: 100,
      sortable: false,
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (params.row.event_count ? params.row.event_count : '-'),
    },
    {
      field: 'joined_at',
      headerName: 'Date',
      minWidth: 150,
      sortable: false,
      flex: 1,
      renderCell: (params) => {
        let dateStr = params.row.joined_at.split('T')[0].split('-').reverse().join('-');
        return dateStr;
      },
    },
    {
      field: 'plan',
      headerName: 'Plan Details',
      minWidth: 130,
      sortable: false,
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (params.row.plan ? params.row.plan : '-'),
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
        const removeUser = async () => {
          setDialogOpen(true);
          try {
            await axios.delete(`/api/admin/users/${id}`);
            enqueueSnackbar('User removed successfully', { variant: 'success' });
            const updatedUsers = allUsers.filter((allUser: any) => allUser.id !== id);
            setAllUsers(updatedUsers);
            setDialogOpen(false);
          } catch (error) {
            enqueueSnackbar(error.message, { variant: 'error' });
          }
        };
        const handleChange = async (id: any) => {};
        return (
          <>
            <FormControl>
              <Select
                sx={{
                  '.MuiOutlinedInput-notchedOutline': {
                    border: 'none',
                  },
                  '.MuiSelect-select': {
                    padding: '0px 0px 0px 32px',
                  },
                }}
                value={selectStatus}
                onChange={() => handleChange(params.row.id)}
                displayEmpty
                IconComponent={MoreVertIcon}
              >
                <MenuItem
                  onClick={() => {
                    setDialogOpen(true);
                    setId(params.row.id);
                  }}
                >
                  Remove User
                </MenuItem>
              </Select>
              <IndividualDialog
                isDialogOpen={dialogOpen}
                buttonMainLabel="No"
                buttonSecondaryLabel="Yes"
                dialogContent="Are you sure you want to Remove User?"
                dialogId="error-dialog-title"
                onClick={removeUser}
                onClose={() => setDialogOpen(false)}
              />
            </FormControl>
          </>
        );
      },
    },
  ];

  return (
    <TableWidthWrapper>
      <TableBackground>
        <TeamHeaderWrapper>
          <TeamButtonStyle
            onClick={handleDownload}
            startIcon={<IconDownloadSVG />}
            color="inherit"
            size="small"
          >
            Download Sheet
          </TeamButtonStyle>
          <SearchInput
            size="small"
            onChange={handleSearch}
            value={searchValue}
            placeholder="Search"
            style={{ borderBottom: '1px solid #fff' }}
            startAdornment={
              <InputAdornment position="start">
                <SearchOutlinedIcon fontSize="medium" color="secondary" />
              </InputAdornment>
            }
            endAdornment={
              <InputAdornment position="end" onClick={clearInput}>
                <CloseIcon fontSize="medium" color="secondary" />
              </InputAdornment>
            }
          />
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
        <PaginateWrapper>
          <div>
            {allMeta.total !== 0 && (
              <Typography variant="h5">
                {allMeta.from} - {allMeta.to} of {allMeta.total}
              </Typography>
            )}
          </div>
          <ToggleButtonGroup
            sx={{
              background: 'none',
              border: 'none',
            }}
            value={click}
            exclusive
            onChange={handlePaginate}
          >
            <ToggleButton
              onClick={() => setAllPage(allPage - 1)}
              disabled={checkPage.prev === null}
              value="prev"
            >
              <ArrowBackIosIcon fontSize="small" />
            </ToggleButton>
            <ToggleButton
              onClick={() => setAllPage(allPage + 1)}
              disabled={checkPage.next === null}
              value="next"
            >
              <ArrowForwardIosIcon fontSize="small" />
            </ToggleButton>
          </ToggleButtonGroup>
        </PaginateWrapper>
      </TableBackground>
    </TableWidthWrapper>
  );
}
