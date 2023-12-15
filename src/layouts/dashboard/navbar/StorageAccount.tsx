// @mui
import { styled } from '@mui/material/styles';
import { Box, Link, Typography, LinearProgress, linearProgressClasses } from '@mui/material';

import useAuth from 'src/hooks/useAuth';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  borderRadius: Number(theme.shape.borderRadius) * 0.5,
  backgroundColor: theme.palette.grey[300],
  transition: theme.transitions.create('opacity', {
    duration: theme.transitions.duration.shorter,
  }),
}));

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 5,
  borderRadius: 5,
  width: '100%',
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.common.white,
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: theme.palette.primary.main,
  },
  [theme.breakpoints.down('sm')]: {
    width: '10rem',
  },
}));

// ----------------------------------------------------------------------

type Props = {
  isCollapse: boolean | undefined;
  href?: string;
};

export default function StorageAccount({ isCollapse, href }: Props) {
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
        <Box
          sx={{
            transition: (theme) =>
              theme.transitions.create('width', {
                duration: theme.transitions.duration.shorter,
              }),
            ...(isCollapse && {
              ml: 0,
              width: 0,
            }),
            p: 1,
          }}
        >
          {isCollapse ? (
            <>
              <Typography variant="subtitle1">
                {user?.user_plan?.storage_used.replace(/ /g, '')}/
              </Typography>
              <Typography variant="subtitle1">{user?.user_plan?.storage_allocated}GB</Typography>
            </>
          ) : (
            <Typography variant="body1">{user?.user_plan?.storage_used} Used</Typography>
          )}
          <BorderLinearProgress
            variant="determinate"
            value={Number(user?.user_plan?.storage_percent)}
          />
          {!isCollapse && (
            <Typography variant="caption" noWrap sx={{ color: 'text.secondary' }}>
              out of {user?.user_plan?.storage_allocated} GB
            </Typography>
          )}
        </Box>
      </RootStyle>
    </Link>
  );
}
