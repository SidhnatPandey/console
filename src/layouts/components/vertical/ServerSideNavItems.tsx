import { useContext, useEffect, useState } from 'react'
import { NavGroup, VerticalNavItemsType } from 'src/@core/layouts/types'
import { PERMISSION_CONSTANTS } from 'src/@core/static/app.constant'
import { AuthContext } from 'src/context/AuthContext'
import VerticalNavItems from 'src/navigation/vertical'

const ServerSideNavItems = () => {

  const authContext = useContext(AuthContext);

  const WorkspaceObj: NavGroup = {
    icon: 'ion:document-outline',
    badgeContent: '0',
    title: 'Workspaces',
    children: [],
    action: 'read',
    subject: PERMISSION_CONSTANTS.workspace,
  }

  const AddWorkspaceObj = {
    icon: 'fluent:add-28-regular',
    title: 'New Workspace',
    path: '/workspace/create',
    action: 'read',
    subject: PERMISSION_CONSTANTS.addWorkspace,
  }

  // ** State
  const [menuItems, setMenuItems] = useState<VerticalNavItemsType>([])

  useEffect(() => {
    setMenuItems(VerticalNavItems());
    if (authContext.workspaces) {
      const navItems = VerticalNavItems();
      authContext?.workspaces.forEach((workspace: any) => {
        WorkspaceObj.children?.push({
          title: workspace.name,
          path: `/workspace/${workspace.id}`,
          action: 'read',
          subject: PERMISSION_CONSTANTS.workspace,
        })
      });
      WorkspaceObj.badgeContent = authContext.workspaces.length.toString();
      WorkspaceObj.children?.push(AddWorkspaceObj);
      navItems[1] = WorkspaceObj;
      setMenuItems(navItems);
    }
  }, [authContext.workspaces])

  return { menuItems }
}

export default ServerSideNavItems
