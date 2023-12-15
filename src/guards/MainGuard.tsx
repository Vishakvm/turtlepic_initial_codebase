import { ReactNode } from 'react';
import useAuth from 'src/hooks/useAuth';

import { Navigate } from 'react-router-dom';
import { PATH_MAIN_ADMIN } from '../routes/paths';

type MainGuardProps = {
  children: ReactNode;
  role: string;
};

export default function MainGuard({ role, children }: MainGuardProps) {
  const { user, isAuthenticated } = useAuth();

  if (isAuthenticated && user?.account_type === role) {
    return <Navigate to={PATH_MAIN_ADMIN.dashboard} />;
  }
  return <>{children}</>;
}
