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
      icon: 'ion:document-outline',
      badgeContent: '0',
      title: 'Workspaces',
      children: [ 
        {
          icon: 'fluent:add-28-regular',
          title: 'New Workspace',
          path: '/workspace/create'
        }
      ]
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
