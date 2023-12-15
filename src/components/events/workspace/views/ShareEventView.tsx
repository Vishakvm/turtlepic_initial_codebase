import React, { useLayoutEffect, useRef, useState } from 'react';

// forms
import { useForm } from 'react-hook-form';
import { FormProvider } from 'src/components/hook-form';

// mui
import {
  Button, Grid, styled, Divider, Typography, Checkbox, FormGroup, FormControlLabel, Stack, Switch, InputAdornment,
  IconButton, OutlinedInput, InputLabel, Tooltip, Zoom, TextField, FormHelperText,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ShareIcon from '@mui/icons-material/Share';
import PlayForWorkIcon from '@mui/icons-material/PlayForWork';

import { useSelector } from 'src/redux/store';
import { useSnackbar } from 'notistack';

import OtpInput from 'react-otp-input';
import * as XLSX from 'xlsx';

import CreateEventFooterView from '../../elements/CreateEventFooter';
import IconBackDarkSVG from 'src/assets/shared/svg/icon_back_dark';
import axios from 'src/utils/axios';

type FormProps = {
  afterSubmit: string;
  share_link?: string;
  emails: string;
  phone_numbers: string;
};

interface TabNextProps {
  shareTabRedirect: (index: number) => void;
  nextIndex: number;
  prevIndex: number;
}
const Wrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(2, 0, 2, 0),
  color: '#7DD78D',
}));
const ShareWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(4, 4, 2, 4),
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(2),
  },
}));
const CheckBox = styled(FormGroup)(({ theme }) => ({
  padding: theme.spacing(0, 0, 2, 0),
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
}));
const BigBox = styled('div')(({ theme }) => ({
  padding: theme.spacing(2, 0, 1, 0),
  display: 'flex',
  alignItems: 'center',
}));
const RadioBtn = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 0, 1, 0),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
}));

