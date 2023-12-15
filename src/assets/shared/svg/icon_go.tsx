type IconProps = {
  color: string;
};

export default function IconGoSVG(props: IconProps): React.ReactElement {
  return (
    <svg width="26" height="26" viewBox="0 0 39 34" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M11.1487 10.1338L19.0619 16.9428L11.1487 23.7518"
        stroke={props.color}
        strokeWidth="3.53333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        opacity="0.5"
        d="M20.6445 10.1338L28.5577 16.9428L20.6445 23.7518"
        stroke={props.color}
        strokeWidth="3.53333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
