// @mui
import React, { useEffect, useState, useRef } from 'react';

import * as Yup from 'yup';
import {
  Drawer,
  Button,
  Box,
  Container,
  styled,
  Typography,
  InputAdornment,
  ToggleButtonGroup,
  ToggleButton,
  Tabs,
  Tab,
  Stack,
  List,
  ListItem,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CloseIcon from '@mui/icons-material/Close';
import { LoadingButton } from '@mui/lab';
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';

import { FormProvider, RHFTextField } from 'src/components/hook-form';
import {
  SearchInput,
  PaginateWrapper,
  TeamHeaderWrapper,
  TeamButtonStyle,
  TableWidthWrapper,
} from 'src/assets/shared/styles/SharedStylesComponent';

import axios from 'src/utils/axios';
import ConfirmationDialog from 'src/components/dialogs/ConfirmationDialog';
import IconBackSVG from 'src/assets/shared/svg/icon_back';
import IconDownloadSVG from 'src/assets/shared/svg/icon_download';
import Page from '../components/Page';
import TeamMemberList from 'src/components/team-members/TeamMemberList';
import useResponsive from 'src/hooks/useResponsive';

type FormValuesProps = {
  afterSubmit?: string;
  email: string;
};

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Div>{children}</Div>}
    </div>
  );
}

function teamTabProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const Div = styled('div')(({ theme }) => ({
  background: theme.palette.grey[300],
  borderRadius: '3px',
}));

export const Wrapper = styled('div')(({ theme }) => ({
  background: theme.palette.grey[300],
  borderRadius: '3px',
  padding: theme.spacing(1, 2),
}));

const TableWrapper = styled(Box)(({ theme }) => ({
  height: '400px',
}));

interface Invites {
  id: number;
  email: string;
  expire_days?: number;
  invited_by?: string;
  created_at?: string;
}