const ShareEventView = ({ shareTabRedirect, nextIndex, prevIndex }: TabNextProps): React.ReactElement => {

  const [code, setCode] = useState<string>('');
  const [allowPasscode, setAllowPasscode] = useState<boolean>(false);
  const [notify, setNotify] = useState<boolean>(false);
  const [link, setLink] = useState<string>('');
  const [dirty, setDirty] = useState(false);
  const [shareDirty, setShareDirty] = useState(false);
  const [email, setEmail] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [shareHTML, setShareHTML] = useState<string>('');
  const [copyMessage, setCopyMessage] = useState('Copy');
  const [inviteMessage, setInviteMessage] = useState('');

  const [isEmailChecked, setIsEmailChecked] = useState(false);
  const [isWhatsAppChecked, setIsWhatsAppChecked] = useState(false);
  const [isBothChecked, setIsBothChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const isMounted = useRef(false);

  const eventDetail = useSelector((state: any) => state.createEvent.value);

  const defaultValues = {
    share_link: '',
    emails: '',
    phone_numbers: '',
  };
  const methods = useForm<FormProps>({
    defaultValues,
  });
  const { handleSubmit, setValue } = methods;

  const onSubmit = async () => {
    const handlePasscode = async () => {
      if (dirty && code) {
        const passcode = code;
        try {
          const response = await axios.patch(`/api/events/${eventDetail.id}/share-setting`, {
            inviteMessage,
            passcode,
          });
          const { message } = response.data;
          enqueueSnackbar(message, { variant: 'success' });
          setDirty(false);
        } catch (error) {
          console.error(error);
          enqueueSnackbar(error.message, { variant: 'error' });
        }
      } else {
        enqueueSnackbar('No Changes To Save', { variant: 'error' });
      }
    };
    const handleNoPasscode = async () => {
      if (dirty) {
        const passcode = code;
        try {
          const response = await axios.patch(`/api/events/${eventDetail.id}/share-setting`, {
            inviteMessage,
            passcode,
          });
          const { message } = response.data;
          enqueueSnackbar(message, { variant: 'success' });
          setDirty(false);
        } catch (error) {
          console.error(error);
          enqueueSnackbar(error.message, { variant: 'error' });
        }
      } else {
        enqueueSnackbar('No Changes To Save', { variant: 'error' });
      }
    };
    switch (allowPasscode) {
      case true:
        handlePasscode();
        break;
      case false:
        handleNoPasscode();
        break;
      default:
        break;
    }
  };

  const handleAllowPasscode = (e: any) => {
    setDirty(true);
    setAllowPasscode(!allowPasscode);
    if (e.target.checked === false) {
      setCode('');
      setDirty(true);
    } else {
      setDirty(true);
    }
  };
  const handleMessage = (e: any) => {
    setDirty(true);
    setInviteMessage(e.target.value);
  };

  const handleNotifyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setNotify(true);
      setShareDirty(true);
    } else {
      setNotify(false);
    }
  };

  const handleBack = () => {
    shareTabRedirect(prevIndex);
  };

  const handlePasscodeChange = (code: string) => {
    setCode(code);
    setDirty(true);
  };
  const handleLinkCopy = () => {
    navigator.clipboard.writeText(link);
    setCopyMessage('Copied');
  };
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

  const handleShareEvent = async (mail: boolean, whatsapp: boolean, both: boolean) => {
    if (shareDirty) {
      setLoading(true);
      let emails = email.split(',').map((item) => item.trim());
      let phone_numbers = phoneNumber.split(',').map((item) => item.trim());
      const notify_guests = notify;

      const ShareViaEmail = async () => {
        try {
          const response = await axios.post(`/api/events/${eventDetail.id}/share`, {
            emails,
            notify_guests,
          });
          const { message } = response.data;
          enqueueSnackbar(message, { variant: 'success' });
          setEmail('');
          setIsEmailChecked(false);
          setShareDirty(false);
          setNotify(false);
          setLoading(false);
        } catch (error) {
          setLoading(false);
          setShareDirty(false);
          console.error(error);
          enqueueSnackbar(error.message, { variant: 'error' });
        }
      };
      const ShareViaWhatsApp = async () => {
        try {
          const response = await axios.post(`/api/events/${eventDetail.id}/share`, {
            phone_numbers,
            notify_guests,
          });
          const { message } = response.data;
          enqueueSnackbar(message, { variant: 'success' });
          setPhoneNumber('');
          setIsWhatsAppChecked(false);
          setNotify(false);
          setLoading(false);
          setShareDirty(false);
        } catch (error) {
          setLoading(false);
          console.error(error);
          setShareDirty(false);
          enqueueSnackbar(error.message, { variant: 'error' });
        }
      };
      const ShareViaBoth = async () => {
        try {
          const response = await axios.post(`/api/events/${eventDetail.id}/share`, {
            emails,
            phone_numbers,
            notify_guests,
          });
          const { message } = response.data;
          enqueueSnackbar(message, { variant: 'success' });
          setPhoneNumber('');
          setEmail('');
          setNotify(false);
          setIsBothChecked(false);
          setLoading(false);
          setShareDirty(false);
        } catch (error) {
          setLoading(false);
          setShareDirty(false);
          console.error(error);
          enqueueSnackbar(error.message, { variant: 'error' });
        }
      };

      const Error = () => {
        enqueueSnackbar('Invalid Inputs', { variant: 'error' });
        setLoading(false);
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
          Error();
      }
    } else {
      enqueueSnackbar('No Changes', { variant: 'success' });
      setLoading(false);
    }
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

  useLayoutEffect(() => {
    const getShareSettings = async () => {
      try {
        const response = await axios.get(`/api/events/${eventDetail.id}/share-setting`);
        const { data } = response.data;
        if (!isMounted.current) {
          data.passcode && setAllowPasscode(true);
          data.passcode && setCode(data.passcode);
          setLink(data.share_link);
          data.invite_message ? setInviteMessage(data.invite_message) : setInviteMessage('');
          setShareHTML(data.share_html);
        }
      } catch (error) {
        console.error(error);
      }
    };
    getShareSettings();

    return () => {
      isMounted.current = true;
    };
  }, [eventDetail.id, setValue]);

  return (
    <>
      <ShareWrapper>
        <Grid container spacing={4}>
          <Grid item sm={12} md={6}>
            <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
              <InputLabel>Link to the event</InputLabel>
              <OutlinedInput
                readOnly
                fullWidth
                value={link}
                name="share_link"
                placeholder="qduwgciu568bbciee899"
                endAdornment={
                  <InputAdornment position="end" onClick={handleLinkCopy}>
                    <Tooltip
                      title={copyMessage}
                      onMouseLeave={() => setCopyMessage('Copy')}
                      placement="top"
                      TransitionComponent={Zoom}
                      TransitionProps={{ timeout: 600 }}
                    >
                      <IconButton aria-label="copy link" edge="end">
                        <ContentCopyIcon fontSize="small" color="secondary" />
                      </IconButton>
                    </Tooltip>
                  </InputAdornment>
                }
              />
              <FormHelperText sx={{ mb: 3 }}>
                <Typography variant="caption" color="info.main">
                  NOTE : For testing, please open the link in incognito mode or use a different
                  browser.
                </Typography>
              </FormHelperText>
              <TextField
                fullWidth
                multiline
                autoFocus
                label="Add Custom Message"
                variant="standard"
                onChange={handleMessage}
                value={inviteMessage}
              />
              <RadioBtn>
                <Typography variant="h6">Set passcode for the event</Typography>

                <Stack direction="row" alignItems="center">
                  <Typography variant="h6">No</Typography>
                  <Switch
                    name="set_passcode"
                    checked={allowPasscode}
                    onChange={handleAllowPasscode}
                  />
                  <Typography variant="h6">Yes</Typography>
                </Stack>
              </RadioBtn>
              {allowPasscode && (
                <OtpInput
                  value={code}
                  isInputNum={true}
                  onChange={handlePasscodeChange}
                  inputStyle={{
                    width: '2.5rem',
                    height: '2.5rem',
                    fontSize: '1rem',
                    borderRadius: 6,
                    border: '1px solid #6D6D6D',
                    background: 'none',
                    marginRight: '0.5rem',
                    color: '#fff',
                  }}
                  focusStyle={{
                    outline: '1px solid #7DD78D',
                    caretColor: '#7dd78d',
                  }}
                  numInputs={4}
                />
              )}

              <Button sx={{ my: 2 }} type="submit" variant="contained" size="small">
                Save
              </Button>

              <Divider />
              <Wrapper>
                <Typography variant="h6">Share via</Typography>
              </Wrapper>

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
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setShareDirty(true);
                  }}
                  disabled={isWhatsAppChecked}
                  label="Enter email IDs you want to share with"
                  placeholder="You can add multiple emails separated by commas."
                  helperText={!!email.split(',').map((item) => item.trim())?.[0] ? `Total Emails:  ${email.split(',').map((item) => item.trim())?.length}` : ''}
                />
                <TextField
                  autoComplete="off"
                  variant="standard"
                  name="phone_numbers"
                  value={phoneNumber}
                  fullWidth
                  onChange={(e) => {
                    setPhoneNumber(e.target.value);
                    setShareDirty(true);
                  }}
                  disabled={isEmailChecked}
                  label="Enter whatsapp numbers you want to share with"
                  placeholder="You can add multiple numbers separated by commas."
                />
              </div>
              <BigBox>
                <FormGroup>
                  <FormControlLabel
                    control={<Checkbox onChange={handleNotifyChange} checked={notify} />}
                    label="Notify pre-registered guests"
                  />
                </FormGroup>
                <Typography
                  onClick={() => shareTabRedirect(nextIndex)}
                  variant="body1"
                  fontStyle="italic"
                  color="secondary"
                  sx={{ cursor: 'pointer' }}
                >
                  View List
                </Typography>
              </BigBox>
            </FormProvider>
            <LoadingButton
              loading={loading}
              sx={{ my: 2 }}
              onClick={() => handleShareEvent(isEmailChecked, isWhatsAppChecked, isBothChecked)}
              disabled={eventDetail === null}
              variant="contained"
              startIcon={<ShareIcon />}
            >
              Share event
            </LoadingButton>
          </Grid>
          <Grid item sm={12} md={6} sx={{ minHeight: '350px', width: '100%' }}>
            <iframe title="Share Html" srcDoc={shareHTML} width="100%" height="97%" />
          </Grid>
        </Grid>
      </ShareWrapper>

      <CreateEventFooterView
        footerAction={
          <Button onClick={handleBack} size="small" color="inherit" startIcon={<IconBackDarkSVG />}>
            Back
          </Button>
        }
      />
    </>
  );
};

export default ShareEventView;
