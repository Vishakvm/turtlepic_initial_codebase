/*
 * Privacy Switch Element
 *
 */
import React from 'react';

import { Switch, Typography, styled, Stack, Grid } from '@mui/material';

type SwitchProps = {
  checked: boolean;
  offLabel: string;
  onLabel: string;
  label: string;
  name: string;
  lock?: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const FlexWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  paddingTop: theme.spacing(2),
}));

export default function PrivacyDayElement(props: SwitchProps): React.ReactElement {
  return (
    <Grid container spacing={2}>
      <Grid item md={9} sm={8} xs={7}>
        <FlexWrapper>
          <Typography pr={1} variant="h6" color="primary">
            {props.label}
          </Typography>
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
