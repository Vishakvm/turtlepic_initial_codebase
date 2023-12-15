import { ReactNode, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

// hooks
import useAuth from '../hooks/useAuth';

import LoadingScreen from '../components/LoadingScreen';

// ----------------------------------------------------------------------

type PRGuardProps = {
  children: ReactNode;
};

export default function PRGuard({ children }: PRGuardProps) {
  const { isAuthenticated, isInitialized } = useAuth();
  const { pathname } = useLocation();
  const slug = pathname.split('/')[2];

  const [requestedLocation, setRequestedLocation] = useState<string | null>(null);

  if (!isInitialized) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    if (pathname !== requestedLocation) {
      setRequestedLocation(pathname);
    }

    return <Navigate to={`/pre-registration/${slug}/signup`} />;
    // By Default Redirecting to Signup On Preview Event 
  }

  if (requestedLocation && pathname !== requestedLocation) {
    setRequestedLocation(null);
    return <Navigate to={requestedLocation} />;
  }

  return <>{children}</>;
}
