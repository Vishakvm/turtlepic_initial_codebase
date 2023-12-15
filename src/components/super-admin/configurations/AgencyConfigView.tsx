import React, { useEffect } from 'react';

import * as Yup from 'yup';
import { styled, Grid, Button } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';
import { yupResolver } from '@hookform/resolvers/yup';

import { FormProvider, RHFTextField } from 'src/components/hook-form';
import axios from 'src/utils/axios';

type ConfigValuesProps = {
  upload_time: string;
};

const Wrapper = styled('div')(({ theme }) => ({
  height: '400px',
  padding: theme.spacing(3),
  maxWidth: '1400px',
  margin: 'auto',
  [theme.breakpoints.up('xl')]: {
    padding: theme.spacing(10),
  },
}));

const Agency = (): React.ReactElement => {
  const { enqueueSnackbar } = useSnackbar();

  const defaultValues = {
    upload_time: '',
  };

  const ConfigSchema = Yup.object().shape({
    upload_time: Yup.string().required('Field is required'),
  });

  const methods = useForm<ConfigValuesProps>({
    resolver: yupResolver(ConfigSchema),
    defaultValues,
  });

  const { handleSubmit, setValue } = methods;

  const onSubmit = async (data: ConfigValuesProps) => {
    const { upload_time } = data;
    try {
      const response = await axios.post('/api/admin/configuration', { upload_time });
      const { message } = response.data;
      enqueueSnackbar(message, { variant: 'success' });
    } catch (error) {
      enqueueSnackbar(error.message, { variant: 'error' });
    }
  };

  useEffect(() => {
    const getUploadTime = async () => {
      try {
        const response = await axios.get('/api/admin/configuration');
        const { data } = response.data;
        data.upload_time ? setValue('upload_time', data.upload_time) : setValue('upload_time', '');
      } catch (error) {
        enqueueSnackbar(error.message, { variant: 'error' });
      }
    };
    getUploadTime();
  }, [enqueueSnackbar, setValue]);
  return (
    <Wrapper>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container>
          <Grid item md={6} xs={12}>
            <RHFTextField
              name="upload_time"
              label="Upload time for the agency after request approval*"
              placeholder="7 days"
            />
          </Grid>
        </Grid>

        <Button variant="contained" type="submit">
          Save Changes
        </Button>
      </FormProvider>
    </Wrapper>
  );
};

export default Agency;
