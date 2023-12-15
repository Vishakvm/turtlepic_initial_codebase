import React, { useEffect, useState, useRef } from 'react';

import { Button, InputAdornment, Stack, styled, Typography } from '@mui/material';

import { useNavigate } from 'react-router';
import { useSnackbar } from 'notistack';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import axios from 'src/utils/axios';
import { eventDetails } from 'src/redux/slices/createEvent';
import { PATH_MAIN } from 'src/routes/paths';
import { useDispatch } from 'src/redux/store';
import { ACCEPTED, CLIENT, REJECTED, REQUESTED, WORKSPACE } from 'src/utils/constants';
import useAuth from 'src/hooks/useAuth';
import { TableWrapper, TableBackground } from 'src/pages/superAdmin/Dashboard';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';

import {
  SearchInput,
  PaginateWrapper,
  TableWidthWrapper,
  TeamHeaderWrapper,
} from 'src/assets/shared/styles/SharedStylesComponent';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';
import ConfirmationDialog from 'src/components/dialogs/ConfirmationDialog';

const ActionWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
}));
function CustomUnsortedIcon() {
  return <UnfoldMoreIcon sx={{ color: '#02C2D9' }} />;
}

type RequestedProps = {
  date_display: number;
  event_status: string;
  event_type: string;
  slug: string;
  host_name: string;
  id: number;
  name: string;
  photo_count: number;
  video_count: number;
  venue: string;
};