export default function TeamMembers() {
  const [inviteDrawer, setInviteDrawer] = React.useState<boolean>(false);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [refreshlist, setRefreshList] = useState<boolean>(false);
  const [memberId, setMemberId] = useState('');
  const [searchValue, setSearchValue] = useState<string>('');
  const [inviteMembers, setInviteMembers] = useState<any | Invites[]>([]);
  const [inviteMeta, setInviteMeta] = useState(Object);
  const [checkPage, setCheckPage] = useState(Object);
  const [click, setClick] = useState<string | null>('');
  const [invitePage, setInvitePage] = useState(1);
  const [value, setValue] = React.useState(0);
  const [alreadyInvited, setAlreadyInvited] = useState<string[]>([]);
  const [alreadyRegistered, setAlreadyRegistered] = useState<string[]>([]);
  const [showInvitedList, setShowInvitedList] = useState(false);
  const [showRegisteredList, setShowRegisteredList] = useState(false);

  const isMounted = useRef(false);

  const { enqueueSnackbar } = useSnackbar();

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  // For displaying Invited member
  const invitedcolumns: GridColDef[] = [
    { field: 'email', headerName: 'Email', minWidth: 150, sortable: false, flex: 1 },
    {
      field: 'expire_days',
      headerName: 'Expiry Days',
      minWidth: 150,
      flex: 1,
      sortable: false,
      align: 'center',
      headerAlign: 'center',
      renderCell: (cellValues) => (
        <div
          style={{
            color: '#7dd78d',
          }}
        >
          {cellValues.value}
        </div>
      ),
    },
    {
      field: 'invited_by',
      headerName: 'Invited By',
      minWidth: 150,
      flex: 1,

      sortable: false,
    },
    {
      field: 'created_at',
      headerName: 'Invited On',
      minWidth: 150,
      flex: 1,
      sortable: false,
      renderCell: (params) => {
        const dateStr = params.row.created_at.split(' ')[0];
        return <div>{dateStr}</div>;
      },
    },
    {
      field: 'resend',
      headerName: 'Actions',
      minWidth: 100,
      flex: 1,
      sortable: false,
      renderCell: (params) => {
        const inviteResendHandler = async (e: any) => {
          e.stopPropagation();
          const { id } = params.row;
          try {
            const response = await axios.post(`api/account/invites/${id}/resend`);
            const { message } = response.data;
            enqueueSnackbar(message, { variant: 'success' });
          } catch (error) {
            enqueueSnackbar(error.message, { variant: 'error' });
          }
        };
        const inviteCancelHandler = async () => {
          setDialogOpen(true);
          try {
            const response = await axios.delete(`/api/account/invites/${memberId}`);
            const { message } = response.data;
            enqueueSnackbar(message, { variant: 'success' });
            const updatedMembers = inviteMembers.filter((member: any) => member.id !== memberId);
            setInviteMembers(updatedMembers);
            setDialogOpen(false);
          } catch (error) {
            enqueueSnackbar(error.message, { variant: 'error' });
          }
        };
        return (
          <>
            <Button size="small" onClick={inviteResendHandler}>
              Resend
            </Button>
            <Button
              sx={{ ml: 5 }}
              size="small"
              onClick={() => {
                setDialogOpen(true);
                setMemberId(params.row.id);
              }}
            >
              Cancel
            </Button>
            <ConfirmationDialog
              isDialogOpen={dialogOpen}
              buttonMainLabel="No , Keep it"
              buttonSecondaryLabel="Yes, Cancel"
              dialogContent="Are you sure you want to Cancel Invite?"
              dialogId="error-dialog-title"
              onClick={inviteCancelHandler}
              onClose={() => setDialogOpen(false)}
            />
          </>
        );
      },
    },
  ];

  const InviteSchema = Yup.object().shape({
    email: Yup.string().required('Email is required').trim(),
  });

  useEffect(() => {
    const getInviteMembers = async () => {
      try {
        await axios
          .get('/api/account/invites', {
            params: {
              page: invitePage,
            },
          })
          .then((response) => {
            if (!isMounted.current) {
              const { data, links, meta } = response.data;
              setCheckPage(links);
              setInviteMeta(meta);
              setInviteMembers(data);
            }
          });
      } catch (error) {
        enqueueSnackbar(error.message, { variant: 'error' });
      }
    };
    getInviteMembers();
    setRefreshList(false);
  }, [invitePage, inviteDrawer, refreshlist, enqueueSnackbar]);

  useEffect(
    () => () => {
      isMounted.current = true;
    },
    []
  );

  const handlePaginate = (event: React.MouseEvent<HTMLElement>, newClick: string | null) => {
    setClick(newClick);
  };

  const isDesktop = useResponsive('up', 'lg');

  const defaultValues = {
    email: '',
  };
  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(InviteSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data: FormValuesProps) => {
    const { email } = data;

    let emails = email.split(',').map((item) => item.trim());

    try {
      const response = await axios.post('/api/account/invites', {
        emails,
      });
      const { message, alreadyInvited, alreadyRegistered } = response.data;
      setAlreadyInvited(alreadyInvited);
      setAlreadyRegistered(alreadyRegistered);

      if (alreadyInvited.length) {
        setShowInvitedList(true);
      }
      if (alreadyRegistered.length) {
        setShowRegisteredList(true);
      }
      reset();
      enqueueSnackbar(message, { variant: 'success' });

      if (alreadyInvited.length || alreadyRegistered.length) {
        setTimeout(() => {
          setShowInvitedList(false);
          setShowRegisteredList(false);
          setInviteDrawer(false);
        }, 5000);
      } else {
        setInviteDrawer(false);
      }
    } catch (error) {
      console.error(error);
      enqueueSnackbar(error.message, { variant: 'error' });
    }
  };

  const InviteForm = () => (
    <Box role="presentation" sx={{ width: isDesktop ? '720px' : '100%', p: 4 }}>
      <Button
        sx={{ color: '#fff' }}
        onClick={(): void => {
          setInviteDrawer(false);
          setShowInvitedList(false);
          setShowRegisteredList(false);
        }}
        startIcon={<IconBackSVG />}
      >
        Back
      </Button>
      <Typography py={4} align="center" variant="h2">
        Invite new team members
      </Typography>
      <Container>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <RHFTextField name="email" label="" placeholder="Email, comma separated" />
          <Box textAlign="center">
            <LoadingButton
              variant="contained"
              loading={isSubmitting}
              type="submit"
              sx={{ width: '200px' }}
            >
              Invite
            </LoadingButton>
          </Box>
        </FormProvider>
        <Box sx={{ mt: 10, color: 'error.main' }}>
          {showInvitedList || showRegisteredList ? (
            <Typography variant="h2">Invites will not be sent to these emails:</Typography>
          ) : null}
          {showInvitedList && (
            <>
              <ul>
                <li>
                  <Typography variant="h4" mt={2}>
                    Already Invited
                  </Typography>
                </li>
              </ul>
              <List dense>
                <ListItem>
                  <>
                    {alreadyInvited.map((a: string, i) => (
                      <Typography variant="h5" key={i}>
                        {a} ,{' '}
                      </Typography>
                    ))}
                  </>
                </ListItem>
              </List>
            </>
          )}
          {showRegisteredList && (
            <>
              <ul>
                <li>
                  <Typography variant="h4">Already Registered</Typography>
                </li>
              </ul>
              <List dense>
                <ListItem>
                  <>
                    {alreadyRegistered.map((a: string, i) => (
                      <Typography variant="h5" key={i}>
                        {a} ,{' '}
                      </Typography>
                    ))}
                  </>
                </ListItem>
              </List>
            </>
          )}
        </Box>
      </Container>
    </Box>
  );

  // Search Handler

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchInput = e.target.value;
    if (searchInput === '') {
      setRefreshList(true);
    }
    setSearchValue(e.target.value);
    if (e.target.value.length > 2) {
      try {
        const response = await axios.post('/api/account/invites/search', {
          search: {
            value: searchInput,
          },
        });
        const { data } = response.data;
        setInviteMembers(data);
      } catch (error) {
        enqueueSnackbar(error.message, { variant: 'error' });
      }
    }
  };

  const handleDownload = async () => {
    try {
      await axios
        .get('/api/account/invites/export', {
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
      title="Team Members"
      header={true}
      headerTitle={
        <Typography color="primary" variant="h6">
          Team Members
        </Typography>
      }
    >
      <>
        <Drawer anchor={'right'} open={inviteDrawer}>
          {InviteForm()}
        </Drawer>
        <Button
          onClick={(): void => {
            setInviteDrawer(true);
          }}
          startIcon={<PersonAddAltOutlinedIcon />}
          color="info"
          variant="contained"
          sx={{ my: 1.2 }}
        >
          invite new members
        </Button>
      </>
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={value}
            onChange={handleChange}
            variant="scrollable"
            scrollButtons={false}
            allowScrollButtonsMobile
            TabIndicatorProps={{
              style: {
                height: '5px',
                borderRadius: '1px',
              },
            }}
          >
            <Tab label="Registered Team Members" {...teamTabProps(0)} sx={{ px: 4 }} />

            <Tab label="Invited Team Members" {...teamTabProps(1)} sx={{ px: 4 }} />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          <Wrapper>
            <TeamMemberList />
          </Wrapper>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <TableWidthWrapper>
            <Wrapper>
              <TeamHeaderWrapper>
                {inviteMembers.length !== 0 && (
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

                    pl: 0.4,
                  }}
                  rows={inviteMembers}
                  columns={invitedcolumns}
                  checkboxSelection={false}
                  disableSelectionOnClick
                  rowHeight={60}
                  disableColumnMenu={true}
                  components={{
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
                  {inviteMeta.total !== 0 && (
                    <Typography variant="h5">
                      {inviteMeta.from} - {inviteMeta.to} of {inviteMeta.total}
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
                    onClick={() => setInvitePage(invitePage - 1)}
                    disabled={checkPage.prev === null}
                    value="prev"
                  >
                    <ArrowBackIosIcon fontSize="small" />
                  </ToggleButton>
                  <ToggleButton
                    onClick={() => setInvitePage(invitePage + 1)}
                    disabled={checkPage.next === null}
                    value="next"
                  >
                    <ArrowForwardIosIcon fontSize="small" />
                  </ToggleButton>
                </ToggleButtonGroup>
              </PaginateWrapper>
            </Wrapper>
          </TableWidthWrapper>
        </TabPanel>
      </Box>
    </Page>
  );
}
