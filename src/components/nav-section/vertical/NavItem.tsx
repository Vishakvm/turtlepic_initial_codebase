import { NavLink as RouterLink } from 'react-router-dom';
// @mui
import { Link } from '@mui/material';
// type
import { NavItemProps } from '../type';
//
import { ListItemStyle, ListItemTextStyle, ListItemIconStyle } from './style';
import { isExternalLink } from '..';
import { styled } from '@mui/material/styles';

const Div = styled('div')(({ theme }) => ({
  width: '4px',
  height: '22px',
  background: theme.palette.primary.main,
  borderRadius: '8px',
}));

// ----------------------------------------------------------------------

export function NavItemRoot({ item, isCollapse, open = false, active, onOpen }: NavItemProps) {
  const { title, path, icon } = item;

  const renderContent = (
    <>
      {icon && <ListItemIconStyle>{icon}</ListItemIconStyle>}
      <ListItemTextStyle disableTypography primary={title} isCollapse={isCollapse} />
      {active && !isCollapse ? <Div /> : null}
    </>
  );

  return isExternalLink(path) ? (
    <ListItemStyle component={Link} href={path} target="_blank" rel="noopener">
      {renderContent}
    </ListItemStyle>
  ) : (
    <ListItemStyle component={RouterLink} to={path} activeRoot={active}>
      {renderContent}
    </ListItemStyle>
  );
}
