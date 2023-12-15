import { Typography } from '@mui/material';

import useAuth from 'src/hooks/useAuth';

export default function Title() {
  const { user } = useAuth();
  return (
    <Typography variant="caption" mt={3} mr={6} ml={1.5} p={1} textTransform="capitalize">
      {user?.account_type} Account
    </Typography>
  );
}
