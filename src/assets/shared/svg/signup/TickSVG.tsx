import { styled } from '@mui/material/styles';
import React from 'react';

const Svg = styled('svg')(({ theme }) => ({
  // boxShadow: `0px 6.15px 26.65px rgba(0, 0, 0, 0.4)`,
  borderRadius: '50%',
  background: theme.palette.common.white
}));

interface colorProps {
  size?: string;
}

const TickSVG = ({ size }: colorProps): React.ReactElement => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    role="img"
    width={size}
    height={size}
    preserveAspectRatio="xMidYMid meet"
    viewBox="0 0 15 15"
  >
    <path
      fill="#ffffff"
      fillRule="evenodd"
      d="M0 7.5a7.5 7.5 0 1 1 15 0a7.5 7.5 0 0 1-15 0Zm7.072 3.21l4.318-5.398l-.78-.624l-3.682 4.601L4.32 7.116l-.64.768l3.392 2.827Z"
      clipRule="evenodd"
      stroke="#7dd78d"
    />
  </Svg>
);

export default TickSVG;
