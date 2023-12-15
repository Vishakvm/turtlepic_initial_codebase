import React from 'react';

export default function WelcomeSVG(): React.ReactElement {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 724 1024"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      <g filter="url(#filter0_d_1321_97643)">
        <rect width="720" height="1024" fill="url(#pattern0)" shapeRendering="crispEdges" />
      </g>
      <defs>
        <filter
          id="filter0_d_1321_97643"
          x="-4"
          y="0"
          width="728"
          height="1032"
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
          <feOffset dy="4" />
          <feGaussianBlur stdDeviation="2" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1321_97643" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_1321_97643"
            result="shape"
          />
        </filter>
        <pattern id="pattern0" patternContentUnits="objectBoundingBox" width="1" height="1">
          <use
            xlinkHref="#image0_1321_97643"
            transform="translate(-0.576634) scale(0.000490435 0.0003663)"
          />
        </pattern>
        <image
          id="image0_1321_97643"
          width="4096"
          height="2730"
        />
      </defs>
    </svg>
  );
}