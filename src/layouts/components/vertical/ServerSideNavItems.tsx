import { useEffect, useState } from 'react'
import { NavGroup, VerticalNavItemsType } from 'src/@core/layouts/types'
import { APP_API } from 'src/@core/static/api.constant'
import VerticalNavItems from 'src/navigation/vertical'
import { getFetcher } from 'src/services/fetcherService'
import useSWR from 'swr'

const ServerSideNavItems = () => {

  const key = APP_API.getListOfWorkspaces;
  const { data } = useSWR(key, getFetcher);

  const WorkspaceObj: NavGroup = {
    icon: 'ion:document-outline',
    badgeContent: '0',
    title: 'Workspaces',
    children: []
  }

  const AddWorkspaceObj = {
    icon: 'fluent:add-28-regular',
    title: 'New Workspace',
    path: '/workspace/create'
  }

  // ** State
  const [menuItems, setMenuItems] = useState<VerticalNavItemsType>([])

  useEffect(() => {
    setMenuItems(VerticalNavItems());
    if (data) {
      const navItems = VerticalNavItems();
      data.data.workspaces.forEach((workspace: any) => {
        WorkspaceObj.children?.push({
          title: workspace.name,
          path: `/workspace?project=${workspace.name}`
        })
      });
      WorkspaceObj.badgeContent = data.data.workspaces.length;
      WorkspaceObj.children?.push(AddWorkspaceObj);
      navItems[1] = WorkspaceObj;
      setMenuItems(navItems);
    }
  }, [data])

  return { menuItems }
}

export default ServerSideNavItems
