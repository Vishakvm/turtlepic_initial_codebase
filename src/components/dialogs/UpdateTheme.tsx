/*
 * Update Theme Dialog
 */

import React, { useState, useEffect } from 'react';
import * as Yup from 'yup';
import { ChromePicker } from 'react-color';
import { LoadingButton } from '@mui/lab';
import { useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';
import { FormProvider, RHFTextField } from 'src/components/hook-form';
import axios from 'src/utils/axios';

import {
  styled,
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Checkbox,
  FormGroup,
  FormControlLabel,
} from '@mui/material';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';

type PropsType = {
  buttonSecondaryLabel: string;
  dialogContent: string;
  dialogId?: string;
  isDialogOpen: boolean;
  methods: any;
  onSubmit: any;
  onClose: () => void;
  loading: any;
  data?: any;
};

const CloseIcon = styled(CancelOutlinedIcon)(({ theme }) => ({
  fontSize: '2rem',
}));

const ContentWrapper = styled('div')(({ theme }) => ({
  width: '100%',
  marginLeft: 'auto',
  marginRight: 'auto',
  [theme.breakpoints.down('sm')]: {
    width: '95%',
  },
}));

const CheckBox = styled(FormGroup)(({ theme }) => ({
  padding: theme.spacing(0, 0, 2, 0),
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
}));

export default function UpdateTheme(props: PropsType): React.ReactElement {
  const [color, setColor] = useState(props.data.accent_color);
  const { enqueueSnackbar } = useSnackbar();
  const [isActiveChecked, setIsActiveChecked] = useState(props.data.active);

  const navigate = useNavigate();

  const PlanSchema = Yup.object().shape({});

  const defaultValues = {};

  type FormValuesProps = {};

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

  useEffect(() => {
    setIsActiveChecked(props.data.active);
    setColor(props.data.accent_color);
  }, [props.data]);

  const onSubmit = async (data: FormValuesProps) => {
    const formData = new FormData();
    formData.append('id', props.data.id);
    formData.append('active', isActiveChecked ? '1' : '0');
    formData.append('accent_color', color!);
    formData.append('name', props.data.name);
    formData.append('default', props.data.default);
    try {
      const response = await axios.post(`/api/events/updatetheme`, formData);
      const { message } = response.data;
      enqueueSnackbar(message, { variant: 'success' });
      reset();
      props.onClose();
    } catch (error) {
      enqueueSnackbar(error.message, { variant: 'error' });
    }
  };

  return (
    <Dialog
      fullScreen
      onClose={props.onClose}
      aria-labelledby={props.dialogId}
      open={props.isDialogOpen}
      BackdropProps={{ invisible: true }}
      sx={{
        backgroundColor: 'rgba(0,0,0,0.5)',

        ' .MuiDialog-container .MuiPaper-root': {
          boxShadow: 'none',

          outline: 'none',
        },
      }}
    >
      <DialogTitle id={props.dialogId}>
        <IconButton
          aria-label="close"
          onClick={props.onClose}
          sx={{
            float: 'right',
            padding: 0,
            color: (theme) => theme.palette.common.white,
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <ContentWrapper>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <>
              <Typography py={1} align="center" variant="h2">
                Manage Theme : {props.data.display_name}
              </Typography>

              <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                <Typography variant="h6">Accent Color</Typography>
                <ChromePicker color={color} onChangeComplete={handleChangeComplete} />
                <br />
                <CheckBox>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={isActiveChecked}
                        onChange={() => {
                          setIsActiveChecked(!isActiveChecked);
                        }}
                      />
                    }
                    label="Active Status"
                  />
                </CheckBox>

                <Box textAlign="right" mt={3}>
                  <LoadingButton
                    variant="contained"
                    type="submit"
                    sx={{ width: '200px' }}
                    loading={isSubmitting}
                  >
                    Update
                  </LoadingButton>
                </Box>
              </FormProvider>
            </>
          </Box>
        </ContentWrapper>
      </DialogContent>
    </Dialog>
  );
}
