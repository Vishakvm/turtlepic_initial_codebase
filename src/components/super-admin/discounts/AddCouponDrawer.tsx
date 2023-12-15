import React from 'react';

import * as Yup from 'yup';
import { Typography, Button, styled, Drawer, Box, Grid } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { FormProvider, RHFTextField, RHFDatePicker } from 'src/components/hook-form';
import IconBackSVG from 'src/assets/shared/svg/icon_back';
import useResponsive from 'src/hooks/useResponsive';

type DrawerProps = {
  openDrawer: boolean;
  onClose: () => void;
};

type FormValuesProps = {
  afterSubmit: string;
  name: string;
  type: string;
  code: string;
  offer_amount: string;
  expiry_date: Date;
};

const Wrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 4, 0, 4),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(0, 2, 0, 2),
  },
}));

export default function AddCouponDrawer(props: DrawerProps): React.ReactElement {
  const isDesktop = useResponsive('up', 'lg');
  const AddCouponSchema = Yup.object().shape({
    name: Yup.string().required('Field is required'),
  });

  const defaultValues = {
    name: '',
    type: '',
    code: '',
    offer_amount: '',
  };

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(AddCouponSchema),
    defaultValues,
  });
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data: FormValuesProps) => { };

  return (
    <Drawer open={props.openDrawer} anchor={'right'}>
      <Box role="presentation" sx={{ width: isDesktop ? '720px' : '100%' }}>
        <Button sx={{ color: '#fff', mx: 3 }} onClick={props.onClose} startIcon={<IconBackSVG />}>
          Back
        </Button>
        <Wrapper>
          <Typography pt={2} pb={6} align="center" variant="h2">
            Add a new coupon
          </Typography>
          <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
              <Grid item lg={6} md={6} sm={12} xs={12}>
                <RHFTextField name="name" label="Name*" />
              </Grid>
              <Grid item lg={6} md={6} sm={12} xs={12}>
                <RHFTextField name="type" label="Type" />
              </Grid>
              <Grid item lg={6} md={6} sm={12} xs={12}>
                <RHFTextField name="code" label="Code" />
              </Grid>
              <Grid item lg={6} md={6} sm={12} xs={12}>
                <RHFTextField name="offer_amount" label="Offer Amount" />
              </Grid>
              <Grid item lg={6} md={6} sm={12} xs={12}>
                <RHFDatePicker label="Expiry Date (mm/dd/yyyy)" name="expiry_date" />
              </Grid>
            </Grid>

            <Box textAlign="right">
              <LoadingButton
                variant="contained"
                loading={isSubmitting}
                type="submit"
                sx={{ width: '150px' }}
              >
                Add
              </LoadingButton>
            </Box>
          </FormProvider>
        </Wrapper>
      </Box>
    </Drawer>
  );
}
