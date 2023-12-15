// components
import SvgIconStyle from '../../../components/SvgIconStyle';
import { PATH_MAIN_ADMIN } from 'src/routes/paths';

// ----------------------------------------------------------------------

const getIcon = (name: string) => (
  <SvgIconStyle src={`/icons/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const ICONS = {
  insights: getIcon('ic_insights'),
  users: getIcon('ic_superadminuser'),
  plans: getIcon('ic_plans'),
  dashboard: getIcon('ic_superadmindashboard'),
  config: getIcon('ic_config'),
  reports: getIcon('ic_reports'),
  themes: getIcon('ic_plans'),
};

export const navConfig = [
  // GENERAL
  // ----------------------------------------------------------------------
  {
    items: [
      { title: 'Dashboard', path: PATH_MAIN_ADMIN.dashboard, icon: ICONS.dashboard },
      { title: 'Users', path: PATH_MAIN_ADMIN.users, icon: ICONS.users },
      { title: 'Plans', path: PATH_MAIN_ADMIN.plans, icon: ICONS.plans },
      { title: 'Configurations', path: PATH_MAIN_ADMIN.configurations, icon: ICONS.config },
      { title: 'Reports', path: PATH_MAIN_ADMIN.reports, icon: ICONS.reports },
      { title: 'Themes', path: PATH_MAIN_ADMIN.themes, icon: ICONS.plans },    ],
  },
];
