import React from 'react';

import { Button, styled, InputBase } from '@mui/material';

export const AttachmentButton = styled(Button)(({ theme }) => ({
  borderRadius: '50%',
  background: 'rgba(2, 194, 217, 0.1)',
  padding: 0,
  width: '50px',
  height: '60px',
}));

export const AttachmentWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer',
  marginBottom: theme.spacing(2),
}));

export const ButtonContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  paddingTop: theme.spacing(2),
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column-reverse',
  },
}));

export const ButtonLandingView = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'flex-end',
  paddingTop: theme.spacing(2),
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column-reverse',
  },
}));
export const SocialButtonWrapper = styled('div')(({ theme }) => ({
  textAlign: 'end',
  paddingTop: theme.spacing(4),
}));

export const SocialButton = styled(Button)(({ theme }) => ({
  width: '145px',
  height: '45px',
  border: '1px solid #292929',
  boxSizing: 'border-box',
  borderRadius: '4.35765px',
  margin: theme.spacing(2),
  [theme.breakpoints.down('sm')]: {
    margin: theme.spacing(0.5),
    width: '130px',
  },
}));

export const BrandingAttachmentWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  paddingBottom: theme.spacing(3),
  [theme.breakpoints.down('md')]: {
    display: 'block',
    textAlign: 'center',
  },
}));
export const AdminAttachmentWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  [theme.breakpoints.down('md')]: {
    display: 'block',
    textAlign: 'center',
  },
}));

export const BrandingEditButton = styled(Button)(({ theme }) => ({
  margin: 0,
  padding: 0,
  height: 'fit-content',
  [theme.breakpoints.down('md')]: {
    justifyContent: 'flex-end',
    width: '100%',
  },
}));

export const SearchInput = styled(InputBase)(({ theme }) => ({
  margin: theme.spacing(2, 0, 0, 4),
  padding: theme.spacing(0.5),
  width: '14rem',
  cursor: 'pointer',
  borderBottom: `1px solid ${theme.palette.common.white}`,
  [theme.breakpoints.down('sm')]: {
    margin: theme.spacing(2, 0, 0, 0),
  },
}));
export const AdminSearchInput = styled(InputBase)(({ theme }) => ({
  margin: theme.spacing(2, 0, 0, 4),
  padding: theme.spacing(0.5),
  width: '6rem',
  cursor: 'pointer',
  [theme.breakpoints.down('sm')]: {
    margin: theme.spacing(2, 0, 0, 0),
  },
}));
export const TeamHeaderWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  width: '100%',
  justifyContent: 'flex-end',
  alignItems: 'flex-end',
  marginBottom: theme.spacing(3),
  [theme.breakpoints.down('sm')]: {
    display: 'block',
  },
}));

export const TeamButtonStyle = styled(Button)(({ theme }) => ({
  marginBottom: '-6px',
  padding: 0,
  height: 'auto',
  [theme.breakpoints.down('sm')]: {
    marginRight: theme.spacing(2),
  },
}));
export const PaginateWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
}));

export const AttachmentThumbnail = styled('div')(({ theme }) => ({
  background: theme.palette.grey[900],
  borderRadius: '15px',
  height: '96px',
  width: '147px',
  marginBottom: theme.spacing(1),
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  cursor: 'pointer',
  [theme.breakpoints.down('sm')]: {
    height: '90px',
    width: '120px',
  },
}));

export const ThumbImgStyle = styled('img')(({ theme }) => ({
  borderRadius: '15px',
  height: '96px',
  width: '147px',
  objectFit: 'cover',
  [theme.breakpoints.down('sm')]: {
    height: '90px',
    width: '120px',
  },
}));

export const EventDetailBox = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  // justifyContent: 'space-evenly',
  borderTop: `1px solid ${theme.palette.common.white}`,
  borderBottom: `1px solid ${theme.palette.common.white}`,
  width: '43%',
  marginRight: 'auto',
  marginLeft: 'auto',
  marginBottom: '40px',
  padding: theme.spacing(0, 1),
  [theme.breakpoints.down('sm')]: {
    width: '95%',
  },
}));

export const MiddleBorder = styled('div')(({ theme }) => ({
  borderLeft: `1px solid ${theme.palette.common.white}`,
  height: '2.5rem',
}));

export const TableWidthWrapper = styled('div')(({ theme }) => ({
  maxWidth: '1400px',
  margin: 'auto',
  width: '100%',
}));

export default function SharedStylesComponent(): React.ReactElement {
  return <></>;
}
