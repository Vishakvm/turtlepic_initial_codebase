import { Suspense, lazy, ElementType } from 'react';
import { Navigate, useRoutes, useLocation } from 'react-router-dom';
// layouts
import DashboardLayout from '../layouts/dashboard';
import LogoOnlyLayout from '../layouts/LogoOnlyLayout';
// components
import LoadingScreen from '../components/LoadingScreen';
import AuthGuard from '../guards/AuthGuard';
import GuestGuard from 'src/guards/GuestGuard';
import useAuth from '../hooks/useAuth';
import { LoginPath } from './config';
import AuthSuccessView from 'src/components/auth/events/SuccessView';
import { GUEST, INDIVIDUAL, AGENCY, SUPERADMIN } from 'src/utils/constants';
import RoleGuard from 'src/guards/RoleGuard';
import SuperAdminDashboardLayout from 'src/layouts/superAdminDashboard';
import AdminGuard from 'src/guards/AdminGuard';
import MainGuard from 'src/guards/MainGuard';
import PlanGuard from 'src/guards/PlanGuard';
import PRGuard from 'src/guards/PRGuard';

// ----------------------------------------------------------------------

const Loadable = (Component: ElementType) => (props: any) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { pathname } = useLocation();

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { isAuthenticated } = useAuth();

  const isDashboard = pathname.includes('/main') && isAuthenticated;

  return (
    <Suspense fallback={<LoadingScreen isDashboard={isDashboard} />}>
      <Component {...props} />
    </Suspense>
  );
};

