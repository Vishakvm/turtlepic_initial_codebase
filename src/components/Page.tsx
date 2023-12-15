import { Helmet } from 'react-helmet-async';
import { forwardRef, ReactNode } from 'react';
// @mui
import { Box, BoxProps, styled } from '@mui/material';

// ----------------------------------------------------------------------

interface Props extends BoxProps {
  children: React.ReactElement | ReactNode;
  meta?: ReactNode;
  title: string;
  header?: boolean;
  headerTitle?: React.ReactElement;
  headerAction?: React.ReactElement;
}

const HeaderWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  width: '100%',
  padding: theme.spacing(4, 0, 2, 0),
  marginBottom: theme.spacing(3),
  [theme.breakpoints.down('lg')]: {
    padding: theme.spacing(4, 0, 2, 4),
    marginBottom: theme.spacing(0),
  },
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
  },
}));

const ActionWrapper = styled(Box)(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    alignSelf: 'flex-end',
    marginTop: theme.spacing(2),
  },
}));

const Page = forwardRef<HTMLDivElement, Props>(
  ({ children, header, headerTitle, headerAction, title = '', meta, ...other }, ref) => (
    <>
      <Helmet>
        <title>{`${title} | TurtlePic`}</title>
        {meta}
      </Helmet>

      <Box ref={ref} {...other} sx={{ p: 0 }}>
        {header && (
          <HeaderWrapper>
            <Box>{headerTitle}</Box>
            <ActionWrapper>{headerAction}</ActionWrapper>
          </HeaderWrapper>
        )}

        {children}
      </Box>
    </>
  )
);

export default Page;
