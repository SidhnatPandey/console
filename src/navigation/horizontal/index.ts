// ** Type import
import { HorizontalNavItemsType } from 'src/@core/layouts/types'

const navigation = (): HorizontalNavItemsType => {
  return [
    {
      title: 'Dashboards',
      icon: 'tabler:smart-home',
      path: '/dashboard',
      disabled: true
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
    {
      title: 'Billing',
      icon: 'jam:document',
      path: '/apps/email',
      disabled: true
    },
    {
      title: 'Settings',
      icon: 'uil:setting',
      path: '/apps/email'
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
  ]
}

export default navigation
