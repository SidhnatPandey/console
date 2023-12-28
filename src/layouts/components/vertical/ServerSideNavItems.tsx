import { useEffect, useState } from 'react'
import { VerticalNavItemsType } from 'src/@core/layouts/types'
import { APP_API } from 'src/@core/static/api.constant'
import VerticalNavItems from 'src/navigation/vertical'
import { getFetcher } from 'src/services/fetcherService'
import useSWR from 'swr'

const ServerSideNavItems = () => {

  const key = APP_API.getListOfWorkspaces;
  const { data } = useSWR(key, getFetcher, {
    onSuccess: () => {
      console.log((data));
    }
  });

  // ** State
  const [menuItems, setMenuItems] = useState<VerticalNavItemsType>([])

  useEffect(() => {
    setMenuItems(VerticalNavItems());
  }, [])

  return { menuItems }
}

export default ServerSideNavItems
