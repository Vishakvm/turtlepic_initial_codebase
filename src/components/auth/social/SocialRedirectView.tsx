/*
 * Redirection Page
 *
 */
import React, { useEffect, useState } from 'react';

import { useNavigate } from 'react-router';

import { useSearchParams } from 'react-router-dom';

import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import { styled } from '@mui/material/styles';

import Page from 'src/components/Page';
import { PATH_AUTH, PATH_MAIN, PATH_PRE_AUTH } from 'src/routes/paths';
import { setSession } from 'src/utils/jwt';
import useAuth from 'src/hooks/useAuth';
import { AGENCY, AGENCY_MEMBER, CLIENT, GUEST, INDIVIDUAL, PUBLISHED } from 'src/utils/constants';
import axios from 'src/utils/axios';

// Styles

const MainWrapper = styled('div')(({ theme }) => ({
  height: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
}));

export default function SocialRedirectView(): React.ReactElement {
  const [status, setStatus] = useState('');

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, socialauth, profileData } = useAuth();

  const getEventDetails = async (slug: string) => {
    try {
      await axios.get(`/api/events/${slug}/pre-registration`).then((response) => {
        const { data } = response.data;
        setStatus(data.event_status);
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const api_token = searchParams.get('api_token');
    const new_user = searchParams.get('new_user');
    const account_type = searchParams.get('account_type');
    const eventSlug = searchParams.get('event_slug');
    if (eventSlug) {
      getEventDetails(eventSlug);
    }
    if (api_token) {
      setSession(api_token);
      socialauth();
      profileData();
    } else {
    }

    if (new_user) {
      switch (account_type) {
        case AGENCY:
          // navigate(PATH_AUTH.agencyBrand);
          navigate(PATH_MAIN.dashboard);
          break;
        case GUEST:
          navigate(`${PATH_PRE_AUTH}/${eventSlug}/selfie-filtering`);
          break;
        case AGENCY_MEMBER:
          navigate(PATH_MAIN.teamOnboarding);
          break;
        case INDIVIDUAL:
          // navigate(PATH_AUTH.individualBrand);
          navigate(PATH_MAIN.dashboard);

          break;
        case CLIENT:
          navigate(PATH_MAIN.clientOnboarding);
          break;
        default:
          return;
      }
    } else {
      switch (account_type) {
        case GUEST:
          // if (user && user.phone_number) {
            if (user && user.has_selfie) {
              if (status === PUBLISHED) {
                navigate(`${PATH_PRE_AUTH}/${eventSlug}/preview`);
              } else {
                navigate(`${PATH_PRE_AUTH}/${eventSlug}/thankyou`);
              }
            } else {
              navigate(`${PATH_PRE_AUTH}/${eventSlug}/selfie-filtering`);
            }
          // } else {
          //   navigate(`${PATH_PRE_AUTH}/${eventSlug}/onboarding`);
          // }
          break;
        default:
          navigate(PATH_MAIN.dashboard);
      }
    }
  }, [navigate, profileData, searchParams, socialauth, status, user]);

  return (
    <Page title="Redirect">
      <MainWrapper>
        <CircularProgress color="primary" />
        <Typography variant="h5" mt={2} color="white">
          Please wait...
        </Typography>
      </MainWrapper>
    </Page>
  );
}
