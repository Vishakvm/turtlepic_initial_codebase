import React, { useLayoutEffect, useState } from 'react';

import {
  Button,
  styled,
  Typography,
  InputAdornment,
  Stack,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CloseIcon from '@mui/icons-material/Close';
import LandscapeRoundedIcon from '@mui/icons-material/LandscapeRounded';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';
import { useSnackbar } from 'notistack';

import axios from 'src/utils/axios';
import CreateEventFooterView from '../../elements/CreateEventFooter';
import IconBackSVG from 'src/assets/shared/svg/icon_back';
import IconDownloadSVG from 'src/assets/shared/svg/icon_download';
import { useSelector } from 'src/redux/store';

import {
  SearchInput,
  TeamButtonStyle,
  TableWidthWrapper,
  PaginateWrapper,
} from 'src/assets/shared/styles/SharedStylesComponent';
import ImageDialog from './Dialog/ImageDialog';

function CustomUnsortedIcon() {
  return <UnfoldMoreIcon sx={{ color: '#02C2D9' }} />;
}
export const TeamHeaderWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  width: '100%',
  justifyContent: 'flex-end',
  alignItems: 'flex-end',
  marginBottom: theme.spacing(2),
  [theme.breakpoints.down('sm')]: {
    display: 'block',
  },
}));

const Wrapper = styled('div')(({ theme }) => ({
  background: theme.palette.grey[300],
  borderRadius: '3px',
  padding: theme.spacing(0, 2, 2, 2),
}));

const ImgWrapper = styled('div')(({ theme }) => ({
  width: '4.5rem',
  height: '2.5rem',
  borderRadius: '6px',
  background: theme.palette.common.black,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  cursor: 'pointer',
}));

const ImgStyle = styled('img')(({ theme }) => ({
  objectFit: 'cover',
  width: '100%',
  height: '100%',
  borderRadius: '6px',
}));

interface RegisteredGuestsType {
  id: number;
  selfie: {
    thumbnail_url: string;
  };
  name: string;
  email: string;
  phone_number?: null;
  date: Date;
  venue: string;
}
interface TabNextProps {
  preRegisterTabRedirect: (index: number) => void;
  nextIndex: number;
  prevIndex: number;
}

