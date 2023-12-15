import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { PATH_MAIN } from '../routes/paths';
import { SUPERADMIN } from 'src/utils/constants';
import useAuth from 'src/hooks/useAuth';

type RoleGuardProps = {
  children: ReactNode;
  role: string[];
};

export default function RoleGuard({ role, children }: RoleGuardProps) {
  const { user, isAuthenticated } = useAuth();

  if (!role.includes(SUPERADMIN) && user?.account_type !== SUPERADMIN && isAuthenticated) {
    return <Navigate to={PATH_MAIN.root} />;
  }
  return <>{children}</>;
}
