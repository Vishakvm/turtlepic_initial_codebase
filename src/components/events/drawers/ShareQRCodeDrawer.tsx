import React, { useState } from 'react';
import { styled, Drawer, FormControlLabel, Checkbox, FormGroup, Box, Button, Typography, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import * as XLSX from 'xlsx';

import { useSelector } from 'src/redux/store';

import { useSnackbar } from 'notistack';

import useResponsive from 'src/hooks/useResponsive';

import PlayForWorkIcon from '@mui/icons-material/PlayForWork';

import IconBackSVG from 'src/assets/shared/svg/icon_back';
import axios from 'src/utils/axios';

type DrawerProps = {
  openDrawer: boolean;
  onClose: () => void;
};

const Wrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 20, 0, 20),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(0, 2, 0, 2),
  },
}));

const TextWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(2, 0, 2, 0),
}));
const ButtonContainer = styled('div')(({ theme }) => ({
  textAlign: 'center',
  marginTop: theme.spacing(3),
}));

const CheckBox = styled(FormGroup)(({ theme }) => ({
  padding: theme.spacing(0, 0, 2, 0),
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'start',
}));

export default function ShareQRCodeDrawerView(props: DrawerProps): React.ReactElement {
  const [isEmailChecked, setIsEmailChecked] = useState(false);
  const [isWhatsAppChecked, setIsWhatsAppChecked] = useState(false);
  const [isBothChecked, setIsBothChecked] = useState(false);
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [shareDirty, setShareDirty] = useState(false);

  const eventDetail = useSelector((state) => state.createEvent.value);

  const isDesktop = useResponsive('up', 'lg');
  const { enqueueSnackbar } = useSnackbar();

  const handleEmailOnly = () => {
    setIsEmailChecked(!isEmailChecked);
    setIsWhatsAppChecked(false);
    setIsBothChecked(false);
    setShareDirty(true);
  };
  const handleWhatsappOnly = () => {
    setIsWhatsAppChecked(!isWhatsAppChecked);
    setIsEmailChecked(false);
    setIsBothChecked(false);
    setShareDirty(true);
  };
  const handleEmailandWhatsapp = () => {
    setIsBothChecked(!isBothChecked);
    setIsEmailChecked(false);
    setIsWhatsAppChecked(false);
    setShareDirty(true);
  };

  const handleCloseDrawer = () => {
    props.onClose();
  };

  const onImportViaExcel = (e: any) => {
    const f = e.target.files[0]

    if (!f?.size) return;

    const reader = new FileReader();
    reader.onload = (evt: any) => { // evt = on_file_select event
      /* Parse data */
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      /* Get first worksheet */
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      // Get as JSON Obj
      let xcelArrObj = XLSX.utils.sheet_to_json(ws, { header: 'A' })
      let emails_string = xcelArrObj?.map((mail: any) => mail.A).toString()

      setEmail(emails_string);
    };
    reader.readAsBinaryString(f);
  }

  const handleShareQRCode = async (mail: boolean, whatsapp: boolean, both: boolean) => {
    if (!mail && !whatsapp && !both) return enqueueSnackbar('Please specify where you want to share the event - email, whatsapp or both!', { variant: 'error' });

    let url = `/api/events/${eventDetail.id}/pre-registration/invite`;

    if (shareDirty) {
      let emails = email.split(',').map((item) => item.trim());
      let phone_numbers = phoneNumber.split(',').map((item) => item.trim());

      const ShareViaEmail = async () => {
        setIsLoading(true);
        try {
          const response = await axios.post(`${url}`, {
            emails,
          });
          const { message } = response.data;
          setIsLoading(false);
          handleCloseDrawer();

          enqueueSnackbar(message, { variant: 'success' });
        } catch (error) {
          enqueueSnackbar(error.message, { variant: 'error' });
          setIsLoading(false);
        }
      };
      const ShareViaWhatsApp = async () => {
        setIsLoading(true);
        try {
          const response = await axios.post(`${url}`, {
            phone_numbers,
          });
          const { message } = response.data;
          enqueueSnackbar(message, { variant: 'success' });
          setIsLoading(false);
          handleCloseDrawer();
        } catch (error) {
          enqueueSnackbar(error.message, { variant: 'error' });
          setIsLoading(false);
        }
      };
      const ShareViaBoth = async () => {
        setIsLoading(true);
        try {
          const response = await axios.post(`${url}`, {
            emails,
            phone_numbers,
          });
          const { message } = response.data;
          enqueueSnackbar(message, { variant: 'success' });
          setIsLoading(false);
          handleCloseDrawer();
        } catch (error) {
          enqueueSnackbar(error.message, { variant: 'error' });
          setIsLoading(false);
        }
      };

      switch (true) {
        case mail:
          ShareViaEmail();
          break;
        case whatsapp:
          ShareViaWhatsApp();
          break;
        case both:
          ShareViaBoth();
          break;
        default:
          return;
      }
      setIsEmailChecked(false);
      setIsWhatsAppChecked(false);
      setIsBothChecked(false);
      setEmail('');
      setPhoneNumber('');

    } else {
      enqueueSnackbar('Please specify where you want to share the event - email, whatsapp or both!', { variant: 'error' });
    }
  };

  return (
    <Drawer open={props.openDrawer} anchor={'right'}>
      <Box role="presentation" sx={{ width: isDesktop ? '720px' : '100%' }}>
        <Button
          sx={{ color: '#fff', mx: 3 }}
          onClick={handleCloseDrawer}
          startIcon={<IconBackSVG />}
        >
          Back
        </Button>
        <Wrapper>
          <Typography py={2} align="center" variant="h2">
            Share QR Code
          </Typography>
          <TextWrapper>
            <Typography color="primary" variant="h6">
              Share via
            </Typography>
          </TextWrapper>

          <CheckBox>
            <FormControlLabel
              control={<Checkbox checked={isEmailChecked} onChange={handleEmailOnly} />}
              label="Email"
            />
            <FormControlLabel
              control={<Checkbox checked={isWhatsAppChecked} onChange={handleWhatsappOnly} />}
              label="Whatsapp"
            />
            <FormControlLabel
              control={<Checkbox checked={isBothChecked} onChange={handleEmailandWhatsapp} />}
              label="Both"
            />
          </CheckBox>
          <div>
            {(isEmailChecked || isBothChecked) && (
              <LoadingButton
                loading={false}
                variant="contained"
                startIcon={<PlayForWorkIcon />}
                component="label"
              >
                Emails Via Excel
                <input hidden
                  onChange={(e: any) => { onImportViaExcel(e); e.target.value = null }}
                  accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                  type="file"
                />
              </LoadingButton>
            )}

            <TextField
              sx={{ pb: 3 }}
              autoComplete="off"
              variant="standard"
              name="emails"
              value={email}
              fullWidth
              multiline
              onChange={(e) => setEmail(e.target.value)}
              disabled={isWhatsAppChecked}
              label="Enter email IDs you want to share with"
              placeholder="You can add multiple emails separated by commas."
              helperText={!!email.split(',').map((item) => item.trim())?.[0] ? `Total Emails:  ${email.split(',').map((item) => item.trim())?.length}` : ''}
            />

            <TextField
              autoComplete="off"
              variant="standard"
              name="emails"
              fullWidth
              onChange={(e) => setPhoneNumber(e.target.value)}
              disabled={isEmailChecked}
              label="Enter whatsapp numbers you want to share with"
              placeholder="You can add multiple numbers separated by commas."
            />
          </div>
        </Wrapper>
        <ButtonContainer>
          <LoadingButton
            onClick={() => handleShareQRCode(isEmailChecked, isWhatsAppChecked, isBothChecked)}
            loading={isLoading}
            size="medium"
            variant="contained"
            sx={{ my: 2 }}
          >
            Share
          </LoadingButton>
        </ButtonContainer>
      </Box>
    </Drawer>
  );
}
