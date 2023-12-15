/*
 * Sign Up Brand Page
 *
 */
import React, { useState } from 'react';

import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router';

import { useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';

import { Button, styled, Typography } from '@mui/material';

import { ButtonContainer } from 'src/assets/shared/styles/SharedStylesComponent';
import IconNextSVG from 'src/assets/shared/svg/IconNextSVG';
import Iplan from 'src/assets/shared/images/Iplan.png';
import axios from 'src/utils/axios';
import { PATH_MAIN } from 'src/routes/paths';
import TPhoneComponent from 'src/assets/shared/elements/TPhoneComponent';
import { isValidPhoneNumber } from 'react-phone-number-input';
import SignupBodyWrapper from 'src/components/auth/elements/SignupBodyWrapper';
import { FormProvider, RHFTextField } from '../../../hook-form';

type FormValuesProps = {
  brand_name: string;
  website_url: string;
  afterSubmit?: string;
};

type PropsType = {
  onClick?: () => void;
};

const Wrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(8),
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(6, 2),
  },
}));

export default function SignupBrandView(props: PropsType): React.ReactElement {
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();
  const clickHandler = () => {
    navigate(PATH_MAIN.dashboard);
  };

  const defaultValues = {
    brand_name: '',
    website_url: '',
  };

  const BrandSchema = Yup.object().shape({
    brand_name: Yup.string().required('Field is required'),
  });

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(BrandSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isDirty },
  } = methods;

  const onSubmit = async (data: FormValuesProps) => {
    const brandDetailsForm = new FormData();
    brandDetailsForm.append('phone_number', phoneNumber);
    brandDetailsForm.append('brand_name', data.brand_name);
    brandDetailsForm.append('website_url', data.website_url);
    if (isDirty || phoneNumber) {
      if (phoneNumber) {
        if (isValidPhoneNumber(phoneNumber)) {
          try {
            await axios.post('/api/account/brand', brandDetailsForm);
            navigate(PATH_MAIN.dashboard);
          } catch (error) {
            enqueueSnackbar(error.message, { variant: 'error' });
          }
        } else {
          enqueueSnackbar('Please enter a valid phone number!', { variant: 'error' });
        }
      } else {
        try {
          await axios.post('/api/account/brand', brandDetailsForm);
          navigate(PATH_MAIN.dashboard);
        } catch (error) {
          enqueueSnackbar(error.message, { variant: 'error' });
        }
      }
    } else {
      navigate(PATH_MAIN.dashboard);
    }
  };
  return (
    <SignupBodyWrapper
      image={Iplan}
      title={'Brand'}
      progress={true}
      progressValue={100}
      children={
        <Wrapper>
          <Typography align="center" variant="h2" mb={8}>
            Let's set up your brand
          </Typography>
          <React.Fragment>
            <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
              <RHFTextField name="brand_name" label="Brand Name*" />
              <RHFTextField name="website_url" label="Website" />
              <TPhoneComponent
                value={phoneNumber}
                defaultCountry="IN"
                placeholder="Contact Number"
                onChange={(phone: any) => setPhoneNumber(phone)}
                error={
                  phoneNumber
                    ? isValidPhoneNumber(phoneNumber)
                      ? undefined
                      : 'Invalid phone number'
                    : 'Phone number required'
                }
              />

              <ButtonContainer>
                <Button onClick={clickHandler} size="large" color="primary" variant="outlined">
                  I’ll do it later
                </Button>
                <Button
                  size="large"
                  variant="contained"
                  color="primary"
                  type="submit"
                  endIcon={<IconNextSVG />}
                >
                  Finish
                </Button>
              </ButtonContainer>
            </FormProvider>
          </React.Fragment>
        </Wrapper>
      }
    />
  );
}
