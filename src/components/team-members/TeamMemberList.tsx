/*
 * Registered team members
 *
 */
import React, { useState, useEffect, useRef } from 'react';

import {
  Button,
  Box,
  styled,
  Typography,
  InputAdornment,
  ToggleButtonGroup,
  ToggleButton,
  Stack,
  Drawer,
  Switch,
  Checkbox,
  List,
  ListItem,
  ListItemIcon,
  ListSubheader,
} from '@mui/material';
import { DataGrid, GridColDef, GridRowId } from '@mui/x-data-grid';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CloseIcon from '@mui/icons-material/Close';
import ConfirmationDialog from 'src/components/dialogs/ConfirmationDialog';
import { LoadingButton } from '@mui/lab';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';
import IconBackSVG from 'src/assets/shared/svg/icon_back';
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
import useAuth from 'src/hooks/useAuth';
import useResponsive from 'src/hooks/useResponsive';

interface Team {
  id: number;
  name: string;
  email: string;
  phone_number?: null;
  events_used: number;
  access: string;
}

interface EventProps {
  date_display: string | null;
  event_status: string;
  has_access: boolean;
  host_name: string;
  id: number;
  name: string;
  slug: string;
  venue: string;
}
function CustomUnsortedIcon() {
  return <UnfoldMoreIcon sx={{ color: '#02C2D9' }} />;
}

const Wrapper = styled('div')(({ theme }) => ({
  background: theme.palette.grey[300],
  borderRadius: '3px',
}));
const TableWrapper = styled(Box)(({ theme }) => ({
  height: '400px',
}));
const WrapperDrawer = styled('div')(({ theme }) => ({
  padding: theme.spacing(5),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(0, 2, 0, 2),
  },
}));

const Option = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  paddingBottom: '3px',
}));

