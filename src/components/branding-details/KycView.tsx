import React, { useEffect, useState } from 'react';

import * as Yup from 'yup';
import { Typography, Container, styled, Grid, Autocomplete, Box } from '@mui/material';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CancelIcon from '@mui/icons-material/Cancel';
// @ts-ignore
import Files from 'react-files';
import { useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';
import { yupResolver } from '@hookform/resolvers/yup';

import { FormProvider, RHFTextField } from 'src/components/hook-form';
import {
  BrandingAttachmentWrapper,
  BrandingEditButton,
  AttachmentWrapper,
  AttachmentThumbnail,
  ThumbImgStyle,
} from 'src/assets/shared/styles/SharedStylesComponent';
import axios from 'src/utils/axios';
import IconEditSVG from 'src/assets/shared/svg/icon_edit';
import { kycStatusDetails } from 'src/redux/slices/kycStatus';
import TAutocompleteInput from 'src/assets/shared/elements/TAutoComplete';
import { useDispatch } from 'src/redux/store';
import { LoadingButton } from '@mui/lab';
import { ACCEPTED } from 'src/utils/constants';

type FormValuesProps = {
  address_line_1: string;
  address_line_2: string;
  city: string;
  gst_no: string;
  pan: string;
  afterSubmit?: string;
};
const OuterWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
  },
}));
const FlexDiv = styled('div')(({ theme }) => ({
  display: 'flex',
}));