export default function RequestedEventsTab(): React.ReactElement {
  const isMounted = useRef(false);
  const { user } = useAuth();

  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const [searchValue, setSearchValue] = useState<string>('');
  const [allMeta, setAllMeta] = useState(Object);
  const [allPage, setAllPage] = useState(1);
  const [checkPage, setCheckPage] = useState(Object);
  const [reqData, setReqData] = useState<RequestedProps[]>([]);
  const [openReject, setOpenReject] = useState(false);
  const [openApprove, setOpenApprove] = useState(false);
  const [eventId, setEventId] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const getEventArea = async (page?: number) => {
    try {
      await axios
        .post(`/api/events/search?limit=10`, {
          params: {
            page: page,
          },
          filters: [{ field: 'client_status', operator: '=', value: REQUESTED }],
        })
        .then((response) => {
          if (!isMounted.current) {
            const { data, meta, links } = response.data;
            setReqData(data);
            setAllMeta(meta);
            setCheckPage(links);
          }
        });
    } catch (error) {
      enqueueSnackbar(error.message, { variant: 'error' });
    }
  };
  useEffect(() => {
    if (user?.account_type === CLIENT) {
      getEventArea();
    }

    return () => {
      isMounted.current = true;
    };
  }, []);

  const workspaceEventClick = (
    eventName: string,
    eventDate: string,
    eventVenue: string,
    eventId: number,
    eventStatus: string,
    eventType: string,
    eventSlug: string,
    email: string,
    clientStatus: string
  ) => {
    dispatch(
      eventDetails({
        name: eventName,
        id: eventId,
        venue: eventVenue,
        date: eventDate,
        event_status: eventStatus,
        eventType: eventType,
        slug: eventSlug,
        is_event_list: true,
        client_email: email,
        client_status: clientStatus,
      })
    );
    eventType === WORKSPACE
      ? navigate(PATH_MAIN.createWorkspaceEvent)
      : navigate(PATH_MAIN.createClientEvent);
  };

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchInput = e.target.value;
    if (searchInput === '') {
      getEventArea();
    }
    setSearchValue(e.target.value);
    if (e.target.value.length > 2) {
      try {
        const response = await axios.post('/api/events/search', {
          search: {
            value: searchValue,
          },
        });
        const { data } = response.data;
        setReqData(data);
      } catch (error) {
        enqueueSnackbar(error.message, { variant: 'error' });
      }
    }
  };
  const clearInput = () => {
    setSearchValue('');
    getEventArea();
  };
  const handlePaginate = async (action: string) => {
    if (action === 'next') {
      setAllPage(allPage + 1);
      const next = allPage + 1;
      getEventArea(next);
    } else {
      setAllPage(allPage - 1);
      const prev = allPage - 1;
      getEventArea(prev);
    }
  };

  const columnsAll: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Event',
      minWidth: 100,
      flex: 1,

      renderCell: (params) => (
        <Typography sx={{ textTransform: 'capitalize' }} noWrap>
          {params.row.name ? params.row.name : '-'}
        </Typography>
      ),
    },

    {
      field: 'host_name',
      headerName: 'Studio',
      minWidth: 100,
      sortable: false,
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <Typography sx={{ textTransform: 'capitalize' }} noWrap>
          {params.row.host_name ? params.row.host_name : '-'}
        </Typography>
      ),
    },
    {
      field: 'count',
      headerName: 'Content',
      minWidth: 100,
      sortable: false,
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) =>
        params.row.photo_count || params.row.video_count ? (
          <div>
            {params.row.photo_count ? (
              <>
                <Typography noWrap>{params.row.photo_count} Photos</Typography>
              </>
            ) : (
              '-'
            )}

            {params.row.video_count ? (
              <>
                <Typography noWrap>{params.row.video_count} Videos</Typography>
              </>
            ) : (
              '-'
            )}
          </div>
        ) : (
          '-'
        ),
    },

    {
      field: 'date_display',
      headerName: 'Date',
      minWidth: 100,
      sortable: false,
      headerAlign: 'center',
      align: 'center',
      flex: 1,
      renderCell: (params) => (
        <Typography sx={{ textTransform: 'capitalize' }} noWrap>
          {params.row.date_display ? params.row.date_display : '-'}
        </Typography>
      ),
    },
    {
      field: 'attachment',
      headerName: 'Action',
      minWidth: 100,
      sortable: false,
      headerAlign: 'center',
      align: 'center',
      flex: 1,
      renderCell: (params) => {
        const handleRejectEvent = async (response: string, id: number) => {
          setLoading(true);
          const approveData = new FormData();
          approveData.append('response_status', response);
          try {
            const response = await axios.post(`/api/events/${id}/client`, approveData);
            const { message } = response.data;
            enqueueSnackbar(message, { variant: 'success' });
            setOpenReject(false);
            setLoading(false);
            getEventArea();
          } catch (error) {
            setOpenReject(false);
            setLoading(false);
            enqueueSnackbar(error.message, { variant: 'error' });
          }
        };
        const handleApproveEvent = async (response: string, id: number) => {
          setLoading(true);
          const approveData = new FormData();
          approveData.append('response_status', response);
          try {
            const response = await axios.post(`/api/events/${id}/client`, approveData);
            const { message } = response.data;
            enqueueSnackbar(message, { variant: 'success' });
            setOpenApprove(false);
            setLoading(true);
            navigate(PATH_MAIN.createClientEvent);
          } catch (error) {
            setLoading(false);
            setOpenApprove(false);
            enqueueSnackbar(error.message, { variant: 'error' });
          }
        };
        return (
          <>
            <ActionWrapper>
              <VisibilityOutlinedIcon
                onClick={() => {
                  workspaceEventClick(
                    params.row.name,
                    params.row.date_display,
                    params.row.venue,
                    params.row.id,
                    params.row.event_status,
                    params.row.event_type,
                    params.row.slug,
                    params.row.client.email,
                    params.row.client_status
                  );
                }}
                sx={{ cursor: 'pointer' }}
              />
              <CancelRoundedIcon
                color="error"
                sx={{ mx: 2, cursor: 'pointer' }}
                onClick={() => {
                  setOpenReject(true);
                  setEventId(params.row.id);
                }}
              />
              <CheckCircleIcon
                color="primary"
                sx={{ cursor: 'pointer' }}
                onClick={() => {
                  setOpenApprove(true);
                  setEventId(params.row.id);
                }}
              />
            </ActionWrapper>
            <ConfirmationDialog
              loading={loading}
              isDialogOpen={openReject}
              buttonMainLabel="Cancel"
              buttonSecondaryLabel="Reject Event"
              dialogContent="Are you sure you want to reject event?"
              dialogId="error-dialog-title"
              onClick={() => handleRejectEvent(REJECTED, eventId)}
              onClose={() => setOpenReject(false)}
            />
            <ConfirmationDialog
              loading={loading}
              isDialogOpen={openApprove}
              buttonMainLabel="Cancel"
              buttonSecondaryLabel="Approve Event"
              dialogContent="Are you sure you want to 
        approve event?"
              dialogId="error-dialog-title"
              onClick={() => handleApproveEvent(ACCEPTED, eventId)}
              onClose={() => setOpenApprove(false)}
            />
          </>
        );
      },
    },
  ];

  return (
    <TableWidthWrapper>
      <TableBackground>
        <TeamHeaderWrapper>
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
              <InputAdornment position="end">
                <CloseIcon onClick={clearInput} fontSize="medium" color="secondary" />
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

              pl: 0.4,
            }}
            rows={reqData}
            columns={columnsAll}
            disableSelectionOnClick
            rowHeight={60}
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
          <div>
            <Button
              disabled={checkPage?.prev === null}
              onClick={() => handlePaginate('back')}
              size="small"
            >
              <ArrowBackIosIcon
                sx={{
                  color: `#fff`,
                }}
                fontSize="small"
              />
            </Button>
            <Button
              size="small"
              disabled={checkPage?.next === null}
              onClick={() => handlePaginate('next')}
            >
              <ArrowForwardIosIcon
                sx={{
                  color: `#fff`,
                }}
                fontSize="small"
              />
            </Button>
          </div>
        </PaginateWrapper>
      </TableBackground>
    </TableWidthWrapper>
  );
}