export default function Router() {
  return useRoutes([
    {
      path: 'auth',
      children: [
        {
          path: 'login',
          element: (
            <GuestGuard>
              <LoginView />
            </GuestGuard>
          ),
        },
        {
          path: 'welcome',
          element: (
            <GuestGuard>
              <SignupWelcome />
            </GuestGuard>
          ),
        },
        {
          path: 'plan',
          element: (
            <GuestGuard>
              <SignupPlan />
            </GuestGuard>
          ),
        },
        {
          path: 'details',
          element: (
            <GuestGuard>
              <SignupDetails />
            </GuestGuard>
          ),
        },
        {
          path: 'success',
          element: (
            <GuestGuard>
              <AuthSuccessView />
            </GuestGuard>
          ),
        },
        {
          path: 'otp',
          element: (
            <GuestGuard>
              <SignupOtp />
            </GuestGuard>
          ),
        },
        {
          path: 'individual/brand',
          element: (
            <AuthGuard>
              <SignupBrand />
            </AuthGuard>
          ),
        },
        {
          path: 'agency/brand',
          element: (
            <AuthGuard>
              <SignupAgencyBrand />
            </AuthGuard>
          ),
        },
        {
          path: 'kyc',
          element: (
            <AuthGuard>
              <SignupKyc />
            </AuthGuard>
          ),
        },
        {
          path: 'onboarding',
          element: <SignupOnboardView />,
        },
      ],
    },
    {
      path: 'member',
      children: [
        {
          path: 'auth/login',
          element: (
            <GuestGuard>
              <MemberLoginView />
            </GuestGuard>
          ),
        },
        {
          path: 'auth/signup',
          element: (
            <GuestGuard>
              <MemberSignupView />
            </GuestGuard>
          ),
        },
        {
          path: 'auth/otp',
          element: (
            <GuestGuard>
              <MembersOtpView />
            </GuestGuard>
          ),
        },
      ],
    },
    {
      path: 'client',
      children: [
        {
          path: 'auth/login',
          element: (
            <GuestGuard>
              <ClientLoginView />
            </GuestGuard>
          ),
        },
        {
          path: 'auth/signup',
          element: (
            <GuestGuard>
              <ClientSignupView />
            </GuestGuard>
          ),
        },
        {
          path: 'auth/otp',
          element: (
            <GuestGuard>
              <ClientOtpView />
            </GuestGuard>
          ),
        },
      ],
    },

    {
      path: '/main',
      element: (
        <PlanGuard>
          <AuthGuard>
            <RoleGuard role={GUEST}>
              <MainGuard role={SUPERADMIN}>
                <DashboardLayout />
              </MainGuard>
            </RoleGuard>
          </AuthGuard>
        </PlanGuard>
      ),
      children: [
        { element: <Navigate to={LoginPath()} replace />, index: true },
        { path: 'dashboard', element: <Dashboard /> },
        { path: 'events', element: <Events /> },
        { path: 'clients', element: <Clients /> },
        { path: 'insights', element: <Insights /> },
        { path: 'branding', element: <Branding /> },
        { path: 'teams', element: <Team /> },
        { path: 'settings', element: <Settings /> },
        { path: 'support', element: <Help /> },
        { path: 'event/workspace/create', element: <CreateWorkspaceEvent /> },
        { path: 'event/client/create', element: <CreateClientEvent /> },
      ],
    },
    {
      path: '/admin',
      element: (
        <AuthGuard>
          <RoleGuard role={GUEST}>
            <AdminGuard role={[INDIVIDUAL, AGENCY, GUEST]}>
              <SuperAdminDashboardLayout />
            </AdminGuard>
          </RoleGuard>
        </AuthGuard>
      ),
      children: [
        { path: 'dashboard', element: <AdminDashboard /> },
        { path: 'users', element: <Users /> },
        { path: 'plans', element: <Plans /> },
        { path: 'configurations', element: <Configurations /> },
        { path: 'Reports', element: <Reports /> },
        { path: 'dashboard/kyc', element: <KycRequestList /> },
        { path: 'themes', element: <ThemesPage /> },
        { path: 'themes/create', element: <CreateTheme /> },
      ],
    },
    {
      path: '/main/events/preview',
      element: (
        <AuthGuard>
          <RoleGuard role={GUEST}>
            <PreviewEvent />
          </RoleGuard>
        </AuthGuard>
      ),
    },
    {
      path: '/main/events/selfie',
      element: (
        <AuthGuard>
          <RoleGuard role={GUEST}>
            <CameraView />
          </RoleGuard>
        </AuthGuard>
      ),
    },
    {
      path: '/main/member/onboard',
      element: (
        <AuthGuard>
          <RoleGuard role={GUEST}>
            <MemberLandingScreen />
          </RoleGuard>
        </AuthGuard>
      ),
    },
    {
      path: '/main/client/onboard',
      element: (
        <AuthGuard>
          <RoleGuard role={GUEST}>
            <ClientOnboardingView />
          </RoleGuard>
        </AuthGuard>
      ),
    },
    {
      path: '/main/success',
      element: (
        <AuthGuard>
          <RoleGuard role={GUEST}>
            <SuccessView />
          </RoleGuard>
        </AuthGuard>
      ),
    },
    { path: '/app/redirect', element: <RedirectView /> },

    {
      path: 'pre-registration/',
      children: [
        {
          path: ':event/signup',
          element: <PRSignupView />,
        },
        {
          path: ':event/login',
          element: <PRLoginView />,
        },
        {
          path: ':event/landing',
          element: <PRLandingView />,
        },
        {
          path: ':event/otp',
          element: <PROtpView />,
        },
        {
          path: ':event/onboarding',
          element: (
            <PRGuard>
              <PROnboardingView />
            </PRGuard>
          ),
        },
        {
          path: ':event/selfie-filtering',
          element: (
            <PRGuard>
              <PRSelfieView />
            </PRGuard>
          ),
        },
        {
          path: ':event/thank-you',
          element: (
            <PRGuard>
              <PRThankyouView />
            </PRGuard>
          ),
        },
        {
          path: ':event/no-filter/thank-you',
          element: (
            <PRGuard>
              <PRThankyouVariantView />
            </PRGuard>
          ),
        },
        {
          path: ':event/preview',
          element: (
            <PRGuard>
              <PreviewEvent />
            </PRGuard>
          ),
        },
      ],
    },
    {
      path: '/',
      element: (
        <AuthGuard>
          <DashboardLayout />
        </AuthGuard>
      ),
      children: [
        { element: <Navigate to={LoginPath()} replace />, index: true },
        { path: 'dashboard', element: <Dashboard /> },
      ],
    },
    {
      path: 'public/:slug/preview',
      element: <PublicPreviewEvent />,
    },
    {
      path: 'public/preview/:slug/passcode',
      element: <PasscodeView />,
    },

    {
      path: '*',
      element: <LogoOnlyLayout />,
      children: [
        { path: '404', element: <NotFound /> },
        { path: '*', element: <Navigate to="/404" replace /> },
      ],
    },
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}

// Signup Flow
const SignupWelcome = Loadable(
  lazy(() => import('src/components/auth/signup/views/SignupWelcomeView'))
);
const SignupPlan = Loadable(lazy(() => import('src/components/auth/signup/views/SignupPlanView')));
const SignupDetails = Loadable(
  lazy(() => import('src/components/auth/signup/views/SignupDetailsView'))
);
const SignupOtp = Loadable(lazy(() => import('src/components/auth/elements/SignupOtpView')));
const SignupBrand = Loadable(
  lazy(() => import('src/components/auth/signup/individual/SignupBrandView'))
);
const SignupKyc = Loadable(lazy(() => import('src/components/auth/signup/agency/SignupKycView')));

const SignupAgencyBrand = Loadable(
  lazy(() => import('src/components/auth/signup/agency/SignupAgencyBrandView'))
);

const SignupOnboardView = Loadable(
  lazy(() => import('src/components/auth/signup/agency/SignupOnboardView'))
);

// Login
const LoginView = Loadable(lazy(() => import('src/components/auth/login/LoginView')));

// Redirect
const RedirectView = Loadable(lazy(() => import('src/components/auth/social/SocialRedirectView')));

// Preview Event
const PreviewEvent = Loadable(lazy(() => import('src/components/events/views/PreviewEventView')));
const PublicPreviewEvent = Loadable(
  lazy(() => import('src/components/events/views/PublicPreviewEventView'))
);

const CameraView = Loadable(lazy(() => import('src/components/events/views/CameraView')));
// Success Page
const SuccessView = Loadable(lazy(() => import('src/components/events/views/SuccessView')));

// Loggedin Flow
const Dashboard = Loadable(lazy(() => import('src/pages/Dashboard')));
const Events = Loadable(lazy(() => import('src/pages/Events')));
const Clients = Loadable(lazy(() => import('src/pages/Clients')));
const Insights = Loadable(lazy(() => import('src/pages/Insights')));
const NotFound = Loadable(lazy(() => import('src/pages/Page404')));
const Branding = Loadable(lazy(() => import('src/pages/Branding')));
const Team = Loadable(lazy(() => import('src/pages/TeamMembers')));
const Settings = Loadable(lazy(() => import('src/pages/Settings')));
const Help = Loadable(lazy(() => import('src/pages/Help')));
const CreateWorkspaceEvent = Loadable(
  lazy(() => import('src/components/events/workspace/CreateWorkspaceEvent'))
);
const CreateClientEvent = Loadable(
  lazy(() => import('src/components/events/client/CreateClientEvent'))
);
// Super Admin Flow
const AdminDashboard = Loadable(lazy(() => import('src/pages/superAdmin/Dashboard')));
const Users = Loadable(lazy(() => import('src/pages/superAdmin/Users')));
const Plans = Loadable(lazy(() => import('src/pages/superAdmin/Plans')));
const Configurations = Loadable(lazy(() => import('src/pages/superAdmin/Configurations')));
const Reports = Loadable(lazy(() => import('src/pages/superAdmin/Reports')));
const KycRequestList = Loadable(lazy(() => import('src/components/super-admin/dashboard/KycList')));
const ThemesPage = Loadable(lazy(() => import('src/pages/superAdmin/Themes')));
const CreateTheme = Loadable(lazy(() => import('src/pages/superAdmin/CreateTheme')));


// Pre-registration flow
const PROnboardingView = Loadable(
  lazy(() => import('src/components/auth/preregisteration/PROnboardingView'))
);
const PROtpView = Loadable(lazy(() => import('src/components/auth/preregisteration/PROtpView')));
const PRSignupView = Loadable(
  lazy(() => import('src/components/auth/preregisteration/PRSignupView'))
);
const PRLoginView = Loadable(
  lazy(() => import('src/components/auth/preregisteration/PRLoginView'))
);

const PRSelfieView = Loadable(
  lazy(() => import('src/components/auth/preregisteration/PRSelfieView'))
);

const PRThankyouView = Loadable(
  lazy(() => import('src/components/auth/preregisteration/PRThankyouView'))
);

const PRThankyouVariantView = Loadable(
  lazy(() => import('src/components/auth/preregisteration/PRThankyouVariant'))
);

const PRLandingView = Loadable(
  lazy(() => import('src/components/auth/preregisteration/PRLandingView'))
);
const PasscodeView = Loadable(lazy(() => import('src/components/auth/elements/PasscodeView')));

//Members Login Flow
const MemberLoginView = Loadable(lazy(() => import('src/components/auth/members/MemberLoginView')));
const MemberSignupView = Loadable(
  lazy(() => import('src/components/auth/members/MemberSignupView'))
);
const MembersOtpView = Loadable(lazy(() => import('src/components/auth/members/MemberOtpView')));
const MemberLandingScreen = Loadable(
  lazy(() => import('src/components/auth/members/MemberLandingView'))
);

//Client Login Flow
const ClientLoginView = Loadable(lazy(() => import('src/components/auth/client/ClientLoginView')));
const ClientSignupView = Loadable(
  lazy(() => import('src/components/auth/client/ClientSignupView'))
);
const ClientOtpView = Loadable(lazy(() => import('src/components/auth/client/ClientOtpView')));
const ClientOnboardingView = Loadable(
  lazy(() => import('src/components/auth/client/ClientOnboardingView'))
);
