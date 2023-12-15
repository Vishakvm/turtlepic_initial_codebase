// @mui
import { styled } from '@mui/material/styles';
import { Box, Link, Typography } from '@mui/material';
import useAuth from 'src/hooks/useAuth';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(1),
  borderRadius: Number(theme.shape.borderRadius) * 0.5,
  backgroundColor: theme.palette.grey[300],
  transition: theme.transitions.create('opacity', {
    duration: theme.transitions.duration.shorter,
  }),
}));

// ----------------------------------------------------------------------

type Props = {
  isCollapse: boolean | undefined;
  href?: string;
};

const AvatarStyle = styled('div')(({ theme }) => ({
  width: '2.8rem',
  height: '2.8rem',
  borderRadius: '50%',
  background: 'white',
  marginRight: theme.spacing(0.5),
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}));

export default function NavbarAccount({ isCollapse, href }: Props) {
  const { user } = useAuth();

  return (
    <Link underline="none" color="inherit" href={href}>
      <RootStyle
        sx={{
          ...(isCollapse && {
            bgcolor: 'transparent',
          }),
        }}
      >
        <AvatarStyle>
          <Typography textTransform="capitalize" variant="h4" noWrap color="black">
            {user
              ? user.name
                  .match(/\b(\w)/g)
                  .slice(0, 2)
                  .join('')
              : 'U'}
          </Typography>
        </AvatarStyle>

        <Box
          sx={{
            ml: 1,
            transition: (theme) =>
              theme.transitions.create('width', {
                duration: theme.transitions.duration.shorter,
              }),
            ...(isCollapse && {
              ml: 0,
              width: 0,
              display: 'none',
            }),
          }}
        >
          <Typography textTransform="capitalize" variant="body1" noWrap>
            {user ? user.name.split(' ').slice(0, 2).join(' ') : 'User'}
          </Typography>
          <Typography variant="caption" noWrap sx={{ color: 'text.secondary' }}>
            {user
              ? user.account_type
                  .toLocaleLowerCase()
                  .replace(
                    /(^|\w)\S*/g,
                    (txt: any) => txt.charAt(0).toLocaleUpperCase() + txt.substring(1)
                  )
              : ''}
          </Typography>
        </Box>
      </RootStyle>
    </Link>
  );
}
