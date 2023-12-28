// navigation.js
import { VerticalNavItemsType } from 'src/@core/layouts/types';

const navigation = (): VerticalNavItemsType => {
  return [
    {
      title: 'Dashboards',
      icon: 'tabler:smart-home',
      path: '/dashboard',
      disabled: true
    },
    {
      icon: 'tabler:smart-home',
      badgeContent: '2',
      title: 'Workspaces',
      children: [
        {
          title: 'Project X',
          path: '/workspace?project=project-x'  // Use a query parameter
        },
        {
          title: 'Project Y',
          path: '/workspace?project=project-y'
        },
        {
          icon: 'fluent:add-28-regular',
          title: 'New Workspace',
          path: '/workspace/create'
        }
      ]
    },
    {
      title: 'Apps',
      icon: 'ion:document-outline',
      path: '/apps'
    },
    {
      title: 'Security',
      icon: 'material-symbols:lock-outline',
      path: '/security'
    },
    {
      sectionTitle: 'MANAGE'
    },
    /* {
      title: 'Billing',
      icon: 'jam:document',
      path: '/apps/email',
      disabled: true
    }, */
    {
      title: 'Settings',
      icon: 'uil:setting',
      path: '/settings'
    },
    {
      title: 'Support',
      icon: 'ri:headphone-line',
      path: 'https://support.initializ.ai/'
    },
    {
      sectionTitle: 'Misc'
    },
    {
      title: 'Documentation',
      icon: 'carbon:document',
      path: 'https://docs.initializ.ai/'
    },
  ];
};

export default navigation;
