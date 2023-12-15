interface colorProps {
  accent_color?: string;
}

const IconBackSVG = ({ accent_color }: colorProps): React.ReactElement => (
  <svg width="23" height="17" viewBox="0 0 23 17" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M16.0834 11.9941L11.5 8.54247L16.0834 5.09081"
      stroke={accent_color ? accent_color : '#7dd78d'}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      opacity="0.5"
      d="M10.5834 11.9941L6.00004 8.54247L10.5834 5.09081"
      stroke={accent_color ? accent_color : '#7dd78d'}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
export default IconBackSVG;
