import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { NAVBAR } from 'src/config';
import useCollapseDrawer from 'src/hooks/useCollapseDrawer';

type Props = {
  collapseClick: boolean;
};

const RootStyle = styled('div', {
  shouldForwardProp: (prop) => prop !== 'collapseClick',
})<Props>(({ collapseClick, theme }) => ({
  backgroundColor: theme.palette.background.default,
  padding: theme.spacing(2, 2, 2, 0),
  position: 'fixed',
  bottom: 0,
  display: 'flex',
  justifyContent: 'space-between',
  width: `calc(100% - ${NAVBAR.DASHBOARD_WIDTH}px)`,

  [theme.breakpoints.up('lg')]: {
    ...(collapseClick && {
      width: '100%',
      paddingRight: '17rem',
    }),
  },
  [theme.breakpoints.down('lg')]: {
    width: '100%',

    ...(collapseClick && {
      width: '100%',
    }),
  },
}));

const FooterText = styled(Typography)(({ theme }) => ({
  color: theme.palette.grey[200],
}));

const FooterLinks = styled(Typography)(({ theme }) => ({
  color: theme.palette.grey[200],
  paddingLeft: theme.spacing(2),
  cursor: 'pointer',
}));

const FooterWrapper = styled('div', {
  shouldForwardProp: (prop) => prop !== 'collapseClick',
})<Props>(({ collapseClick, theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  paddingRight: 33,

  [theme.breakpoints.up('lg')]: {
    ...(collapseClick && {
      marginRight: -150,
    }),
  },
}));

// ----------------------------------------------------------------------

export default function MainFooter() {
  const { collapseClick } = useCollapseDrawer();

  return (
    <RootStyle collapseClick={collapseClick}>
      <FooterText variant="subtitle2">2022 © turtlepic.com</FooterText>
      <FooterWrapper collapseClick={collapseClick}>
        <FooterLinks variant="subtitle2">About TurtlePic</FooterLinks>
        <FooterLinks variant="subtitle2">Privacy Policy</FooterLinks>
      </FooterWrapper>
    </RootStyle>
  );
}
