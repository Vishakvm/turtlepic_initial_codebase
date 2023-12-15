/*
 * Sign Up Agency Brand Page
 *
 */
import React, { useState } from 'react';

import * as Yup from 'yup';
import { useNavigate } from 'react-router';
import { yupResolver } from '@hookform/resolvers/yup';

import { useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';

import { Button, styled, Typography, InputAdornment } from '@mui/material';

import TPhoneComponent from 'src/assets/shared/elements/TPhoneComponent';
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined';
import { isValidPhoneNumber } from 'react-phone-number-input';

import {
  AttachmentButton,
  AttachmentWrapper,
  ButtonContainer,
} from 'src/assets/shared/styles/SharedStylesComponent';
import { FormProvider, RHFTextField } from '../../../hook-form';
import AgencyBrand from 'src/assets/shared/images/AgencyBrand.png';
import axios from 'src/utils/axios';
import IconNextSVG from 'src/assets/shared/svg/IconNextSVG';
import { PATH_AUTH } from 'src/routes/paths';
import SignupBodyWrapper from 'src/components/auth/elements/SignupBodyWrapper';
import TInputComponent from 'src/assets/shared/elements/TInputComponent';

type FormValuesProps = {
  brand_name: string;
  website_url: string;
  domain: string;
  afterSubmit?: string;
};

const Wrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(8),
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(6, 2),
  },
}));

export default function SignupAgencyBrandView(): React.ReactElement {
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const navigate = useNavigate();
  const [emailList, setEmails] = useState<string>('');

  const { enqueueSnackbar } = useSnackbar();
  const clickHandler = () => {
    navigate(PATH_AUTH.kyc);
  };

  const defaultValues = {
    brand_name: '',
    website_url: '',
    domain: '',
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
    brandDetailsForm.append('domain', data.domain);
    if (isDirty || phoneNumber) {
      if (phoneNumber) {
        if (isValidPhoneNumber(phoneNumber)) {
          try {
            const response = await axios.post('/api/account/brand', brandDetailsForm);
            const { data } = response.data;
            if (process.env.REACT_APP_SHOW_SUBDOMAIN === 'true') {
              if (data.domain) {
                !window.location.host.includes(data.domain) &&
                  window.location.replace(
                    `https://${data.domain}.${process.env.REACT_APP_MAIN_DOMAIN}/kyc`
                  );
              } else {
                navigate(PATH_AUTH.kyc);
              }
            } else {
              navigate(PATH_AUTH.kyc);
            }
          } catch (error) {
            enqueueSnackbar(error.message, { variant: 'error' });
          }
        } else {
          enqueueSnackbar('Please enter a valid phone number!', { variant: 'error' });
        }
      } else {
        try {
          const response = await axios.post('/api/account/brand', brandDetailsForm);
          const { data } = response.data;
          if (process.env.REACT_APP_SHOW_SUBDOMAIN === 'true') {
            if (data.domain) {
              !window.location.host.includes(data.domain) &&
                window.location.replace(
                  `https://${data.domain}.${process.env.REACT_APP_MAIN_DOMAIN}/kyc`
                );
            } else {
              navigate(PATH_AUTH.kyc);
            }
          } else {
            navigate(PATH_AUTH.kyc);
          }
        } catch (error) {
          enqueueSnackbar(error.message, { variant: 'error' });
        }
      }
    } else {
      navigate(PATH_AUTH.kyc);
    }
  };

  const emailHandler = (val: any) => {
    setEmails(val.target.value);
  };

  const sendInvite = async () => {
    let emails = emailList.split(',').map((item) => item.trim());
    if (emailList !== '') {
      try {
        const response = await axios.post('/api/account/invites', { emails });
        enqueueSnackbar(response.data.message, { variant: 'success' });
        // setEmails('');
      } catch (error) {
        console.error(error);
        enqueueSnackbar(error.message, { variant: 'error' });
      }
    } else {
      enqueueSnackbar('Please enter email/emails', { variant: 'error' });
    }
  };

  return (
    <SignupBodyWrapper
      image={AgencyBrand}
      title={'Agency Brand'}
      progress={true}
      progressValue={85}
      children={
        <Wrapper>
          <Typography align="center" variant="h2" mb={8}>
            Let's set up your brand
          </Typography>
          <React.Fragment>
            <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
              <RHFTextField name="brand_name" label="Brand Name*" />
              <RHFTextField name="website_url" label="Website" />
              <RHFTextField name="domain" label="Domain Name" />
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

              <AttachmentWrapper>
                <AttachmentButton color="secondary">
                  <PersonAddAltOutlinedIcon />
                </AttachmentButton>
                <Typography color="secondary" px={2} variant="h6">
                  Invite Team Members
                </Typography>
              </AttachmentWrapper>
              <TInputComponent
                id="emailList"
                label=""
                value={emailList}
                onChange={emailHandler}
                placeholder="Email, comma separated"
                InputProps={{
                  endAdornment: (
                    <InputAdornment
                      position="end"
                      onClick={sendInvite}
                      sx={{ cursor: 'pointer', padding: '20px 0 20px 0' }}
                    >
                      <Typography color="primary" variant="h5">
                        |&nbsp;&nbsp; Send Invite
                      </Typography>
                    </InputAdornment>
                  ),
                }}
              />
              <ButtonContainer>
                <Button
                  sx={{ width: 170 }}
                  onClick={clickHandler}
                  size="large"
                  color="primary"
                  variant="outlined"
                >
                  I’ll do it later
                </Button>
                <Button
                  sx={{ width: 170 }}
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
