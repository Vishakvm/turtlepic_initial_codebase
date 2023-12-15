import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import useAuth from 'src/hooks/useAuth';

type RoleGuardProps = {
  children: ReactNode;
};

export default function PlanGuard({ children }: RoleGuardProps) {
  const { isAuthenticated, user } = useAuth();

  const { pathname } = useLocation();

  if (
    isAuthenticated &&
    user?.user_plan &&
    user?.user_plan.expired &&
    !pathname.includes('/main/settings')
  ) {
    return <Navigate to={'/main/settings?to=plan'} />;
  } else if (!isAuthenticated && user?.user_plan.expired && !pathname.includes('/main/settings')) {
    return <Navigate to={'/main/settings?to=plan'} />;
  }

  return <>{children}</>;
}
