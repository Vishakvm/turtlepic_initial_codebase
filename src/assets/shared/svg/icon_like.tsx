interface colorProps {
  color?: boolean;
}

const IconLikeSVG = ({ color }: colorProps): React.ReactElement => (

  <svg xmlns="http://www.w3.org/2000/svg" width="57.241" height="36.123" viewBox="0 0 57.241 36.123">
  <g id="Group_12" data-name="Group 12" transform="translate(-3370.746 -590.761)" opacity={color ? '1' : '0.5'}>
    <path id="Union_2" data-name="Union 2" d="M14.02,36.123a3,3,0,0,1-3-3V8.656L0,0H54.24a3,3,0,0,1,3,3V33.124a3,3,0,0,1-3,3Z" transform="translate(3370.746 590.761)" fill={color ? 'rgb(125, 215, 141)' : '#b8b7b4'}/>
    <g id="Group_3" data-name="Group 3" transform="translate(3394.799 601.28)">
      <path id="Subtraction_1" data-name="Subtraction 1" d="M5.926,4.741C2.658,4.741,0,2.614,0,0H11.852C11.852,2.614,9.194,4.741,5.926,4.741Z" transform="translate(4.741 11.853)" fill="#0a0a0a"/>
      <g id="Group_1" data-name="Group 1" transform="translate(0 0)">
        <circle id="Ellipse_2" data-name="Ellipse 2" cx="2.37" cy="2.37" r="2.37" transform="translate(0 0)" fill="#0a0a0a"/>
        <circle id="Ellipse_3" data-name="Ellipse 3" cx="2.37" cy="2.37" r="2.37" transform="translate(16.593 0)" fill="#0a0a0a"/>
      </g>
    </g>
  </g>
</svg>
);
export default IconLikeSVG;
