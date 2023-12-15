import React, { useEffect, useState, useRef } from 'react';

import { Typography, Button, Grid } from '@mui/material';

import ShareIcon from '@mui/icons-material/Share';
import ShareQRCodeDrawer from 'src/components/events/drawers/ShareQRCodeDrawer';
import { useNavigate } from 'react-router';
import { useSnackbar } from 'notistack';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';

import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

import {
  Wrapper,
  ImgWrapper,
  ImgStyle,
  Folder,
  LabelStyle,
  LabelWrapper,
  Triangle,
  ActionWrapper,
  GridStyle,
  EmptyState,
  EventDetailType,
} from 'src/pages/Events';

import axios from 'src/utils/axios';
import { eventDetails } from 'src/redux/slices/createEvent';
import { PATH_MAIN } from 'src/routes/paths';
import { useDispatch } from 'src/redux/store';
import VideoCoverPhoto from 'src/assets/shared/images/Cover.png';
import { AGENCY, TRANSFERRED, WORKSPACE, CLIENT } from 'src/utils/constants';
import useAuth from 'src/hooks/useAuth';

export default function ClientEventsTab(): React.ReactElement {
  const [clientEventDetails, setClientEventDetails] = useState<EventDetailType[]>([]);
  const [qRCodeDrawer, setQrCodeDrawer] = useState(false);
  const [paginateMeta, setPaginateMeta] = useState(Object);
  const [checkPage, setCheckPage] = useState(Object);
  const [picturePage, setPicturePage] = useState(1);
  const isMounted = useRef(false);

  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const { user } = useAuth();

  const getClientEvents = async (page?: number) => {
    try {
      await axios
        .post(`/api/events/search`, {
          params: {
            page: page,
          },
          filters: [{ field: 'event_type', operator: '=', value: CLIENT }],
        })
        .then((response) => {
          if (!isMounted.current) {
            const { data, meta, links } = response.data;
            setClientEventDetails(data);
            setPaginateMeta(meta);
            setCheckPage(links);
          }
        });
    } catch (error) {
      enqueueSnackbar(error.message, { variant: 'error' });
    }
  };

  useEffect(() => {
    if (user?.account_type === AGENCY) {
      getClientEvents();
    }
    return () => {
      isMounted.current = true;
    };
  }, [enqueueSnackbar]);

  const clientEventClick = (
    eventName: string,
    eventDate: string,
    eventVenue: string,
    eventId: number,
    eventStatus: string,
    eventType: string,
    eventSlug: string,
    reqStatus: string,
    clientEmail: string,
    clientName: string,
    uploadTimeLeft: string,
    uploadTimePercent: string
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
        client_name: clientName,
        client_email: clientEmail,
        client_status: reqStatus,
        upload_time_left: uploadTimeLeft,
        upload_time_percent: uploadTimePercent,
      })
    );
    eventType === WORKSPACE
      ? navigate(PATH_MAIN.createWorkspaceEvent)
      : navigate(PATH_MAIN.createClientEvent);
  };

  const clientEventPreview = (
    eventName: string,
    eventDate: string,
    eventVenue: string,
    eventId: number,
    eventStatus: string,
    eventType: string,
    eventSlug: string,
    reqStatus: string,
    clientEmail: string,
    clientName: string,
    uploadTimeLeft: string,
    uploadTimePercent: string
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
        client_name: clientName,
        client_email: clientEmail,
        client_status: reqStatus,
        upload_time_left: uploadTimeLeft,
        upload_time_percent: uploadTimePercent,
      })
    );
    window.open(PATH_MAIN.previewEvent, '_blank');
  };

  const handlePaginate = async (action: string) => {
    if (action === 'next') {
      setPicturePage(picturePage + 1);
      const next = picturePage + 1;
      getClientEvents(next);
    } else {
      setPicturePage(picturePage - 1);
      const prev = picturePage - 1;
      getClientEvents(prev);
    }
  };

  return (
    <Wrapper>
      {clientEventDetails.length !== 0 ? (
        <Grid container spacing={3}>
          {clientEventDetails.map((ele, i) => (
            <GridStyle key={i} item={true} container md={3} sm={6} xs={12}>
              <Folder>
                <LabelWrapper>
                  <LabelStyle>
                    <Typography variant="subtitle2" color="common.black" textTransform="capitalize">
                      {ele.event_status}
                    </Typography>
                  </LabelStyle>
                  <Triangle />
                </LabelWrapper>

                <ImgWrapper
                  onClick={(): void => {
                    clientEventClick(
                      ele.name,
                      ele.date_display,
                      ele.venue,
                      ele.id,
                      ele.event_status,
                      ele.event_type,
                      ele.slug,
                      ele.client_status,
                      ele.client.email,
                      ele.client.name,
                      ele.upload_time_left,
                      ele.upload_time_percent
                    );
                  }}
                >
                  {ele.cover_picture ? (
                    <ImgStyle src={String(ele.cover_picture.thumbnail_url)} alt="VideoCoverPhoto" />
                  ) : (
                    <ImgStyle src={String(VideoCoverPhoto)} alt="VideoCoverPhoto" />
                  )}
                </ImgWrapper>

                <Typography py={0.5} variant="h6" textTransform="capitalize">
                  {ele.name}
                </Typography>
                <Typography variant="subtitle2" color="grey.200">
                  {ele.folder_count} Folders | {ele.photo_count} Photos | {ele.video_count} Videos
                </Typography>
                <ActionWrapper>
                  <Button
                    variant="outlined"
                    color="secondary"
                    size="small"
                    startIcon={<VisibilityOutlinedIcon />}
                    onClick={(): void => {
                      clientEventPreview(
                        ele.name,
                        ele.date_display,
                        ele.venue,
                        ele.id,
                        ele.event_status,
                        ele.event_type,
                        ele.slug,
                        ele.client_status,
                        ele.client.email,
                        ele.client.name,
                        ele.upload_time_left,
                        ele.upload_time_percent
                      );
                    }}
                  >
                    Preview Event
                  </Button>

                  {ele.client_status !== TRANSFERRED ? (
                    <ShareIcon
                      onClick={() => {
                        setQrCodeDrawer(true);
                      }}
                      sx={{ cursor: 'pointer' }}
                    />
                  ) : null}
                  <ShareQRCodeDrawer
                    openDrawer={qRCodeDrawer}
                    onClose={() => {
                      setQrCodeDrawer(false);
                    }}
                  />
                </ActionWrapper>
              </Folder>
            </GridStyle>
          ))}
        </Grid>
      ) : (
        <EmptyState>
          <Typography color="primary" variant="h5">
            No Data Found!
          </Typography>
        </EmptyState>
      )}
      {checkPage.next !== null && (
        <Grid container>
          <Grid
            item
            xs={12}
            sm={12}
            md={12}
            lg={12}
            px={5}
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <Typography variant="h5">
                {paginateMeta.from} - {paginateMeta.to} of {paginateMeta.total}
              </Typography>
            </div>

            <div>
              <Button
                disabled={checkPage?.prev === null}
                onClick={() => handlePaginate('back')}
                size="small"
                sx={{
                  '&:hover': {
                    backgroundColor: '#7dd78d',
                  },
                }}
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
          </Grid>
        </Grid>
      )}
    </Wrapper>
  );
}
