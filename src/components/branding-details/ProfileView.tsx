import React, { useState, useEffect, useRef } from 'react';

import { Typography, Container, styled, Grid, Switch, Stack } from '@mui/material';
import { isValidPhoneNumber } from 'react-phone-number-input';
import * as Yup from 'yup';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSnackbar } from 'notistack';

// Hooks
import {
  BrandingAttachmentWrapper,
  BrandingEditButton,
  AttachmentWrapper,
  AttachmentThumbnail,
  ThumbImgStyle,
} from 'src/assets/shared/styles/SharedStylesComponent';
import axios from 'src/utils/axios';
import { FormProvider, RHFTextField } from 'src/components/hook-form';

// Icons
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import CancelIcon from '@mui/icons-material/Cancel';
import IconEditSVG from 'src/assets/shared/svg/icon_edit';

// @ts-ignore
import Files from 'react-files';
import PhotoSVG from 'src/assets/shared/svg/icon_photo';
import TPhoneComponent from 'src/assets/shared/elements/TPhoneComponent';
import { LoadingButton } from '@mui/lab';

type ProfileValuesProps = {
  brand_name: string;
  website_url: string;
  official_email: string;
  instagram_url: string;
  facebook_url: string;
  youtube_url: string;
  about: string;
  domain: string;
  logo_watermark: boolean;
  afterSubmit?: string;
};

const FilesWrapper = styled('div')(({ theme }) => ({
  width: 'fit-content',
}));

