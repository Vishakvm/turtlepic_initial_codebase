/*
 * Privacy Switch Element
 *
 */
import React from 'react';

import { Switch, Typography, styled, Stack, Grid, Tooltip, Zoom } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';

type SwitchProps = {
  checked: boolean;
  offLabel: string;
  onLabel: string;
  label: string;
  name: string;
  info: string;
  lock?: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export const FlexWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  paddingTop: theme.spacing(2),
}));
const Info = styled(InfoIcon)(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    display: 'none',
  },
}));

export default function PrivacySwitchElement(props: SwitchProps): React.ReactElement {
  return (
    <Grid container spacing={2}>
      <Grid item md={9} sm={8} xs={7}>
        <FlexWrapper>
          <Typography pr={1} variant="h6">
            {props.label}
          </Typography>
          <Tooltip
            title={props.info}
            arrow
            placement="top"
            TransitionComponent={Zoom}
            TransitionProps={{ timeout: 400 }}
            componentsProps={{
              tooltip: {
                sx: {
                  bgcolor: 'common.black',
                  borderRadius: '4px',
                  p: 1.5,
                  fontSize: '13px',
                  fontStyle: 'italic',
                  lineHeight: '15.73px',
                  fontWeight: 200,
                  width: 200,
                  '& .MuiTooltip-arrow': {
                    color: 'common.black',
                  },
                },
              },
            }}
          >
            <Info fontSize="small" sx={{ cursor: 'pointer' }} />
          </Tooltip>
        </FlexWrapper>
      </Grid>
      <Grid item md={3} sm={4} xs={5}>
        <Stack direction="row" py={1} alignItems="center">
          <Typography variant="h6">{props.offLabel}</Typography>
          <Switch
            name={props.name}
            checked={props.checked}
            onChange={props.onChange}
            disabled={props.lock}
          />
          <Typography pr={1} variant="h6">
            {props.onLabel}
          </Typography>
        </Stack>
      </Grid>
    </Grid>
  );
}
