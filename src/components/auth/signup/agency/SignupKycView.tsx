/*
 * Sign Up KYC Page
 *
 */
import React, { useState } from 'react';

import * as Yup from 'yup';
import { Grid, styled, Typography, Autocomplete, Box, Button } from '@mui/material';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import AttachFileIcon from '@mui/icons-material/AttachFile';
// @ts-ignore
import Files from 'react-files';
import { useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSelector } from 'react-redux';

import { BUYPLAN } from 'src/utils/constants';
import { FormProvider, RHFTextField } from 'src/components/hook-form';
import { AttachmentWrapper, ButtonContainer } from 'src/assets/shared/styles/SharedStylesComponent';
import AgencyBrand from 'src/assets/shared/images/AgencyBrand.png';
import axios from 'src/utils/axios';
import IconNextSVG from 'src/assets/shared/svg/IconNextSVG';
import SignupBodyWrapper from 'src/components/auth/elements/SignupBodyWrapper';
import TAutocompleteInput from 'src/assets/shared/elements/TAutoComplete';

type FormValuesProps = {
  gst_no: string;
  pan: string;
  city: string;
  address_line_1: string;
  address_line_2: string;
  afterSubmit?: string;
};
type PropsType = {
  onClick?: () => void;
};

const KycWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(8),
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(6, 2),
  },
}));

const OuterWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  [theme.breakpoints.down('lg')]: {
    flexDirection: 'column',
  },
  [theme.breakpoints.down('md')]: {
    flexDirection: 'row',
  },
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
  },
}));
const FlexDiv = styled('div')(({ theme }) => ({
  display: 'flex',
}));

const FilesWrapper = styled('div')(({ theme }) => ({
  paddingRight: theme.spacing(3),
  [theme.breakpoints.down('sm')]: {},
}));

const AttachmentThumbnail = styled('div')(({ theme }) => ({
  background: theme.palette.common.black,
  borderRadius: '15px',
  height: '96px',
  width: '147px',
  marginBottom: theme.spacing(1),
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  [theme.breakpoints.down('sm')]: {
    height: '90px',
    width: '120px',
  },
}));

