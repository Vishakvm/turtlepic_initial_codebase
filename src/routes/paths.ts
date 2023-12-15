// ----------------------------------------------------------------------


function path(root: string, sublink: string) {
  return `${root}${sublink}`;
}

const ROOTS_AUTH = '/auth';
const ROOTS_MAIN = '/main';
const ROOTS_MAIN_ADMIN = '/admin';
const ROOTS_PRE_AUTH = '/pre-registration';
const ROOTS_CLIENT_AUTH = '/client/auth';
const ROOTS_MEMBER_AUTH = '/member/auth';
const ROOTS_PLAN = '/main/settings?to=plan'

// ----------------------------------------------------------------------

export const PATH_AUTH = {
  root: ROOTS_AUTH,
  login: path(ROOTS_AUTH, '/login'),
  welcome: path(ROOTS_AUTH, '/welcome'),
  plan: path(ROOTS_AUTH, '/plan'),
  details: path(ROOTS_AUTH, '/details'),
  otp: path(ROOTS_AUTH, '/otp'),
  individualBrand: path(ROOTS_AUTH, '/individual/brand'),
  agencyBrand: path(ROOTS_AUTH, '/agency/brand'),
  kyc: path(ROOTS_AUTH, '/kyc'),
  onboarding: path(ROOTS_AUTH, '/onboarding'),
};

export const PATH_PRE_AUTH = ROOTS_PRE_AUTH 

export const PATH_CLIENT_AUTH = {
  root: ROOTS_CLIENT_AUTH,
  login: path(ROOTS_CLIENT_AUTH, '/login'),
  signup: path(ROOTS_CLIENT_AUTH, '/signup'),
  otp: path(ROOTS_CLIENT_AUTH, '/otp'),
};

export const PATH_MEMBER_AUTH = {
  root: ROOTS_MEMBER_AUTH,
  login: path(ROOTS_MEMBER_AUTH, '/login'),
  signup: path(ROOTS_MEMBER_AUTH, '/signup'),
  otp: path(ROOTS_MEMBER_AUTH, '/otp'),
};
export const PATH_PAGE = {
  page404: '/404',
  page500: '/500',
};
export const PATH_PLAN = {
  root: ROOTS_PLAN,
};

export const PATH_MAIN = {
  root: ROOTS_MAIN,
  dashboard: path(ROOTS_MAIN, '/dashboard'),
  events: path(ROOTS_MAIN, '/events'),
  clients: path(ROOTS_MAIN, '/clients'),
  insights: path(ROOTS_MAIN, '/insights'),
  configurations: path(ROOTS_MAIN, '/configurations'),
  branding: path(ROOTS_MAIN, '/branding'),
  teams: path(ROOTS_MAIN, '/teams'),
  settings: path(ROOTS_MAIN, '/settings'),
  support: path(ROOTS_MAIN, '/support'),
  success: path(ROOTS_MAIN, '/success'),
  createWorkspaceEvent: path(ROOTS_MAIN, '/event/workspace/create'),
  createClientEvent: path(ROOTS_MAIN, '/event/client/create'),
  previewEvent: path(ROOTS_MAIN, '/events/preview'),
  teamOnboarding: path(ROOTS_MAIN, '/member/onboard'),
  clientOnboarding: path(ROOTS_MAIN, '/client/onboard'),
  addSelfie: path(ROOTS_MAIN, '/events/selfie'),
};
export const PATH_MAIN_ADMIN = {
  root: ROOTS_MAIN_ADMIN,
  dashboard: path(ROOTS_MAIN_ADMIN, '/dashboard'),
  users: path(ROOTS_MAIN_ADMIN, '/users'),
  plans: path(ROOTS_MAIN_ADMIN, '/plans'),
  configurations: path(ROOTS_MAIN_ADMIN, '/configurations'),
  discounts: path(ROOTS_MAIN_ADMIN, '/discounts'),
  reports: path(ROOTS_MAIN_ADMIN, '/reports'),
  kyc: path(ROOTS_MAIN_ADMIN, '/dashboard/kyc'),
  themes: path(ROOTS_MAIN_ADMIN, '/themes'),
  createTheme: path(ROOTS_MAIN_ADMIN, '/themes/create'),
};
