import React, { useState } from 'react';

import * as Yup from 'yup';
import { Typography, Button, styled, Drawer, Box } from '@mui/material';
import { isValidPhoneNumber } from 'react-phone-number-input';
import { LoadingButton } from '@mui/lab';
import { useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';
import { yupResolver } from '@hookform/resolvers/yup';

import { FormProvider, RHFTextField } from 'src/components/hook-form';
import axios from 'src/utils/axios';
import IconBackSVG from 'src/assets/shared/svg/icon_back';
import TPhoneComponent from 'src/assets/shared/elements/TPhoneComponent';
import useResponsive from 'src/hooks/useResponsive';

type DrawerProps = {
  openDrawer: boolean;
  onClose: () => void;
};

type FormValuesProps = {
  storage: string;
  events: string;
  email: string;
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
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const isDesktop = useResponsive('up', 'lg');
  const { enqueueSnackbar } = useSnackbar();

  const PlanSchema = Yup.object().shape({
    email: Yup.string()
      .email('Email must be a valid email address')
      .required('Email is required')
      .trim(),

    storage: Yup.string().required('Field is required'),
    events: Yup.string().required('Field is required'),
  });

  const defaultValues = {
    storage: '',
    events: '',
    email: '',
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
    if (phoneNumber) {
      if (isValidPhoneNumber(phoneNumber)) {
        try {
          const response = await axios.post(`/api/subscription/request`, {
            storage: data.storage,
            events: data.events,
            email: data.email,
            phone_number: phoneNumber,
          });
          const { message } = response.data;
          enqueueSnackbar(message, { variant: 'success' });
          props.onClose();
          reset();
        } catch (error) {
          enqueueSnackbar(error.message, { variant: 'error' });
        }
      } else {
        enqueueSnackbar('Please enter a valid phone number!', { variant: 'error' });
      }
    } else {
      try {
        const response = await axios.post(`/api/subscription/request`, {
          storage: data.storage,
          events: data.events,
          email: data.email,
        });
        const { message } = response.data;
        enqueueSnackbar(message, { variant: 'success' });
        props.onClose();
        reset();
      } catch (error) {
        enqueueSnackbar(error.message, { variant: 'error' });
      }
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
              <RHFTextField name="email" label="Email*" placeholder="turtlepic@gmail.com" />

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
              <TPhoneComponent
                name="phone_number"
                value={phoneNumber}
                defaultCountry="IN"
                onChange={(phone: any) => setPhoneNumber(phone)}
                placeholder="Contact Number"
                error={
                  phoneNumber
                    ? isValidPhoneNumber(phoneNumber)
                      ? undefined
                      : 'Invalid phone number'
                    : 'Phone number required'
                }
              />
              <Box textAlign="right" mt={3}>
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
