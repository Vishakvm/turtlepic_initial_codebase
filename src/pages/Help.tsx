// @mui
import { Typography } from '@mui/material';
// components
import Page from 'src/components/Page';
import FAQ from 'src/components/auth/signup/views/FAQ';

// ----------------------------------------------------------------------

export default function Help() {
  return (
    <Page
      header={true}
      headerTitle={
        <Typography color="primary" variant="h6">
          Help & Support
        </Typography>
      }
      title="Help"
    >
      <Typography align="center" mb={6} variant="h2" gutterBottom>
        In case of any queries / feedback, feel free to reach out to us at support@turtlepic.com
      </Typography>
      <FAQ />
    </Page>
  );
}
