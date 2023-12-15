interface colorProps {
  color?: boolean;
}

const IconHateSVG = ({ color }: colorProps): React.ReactElement => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="57.241"
    height="36.123"
    viewBox="0 0 57.241 36.123"
  >
    <g
      id="Group_10"
      data-name="Group 10"
      transform="translate(-3225.027 -420.761)"
      opacity={color ? '1' : '0.5'}
    >
      <path
        id="Union_5"
        data-name="Union 5"
        d="M14.02,36.123a3,3,0,0,1-3-3V8.656L0,0H54.24a3,3,0,0,1,3,3V33.124a3,3,0,0,1-3,3Z"
        transform="translate(3225.027 420.761)"
        fill={color ? 'rgb(125, 215, 141)' : "#b8b7b4"}
      />
      <g id="Group_1" data-name="Group 1" transform="translate(3248.633 432.28)">
        <circle
          id="Ellipse_2"
          data-name="Ellipse 2"
          cx="2.37"
          cy="2.37"
          r="2.37"
          transform="translate(0 0)"
          fill="#0a0a0a"
        />
        <circle
          id="Ellipse_3"
          data-name="Ellipse 3"
          cx="2.37"
          cy="2.37"
          r="2.37"
          transform="translate(16.593 0)"
          fill="#0a0a0a"
        />
      </g>
      <ellipse
        id="Ellipse_4"
        data-name="Ellipse 4"
        cx="9.5"
        cy="4.5"
        rx="9.5"
        ry="4.5"
        transform="translate(3251 440)"
        fill="#0a0a0a"
      />
      <g id="Group_8" data-name="Group 8" transform="translate(-0.147)">
        <line
          id="Line_1"
          data-name="Line 1"
          x2="7"
          y2="7"
          transform="translate(3249.147 426.651)"
          fill="none"
          stroke="#0a0a0a"
          stroke-width="2"
        />
        <line
          id="Line_2"
          data-name="Line 2"
          x1="7"
          y2="7"
          transform="translate(3262.748 426.651)"
          fill="none"
          stroke="#0a0a0a"
          stroke-width="2"
        />
      </g>
    </g>
  </svg>
  
);
export default IconHateSVG;
