import React from 'react';

import { Typography, Button, styled, Drawer, Box } from '@mui/material';

import * as Yup from 'yup';
import { FormProvider, RHFTextField } from 'src/components/hook-form';
import axios from 'src/utils/axios';
import { LoadingButton } from '@mui/lab';
import { useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';
import { yupResolver } from '@hookform/resolvers/yup';

import IconBackSVG from 'src/assets/shared/svg/icon_back';
import useResponsive from 'src/hooks/useResponsive';
import { useDispatch } from 'src/redux/store';
import { customPlan } from 'src/redux/slices/customPlan';

type DrawerProps = {
  openDrawer: boolean;
  onClose: () => void;
};

type FormValuesProps = {
  storage: string;
  events: string;
};

export const Wrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(5),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(0, 2, 0, 2),
  },
}));
export const Container = styled('div')(({ theme }) => ({
  padding: theme.spacing(2, 0, 3, 0),
}));

export default function CustomPlanDrawer(props: DrawerProps): React.ReactElement {
  const isDesktop = useResponsive('up', 'lg');
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();

  const PlanSchema = Yup.object().shape({
    storage: Yup.string().required('Field is required'),
    events: Yup.string().required('Field is required'),
  });

  const defaultValues = {
    storage: '',
    events: '',
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

  const onSubmit = async (Fdata: FormValuesProps) => {
    try {
      const response = await axios.post(`/api/subscription/user-request`, {
        storage: Fdata.storage,
        events: Fdata.events,
      });
      const { message, data } = response.data;
      dispatch(customPlan({ events: data.events, storage: data.storage }));
      enqueueSnackbar(message, { variant: 'success' });
      props.onClose();
      reset();
    } catch (error) {
      enqueueSnackbar(error.message, { variant: 'error' });
    }
  };

  const handleClose = () => {
    props.onClose();
  };

  return (
    <Drawer open={props.openDrawer} anchor={'right'}>
      <Box role="presentation" sx={{ width: isDesktop ? '720px' : '100%' }}>
        <Button
          sx={{ color: '#fff', mx: 3 }}
          onClick={() => handleClose()}
          startIcon={<IconBackSVG />}
        >
          Back
        </Button>
        <Wrapper>
          <Typography py={4} align="center" variant="h2">
            Turtle Custom Plan
          </Typography>
          <Container>
            <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
              <RHFTextField
                name="storage"
                label="How much storage will you be needing?*"
                placeholder="in GB"
              />
              <RHFTextField
                name="events"
                label="Approximate no. events in a month?*"
                placeholder="in numbers"
              />
              <Box textAlign="right">
                <LoadingButton
                  variant="contained"
                  type="submit"
                  sx={{ width: '200px' }}
                  loading={isSubmitting}
                >
                  Request quote
                </LoadingButton>
              </Box>
            </FormProvider>
          </Container>
        </Wrapper>
      </Box>
    </Drawer>
  );
}
