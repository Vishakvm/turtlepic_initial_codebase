import React, { useState, useEffect, useRef } from 'react';
import * as Yup from 'yup';

import { DataGrid, GridColDef } from '@mui/x-data-grid';
import {
  Typography,
  Stack,
  InputAdornment,
  ToggleButtonGroup,
  ToggleButton,
  styled,
  Box,
} from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';

import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';
import { useSnackbar } from 'notistack';

import CancelIcon from '@mui/icons-material/Cancel';

//@ts-ignore
import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';

import {
  SearchInput,
  PaginateWrapper,
  TableWidthWrapper,
  TeamHeaderWrapper,
  TeamButtonStyle,
} from 'src/assets/shared/styles/SharedStylesComponent';
import { TableWrapper, KycListProps, TableBackground } from 'src/pages/superAdmin/Dashboard';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import axios from 'src/utils/axios';

import IconDownloadSVG from 'src/assets/shared/svg/icon_download';
import RejectConfirmation from 'src/components/dialogs/RejectDialog';
import ConfirmationDialog from 'src/components/dialogs/ConfirmationDialog';
import { UPLOADED } from 'src/utils/constants';

const ActionWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
}));

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

function CustomUnsortedIcon() {
  return <UnfoldMoreIcon sx={{ color: '#02C2D9' }} />;
}

type FormValuesProps = {
  reject_reason: string;
};

