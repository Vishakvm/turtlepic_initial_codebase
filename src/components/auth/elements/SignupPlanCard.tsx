/*
 * Sign Up Plan Card Page
 *
 */
import React from 'react';

import { styled, Button, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { StrikeThroughText } from 'src/components/setting/Plan';
import IconNextSVG from 'src/assets/shared/svg/IconNextSVG';

type PropsType = {
  amount: number;
  type: string;
  discountedAmount: number;
  period: string;
  trialDays: string;
  trial_period: number | null;
  original_price?: number;
  onTryClick?: () => void;
  onBuyClick?: () => void;
};

const PlanCard = styled('div')(({ theme }) => ({
  border: `0.5px solid ${theme.palette.primary.main}`,
  borderRadius: 4,
  padding: theme.spacing(3, 2),
  height: '250px',
  margin: theme.spacing(0, 2, 2, 0),
  [theme.breakpoints.down('md')]: {
    margin: theme.spacing(0, 0, 2, 0),
    padding: theme.spacing(4, 2),
  },
  [theme.breakpoints.between('sm', 'lg')]: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    height: '150px',
  },
}));

const ButtonWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  [theme.breakpoints.between('sm', 'lg')]: {
    flexDirection: 'column',
  },
}));

const AmountWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-end',
  marginBottom: theme.spacing(3),
}));

const SubTitleWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  [theme.breakpoints.down('sm')]: {
    display: 'block',
  },
}));

export default function SignupPlanCard(props: PropsType): React.ReactElement {
  return (
    <PlanCard>
      <SubTitleWrapper>
        <div style={{ width: '100%' }}>
          <Typography variant="h1" mb={3}>
            {props.type}
          </Typography>
          <AmountWrapper>
            <Typography variant="h2" color="primary">
              &#8377;{props.amount}
            </Typography>
            <Typography variant="h5" color="primary">
              /{props.period}
            </Typography>
            {props.original_price && (
              <StrikeThroughText variant="h5" color="error" pl={2}>
                &#8377;
                {props.original_price}/month
              </StrikeThroughText>
            )}
          </AmountWrapper>
        </div>
      </SubTitleWrapper>
      <ButtonWrapper>
        {props.trial_period !== null ? (
          <Button onClick={props.onTryClick} size="small" color="primary" variant="outlined">
            Try it for {props.trialDays}
          </Button>
        ) : (
          <div />
        )}
        <LoadingButton
          onClick={props.onBuyClick}
          size="small"
          type="submit"
          variant="contained"
          color="primary"
          endIcon={<IconNextSVG />}
        >
          Buy Now
        </LoadingButton>
      </ButtonWrapper>
    </PlanCard>
  );
}
