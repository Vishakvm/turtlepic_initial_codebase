import { Link as RouterLink } from 'react-router-dom';
import { Box, BoxProps } from '@mui/material';

// ----------------------------------------------------------------------

interface Props extends BoxProps {
  disabledLink?: boolean;
}

export default function Logo2({ disabledLink = false, sx }: Props) {
  const logo = (
    <Box sx={{ width: 30, height: 30, ...sx }}>
      <svg
        width="30"
        height="30"
        viewBox="0 0 438 260"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M381.798 248.27C366.93 248.27 353.255 240.32 346.107 227.527C340.523 217.522 336.586 206.703 334.419 195.537C333.791 192.326 333.319 189.084 332.984 185.83H321.911C322.327 190.419 323.01 194.978 323.96 199.487C325.618 207.355 328.084 215.056 331.313 222.453C308.092 232.837 283.573 236.296 261.197 236.296C222.108 236.296 189.522 225.732 181.694 222.987V222.975C176.07 213.243 171.569 202.803 168.331 191.953C167.754 190.059 167.236 188.14 166.746 186.215H155.371C160.743 208.939 171.206 230.328 185.696 248.27H139.949C135.086 248.27 130.555 246.196 127.517 242.575L127.428 242.451C118.906 231.669 113.983 219.286 112.79 205.641L112.509 202.443L109.582 201.108C57.6313 177.427 33.6104 146.89 22.6129 125.452C22.4427 125.11 22.2719 124.768 22.1017 124.439C24.648 125.396 27.2248 126.153 29.8009 126.743L32.9893 127.395C34.0519 127.557 35.1245 127.687 36.1871 127.824L37.7813 128.023C38.3123 128.097 38.844 128.103 39.375 128.147L42.5529 128.327C44.6688 128.408 46.784 128.308 48.8689 128.308L55.1148 127.824L48.9596 126.93C46.9443 126.482 44.919 126.122 42.9441 125.601L40.0072 124.756C39.5252 124.607 39.034 124.489 38.5533 124.315L37.1292 123.793C36.1772 123.446 35.2344 123.11 34.3022 122.75L31.5758 121.52C28.0067 119.806 24.6481 117.782 21.7409 115.353C20.3069 114.142 18.9338 112.875 17.7706 111.503C17.1595 110.845 16.6483 110.118 16.1465 109.441C15.9466 109.137 15.7255 108.845 15.5553 108.559C12.3569 98.7092 11.4148 91.0331 11.144 87.1143C19.425 82.3571 46.2531 68.6567 73.6518 72.9482C84.3183 74.6126 92.5192 80.6181 98.0329 90.8033C106.234 105.932 105.692 124.917 102.144 132.805C98.575 140.767 102.094 151.405 111.818 162L117.613 168.316L120.249 162.093L120.961 160.429C126.164 148.157 133.683 135.966 142.725 125.166C149.754 116.769 157.473 109.391 165.684 103.224C189.336 85.4498 218.699 75.656 248.372 75.656C308.397 75.656 361.751 115.335 379.705 171.645C380.966 175.607 382.059 179.644 382.96 183.768C388.152 207.424 398.802 229.663 413.832 248.27H381.798ZM264.308 49.2428V65.4894C259.036 64.918 253.713 64.6261 248.372 64.6261C242.926 64.6261 237.498 64.9242 232.101 65.5391C232.101 65.5391 232.101 65.5391 232.095 65.5391V49.2428H264.308ZM204.539 38.2068C203.39 38.2068 202.446 37.2752 202.446 36.12V13.1165C202.446 11.9613 203.39 11.0297 204.539 11.0297H289.107C290.256 11.0297 291.2 11.9613 291.2 13.1165V36.12C291.2 37.2752 290.256 38.2068 289.107 38.2068H204.539ZM424.228 243.544C409.317 225.831 398.771 204.337 393.729 181.402C386.58 148.797 368.297 119.16 342.25 97.9702C322.861 82.1894 299.752 71.6129 275.338 67.1103V49.2366H289.107C296.342 49.2366 302.23 43.349 302.23 36.12V13.1165C302.23 5.88748 296.342 -6.10352e-05 289.107 -6.10352e-05H204.539C197.304 -6.10352e-05 191.416 5.88748 191.416 13.1165V36.12C191.416 43.349 197.304 49.2366 204.539 49.2366H221.071V67.1848C198.676 71.3831 177.292 80.6989 159.057 94.3992C150.175 101.075 141.834 109.05 134.274 118.092C126.605 127.246 119.938 137.357 114.705 147.722C111.738 142.841 111.347 139.233 112.209 137.326C117.462 125.632 117.232 103.063 107.737 85.5492C100.6 72.3768 89.4015 64.2411 75.3559 62.0488C38.4229 56.2668 3.94542 78.5128 2.50211 79.4505L0.0961848 81.028L0.00612072 83.891C-0.0143738 84.717 -0.465249 104.243 12.4476 129.793C23.9866 152.61 48.8894 184.83 102.144 209.821C103.988 224.366 109.573 237.631 118.775 249.301C118.865 249.413 118.956 249.531 119.067 249.661C124.199 255.785 131.808 259.293 139.949 259.293H209.364L196.093 243.544C194.447 241.6 192.863 239.606 191.335 237.569C200.831 240.24 214.196 243.376 229.946 245.388C239.026 246.556 249.465 247.388 260.725 247.388C283.94 247.388 310.657 243.836 336.182 232.359C336.282 232.539 336.381 232.719 336.487 232.899C345.579 249.183 362.943 259.293 381.798 259.293H437.5L424.228 243.544Z"
          fill="url(#paint0_linear_2886_163550)"
        />
        <path
          d="M58.8184 93.9715C54.6474 93.9715 51.2695 97.35 51.2695 101.517C51.2695 105.691 54.6474 109.069 58.8184 109.069C62.9887 109.069 66.3678 105.691 66.3678 101.517C66.3678 97.35 62.9887 93.9715 58.8184 93.9715Z"
          fill="url(#paint1_linear_2886_163550)"
        />
        <path
          d="M251.573 196.209C228.165 196.209 209.118 177.161 209.118 153.754C209.118 130.34 228.165 111.293 251.573 111.293C274.992 111.293 294.04 130.34 294.04 153.754C294.04 177.161 274.992 196.209 251.573 196.209ZM251.573 100.269C222.091 100.269 198.088 124.254 198.088 153.754C198.088 183.247 222.091 207.239 251.573 207.239C281.066 207.239 305.07 183.247 305.07 153.754C305.07 124.254 281.066 100.269 251.573 100.269Z"
          fill="url(#paint2_linear_2886_163550)"
        />
        <path
          d="M251.59 122.31V133.333C262.849 133.333 272.004 142.494 272.004 153.753H283.033C283.033 136.414 268.929 122.31 251.59 122.31Z"
          fill="url(#paint3_linear_2886_163550)"
        />
        <defs>
          <linearGradient
            id="paint0_linear_2886_163550"
            x1="212.886"
            y1="-20.5754"
            x2="222.092"
            y2="281.911"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#7FD079" />
            <stop offset="1" stopColor="#52AFE6" />
          </linearGradient>
          <linearGradient
            id="paint1_linear_2886_163550"
            x1="55.2486"
            y1="-15.7741"
            x2="64.4547"
            y2="286.713"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#7FD079" />
            <stop offset="1" stopColor="#52AFE6" />
          </linearGradient>
          <linearGradient
            id="paint2_linear_2886_163550"
            x1="246.244"
            y1="-21.5865"
            x2="255.45"
            y2="280.9"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#7FD079" />
            <stop offset="1" stopColor="#52AFE6" />
          </linearGradient>
          <linearGradient
            id="paint3_linear_2886_163550"
            x1="262.278"
            y1="-22.0778"
            x2="271.484"
            y2="280.409"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#7FD079" />
            <stop offset="1" stopColor="#52AFE6" />
          </linearGradient>
        </defs>
      </svg>
    </Box>
  );

  if (disabledLink) {
    return <>{logo}</>;
  }

  return <RouterLink to="/">{logo}</RouterLink>;
}