const PreregisteredGuestsView = ({
  preRegisterTabRedirect,
  nextIndex,
  prevIndex,
}: TabNextProps) => {
  const [searchValue, setSearchValue] = useState<string>('');
  const [registeredGuests, setRegisteredGuests] = useState<RegisteredGuestsType[]>([]);
  const [meta, setMeta] = useState(Object);
  const [checkPage, setCheckPage] = useState(Object);
  const [refreshlist, setRefreshList] = useState<boolean>(false);
  const [click, setClick] = useState<string | null>('');
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState([] as any);
  const [url, setUrl] = useState<string>('');

  const [viewImage, setViewImage] = useState(false);

  const eventDetail = useSelector((state) => state.createEvent.value);

  const { enqueueSnackbar } = useSnackbar();

  useLayoutEffect(() => {
    let limit = 10;

    const getPRGuests = async () => {
      try {
        const response = await axios.get(`/api/events/${eventDetail.id}/guests?limit=${limit}`, {
          params: {
            page: page,
          },
        });
        const { data, links, meta } = response.data;
        setCheckPage(links);
        setMeta(meta);
        setRegisteredGuests(data);
      } catch (error) {
        console.error(error);
        enqueueSnackbar(error.message, { variant: 'error' });
      }
    };
    getPRGuests();
    setRefreshList(false);
  }, [enqueueSnackbar, eventDetail.id, page, refreshlist]);

  const columns: GridColDef[] = [
    {
      field: 'selfie',
      headerName: 'Selfie',
      minWidth: 150,
      flex: 1,
      sortable: false,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => {
        const handleClick = () => {
          setViewImage(true);
        };
        return (
          <>
            {params.row.selfie ? (
              <ImgWrapper
                onClick={() => {
                  setUrl(params.row?.selfie?.original_url);
                  handleClick();
                }}
              >
                <ImgStyle src={String(params.row.selfie.thumbnail_url)} />
              </ImgWrapper>
            ) : (
              <ImgWrapper>
                <LandscapeRoundedIcon color="primary" />
              </ImgWrapper>
            )}
            <ImageDialog img={url} open={viewImage} close={() => setViewImage(false)} />
          </>
        );
      },
    },
    {
      field: 'name',
      headerName: 'Name',
      minWidth: 150,
      flex: 1,
      renderCell: (params) => (
        <Typography sx={{ textTransform: 'capitalize' }} noWrap>
          {params.row.name ? params.row.name : '-'}
        </Typography>
      ),
    },

    { field: 'guest_email', headerName: 'Email ID', minWidth: 200, flex: 1, sortable: false },
    {
      field: 'guest_phone_number',
      headerName: 'Phone Number',
      minWidth: 160,
      flex: 1,
      sortable: false,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <>
          {params.row.guest_phone_number ? (
            params.row.guest_phone_number
          ) : (
            <Typography variant="h5">-</Typography>
          )}
        </>
      ),
    },
    {
      field: 'created_at',
      headerName: 'Date',
      minWidth: 150,
      flex: 1,
      sortable: false,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => {
        const dateStr = params.row.created_at.split(' ')[0].split('-').reverse().join('-');
        return <div>{dateStr}</div>;
      },
    },
  ];

  //ToggleButton Handler

  const handleAlignment = (event: React.MouseEvent<HTMLElement>, newClick: string | null) => {
    setClick(newClick);
  };

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchInput = e.target.value;
    if (searchInput === '') {
      setRefreshList(true);
    }
    setSearchValue(e.target.value);
    if (e.target.value.length > 2) {
      try {
        const response = await axios.post(`/api/events/${eventDetail.id}/guests/search?limit=6`, {
          search: {
            value: searchInput,
          },
        });
        const { data } = response.data;
        setRegisteredGuests(data);
      } catch (error) {
        console.error(error);
        enqueueSnackbar(error.message, { variant: 'error' });
      }
    }
  };

  const clearInput = () => {
    setSearchValue('');
    setRefreshList(true);
  };

  const handleDownload = async () => {
    try {
      await axios
        .get(`/api/events/${eventDetail.id}/guests/export`, {
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

  const handleRevokeAccess = async () => {
    if (selectedIds.length !== 0) {
      try {
        await axios.delete(`/api/events/${eventDetail.id}/guests/batch`, {
          data: { resources: selectedIds },
        });
        const updatedGuests = registeredGuests.filter((item) => !selectedIds.includes(item.id));
        setRegisteredGuests(updatedGuests);
        enqueueSnackbar('Successfully Removed', { variant: 'success' });
      } catch (error) {
        enqueueSnackbar(error.message, { variant: 'error' });
      }
    } else {
      enqueueSnackbar('Please select the members for whom you want to revoke the access!', {
        variant: 'error',
      });
    }
  };

  return (
    <>
      <TableWidthWrapper>
        <Wrapper>
          <TeamHeaderWrapper>
            {registeredGuests.length !== 0 && (
              <TeamButtonStyle
                onClick={handleDownload}
                startIcon={<IconDownloadSVG />}
                color="inherit"
                size="small"
              >
                Download Sheet
              </TeamButtonStyle>
            )}

            <SearchInput
              size="small"
              onChange={handleSearch}
              value={searchValue}
              placeholder="Search"
              style={{ marginRight: '2rem' }}
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
            <TeamButtonStyle color="secondary" size="small" onClick={handleRevokeAccess}>
              Revoke Access
            </TeamButtonStyle>
          </TeamHeaderWrapper>
          <div style={{ height: 350, width: '100%' }}>
            <DataGrid
              sx={{
                '.MuiDataGrid-row': {
                  mt: 0.5,
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

                pl: 0.4,
              }}
              rows={registeredGuests}
              columns={columns}
              checkboxSelection
              disableSelectionOnClick
              rowHeight={50}
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
              onSelectionModelChange={(ids: any) => {
                setSelectedIds(ids);
              }}
            />
          </div>
          <PaginateWrapper>
            <div>
              {meta.total !== 0 && (
                <Typography variant="subtitle1">
                  {meta.from} - {meta.to} of {meta.total}
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
              onChange={handleAlignment}
            >
              <ToggleButton
                onClick={() => setPage(page - 1)}
                disabled={checkPage.prev === null}
                value="prev"
              >
                <ArrowBackIosIcon fontSize="small" />
              </ToggleButton>
              <ToggleButton
                onClick={() => setPage(page + 1)}
                disabled={checkPage.next === null}
                value="next"
              >
                <ArrowForwardIosIcon fontSize="small" />
              </ToggleButton>
            </ToggleButtonGroup>
          </PaginateWrapper>
        </Wrapper>
      </TableWidthWrapper>
      <CreateEventFooterView
        footerAction={
          <Button
            onClick={() => preRegisterTabRedirect(prevIndex)}
            size="small"
            color="primary"
            startIcon={<IconBackSVG />}
          >
            Back
          </Button>
        }
      />
    </>
  );
};

export default PreregisteredGuestsView;
