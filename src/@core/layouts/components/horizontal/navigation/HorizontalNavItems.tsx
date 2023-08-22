// ** Types
import { NavLink, NavGroup, HorizontalNavItemsType, NavSectionTitle } from 'src/@core/layouts/types'

// ** Custom Navigation Components
import HorizontalNavLink from './HorizontalNavLink'
import HorizontalNavGroup from './HorizontalNavGroup'

interface Props {
  hasParent?: boolean
  horizontalNavItems?: HorizontalNavItemsType
}
const resolveComponent = (item: NavGroup | NavLink | NavSectionTitle) => {
  if ((item as NavGroup).children) return HorizontalNavGroup

  return HorizontalNavLink
}

const HorizontalNavItems = (props: Props) => {
  const RenderMenuItems = props.horizontalNavItems?.map((item: NavGroup | NavLink | NavSectionTitle, index: number) => {
    const TagName: any = resolveComponent(item)

    return <TagName {...props} key={index} item={item} />
  })

  return <>{RenderMenuItems}</>
}

export default HorizontalNavItems
