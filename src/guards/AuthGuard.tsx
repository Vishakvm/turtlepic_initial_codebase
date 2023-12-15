import { useState, ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
// hooks
import useAuth from '../hooks/useAuth';
// pages
import LoginView from 'src/components/auth/login/LoginView';
// components
import LoadingScreen from '../components/LoadingScreen';

// ----------------------------------------------------------------------

type AuthGuardProps = {
  children: ReactNode;
};

export default function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, isInitialized, user } = useAuth();
  const { pathname } = useLocation();
  const [requestedLocation, setRequestedLocation] = useState<string | null>(null);

  if (!isInitialized) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    if (pathname !== requestedLocation) {
      setRequestedLocation(pathname);
    }

    return <LoginView />;
  }

  if (isAuthenticated && user?.account_type) {
    if (process.env.REACT_APP_SHOW_SUBDOMAIN === 'true') {
      user &&
        user.agency &&
        user.agency.domain &&
        !window.location.host.includes(user.agency.domain) &&
        window.location.replace(
          `https://${user.agency.domain}.${process.env.REACT_APP_MAIN_DOMAIN}`
        );
    }
  }

  if (requestedLocation && pathname !== requestedLocation) {
    setRequestedLocation(null);
    return <Navigate to={requestedLocation} />;
  }

  return <>{children}</>;
}
