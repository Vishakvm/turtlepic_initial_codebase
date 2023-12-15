import { Typography } from '@mui/material';

import useAuth from 'src/hooks/useAuth';

export default function Title() {
  const { user } = useAuth();
  return (
    <Typography variant="caption" mt={3} mr={2} pl={1.3} pr={2} textTransform="capitalize">
      {user?.account_type} Account
    </Typography>
  );
}
