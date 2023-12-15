interface colorProps {
  accent_color?: string;
}

const IconTickBlueSVG = ({ accent_color }: colorProps): React.ReactElement => (
  <svg width="70" height="70" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g filter="url(#filter0_d_1587_101811)">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M28 39.3478C36.2843 39.3478 43 32.7781 43 24.6739C43 16.5697 36.2843 10 28 10C19.7157 10 13 16.5697 13 24.6739C13 32.7781 19.7157 39.3478 28 39.3478Z"
        fill={accent_color ? accent_color : '#7dd78d'}
        fillOpacity="1"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M28 39.3478C36.2843 39.3478 43 32.7781 43 24.6739C43 16.5697 36.2843 10 28 10C19.7157 10 13 16.5697 13 24.6739C13 32.7781 19.7157 39.3478 28 39.3478Z"
        stroke="#6D6D6D"
      />
    </g>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M25.0779 30.7004L20.5 26.222L21.8636 24.888L25.0779 28.0324L34.1364 19.1709L35.5 20.5049L25.0779 30.7004Z"
      fill="white"
    />
    <defs>
      <filter
        id="filter0_d_1587_101811"
        x="0"
        y="0"
        width="56"
        height="55.3477"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy="3" />
        <feGaussianBlur stdDeviation="6.5" />
        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.0792996 0" />
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1587_101811" />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_dropShadow_1587_101811"
          result="shape"
        />
      </filter>
    </defs>
  </svg>
);
export default IconTickBlueSVG;