const Toggle = styled(Switch)(({ theme }) => ({
  '& .MuiSwitch-thumb': {
    border: '2px solid #6d6d6d',
    background: theme.palette.grey[900],
  },
  '& .MuiSwitch-track': {
    backgroundColor: '#6D6d6d',
  },
}));
const ImageWrapper = styled('div')(({ theme }) => ({
  position: 'relative',
}));
const CancelIconStyle = styled(CancelIcon)(({ theme }) => ({
  position: 'absolute',
  top: '-0.8rem',
  right: '-0.6rem',
  cursor: 'pointer',
}));
const ProfileView = (): React.ReactElement => {
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [fileName, setFileName] = React.useState<string>('');
  const [isLocked, setisLocked] = useState<boolean>(false);
  const [file, setFile] = useState<string | Blob>('');
  const [isEditing, setIsEditing] = useState(true);
  const [loading, setLoading] = useState(false);

  const { enqueueSnackbar } = useSnackbar();

  const ProfileSchema = Yup.object().shape({
    brand_name: Yup.string().required('Field is required'),
    website_url: Yup.string().url('Enter correct url'),
    official_email: Yup.string().email('Email must be a valid email address'),
    instagram_url: Yup.string().url('Enter correct link'),
    youtube_url: Yup.string().url('Enter correct link'),
    facebook_url: Yup.string().url('Enter correct link'),
  });

  const handleEdit = () => {
    setIsEditing(true);
    setisLocked(!isLocked);
  };
  const onFilesChange = (files: any) => {
    setFileName(files.map((filename: any) => filename.preview.url));
    setFile(files[0]);
  };

  const onFilesError = (error: any, file: any) => {
    console.log('error code ' + error.code + ': ' + error.message);
  };

  const MAX_FILE_SIZE = 500000000000;

  const defaultValues = {
    brand_name: '',
    website_url: '',
    official_email: '',
    instagram_url: '',
    youtube_url: '',
    facebook_url: '',
    about: '',
    domain: '',
  };
  const methods = useForm<ProfileValuesProps>({
    resolver: yupResolver(ProfileSchema),
    defaultValues,
  });

  const { handleSubmit, setValue } = methods;

  const onSubmit = async (data: ProfileValuesProps) => {
    const profileForm = new FormData();
    profileForm.append('brand_name', data.brand_name);
    profileForm.append('website_url', data.website_url);
    profileForm.append('official_email', data.official_email);
    profileForm.append('instagram_url', data.instagram_url);
    profileForm.append('youtube_url', data.youtube_url);
    profileForm.append('facebook_url', data.facebook_url);
    profileForm.append('about', data.about);
    file && profileForm.append('logo', file);
    profileForm.append('domain', data.domain);
    profileForm.append('logo_watermark', isChecked ? '1' : '0');
    if (phoneNumber) {
      profileForm.append('phone_number', phoneNumber);
      if (isValidPhoneNumber(phoneNumber)) {
        try {
          setLoading(true);
          const response = await axios.post('/api/account/brand', profileForm);
          const { message, data } = response.data;
          if (process.env.REACT_APP_SHOW_SUBDOMAIN === 'true') {
            data.domain &&
              !window.location.host.includes(data.domain) &&
              window.location.replace(
                `https://${data.domain}.${process.env.REACT_APP_MAIN_DOMAIN}`
              );
          }
          enqueueSnackbar(message, { variant: 'success' });
          setIsEditing(false);
          setisLocked(true);
          setLoading(false);
        } catch (error) {
          setLoading(false);
          enqueueSnackbar(error.message, { variant: 'error' });
        }
      } else {
        enqueueSnackbar('Please enter a valid phone number!', { variant: 'error' });
      }
    } else {
      profileForm.append('phone_number', '');
      try {
        setLoading(true);
        const response = await axios.post('/api/account/brand', profileForm);
        const { data, message } = response.data;
        if (process.env.REACT_APP_SHOW_SUBDOMAIN === 'true') {
          data.domain &&
            !window.location.host.includes(data.domain) &&
            window.location.replace(`https://${data.domain}.${process.env.REACT_APP_MAIN_DOMAIN}`);
        }
        enqueueSnackbar(message, { variant: 'success' });
        setIsEditing(false);
        setisLocked(true);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        enqueueSnackbar(error.message, { variant: 'error' });
      }
    }
  };

  const handleChange = () => {
    setIsChecked(!isChecked);
  };
  const isMounted = useRef(false);

  useEffect(() => {
    const getProfileDetails = async () => {
      try {
        const response = await axios.get('/api/account/brand');
        const { data } = response.data;
        if (!isMounted.current) {
          data.brand_name ? setValue('brand_name', data.brand_name) : setValue('brand_name', '');
          if (data.brand_name !== '') {
            setisLocked(true);
            setIsEditing(false);
          }
          data.website_url
            ? setValue('website_url', data.website_url)
            : setValue('website_url', '');
          data.official_email
            ? setValue('official_email', data.official_email)
            : setValue('official_email', '');
          data.instagram_url
            ? setValue('instagram_url', data.instagram_url)
            : setValue('instagram_url', '');
          data.facebook_url
            ? setValue('facebook_url', data.facebook_url)
            : setValue('facebook_url', '');
          data.youtube_url
            ? setValue('youtube_url', data.youtube_url)
            : setValue('youtube_url', '');
          data.about ? setValue('about', data.about) : setValue('about', '');
          data.phone_number ? setPhoneNumber(data.phone_number) : setPhoneNumber('');
          data.domain ? setValue('domain', data.domain) : setValue('domain', '');
          data.logo &&
            (data.logo.thumbnail_url
              ? setFileName(data.logo.thumbnail_url)
              : setFileName(data.logo.original_url));
          setIsChecked(data.logo_watermark);
        }
      } catch (error) {
        console.error(error);
        enqueueSnackbar(error.message, { variant: 'error' });
      }
    };
    getProfileDetails();

    return () => {
      isMounted.current = true;
    };
  }, [enqueueSnackbar, setValue]);

  return (
    <React.Fragment>
      <Container sx={{ py: 3 }}>
        <div>
          <BrandingAttachmentWrapper>
            <FilesWrapper>
              <Files
                className="files-dropzone"
                onChange={onFilesChange}
                onError={onFilesError}
                accepts={['image/*']}
                maxFileSize={MAX_FILE_SIZE}
                minFileSize={0}
                clickable={!isLocked}
                multiple={false}
              >
                <AttachmentWrapper>
                  <AttachmentThumbnail color="primary">
                    {fileName ? (
                      <ImageWrapper>
                        <ThumbImgStyle src={String(fileName)} alt="img" />
                        {isEditing && (
                          <CancelIconStyle
                            fontSize="medium"
                            color="primary"
                            onClick={(e: any) => {
                              e.stopPropagation();
                              setFileName('');
                            }}
                          />
                        )}
                      </ImageWrapper>
                    ) : (
                      <PhotoSVG />
                    )}
                  </AttachmentThumbnail>

                  <AddBoxOutlinedIcon color="primary" sx={{ ml: 1 }} />
                  <Typography px={1} variant="body2">
                    Upload logo
                  </Typography>
                </AttachmentWrapper>
              </Files>
            </FilesWrapper>
            {isEditing ? (
              <LoadingButton
                size="small"
                loading={loading}
                color="secondary"
                onClick={handleSubmit(onSubmit)}
              >
                Save
              </LoadingButton>
            ) : (
              <BrandingEditButton
                size="small"
                startIcon={<IconEditSVG />}
                sx={{ color: '#fff' }}
                onClick={handleEdit}
              >
                Edit
              </BrandingEditButton>
            )}
          </BrandingAttachmentWrapper>
        </div>
        <FormProvider methods={methods}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4} lg={4}>
              <RHFTextField
                name="brand_name"
                label="Name of the brand*"
                placeholder="should be unique in your workspace"
                disabled={isLocked}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={4}>
              <RHFTextField
                name="website_url"
                label="Website"
                placeholder="eg. https://www.intellinetsystem.com"
                disabled={isLocked}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={4}>
              <RHFTextField
                name="official_email"
                label="Official Email"
                placeholder="turtlepic@gmail.com"
                disabled={isLocked}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4} lg={4}>
              <RHFTextField name="instagram_url" label="Instagram Link" disabled={isLocked} />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={4}>
              <RHFTextField name="youtube_url" label="Youtube Link" disabled={isLocked} />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={4}>
              <RHFTextField name="facebook_url" label="Facebook Link" disabled={isLocked} />
            </Grid>

            <Grid item xs={12} sm={6} md={6} lg={4}>
              <RHFTextField name="about" label="About Us" multiline rows={3} disabled={isLocked} />
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={4}>
              <RHFTextField
                name="domain"
                label="Domain Name"
                placeholder="Test1234.turtlepic.com"
                disabled={isLocked}
              />
              <Typography variant="caption" color="grey.100">
                Custom domain is only available for subscription members
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={4}>
              <Typography color={isLocked ? 'grey.600' : 'commom.white'} pb={0} variant="h6">
                Please enter your contact number
              </Typography>
              <TPhoneComponent
                name="phone_number"
                disabled={isLocked}
                value={phoneNumber}
                defaultCountry="IN"
                onChange={(phone: any) => setPhoneNumber(phone)}
                error={
                  phoneNumber
                    ? isValidPhoneNumber(phoneNumber)
                      ? undefined
                      : 'Invalid phone number'
                    : 'Phone number required'
                }
              />
            </Grid>
          </Grid>
          <Typography variant="body2">Set logo as watermark</Typography>

          <Stack direction="row" spacing={1} py={2} alignItems="center">
            <Typography variant="body2">No</Typography>
            <Toggle
              name="logo_watermark"
              checked={isChecked}
              onChange={handleChange}
              disabled={isLocked}
            />
            <Typography variant="body2">Yes</Typography>
          </Stack>
        </FormProvider>
      </Container>
    </React.Fragment>
  );
};

export default ProfileView;
