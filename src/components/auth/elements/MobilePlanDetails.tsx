/*
 * Sign Up Mobile Details Element
 *
 */
import React from 'react';

import { styled, Typography } from '@mui/material';

import Ellipse from 'src/assets/shared/images/Ellipse.png';

type PropsType = {
  label: string;
  value: React.ReactElement;
};

const TableListWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  width: '100%',
  justifyContent: 'space-between',
  padding: theme.spacing(1.5),
}));
const TableListItem = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
}));

export default function MobilePlanDetailsView(props: PropsType): React.ReactElement {
  return (
    <TableListWrapper>
      <TableListItem>
        <img src={String(Ellipse)} alt="selfie" width="10px" height="11px" />
        <Typography ml={1} variant="h5">
          {props.label}
        </Typography>
      </TableListItem>

      {props.value}
    </TableListWrapper>
  );
}