const ListWrapper = styled('div')(({ theme }) => ({
  minHeight: '250px',
  marginTop: '10px',
  background: theme.palette.grey[900],
}));
export default function TeamMemberList(): React.ReactElement {
  const [id, setId] = useState();
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [members, setMembers] = useState<Team[]>([]);
  const [searchValue, setSearchValue] = useState<string>('');
  const [teamMeta, setTeamMeta] = useState(Object);
  const [checkPage, setCheckPage] = useState(Object);
  const [click, setClick] = useState<string | null>('');
  const [teamPage, setTeamPage] = useState(1);
  const [refreshlist, setRefreshList] = useState<boolean>(false);
  const [permissionsDrawer, setPermissionsDrawer] = useState(false);
  const [userRole, setUserRole] = useState<string>('');
  const [userId, setUserId] = useState<number>(0);

  const [eventList, setEventList] = useState<Array<EventProps>>([]);
  const [currUser, setCurrUser] = useState('');
  const [toggle, setToggle] = useState<boolean>(false);

  const [memberId, setmemberId] = useState<GridRowId>();

  const isMounted = useRef(false);

  const { user } = useAuth();

  const isDesktop = useResponsive('up', 'lg');

  const { enqueueSnackbar } = useSnackbar();

  const [check, setCheck] = useState<number[]>([]);
  const isChecked = async (checkboxIdx: number, e: boolean, eventId: any) => {
    const updatedPermission = eventList[checkboxIdx];
    updatedPermission.has_access = e;
    const newPermission = [...eventList];
    newPermission[checkboxIdx] = updatedPermission;

    const newAccess = newPermission.filter((p) => p.has_access === true);
    const newAccessIds = newAccess.map((n: any) => n.id);
    setCheck(newAccessIds);
  };

  const handleAllCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
    setToggle(!toggle);
    if (event.target.checked) {
      const newArr = eventList.map((el, index) => ({
        ...el,
        has_access: true,
      }));
      setEventList(newArr);
      const newAccessIds = newArr.map((n: any) => n.id);
      setCheck(newAccessIds);
    } else {
      const newArr = eventList.map((el, index) => ({
        ...el,
        has_access: false,
      }));
      setEventList(newArr);
      setCheck([]);
    }
  };
  const grantAccess = async () => {
    try {
      const response = await axios.post(`/api/account/team/${memberId}/permission`, {
        events: check,
      });
      const { message } = response.data;
      enqueueSnackbar(message, { variant: 'success' });
      setPermissionsDrawer(false);
    } catch (error) {
      console.error(error);
      enqueueSnackbar(error.message, { variant: 'error' });
    }
  };
  // For displaying member
  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Name',
      minWidth: 170,
      flex: 1,
      renderCell: (params) => (
        <Typography sx={{ textTransform: 'capitalize' }} noWrap>
          {params.row.name ? params.row.name : '-'}
        </Typography>
      ),
    },

    { field: 'email', headerName: 'Email', minWidth: 200, sortable: false, flex: 1 },
    {
      field: 'phone_number',
      headerName: 'Phone',
      align: 'center',
      headerAlign: 'center',
      minWidth: 140,
      flex: 1,
      sortable: false,
    },
    {
      field: 'events_used',
      headerName: 'No. of Events',
      minWidth: 140,
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      renderCell: (params) => (
        <Typography color="primary">{params.row.event_access.length}</Typography>
      ),
    },
    {
      field: 'access',
      headerName: 'Access Rights',
      minWidth: 130,
      flex: 1,
      sortable: false,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => <Typography color="primary">{params.row.access}</Typography>,
    },
    {
      field: 'permissions',
      headerName: 'Permissions',
      minWidth: 130,
      flex: 1,
      sortable: false,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => {
        const handlePermissionsDrawer = () => {
          setmemberId(params.id);
          getMemberEvents(params.id);
          setPermissionsDrawer(true);
        };
        return (
          <>
            <Button
              size="small"
              onClick={() => {
                handlePermissionsDrawer();
              }}
              disabled={userRole === 'agency_member' || userId === params.row.id}
            >
              Edit
            </Button>
          </>
        );
      },
    },
    {
      field: 'delete',
      headerName: 'Actions',
      align: 'center',
      headerAlign: 'center',
      minWidth: 80,
      flex: 1,
      sortable: false,
      renderCell: (params) => {
        const inviteDeleteHandler = async () => {
          setDialogOpen(true);
          try {
            const response = await axios.delete(`/api/account/team/${id}`);
            const { message } = response.data;
            enqueueSnackbar(message, { variant: 'success' });
            const updatedMembers = members.filter((member: any) => member.id !== id);
            setMembers(updatedMembers);
            setDialogOpen(false);
          } catch (error) {
            enqueueSnackbar(error.message, { variant: 'error' });
          }
        };
        return (
          <>
            <Button
              size="small"
              onClick={() => {
                setDialogOpen(true);
                setId(params.row.id);
              }}
              disabled={userRole === 'agency_member' || userId === params.row.id}
            >
              Delete
            </Button>
            <ConfirmationDialog
              isDialogOpen={dialogOpen}
              buttonMainLabel="No , Keep it"
              buttonSecondaryLabel="Yes, Delete"
              dialogContent="Are you sure you want to Delete Invite?"
              dialogId="error-dialog-title"
              onClick={inviteDeleteHandler}
              onClose={() => setDialogOpen(false)}
            />
          </>
        );
      },
    },
  ];

  const handlePaginate = (event: React.MouseEvent<HTMLElement>, newClick: string | null) => {
    setClick(newClick);
  };

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchInput = e.target.value;
    setSearchValue(e.target.value);
    if (e.target.value.length > 2) {
      try {
        const response = await axios.post('/api/account/team/search', {
          search: {
            value: searchInput,
          },
        });
        const { data } = response.data;
        setMembers(data);
      } catch (error) {
        enqueueSnackbar(error.message, { variant: 'error' });
      }
    }
  };

  const handleDownload = async () => {
    try {
      await axios
        .get('/api/account/team/export', {
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

  const getMemberEvents = async (id: any) => {
    try {
      await axios.get(`/api/account/team`).then((response) => {
        const { data } = response.data;
        const currMember = data.filter((d: any) => d.id === id);
        setCurrUser(currMember.map((m: any) => m.name));
        const memberEvent = currMember.map((c: any) => c.event_access);
        for (const event of memberEvent) {
          setEventList(event.map((d: any) => d));

          const newAccess = event.filter((p: any) => p.has_access === true);
          const newAccessIds = newAccess.map((n: any) => n.id);
          setCheck(newAccessIds);
        }
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const getTeamMembers = async () => {
      try {
        await axios
          .get(`/api/account/team`, {
            params: {
              page: teamPage,
            },
          })
          .then((response) => {
            if (!isMounted.current) {
              const { data, links, meta } = response.data;
              setCheckPage(links);
              setTeamMeta(meta);
              setMembers(data);
            }
          });
      } catch (error) {
        enqueueSnackbar(error.message, { variant: 'error' });
      }
    };
    getTeamMembers();
    setRefreshList(false);
    user && setUserRole(user.role);
    user && setUserId(user.id);
  }, [teamPage, refreshlist, user, enqueueSnackbar, permissionsDrawer]);

  useEffect(
    () => () => {
      isMounted.current = true;
    },
    []
  );

  return (
    <>
      <TableWidthWrapper>
        <Wrapper>
          <TeamHeaderWrapper>
            <TeamButtonStyle
              startIcon={<IconDownloadSVG />}
              color="inherit"
              size="small"
              onClick={handleDownload}
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

                pl: 0.4,
              }}
              rows={members}
              columns={columns}
              checkboxSelection={false}
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
              <Typography variant="h5">
                {teamMeta.from} - {teamMeta.to} of {teamMeta.total}
              </Typography>
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
                onClick={() => setTeamPage(teamPage - 1)}
                disabled={checkPage.prev === null}
                value="prev"
              >
                <ArrowBackIosIcon fontSize="small" />
              </ToggleButton>
              <ToggleButton
                onClick={() => setTeamPage(teamPage + 1)}
                disabled={checkPage.next === null}
                value="next"
              >
                <ArrowForwardIosIcon fontSize="small" />
              </ToggleButton>
            </ToggleButtonGroup>
          </PaginateWrapper>
        </Wrapper>
      </TableWidthWrapper>

      <Drawer open={permissionsDrawer} anchor={'right'}>
        <Box role="presentation" sx={{ width: isDesktop ? '720px' : '100%' }}>
          <Button
            sx={{ color: '#fff', mx: 3 }}
            onClick={() => setPermissionsDrawer(false)}
            startIcon={<IconBackSVG />}
          >
            Back
          </Button>
          <WrapperDrawer>
            <Typography pb={1} align="center" variant="h2">
              Edit Permissions for
            </Typography>
            <Typography pb={1} align="center" variant="h3" color="primary">
              {currUser}
            </Typography>
            <Option>
              <Typography align="center" variant="h6">
                Restricted
              </Typography>
              <Switch checked={toggle} onChange={handleAllCheck} />
              <Typography align="center" variant="h6">
                Complete
              </Typography>
            </Option>

            {eventList.length ? (
              <ListWrapper>
                <List
                  subheader={
                    <ListSubheader
                      sx={{
                        p: 1,
                        background: 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <Typography variant="h4">Select</Typography>
                      <Typography variant="h4" pl={5}>
                        Events
                      </Typography>
                    </ListSubheader>
                  }
                  sx={{ width: '100%', maxWidth: '100%', px: 8, py: 6 }}
                >
                  {eventList.map((event: any, index: number) => (
                    <div key={index}>
                      <ListItem disablePadding sx={{ ml: 2 }}>
                        <ListItemIcon
                          sx={{
                            mr: 6,
                          }}
                        >
                          <Checkbox
                            size="medium"
                            checkedIcon={<CheckBoxIcon color="secondary" />}
                            edge="start"
                            checked={event.has_access}
                            tabIndex={-1}
                            onChange={() => {
                              isChecked(index, !event.has_access, event.id);
                            }}
                          />
                        </ListItemIcon>
                        <Typography variant="body1" pl={1}>
                          {event.name}
                        </Typography>
                      </ListItem>
                    </div>
                  ))}
                </List>
              </ListWrapper>
            ) : null}
            <Box textAlign={eventList.length ? 'right' : 'center'} mt={2}>
              <LoadingButton onClick={grantAccess} variant="contained" type="submit">
                Grant access
              </LoadingButton>
            </Box>
          </WrapperDrawer>
        </Box>
      </Drawer>
    </>
  );
}