const FilesWrapper = styled('div')(({ theme }) => ({
  width: 'fit-content',
  marginRight: theme.spacing(4),
  [theme.breakpoints.down('sm')]: {
    marginRight: theme.spacing(1),
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

const VerificationWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
}));

type CountryType = {
  id: number;
  name: string;
  flag: string;
  iso_code: string;
};

type StateType = {
  id: number;
  name: string;
  country_id: string;
};

export default function KycView(): React.ReactElement {
  const [panFrontSrc, setPanFrontSrc] = useState<string>('');
  const [panBackSrc, setPanBackSrc] = useState<string>('');
  const [gstSrc, setGstSrc] = useState<string>('');
  const [isLocked, setisLocked] = useState<boolean>(true);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [panFront, setPanFront] = useState<string | Blob>('');
  const [panBack, setPanBack] = useState<string | Blob>('');
  const [gstFile, setGstFile] = useState<string | Blob>('');

  const [countryError, setCountryError] = useState<boolean>(false);
  const [countryList, setCountryList] = useState<Array<CountryType>>([]);
  const [countryId, setCountryId] = useState<string>('');
  const [countryInputValue, setCountryInputValue] = useState('');
  const [defaultCountry, setDefaultCountry] = useState<CountryType | null>(null);

  const [stateError, setStateError] = useState<boolean>(false);
  const [stateList, setStateList] = useState<Array<StateType>>([]);
  const [stateId, setStateId] = useState<string>('');
  const [stateInputValue, setStateInputValue] = useState('');
  const [defaultState, setDefaultState] = useState<StateType | null>(null);

  const [verificationStatus, setVerificationStatus] = useState<string>('');
  const [rejectionReason, setRejectionReason] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const { enqueueSnackbar } = useSnackbar();

  const dispatch = useDispatch();

  const KycSchema = Yup.object().shape({
    address_line_1: Yup.string().required('Field is required'),
    city: Yup.string().required('Field is required'),
    address_line_2: Yup.string().required('Field is required'),
    gst_no: Yup.string().required('Field is required'),
    pan: Yup.string().required('Field is required'),
  });

  const onPanFrontChange = (files: any) => {
    setPanFrontSrc(files.map((filename: any) => filename.preview.url));
    setPanFront(files[0]);
  };

  const onPanFrontError = (error: any, file: any) => {
    console.log('error code ' + error.code + ': ' + error.message);
    enqueueSnackbar(error.message, { variant: 'error' });
  };

  const onPanBackChange = (files: any) => {
    setPanBackSrc(files.map((filename: any) => filename.preview.url));
    setPanBack(files[0]);
  };

  const onPanBackError = (error: any, file: any) => {
    console.log('error code ' + error.code + ': ' + error.message);
    enqueueSnackbar(error.message, { variant: 'error' });
  };

  const onGstFileChange = (files: any) => {
    setGstSrc(files.map((filename: any) => filename.preview.url));
    setGstFile(files[0]);
  };

  const onGstFileError = (error: any, file: any) => {
    console.log('error code ' + error.code + ': ' + error.message);
    enqueueSnackbar(error.message, { variant: 'error' });
  };

  const MAX_FILE_SIZE = 500000000000;

  const defaultValues = {
    address_line_1: '',
    address_line_2: '',
    city: '',
    gst_no: '',
    pan: '',
  };
  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(KycSchema),
    defaultValues,
  });

  const { handleSubmit, setValue } = methods;

  const onSubmit = async (data: FormValuesProps, event: any) => {
    event.stopPropagation();
    const kycForm = new FormData();
    !countryInputValue && setCountryError(true);
    !stateInputValue && setStateError(true);
    kycForm.append('address_line_1', data.address_line_1);
    kycForm.append('address_line_2', data.address_line_2);
    kycForm.append('state_id', stateId);
    kycForm.append('city', data.city);
    kycForm.append('country_id', countryId);
    kycForm.append('gst_no', data.gst_no);
    kycForm.append('pan', data.pan);
    panFront && kycForm.append('pan_front', panFront);
    panBack && kycForm.append('pan_back', panBack);
    gstFile && kycForm.append('gst_document', gstFile);
    if (!countryError && !stateError) {
      try {
        setLoading(true);
        const response = await axios.post('/api/account/kyc', kycForm);
        const { data, message } = response.data;
        enqueueSnackbar(message, { variant: 'success' });
        dispatch(kycStatusDetails({ kyc_status: data.verification_status }));
        setVerificationStatus(data.verification_status);
        setIsEditing(false);
        setisLocked(!isLocked);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error(error);
        enqueueSnackbar(error.message, { variant: 'error' });
      }
    }
  };

  const handleEdit = () => {
    setisLocked(false);
    setIsEditing(true);
  };

  const handleCountySearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setCountryError(false);
    const searchInput = e.target.value;
    if (e.target.value.length >= 2) {
      try {
        const response = await axios.post('/api/lookup/countries/search?limit=10', {
          search: {
            value: searchInput,
          },
        });
        const { data } = response.data;
        setCountryList(data);
      } catch (error) {
        console.error(error);
        enqueueSnackbar(error.message, { variant: 'error' });
      }
    }
  };

  const handleStateSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (countryId) {
      setStateError(false);
      const searchInput = e.target.value;
      if (e.target.value.length >= 2) {
        try {
          const response = await axios.post(
            `/api/lookup/countries/${countryId}/states/search?limit=10`,
            {
              search: {
                value: searchInput,
              },
            }
          );
          const { data } = response.data;
          setStateList(data);
        } catch (error) {
          console.error(error);
          enqueueSnackbar(error.message, { variant: 'error' });
        }
      }
    } else {
      enqueueSnackbar('Please select a country first', { variant: 'error' });
    }
  };

  useEffect(() => {
    const getKycDetails = async () => {
      try {
        const response = await axios.get('/api/account/kyc');
        const { data } = response.data;
        data.address_line_1
          ? setValue('address_line_1', data.address_line_1)
          : setValue('address_line_1', '');

        data.address_line_2
          ? setValue('address_line_2', data.address_line_2)
          : setValue('address_line_2', '');
        data.city ? setValue('city', data.city) : setValue('city', '');
        data.gst_no ? setValue('gst_no', data.gst_no) : setValue('gst_no', '');
        data.pan ? setValue('pan', data.pan) : setValue('pan', '');
        if (data.pan === null) {
          setIsEditing(true);
          setisLocked(false);
        }
        data.pan_front &&
          (data.pan_front.thumbnail_url
            ? setPanFrontSrc(data.pan_front.thumbnail_url)
            : setPanFrontSrc(data.pan_front.original_url));
        data.pan_back &&
          (data.pan_back.thumbnail_url
            ? setPanBackSrc(data.pan_back.thumbnail_url)
            : setPanBackSrc(data.pan_back.original_url));
        data.gst_document &&
          (data.gst_document.thumbnail_url
            ? setGstSrc(data.gst_document.thumbnail_url)
            : setGstSrc(data.gst_document.original_url));
        data.country && setDefaultCountry(data.country);
        data.country && setCountryId(data.country.id);

        data.state && setStateId(data.state.id);
        data.state && setDefaultState(data.state);
        data.verification_status && setVerificationStatus(data.verification_status);
        data.reject_reason && setRejectionReason(data.reject_reason);
      } catch (error) {
        console.error(error);
        enqueueSnackbar(error.message, { variant: 'error' });
      }
    };
    getKycDetails();
  }, [enqueueSnackbar, setValue]);

  return (
    <React.Fragment>
      <Container sx={{ py: 3 }}>
        <div>
          <BrandingAttachmentWrapper>
            <OuterWrapper>
              <FlexDiv>
                <FilesWrapper>
                  <Files
                    className="files-dropzone"
                    onChange={onPanFrontChange}
                    onError={onPanFrontError}
                    accepts={['image/*', '.pdf']}
                    multiple={false}
                    maxFileSize={MAX_FILE_SIZE}
                    minFileSize={0}
                    clickable={!isLocked}
                  >
                    <AttachmentThumbnail color="primary">
                      {panFrontSrc ? (
                        <ImageWrapper>
                          <ThumbImgStyle src={String(panFrontSrc)} alt="img" />
                          {isEditing && verificationStatus !== ACCEPTED && (
                            <CancelIconStyle
                              fontSize="medium"
                              color="primary"
                              onClick={(e: any) => {
                                e.stopPropagation();
                                setPanFrontSrc('');
                                setPanFront('');
                              }}
                            />
                          )}
                        </ImageWrapper>
                      ) : (
                        <AttachFileIcon color="primary" />
                      )}
                    </AttachmentThumbnail>

                    <AttachmentWrapper>
                      <AddBoxOutlinedIcon color="primary" />
                      <Typography px={1} variant="body2">
                        Upload PAN Front
                      </Typography>
                    </AttachmentWrapper>
                  </Files>
                </FilesWrapper>
                <FilesWrapper>
                  <Files
                    className="files-dropzone"
                    onChange={onPanBackChange}
                    onError={onPanBackError}
                    accepts={['image/*', '.pdf']}
                    multiple={false}
                    maxFileSize={MAX_FILE_SIZE}
                    minFileSize={0}
                    clickable={!isLocked}
                  >
                    <AttachmentThumbnail color="primary">
                      {panBackSrc ? (
                        <ImageWrapper>
                          <ThumbImgStyle src={String(panBackSrc)} alt="img" />
                          {isEditing && verificationStatus !== ACCEPTED && (
                            <CancelIconStyle
                              fontSize="medium"
                              color="primary"
                              onClick={(e: any) => {
                                e.stopPropagation();
                                setPanBackSrc('');
                                setPanBack('');
                              }}
                            />
                          )}
                        </ImageWrapper>
                      ) : (
                        <AttachFileIcon color="primary" />
                      )}
                    </AttachmentThumbnail>
                    <AttachmentWrapper>
                      <AddBoxOutlinedIcon color="primary" />
                      <Typography px={1} variant="body2">
                        Upload PAN Back
                      </Typography>
                    </AttachmentWrapper>
                  </Files>
                </FilesWrapper>
              </FlexDiv>
              <FilesWrapper>
                <Files
                  className="files-dropzone"
                  onChange={onGstFileChange}
                  onError={onGstFileError}
                  accepts={['image/*', '.pdf']}
                  multiple={false}
                  maxFileSize={MAX_FILE_SIZE}
                  minFileSize={0}
                  clickable={!isLocked}
                >
                  <AttachmentThumbnail color="primary">
                    {gstSrc ? (
                      <ImageWrapper>
                        <ThumbImgStyle src={String(gstSrc)} alt="img" />
                        {isEditing && verificationStatus !== ACCEPTED && (
                          <CancelIconStyle
                            fontSize="medium"
                            color="primary"
                            onClick={(e: any) => {
                              e.stopPropagation();
                              setGstSrc('');
                              setGstFile('');
                            }}
                          />
                        )}
                      </ImageWrapper>
                    ) : (
                      <AttachFileIcon color="primary" />
                    )}
                  </AttachmentThumbnail>
                  <AttachmentWrapper>
                    <AddBoxOutlinedIcon color="primary" />
                    <Typography px={1} variant="body2">
                      Upload GST Certificate
                    </Typography>
                  </AttachmentWrapper>
                </Files>
              </FilesWrapper>
            </OuterWrapper>
            <div>
              <VerificationWrapper>
                <Typography variant="h6" fontStyle="italic">
                  Verification Status :
                </Typography>
                <Typography
                  variant="h6"
                  fontStyle="italic"
                  px={1}
                  color="info.main"
                  textTransform="capitalize"
                >
                  {verificationStatus}
                </Typography>
              </VerificationWrapper>
              {rejectionReason && (
                <Typography variant="caption" fontStyle="italic" textTransform="capitalize">
                  {rejectionReason}
                </Typography>
              )}
            </div>

            {verificationStatus !== ACCEPTED &&
              (isEditing ? (
                <LoadingButton
                  sx={{
                    m: 0,
                    p: 0,
                    height: 'fit-content',
                  }}
                  size="small"
                  loading={loading}
                  color="secondary"
                  onClick={handleSubmit(onSubmit)}
                >
                  Request to verify
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
              ))}
          </BrandingAttachmentWrapper>
        </div>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={6} md={4} lg={4}>
              <RHFTextField name="address_line_1" label="Address Line 1*" disabled={isLocked} />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={4}>
              <RHFTextField name="address_line_2" label="Address Line 2*" disabled={isLocked} />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={4}>
              <Autocomplete
                disablePortal
                disabled={isLocked}
                id="country"
                value={defaultCountry}
                options={countryList}
                getOptionLabel={(option) => option.name}
                inputValue={countryInputValue}
                onInputChange={(event, newInputValue) => {
                  setCountryError(false);
                  setCountryInputValue(newInputValue);
                }}
                onChange={(event: any, newValue: CountryType | null) => {
                  if (newValue) {
                    setCountryId(newValue.id.toString());
                    setDefaultCountry(newValue);
                  } else {
                    setCountryError(true);
                    setCountryId('');
                  }
                }}
                renderOption={(props, option) => (
                  <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                    {option.flag}&nbsp;&nbsp;
                    {option.name}
                  </Box>
                )}
                renderInput={(params) => (
                  <TAutocompleteInput
                    {...params}
                    onChange={handleCountySearch}
                    errorFlag={countryError}
                    label="Country*"
                    errorMessage="Field is required!"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={4}>
              <Autocomplete
                disablePortal
                disabled={isLocked}
                id="state"
                options={stateList}
                value={defaultState}
                getOptionLabel={(option) => option.name}
                inputValue={stateInputValue}
                onInputChange={(event, newInputValue) => {
                  setStateError(false);
                  setStateInputValue(newInputValue);
                }}
                onChange={(event: any, newValue: StateType | null) => {
                  if (newValue) {
                    setStateId(newValue.id.toString());
                    setDefaultState(newValue);
                  } else {
                    setStateError(true);
                    setStateId('');
                  }
                }}
                renderInput={(params) => (
                  <TAutocompleteInput
                    {...params}
                    onChange={handleStateSearch}
                    errorFlag={stateError}
                    label="State*"
                    errorMessage="Field is required!"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={4}>
              <RHFTextField name="city" label="City*" disabled={isLocked} />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={4}>
              <RHFTextField name="gst_no" label="GST ID*" disabled={isLocked} />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={4}>
              <RHFTextField name="pan" label="PAN Number*" disabled={isLocked} />
            </Grid>
          </Grid>
        </FormProvider>
      </Container>
    </React.Fragment>
  );
}