export default function KycUploaded() {
  const [id, setId] = useState();
  const [pendingKycList, setPendingKycList] = useState<KycListProps[]>([]);
  const [searchValue, setSearchValue] = useState<string>('');
  const [pendingMeta, setAllMeta] = useState(Object);
  const [click, setClick] = useState<string | null>('');
  const [pendingPage, setPendingPage] = useState(1);
  const [checkPage, setCheckPage] = useState(Object);
  const [openApprove, setOpenApprove] = useState(false);
  const [openReject, setOpenReject] = useState(false);
  const [refreshlist, setRefreshList] = useState<boolean>(false);
  const [showGallery, setShowGallery] = useState(false);
  const [docs, setDocs] = useState<Object[]>([]);
  const isMounted = useRef(false);

  const handleOpenApprove = () => {
    setOpenApprove(true);
  };

  const handleCloseApprove = () => {
    setOpenApprove(false);
  };
  const handleOpenReject = () => {
    setOpenReject(true);
  };

  const handleCloseReject = () => {
    setOpenReject(false);
  };

  const PlanSchema = Yup.object().shape({
    reject_reason: Yup.string().required('Field is required'),
  });

  const defaultValues = {
    reject_reason: '',
  };
  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(PlanSchema),
    defaultValues,
  });
  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const { enqueueSnackbar } = useSnackbar();

  const handlePaginate = (event: React.MouseEvent<HTMLElement>, newClick: string | null) => {
    setClick(newClick);
  };
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
      minWidth: 200,
      sortable: false,
      flex: 1,
      renderCell: (params) =>
        params.row.contact || params.row.email ? (
          <div>
            <Typography noWrap>{params.row.contact}</Typography>
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
      field: 'gst_no',
      headerName: 'GST',
      minWidth: 150,
      sortable: false,
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (params.row.gst_no ? params.row.gst_no : '-'),
    },
    {
      field: 'pan',
      headerName: 'PAN',
      minWidth: 150,
      sortable: false,
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (params.row.pan ? params.row.pan : '-'),
    },
    {
      field: 'address_line_1',
      headerName: 'Address',
      minWidth: 200,
      sortable: false,
      flex: 1,
      renderCell: (params) => (
        <div>
          <Typography
            sx={{
              whiteSpace: 'break-spaces',
              wordBreak: 'break-all',
            }}
            noWrap
          >
            {params.row.address_line_1 ? params.row.address_line_1 : '-'}
          </Typography>
          <Typography noWrap>
            {params.row.address_line_2 ? params.row.address_line_2 : '-'},
          </Typography>
          <Typography
            sx={{
              whiteSpace: 'break-spaces',
              wordBreak: 'break-all',
            }}
            noWrap
          >
            {params.row.city ? params.row.city : '-'},
            {params.row.state ? params.row.state.name : '-'},
            {params.row.country ? params.row.country.name : '-'}
          </Typography>
        </div>
      ),
    },
    {
      field: 'created_at',
      headerName: 'Date',
      minWidth: 100,
      sortable: false,
      flex: 1,
      renderCell: (params) => {
        let dateStr = params.row.created_at.split('T')[0].split('-').reverse().join('-');
        return dateStr;
      },
    },
    {
      field: 'attachment',
      headerName: 'Action',
      minWidth: 100,
      sortable: false,
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => {
        const approveUser = async () => {
          try {
            await axios.post(`/api/admin/kyc/${id}/verify`);
            enqueueSnackbar('User verified', { variant: 'success' });
            const pendingUsers = pendingKycList.filter((pendingUser: any) => pendingUser.id !== id);
            setPendingKycList(pendingUsers);
            setOpenApprove(false);
          } catch (error) {
            setOpenApprove(false);
            enqueueSnackbar(error.message, { variant: 'error' });
          }
        };

        const onSubmit = async (data: FormValuesProps) => {
          const rejectReasonData = new FormData();
          rejectReasonData.append('reject_reason', data.reject_reason);
          try {
            await axios.post(`/api/admin/kyc/${id}/reject`, rejectReasonData);
            enqueueSnackbar('User rejected', { variant: 'success' });
            const rejectUsers = pendingKycList.filter((rejectUser: any) => rejectUser.id !== id);
            setPendingKycList(rejectUsers);
            setOpenReject(false);
            reset();
          } catch (error) {
            enqueueSnackbar(error.message, { variant: 'error' });
            setOpenReject(false);
          }
        };
        const handleOpenDocument = () => {
          const gst = params.row.gst_document;
          const panF = params.row.pan_front;
          const panB = params.row.pan_back;
          if (gst || panF || panB !== null) {
            const documents = [];
            documents.push(
              { original: gst.original_url },
              { original: panF.original_url },
              { original: panB.original_url }
            );
            setDocs(documents);
            setShowGallery(true);
          } else {
            enqueueSnackbar('No Document Found', { variant: 'error' });
          }
        };
        return (
          <>
            <ActionWrapper>
              <AttachFileIcon onClick={handleOpenDocument} sx={{ cursor: 'pointer' }} />
              <CancelRoundedIcon
                color="error"
                sx={{ margin: '0 6px 0 6px', cursor: 'pointer' }}
                onClick={() => {
                  handleOpenReject();
                  setId(params.row.id);
                }}
              />
              <CheckCircleIcon
                color="primary"
                sx={{ cursor: 'pointer' }}
                onClick={() => {
                  handleOpenApprove();
                  setId(params.row.id);
                }}
              />
            </ActionWrapper>

            <ConfirmationDialog
              isDialogOpen={openApprove}
              buttonMainLabel="Cancel"
              buttonSecondaryLabel=" Approve KYC"
              dialogContent="Are you sure you want to approve KYC?"
              dialogId="error-dialog-title"
              onClick={approveUser}
              onClose={() => handleCloseApprove()}
            />
            <RejectConfirmation
              methods={methods}
              onSubmit={handleSubmit(onSubmit)}
              isDialogOpen={openReject}
              loading={isSubmitting}
              buttonSecondaryLabel="Reject"
              dialogContent="Are you sure you want to reject KYC?"
              dialogId="error-dialog-title"
              onClose={() => handleCloseReject()}
            />
          </>
        );
      },
    },
  ];

  // Search Handler

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchInput = e.target.value;
    if (searchInput === '') {
      setRefreshList(true);
    }
    setSearchValue(e.target.value);
    if (e.target.value.length > 2) {
      try {
        const response = await axios.post('/api/admin/agencies/search', {
          search: {
            value: searchValue,
          },
          filters: [{ field: 'verification_status', operator: '=', value: UPLOADED }],
        });
        const { data } = response.data;
        setPendingKycList(data);
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
  useEffect(() => {
    const getAllUsers = async () => {
      try {
        await axios
          .post(`/api/admin/agencies/search`, {
            filters: [{ field: 'verification_status', operator: '=', value: UPLOADED }],
          })
          .then((response) => {
            if (!isMounted.current) {
              const { data, links, meta } = response.data;
              setCheckPage(links);
              setAllMeta(meta);
              setPendingKycList(data);
            }
          });
      } catch (error) {
        enqueueSnackbar(error.message, { variant: 'error' });
      }
    };
    getAllUsers();
    setRefreshList(false);
  }, [enqueueSnackbar, refreshlist]);

  useEffect(
    () => () => {
      isMounted.current = true;
    },
    []
  );

  return (
    <div style={{ position: 'relative' }}>
      {showGallery ? (
        <>
          <Box sx={{ zIndex: 4, position: 'absolute', right: 40 }}>
            <CancelIcon
              onClick={() => setShowGallery(false)}
              color="primary"
              sx={{ fontSize: '2rem', cursor: 'pointer' }}
            />
          </Box>
          <ImageGallery items={docs} height="500px" showThumbnails={false} />
        </>
      ) : (
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
                  <InputAdornment position="end">
                    <CloseIcon onClick={clearInput} fontSize="medium" color="secondary" />
                  </InputAdornment>
                }
              />
            </TeamHeaderWrapper>
            <TableWrapper>
              <Table
                rows={pendingKycList}
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
                {pendingMeta.total !== 0 && (
                  <Typography variant="h5">
                    {pendingMeta.from} - {pendingMeta.to} of {pendingMeta.total}
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
                  onClick={() => setPendingPage(pendingPage - 1)}
                  disabled={checkPage.prev === null}
                  value="prev"
                >
                  <ArrowBackIosIcon fontSize="small" />
                </ToggleButton>
                <ToggleButton
                  onClick={() => setPendingPage(pendingPage + 1)}
                  disabled={checkPage.next === null}
                  value="next"
                >
                  <ArrowForwardIosIcon fontSize="small" />
                </ToggleButton>
              </ToggleButtonGroup>
            </PaginateWrapper>
          </TableBackground>
        </TableWidthWrapper>
      )}
    </div>
  );
}
