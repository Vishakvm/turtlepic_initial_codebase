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
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CloseIcon from '@mui/icons-material/Close';
import ConfirmationDialog from 'src/components/dialogs/ConfirmationDialog';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
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

import IconDownloadSVG from 'src/assets/shared/svg/icon_download';
import ManageConfigurations from 'src/components/dialogs/ManageConfigurations';
import { yupResolver } from '@hookform/resolvers/yup';
import { PENDING, REJECTED, UPLOADED, VERIFIED } from 'src/utils/constants';

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
  contact: string;
  event_count: number;
  member_count: number;
  verification_status: string;
  created_at: string;
  upload_time: number;
}

function CustomUnsortedIcon() {
  return <UnfoldMoreIcon sx={{ color: '#02C2D9' }} />;
}

type FormValuesProps = {
  id: number;
  upload: number;
};
export default function AgencyAll(): React.ReactElement {
  const [id, setId] = useState();
  const [allUsers, setAllUsers] = useState<AllListProps[]>([]);
  const [searchValue, setSearchValue] = useState<string>('');
  const [allMeta, setAllMeta] = useState(Object);
  const [click, setClick] = useState<string | null>('');
  const [allPage, setAllPage] = useState(1);
  const [checkPage, setCheckPage] = useState(Object);
  const [selectStatus, setSelectStatus] = useState<string>('');
  const [actionType] = useState('');
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [dialogConfigurationOpen, setDialogConfigurationOpen] = useState<boolean>(false);
  const [refreshlist, setRefreshList] = useState<boolean>(false);

  const isMounted = useRef(false);

  const AgencyUserSchema = Yup.object().shape({
    upload: Yup.string().required('Field is required'),
  });

  const defaultValues = {
    upload: 0,
  };
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
      await axios
        .get('/api/admin/agencies', {
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
    getAllAgencyUsers();
    setRefreshList(false);
  }, [allPage, refreshlist]);

  useEffect(
    () => () => {
      isMounted.current = true;
    },
    []
  );

  const columnsAll: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Name',
      minWidth: 150,
      flex: 1,
      renderCell: (params) => (
        <Typography
          sx={{ textTransform: 'capitalize', whiteSpace: 'break-spaces', wordBreak: 'break-all' }}
          noWrap
        >
          {params.row.name ? params.row.name : '-'}
        </Typography>
      ),
    },

    {
      field: 'contact',
      headerName: 'Contact',
      minWidth: 250,
      sortable: false,
      flex: 1,
      renderCell: (params) =>
        params.row.contact || params.row.email ? (
          <div>
            <Typography>{params.row.contact}</Typography>
            <Typography
              sx={{
                whiteSpace: 'break-spaces',
                wordBreak: 'break-all',
              }}
              noWrap
            >
              {params.row.email}
            </Typography>
          </div>
        ) : (
          '-'
        ),
    },
    {
      field: 'event_count',
      headerName: 'Events',
      minWidth: 50,
      sortable: false,
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => <Typography color="primary">{params.row.event_count}</Typography>,
    },
    {
      field: 'member_count',
      headerName: 'Members',
      minWidth: 50,
      sortable: false,
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => <Typography color="primary">{params.row.member_count}</Typography>,
    },
    {
      field: 'created_at',
      headerName: 'Joined On',
      minWidth: 150,
      sortable: false,
      flex: 1,
      renderCell: (params) => {
        let dateStr = params.row.created_at.split('T')[0].split('-').reverse().join('-');
        return dateStr;
      },
    },
    {
      field: 'verification_status',
      headerName: 'KYC Status',
      minWidth: 130,
      sortable: false,
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => {
        let color;
        const status = params.row.verification_status;
        switch (status) {
          case REJECTED:
            color = '#D10303';
            break;
          case VERIFIED:
            color = '#7dd78d';
            break;
          case UPLOADED:
            color = '#B7B6B6';
            break;
          case PENDING:
            color = '#03E4FF';
            break;
          default:
            return;
        }
        return (
          <Button
            variant="contained"
            size="small"
            style={{
              borderRadius: '20px',
              width: '118px',
              height: '30px',
              color: params.row.verification_status === REJECTED ? '#fff' : '#000',
              backgroundColor: `${color}`,
            }}
          >
            {params.row.verification_status}
          </Button>
        );
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
        const removeUser = async () => {
          setDialogOpen(true);
          try {
            await axios.delete(`/api/admin/agencies/${id}`);
            enqueueSnackbar('Agency removed successfully', { variant: 'success' });
            const updatedUsers = allUsers.filter((allUser: any) => allUser.id !== id);
            setAllUsers(updatedUsers);
            setDialogOpen(false);
          } catch (error) {
            enqueueSnackbar(error.message, { variant: 'error' });
          }
        };
        const onSubmit = async (data: FormValuesProps) => {
          try {
            const response = await axios.post(`/api/admin/agency/${id}/configuration`, {
              upload_time: data.upload,
            });
            const { message } = response.data;
            enqueueSnackbar(message, { variant: 'success' });
            setDialogConfigurationOpen(false);
            getAllAgencyUsers();
            reset();
          } catch (error) {
            enqueueSnackbar(error.message, { variant: 'error' });
          }
        };
        const handleChange = async (id: any) => {};

        const handleSetUploadTime = (time: number) => {
          time ? setValue('upload', time) : setValue('upload', 0);
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
                    setId(params.row.id);
                    handleSetUploadTime(params.row.upload_time);
                  }}
                >
                  Manage Configurations
                </MenuItem>

                <MenuItem
                  value="remove"
                  onClick={() => {
                    setDialogOpen(true);
                    setId(params.row.id);
                  }}
                >
                  Remove User
                </MenuItem>
              </Select>
              <ConfirmationDialog
                isDialogOpen={dialogOpen}
                buttonMainLabel="No"
                buttonSecondaryLabel="Yes"
                dialogContent="Are you sure you want to Remove User?"
                dialogId="error-dialog-title"
                onClick={removeUser}
                onClose={() => setDialogOpen(false)}
              />
              <ManageConfigurations
                methods={methods}
                onSubmit={handleSubmit(onSubmit)}
                isDialogOpen={dialogConfigurationOpen}
                loading={isSubmitting}
                buttonSecondaryLabel="Save"
                dialogContent="Are you sure you want to Update Upload Configurations?"
                dialogId="error-dialog-title"
                onClose={() => setDialogConfigurationOpen(false)}
              />
            </FormControl>
          </>
        );
      },
    },
  ];

  const { enqueueSnackbar } = useSnackbar();

  const handlePaginate = (event: React.MouseEvent<HTMLElement>, newClick: string | null) => {
    setClick(newClick);
  };

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchInput = e.target.value;
    setSearchValue(e.target.value);
    if (searchInput === '') {
      setRefreshList(true);
    }

    if (e.target.value.length > 2) {
      try {
        const response = await axios.post('/api/admin/agencies/search', {
          search: {
            value: searchInput,
          },
        });
        const { data, links, meta } = response.data;
        setCheckPage(links);
        setAllMeta(meta);
        setAllUsers(data);
      } catch (error) {
        enqueueSnackbar(error.message, { variant: 'error' });
      }
    }
  };
  const handleDownload = async () => {
    try {
      await axios
        .get('/api/admin/agencies/export/', {
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
  };
  const selectUser = async (status: string) => {
    if (status === '') {
      setRefreshList(true);
    }
    try {
      const response = await axios.post(`/api/admin/agencies/search`, {
        filters: [{ field: 'verification_status', operator: '=', value: `${status}` }],
      });
      const { data, links, meta } = response.data;
      setCheckPage(links);
      setAllMeta(meta);
      setAllUsers(data);
    } catch (error) {
      enqueueSnackbar(error.message, { variant: 'error' });
    }
  };
  const selectChange = async (event: SelectChangeEvent) => {
    selectUser(event.target.value);
    setSelectStatus(event.target.value);
  };

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
          <Box sx={{ minWidth: 90 }}>
            <FormControl fullWidth>
              <Select
                sx={{
                  '.MuiOutlinedInput-notchedOutline': {
                    border: 'none',
                  },
                  '.MuiSelect-select': {
                    padding: '0px 0px 0 32px',
                  },
                }}
                value={selectStatus}
                onChange={selectChange}
                displayEmpty
              >
                <MenuItem value="">
                  <Typography variant="h6">Status</Typography>
                </MenuItem>
                <MenuItem value="verified">Verified</MenuItem>
                <MenuItem value="uploaded">Uploaded</MenuItem>
                <MenuItem value="rejected">Rejected</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
              </Select>
            </FormControl>
          </Box>
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
