import { useState } from 'react';
import { useLocation } from 'react-router-dom';
// type
import { NavListProps } from '../type';

import { NavItemRoot } from './NavItem';
import { getActive } from '..';

// ----------------------------------------------------------------------

type NavListRootProps = {
  list: NavListProps;
  isCollapse: boolean;
};

export function NavListRoot({ list, isCollapse }: NavListRootProps) {
  const { pathname } = useLocation();

  const active = getActive(list.path, pathname);

  const [open, setOpen] = useState(active);

  const hasChildren = list.children;

  if (hasChildren) {
    return (
      <>
        <NavItemRoot
          item={list}
          isCollapse={isCollapse}
          active={active}
          open={open}
          onOpen={() => setOpen(!open)}
        />
      </>
    );
  }

  return <NavItemRoot item={list} active={active} isCollapse={isCollapse} />;
}
