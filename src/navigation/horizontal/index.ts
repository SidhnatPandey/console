// ** Type import
import { HorizontalNavItemsType } from 'src/@core/layouts/types'

const navigation = (): HorizontalNavItemsType => {
  return [
    {
      title: 'Dashboards',
      icon: 'tabler:smart-home',
      badgeContent: 'new',
      badgeColor: 'error',
      children: [
        {
          title: 'Analytics',
          path: '/dashboard'
        },
        {
          title: 'CRM',
          path: '/dashboard'
        },
        {
          title: 'eCommerce',
          path: '/dashboard'
        }
      ]
    },
  ]
}

export default navigation
