import React, { useState, useEffect } from 'react';

import { Typography, styled, Grid, Stack, Switch, Button } from '@mui/material';

import { useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';

// Hooks
import { FormProvider, RHFTextField } from 'src/components/hook-form';
import axios from 'src/utils/axios';
import { SettingWrapper } from 'src/pages/Settings';
import IconEditSVG from 'src/assets/shared/svg/icon_edit';

type FormValuesProps = {
  custom_message: string;
  selfie_filtering: boolean;
  skip_duplicates: boolean;
  right_click: boolean;
  afterSubmit?: string;
};

export const HeaderWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(3, 0, 3, 0),
}));

export const Line = styled('div')(({ theme }) => ({
  borderBottom: '1px solid #6D6D6D',
}));

const AccountSettingView = () => {
  // Config State
  const [isConfigLocked, setIsConfigLocked] = useState<boolean>(true);
  const [isConfigEditing, setIsConfigEditing] = useState<boolean>(false);

  const [filter, setFilter] = useState<boolean>(false);
  const [duplicate, setDuplicate] = useState<boolean>(false);
  const [protect, setProtect] = useState<boolean>(false);

  const [dirty, setDirty] = useState<boolean>(false);

  // custom message state
  const [message, setMessage] = useState('');

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const getConfigDetails = async () => {
      try {
        const response = await axios.get('/api/account/settings');
        const { data } = response.data;
        setMessage(data.custom_message);
        setFilter(data.selfie_filtering);
        setDuplicate(data.skip_duplicates);
        setProtect(data.right_click);
      } catch (error) {
        console.error(error);
        enqueueSnackbar(error.message, { variant: 'error' });
      }
    };
    getConfigDetails();
  }, [enqueueSnackbar]);

  const methods = useForm<FormValuesProps>({});

  const { handleSubmit } = methods;

  const onSubmit = async (data: FormValuesProps) => {};

  const handleChange = (e: { target: { value: React.SetStateAction<string> } }) => {
    setMessage(e.target.value);
    setDirty(true);
  };

  const handleConfigEdit = () => {
    setIsConfigLocked(!isConfigLocked);
    setIsConfigEditing(true);
  };

  const handleConfigSave = async () => {
    const custom_message = message;
    const selfie_filtering = filter;
    const skip_duplicates = duplicate;
    const right_click = protect;
    if (dirty) {
      try {
        const response = await axios.post('/api/account/settings', {
          custom_message,
          selfie_filtering,
          skip_duplicates,
          right_click,
        });
        const { message } = response.data;
        enqueueSnackbar(message, { variant: 'success' });
        setIsConfigEditing(false);
        setIsConfigLocked(!isConfigLocked);
        setDirty(false);
      } catch (error) {
        console.error(error);
        enqueueSnackbar(error.message, { variant: 'error' });
      }
    } else {
      enqueueSnackbar('No new changes to save!', { variant: 'error' });
    }
  };

  const handleFilter = () => {
    setFilter(!filter);
    setDirty(true);
  };
  const handleDuplicate = () => {
    setDuplicate(!duplicate);
    setDirty(true);
  };

  const handleProtect = () => {
    setProtect(!protect);
    setDirty(true);
  };

  return (
    <SettingWrapper sx={{ maxWidth: '1400px', margin: 'auto' }}>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <HeaderWrapper>
          <Typography sx={{ cursor: 'pointer' }} color="grey.0" py={0.2} variant="h6">
            Default Configurations
          </Typography>
          {isConfigEditing ? (
            <Button
              onClick={handleConfigSave}
              size="small"
              sx={{ color: '#fff', cursor: 'pointer' }}
              color="secondary"
            >
              Save
            </Button>
          ) : (
            <Button
              size="small"
              startIcon={<IconEditSVG />}
              sx={{ color: '#fff', cursor: 'pointer' }}
              color="secondary"
              onClick={handleConfigEdit}
            >
              Edit
            </Button>
          )}
        </HeaderWrapper>
        <div>
          <Line />
        </div>
        <Grid container spacing={1} py={3.5}>
          <Grid item xs={12} sm={12} md={4} lg={4}>
            <RHFTextField
              value={message}
              name="custom_message"
              label="Custom message"
              onChange={handleChange}
              minRows={1}
              maxRows={3}
              multiline
              disabled={isConfigLocked}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={1} lg={1} />

          <Grid item xs={12} sm={6} md={3} lg={3} py={1}>
            <Typography variant="h6">Mandatory photo filtering</Typography>

            <Stack direction="row" spacing={1} py={1} alignItems="center">
              <Typography variant="h6">No</Typography>
              <Switch
                name="selfie_filtering"
                checked={filter}
                onChange={handleFilter}
                disabled={isConfigLocked}
              />
              <Typography variant="h6">Yes</Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={6} md={2} lg={2}>
            <Typography variant="h6">Skip Duplicates</Typography>

            <Stack direction="row" spacing={1} py={1} alignItems="center">
              <Typography variant="h6">No</Typography>
              <Switch
                name="skip_duplicates"
                checked={duplicate}
                onChange={handleDuplicate}
                disabled={isConfigLocked}
              />
              <Typography variant="h6">Yes</Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={6} md={2} lg={2}>
            <Typography variant="h6">Right click protection</Typography>

            <Stack direction="row" spacing={1} py={1} alignItems="center">
              <Typography variant="h6">No</Typography>
              <Switch
                name="right_click"
                checked={protect}
                onChange={handleProtect}
                disabled={isConfigLocked}
              />
              <Typography variant="h6">Yes</Typography>
            </Stack>
          </Grid>
        </Grid>
      </FormProvider>
    </SettingWrapper>
  );
};

export default AccountSettingView;