const ImgStyle = styled('img')(({ theme }) => ({
  borderRadius: '15px',
  height: '80px',
  width: '130px',
  objectFit: 'cover',
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

export default function SignupKycView(props: PropsType): React.ReactElement {
  const [panFrontSrc, setPanFrontSrc] = useState<string>('');
  const [panBackSrc, setPanBackSrc] = useState<string>('');
  const [panGstSrc, setGstSrc] = useState<string>('');
  const [panFront, setPanFront] = useState<string | Blob>('');
  const [panBack, setPanBack] = useState<string | Blob>('');
  const [gstFile, setGstFile] = useState<string | Blob>('');

  const [countryError, setCountryError] = useState<boolean>(false);
  const [countryList, setCountryList] = useState<Array<CountryType>>([]);
  const [countryId, setCountryId] = useState<string>('');
  const [countryInputValue, setCountryInputValue] = React.useState('');
  const [defaultCountry, setDefaultCountry] = useState<CountryType | null>(null);

  const [stateError, setStateError] = useState<boolean>(false);
  const [stateList, setStateList] = useState<Array<StateType>>([]);
  const [stateId, setStateId] = useState<string>('');
  const [stateInputValue, setStateInputValue] = React.useState('');
  const [defaultState, setDefaultState] = useState<StateType | null>(null);
  const [, setLoading] = useState(false);

  const { enqueueSnackbar } = useSnackbar();

  const { planStatus } = useSelector((state: any) => state.prePlan.value);

  const navigate = useNavigate();

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

  const handleCountySearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setCountryError(false);
    const searchInput = e.target.value;
    if (e.target.value.length > 3) {
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
      if (e.target.value.length > 3) {
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

  const KycSchema = Yup.object().shape({
    address_line_1: Yup.string().required('Field is required'),
    city: Yup.string().required('Field is required'),
    address_line_2: Yup.string().required('Field is required'),
    gst_no: Yup.string().required('Field is required'),
    pan: Yup.string().required('Field is required'),
  });

  const MAX_FILE_SIZE = 500000000000;

  const defaultValues = {
    gst_no: '',
    pan: '',
    city: '',
    address_line_1: '',
    address_line_2: '',
  };

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(KycSchema),
    defaultValues,
  });

  const { handleSubmit } = methods;

  const onSubmit = async (data: FormValuesProps) => {
    const KYCDetailsForm = new FormData();
    KYCDetailsForm.append('gst_no', data.gst_no);
    KYCDetailsForm.append('pan', data.pan);
    KYCDetailsForm.append('state_id', stateId);
    KYCDetailsForm.append('city', data.city);
    KYCDetailsForm.append('country_id', countryId);
    KYCDetailsForm.append('address_line_1', data.address_line_1);
    KYCDetailsForm.append('address_line_2', data.address_line_2);
    panFront && KYCDetailsForm.append('pan_front', panFront);
    panBack && KYCDetailsForm.append('pan_back', panBack);
    gstFile && KYCDetailsForm.append('gst_document', gstFile);
    if (!countryError && !stateError) {
      try {
        const response = await axios.post('/api/account/kyc', KYCDetailsForm);
        const { message } = response.data;
        enqueueSnackbar(message, { variant: 'success' });
      } catch (error) {
        console.error(error);
        enqueueSnackbar(error.message, { variant: 'error' });
      }

      clickHandler();
    }
  };
  const clickHandler = async () => {
    setLoading(true);
    if (planStatus === BUYPLAN) {
      try {
        const response = await axios.get('/api/subscription/checkout/');
        const { data } = response.data;
        const { hosted_page } = data;
        window.location.replace(`${hosted_page.url}`);
      } catch (e) {
        console.error(e);
        enqueueSnackbar(e.message, { variant: 'error' });
      }
      setLoading(false);
    } else {
      navigate('/main/dashboard');
    }
  };

  return (
    <SignupBodyWrapper
      title={'KYC'}
      image={AgencyBrand}
      progress={true}
      progressValue={100}
      children={
        <KycWrapper>
          <Typography align="center" variant="h2" mt={16} mb={4}>
            Verify KYC to access major features
          </Typography>
          <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <RHFTextField name="gst_no" label="GST Number" />
            <RHFTextField name="pan" label="PAN Number" />
            <RHFTextField name="address_line_1" label="Address Line 1" />
            <RHFTextField name="address_line_2" label="Address Line 2" />
            <Autocomplete
              disablePortal
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
                }
                setDefaultCountry(newValue);
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
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12} md={6} lg={6}>
                <Autocomplete
                  disablePortal
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
                    }
                    setDefaultState(newValue);
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
              <Grid item xs={12} sm={12} md={6} lg={6}>
                <RHFTextField name="city" label="City" />
              </Grid>
            </Grid>

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
                    clickable
                  >
                    <AttachmentThumbnail color="primary">
                      {panFrontSrc ? (
                        <ImgStyle src={String(panFrontSrc)} alt="img" />
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
                    clickable
                  >
                    <AttachmentThumbnail color="primary">
                      {panBackSrc ? (
                        <ImgStyle src={String(panBackSrc)} alt="img" />
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
                  clickable
                >
                  <AttachmentThumbnail color="primary">
                    {panGstSrc ? (
                      <ImgStyle src={String(panGstSrc)} alt="img" />
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

            <ButtonContainer>
              <Button
                sx={{ width: 170 }}
                size="large"
                color="primary"
                variant="outlined"
                onClick={clickHandler}
              >
                I’ll do it later
              </Button>
              <Button
                sx={{ width: 170 }}
                size="large"
                type="submit"
                variant="contained"
                color="primary"
                endIcon={<IconNextSVG />}
                onClick={() => {
                  !countryInputValue && setCountryError(true);
                  !stateInputValue && setStateError(true);
                }}
              >
                Finish
              </Button>
            </ButtonContainer>
          </FormProvider>
        </KycWrapper>
      }
    />
  );
}
