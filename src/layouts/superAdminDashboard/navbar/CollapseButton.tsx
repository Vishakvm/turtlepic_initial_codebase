// @mui
import { Box } from '@mui/material';
// components
import { IconButtonAnimate } from '../../../components/animate';

// ----------------------------------------------------------------------

type Props = {
  onToggleCollapse: VoidFunction;
  collapseClick: boolean;
};

export default function CollapseButton({ onToggleCollapse, collapseClick }: Props) {
  return (
    <IconButtonAnimate onClick={onToggleCollapse}>
      <Box
        sx={{
          lineHeight: 0,
          transition: (theme) =>
            theme.transitions.create('transform', {
              duration: theme.transitions.duration.shorter,
            }),
          ...(collapseClick && {
            transform: 'rotate(180deg)',
          }),
        }}
      >
        {icon}
      </Box>
    </IconButtonAnimate>
  );
}

// ----------------------------------------------------------------------

const icon = (
  <svg width="16" height="16" viewBox="0 0 16 11" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M1.40836 10.3373H10.7813C11.2499 10.3373 11.6334 9.95387 11.6334 9.48522C11.6334 9.01658 11.2499 8.63314 10.7813 8.63314H1.40836C0.939712 8.63314 0.556274 9.01658 0.556274 9.48522C0.556274 9.95387 0.939712 10.3373 1.40836 10.3373ZM1.40836 6.07689H8.22502C8.69367 6.07689 9.07711 5.69345 9.07711 5.2248C9.07711 4.75616 8.69367 4.37272 8.22502 4.37272H1.40836C0.939712 4.37272 0.556274 4.75616 0.556274 5.2248C0.556274 5.69345 0.939712 6.07689 1.40836 6.07689ZM0.556274 0.964388C0.556274 1.43303 0.939712 1.81647 1.40836 1.81647H10.7813C11.2499 1.81647 11.6334 1.43303 11.6334 0.964388C11.6334 0.495742 11.2499 0.112305 10.7813 0.112305H1.40836C0.939712 0.112305 0.556274 0.495742 0.556274 0.964388ZM15.2973 7.67881L12.8433 5.2248L15.2973 2.7708C15.6296 2.43849 15.6296 1.90168 15.2973 1.56937C14.965 1.23705 14.4282 1.23705 14.0959 1.56937L11.0369 4.62835C10.7046 4.96066 10.7046 5.49747 11.0369 5.82978L14.0959 8.88876C14.4282 9.22108 14.965 9.22108 15.2973 8.88876C15.6211 8.55645 15.6296 8.01112 15.2973 7.67881Z"
      fill="#FFFFFF"
    />
  </svg>
);
