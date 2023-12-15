import { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
// hooks
import useAuth from '../hooks/useAuth';
// components
import PRLoginView from 'src/components/auth/preregisteration/PRLoginView';
import PROnboardingView from '../components/auth/preregisteration/PROnboardingView';

// ----------------------------------------------------------------------

type RoleGuardProps = {
  children: ReactNode;
  role?: string;
};

export default function RoleGuard({ role, children }: RoleGuardProps) {
  const { user, isAuthenticated } = useAuth();
  const { pathname } = useLocation();

  if (
    isAuthenticated &&
    user?.account_type === role &&
    pathname.includes('/main/') &&
    pathname.includes('/admin/')
  ) {
    return <PROnboardingView />;
  } else if (
    !isAuthenticated &&
    user?.account_type === role &&
    pathname.includes('/main/') &&
    pathname.includes('/admin/')
  ) {
    return <PRLoginView />;
  }

  return <>{children}</>;
}
