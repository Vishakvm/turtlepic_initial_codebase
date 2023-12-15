import React, { useState } from 'react';
import { Tabs, Tab, Box, Typography, styled } from '@mui/material';
import * as Yup from 'yup';
import { Button, Drawer } from '@mui/material';
import { ChromePicker } from 'react-color';
import { isValidPhoneNumber } from 'react-phone-number-input';
import { LoadingButton } from '@mui/lab';
import { useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';
import { FormProvider, RHFTextField } from 'src/components/hook-form';
import axios from 'src/utils/axios';
import IconBackSVG from 'src/assets/shared/svg/icon_back';
import TPhoneComponent from 'src/assets/shared/elements/TPhoneComponent';
import useResponsive from 'src/hooks/useResponsive';
import { PATH_MAIN_ADMIN } from 'src/routes/paths';
import ThemesView from 'src/components/super-admin/themes/ThemesView';
import Page from '../../components/Page';
import { Navigate } from 'react-router';

export const OuterWrapper = styled('div')(({ theme }) => ({
  background: theme.palette.grey[300],
  height: '33rem',
  padding: theme.spacing(2),
}));

export const Container = styled('div')(({ theme }) => ({
  padding: theme.spacing(2, 0, 3, 0),
}));

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function CreateTheme() {
  const [value, setValue] = React.useState(0);
  const [image, setImage] = useState<File | null>(null);
  const [color, setColor] = useState('#000000');
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const PlanSchema = Yup.object().shape({
    name: Yup.string().required('name is required'),
  });

  const defaultValues = {
    name: '',
  };

  type FormValuesProps = {
    name: string;
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setImage(event.target.files && event.target.files[0]);
  };

  const handleChangeComplete = (newColor: any) => {
    setColor(newColor.hex);
  };

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(PlanSchema),
    defaultValues,
  });
  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data: FormValuesProps) => {
    const formData = new FormData();
    formData.append('accent_color', color!);
    formData.append('name', data.name);
    formData.append('image', image!);
    try {
      const response = await axios.post(`/api/events/createtheme`, formData);
      const { message } = response.data;
      enqueueSnackbar(message, { variant: 'success' });
      reset();
      navigate(PATH_MAIN_ADMIN.themes);
    } catch (error) {
      enqueueSnackbar(error.message, { variant: 'error' });
    }
  };

  return (
    <Page
      title="Users"
      header={true}
      headerTitle={
        <Typography color="primary" variant="h6">
          Themes
        </Typography>
      }
    >
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <>
          <Typography py={2} align="center" variant="h2">
            Create Theme
          </Typography>
          <Container>
            <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
              <RHFTextField name="name" label="Name*" placeholder="" />
              <Typography variant="h6">Accent Color</Typography>
              <ChromePicker color={color} onChangeComplete={handleChangeComplete} />
              <Typography variant="h6" sx={{ marginTop: '1.5rem' }}>
                Theme Background
              </Typography>
              <input type="file" onChange={handleFileChange} />
              <Box textAlign="right" mt={3}>
                <LoadingButton
                  variant="contained"
                  type="submit"
                  sx={{ width: '200px' }}
                  loading={isSubmitting}
                >
                  Save Theme
                </LoadingButton>
              </Box>
            </FormProvider>
          </Container>
        </>
      </Box>
    </Page>
  );
}
