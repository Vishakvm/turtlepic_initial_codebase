// components
import SvgIconStyle from '../../../components/SvgIconStyle';
import { PATH_MAIN, PATH_PLAN } from 'src/routes/paths';

// ----------------------------------------------------------------------

const getIcon = (name: string) => (
  <SvgIconStyle src={`/icons/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const ICONS = {
  insights: getIcon('ic_insights'),
  events: getIcon('ic_events'),
  clients: getIcon('ic_clients'),
  dashboard: getIcon('ic_dashboard'),
  next: getIcon('ic_next'),
  paper: getIcon('ic_paper'),
  team: getIcon('ic_team'),
  settings: getIcon('ic_settings'),
  help: getIcon('ic_help'),
};

export const navConfig = [
  // GENERAL
  // ----------------------------------------------------------------------
  {
    items: [
      { title: 'Dashboard', path: PATH_MAIN.dashboard, icon: ICONS.dashboard },
      { title: 'Events', path: PATH_MAIN.events, icon: ICONS.events },
      { title: 'Insights', path: PATH_MAIN.insights, icon: ICONS.insights },
    ],
  },
];

export const navClientConfig = [
  // Client
  {
    items: [{ title: 'Clients', path: PATH_MAIN.clients, icon: ICONS.clients }],
  },
];
export const navStorageConfig = [
  // STORAGE
  {
    subheader: 'Storage',
    items: [{ title: 'Upgrade Plan', path: '', icon: ICONS.next }],
  },
];

export const navProfileConfig = [
  // TEAMS
  {
    subheader: 'Profile',
    items: [
      {
        title: 'Team Members',
        path: PATH_MAIN.teams,
        icon: ICONS.team,
      },
    ],
  },
];
export const navManagementConfig = [
  // MANAGEMENT
  {
    items: [
      { title: 'Branding Details', path: PATH_MAIN.branding, icon: ICONS.paper },
      { title: 'Settings', path: PATH_MAIN.settings, icon: ICONS.settings },
      { title: 'Help & Support', path: PATH_MAIN.support, icon: ICONS.help },
    ],
  },
];

export const navConfig2 = [
  // GENERAL
  // ----------------------------------------------------------------------
  {
    items: [
      { title: 'Dashboard', path: PATH_PLAN.root, icon: ICONS.dashboard },
      { title: 'Events', path: PATH_PLAN.root, icon: ICONS.events },
      { title: 'Insights', path: PATH_PLAN.root, icon: ICONS.insights },
    ],
  },
];

export const navClientConfig2 = [
  // Client
  {
    items: [{ title: 'Clients', path: PATH_PLAN.root, icon: ICONS.clients }],
  },
];
export const navStorageConfig2 = [
  // STORAGE
  {
    subheader: 'Storage',
    items: [{ title: 'Upgrade Plan', path: '', icon: ICONS.next }],
  },
];

export const navProfileConfig2 = [
  // TEAMS
  {
    subheader: 'Profile',
    items: [
      {
        title: 'Team Members',
        path: PATH_PLAN.root,
        icon: ICONS.team,
      },
    ],
  },
];
export const navManagementConfig2 = [
  // MANAGEMENT
  {
    items: [
      { title: 'Branding Details', path: PATH_PLAN.root, icon: ICONS.paper },
      { title: 'Settings', path: PATH_PLAN.root, icon: ICONS.settings },
      { title: 'Help & Support', path: PATH_PLAN.root, icon: ICONS.help },
    ],
  },
];
