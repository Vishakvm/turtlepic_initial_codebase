import React, { useState, useEffect, useRef } from 'react';

import {
  Box,
  styled,
  Typography,
  InputAdornment,
  ToggleButtonGroup,
  ToggleButton,
  Stack,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CloseIcon from '@mui/icons-material/Close';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';
import { useSnackbar } from 'notistack';

import {
  SearchInput,
  PaginateWrapper,
  TeamHeaderWrapper,
  TeamButtonStyle,
  TableWidthWrapper,
} from 'src/assets/shared/styles/SharedStylesComponent';
import axios from 'src/utils/axios';
import IconDownloadSVG from 'src/assets/shared/svg/icon_download';
import Page from '../components/Page';
import { ACCEPTED, REJECTED, REQUESTED, TRANSFERRED } from 'src/utils/constants';

// ----------------------------------------------------------------------

interface Team {
  id: number;
  name: string;
  email: string;
  phone_number?: null;
  event_date: string;
  client_status: string;
}

function CustomUnsortedIcon() {
  return <UnfoldMoreIcon sx={{ color: '#02C2D9' }} />;
}

const TableWrapper = styled(Box)(({ theme }) => ({
  height: '400px',
  padding: theme.spacing(0),
}));

const OuterWrapper = styled(Box)(({ theme }) => ({
  background: theme.palette.grey[300],
  padding: theme.spacing(2),
}));

export default function PageThree() {
  const [clientList, setClientList] = useState<Team[]>([]);
  const [searchValue, setSearchValue] = useState<string>('');
  const [clientMeta, setClientMeta] = useState(Object);
  const [checkPage, setCheckPage] = useState(Object);
  const [click, setClick] = useState<string | null>('');
  const [clientPage, setClientPage] = useState(1);
  const [refreshlist, setRefreshList] = useState<boolean>(false);

  const isMounted = useRef(false);

  const { enqueueSnackbar } = useSnackbar();

  // For displaying member
  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Name',
      minWidth: 150,
      flex: 1,
      sortable: true,
      renderCell: (params) => (
        <Typography
          sx={{
            textTransform: 'capitalize',
          }}
        >
          {params.row.name}
        </Typography>
      ),
    },

    {
      field: 'email',
      headerName: 'Email',
      minWidth: 150,
      flex: 1,
      sortable: false,
    },
    {
      field: 'phone_number',
      headerName: 'Phone Number',
      minWidth: 150,
      flex: 1,
      sortable: false,
    },
    {
      field: 'event_name',
      headerName: 'Event Name',
      minWidth: 150,
      flex: 1,
      sortable: false,
    },
    {
      field: 'event_date',
      headerName: 'Event Date',
      minWidth: 200,
      flex: 1,
      sortable: false,
    },
    {
      field: 'client_status',
      headerName: 'Status',
      minWidth: 100,
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      renderCell: (params) => {
        let color;
        const status = params.row.client_status;
        switch (status) {
          case ACCEPTED:
            color = '#F7DA75';
            break;
          case REQUESTED:
            color = '#B7B6B6';
            break;
          case TRANSFERRED:
            color = '#7dd78d';
            break;
          case REJECTED:
            color = '#FF2066';
            break;
          default:
            return;
        }
        return (
          <Typography
            sx={{
              color: color,
              textTransform: 'capitalize',
            }}
          >
            {params.row.client_status}
          </Typography>
        );
      },
    },
  ];

  useEffect(() => {
    const getClientList = async () => {
      try {
        await axios
          .get(`/api/account/clients`, {
            params: {
              page: clientPage,
            },
          })
          .then((response) => {
            if (!isMounted.current) {
              const { data, links, meta } = response.data;
              setCheckPage(links);
              setClientMeta(meta);
              setClientList(data.reverse());
            }
          });
      } catch (error) {
        enqueueSnackbar(error.message, { variant: 'error' });
      }
    };
    getClientList();
    setRefreshList(false);
  }, [clientPage, enqueueSnackbar, refreshlist]);

  useEffect(
    () => () => {
      isMounted.current = true;
    },
    []
  );

  const handlePaginate = (event: React.MouseEvent<HTMLElement>, newClick: string | null) => {
    setClick(newClick);
  };

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchInput = e.target.value;
    setSearchValue(e.target.value);
    if (e.target.value.length > 2) {
      try {
        const response = await axios.post('/api/account/clients/search', {
          search: {
            value: searchInput,
          },
        });
        const { data } = response.data;
        setClientList(data);
      } catch (error) {
        console.error(error);
        enqueueSnackbar(error.message, { variant: 'error' });
      }
    }
  };

  const handleDownload = async () => {
    try {
      await axios
        .get('/api/account/clients/export', {
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

  return (
    <Page
      title="Clients"
      header={true}
      headerTitle={
        <Typography color="primary" variant="h6">
          Clients
        </Typography>
      }
    >
      <OuterWrapper>
        <TableWidthWrapper>
          <TeamHeaderWrapper>
            {clientList.length !== 0 && (
              <TeamButtonStyle
                startIcon={<IconDownloadSVG />}
                color="inherit"
                size="small"
                onClick={handleDownload}
              >
                Download Sheet
              </TeamButtonStyle>
            )}

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
                <InputAdornment onClick={clearInput} position="end">
                  <CloseIcon fontSize="medium" color="secondary" />
                </InputAdornment>
              }
            />
          </TeamHeaderWrapper>

          <TableWrapper>
            <DataGrid
              sx={{
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
              }}
              rows={clientList}
              columns={columns}
              checkboxSelection={false}
              disableSelectionOnClick
              rowHeight={60}
              disableColumnMenu={true}
              getRowId={(r) => r.event_name}
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
              {clientMeta.total !== 0 && (
                <Typography variant="subtitle1">
                  {clientMeta.from} - {clientMeta.to} of {clientMeta.total}
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
                onClick={() => setClientPage(clientPage - 1)}
                disabled={checkPage.prev === null}
                value="prev"
              >
                <ArrowBackIosIcon fontSize="small" />
              </ToggleButton>
              <ToggleButton
                onClick={() => setClientPage(clientPage + 1)}
                disabled={checkPage.next === null}
                value="next"
              >
                <ArrowForwardIosIcon fontSize="small" />
              </ToggleButton>
            </ToggleButtonGroup>
          </PaginateWrapper>
        </TableWidthWrapper>
      </OuterWrapper>
    </Page>
  );
}
