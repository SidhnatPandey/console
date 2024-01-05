// ** MUI Imports
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Type Import
import { Settings } from 'src/@core/context/settingsContext'
//import LanguageDropdown from 'src/@core/layouts/components/shared-components/LanguageDropdown'

// ** Components
import Autocomplete from 'src/layouts/components/Autocomplete'
import ModeToggler from 'src/@core/layouts/components/shared-components/ModeToggler'
import NotificationDropdown, { NotificationsType } from 'src/@core/layouts/components/shared-components/NotificationDropdown'
import ShortcutsDropdown, { ShortcutsType } from 'src/@core/layouts/components/shared-components/ShortcutsDropdown'
import UserDropdown from 'src/@core/layouts/components/shared-components/UserDropdown'
import { Button } from '@mui/material'
import { useRouter } from 'next/navigation'
import { APP_API } from 'src/@core/static/api.constant'
import useSWR from 'swr'
import { getFetcher } from 'src/services/fetcherService'
import { setApiBaseUrl } from 'src/@core/services/interceptor'
import { useEffect, useState } from 'react'
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { LOCALSTORAGE_CONSTANTS } from 'src/@core/static/app.constant'

interface Props {
  hidden: boolean
  settings: Settings
  toggleNavVisibility: () => void
  saveSettings: (values: Settings) => void
}

interface Organization {
  org_id: string,
  org_name: string
}

const shortcuts: ShortcutsType[] = [];
const notifications: NotificationsType[] = [];

const AppBarContent = (props: Props) => {

  const router = useRouter()
  // ** Props
  const { hidden, settings, saveSettings, toggleNavVisibility } = props;

  setApiBaseUrl();
  const { data: organizationData } = useSWR<{ data: Organization[] }>(APP_API.OrgList, getFetcher);

  // State for selected organization
  const [organizationAnchorEl, setOrganizationAnchorEl] = useState<null | HTMLElement>(null);
  const organizationOpen = Boolean(organizationAnchorEl);
  const [selectedOrganization, setSelectedOrganization] = useState<Organization>(); // Default value can be an empty string

  const handleOrganizationClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setOrganizationAnchorEl(event.currentTarget);
  };

  const handleOrganizationClose = () => {
    setOrganizationAnchorEl(null);
  };

  useEffect(() => {
    // Set the default organization based on the response from the API
    const orgId = JSON.parse(localStorage.getItem(LOCALSTORAGE_CONSTANTS.ogrId)!)
    if (orgId) {
      // Set the default organization to the first one in the list
      organizationData?.data.forEach(org => {
        if (org.org_id === orgId) { setSelectedOrganization(org) }
      });
    }
  }, [organizationData]);

  // Handler for selecting an organization
  const handleOrganizationSelection = (organization: Organization) => {
    // Update the selected organization
    setSelectedOrganization(organization);
    localStorage.setItem(LOCALSTORAGE_CONSTANTS.ogrId, JSON.stringify(organization.org_id))
    window.location.reload();
    // Close the dropdown
    handleOrganizationClose();
    // Additional actions if needed
  };

  return (
    <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Box className='actions-left' sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
        {hidden ? (
          <IconButton color='inherit' sx={{ ml: -2.75 }} onClick={toggleNavVisibility}>
            <Icon fontSize='1.5rem' icon='tabler:menu-2' />
          </IconButton>
        ) : null}

        <Autocomplete hidden={hidden} settings={settings} />
      </Box>
      <Box className='actions-right' sx={{ display: 'flex', alignItems: 'center' }}>
        {/* <LanguageDropdown settings={settings} saveSettings={saveSettings} /> */}
        <Button variant='contained' sx={{ marginRight: '10px' }} size="large" onClick={() => router.push('/create-app')}>Create</Button>
        <Button
          variant="contained"
          size="large"
          onClick={handleOrganizationClick}
          endIcon={<ArrowDropDownIcon />}
          sx={{ backgroundColor: 'lightgray', '&:hover': { backgroundColor: 'lightgray' }, color: 'black' }}
        >
          {selectedOrganization?.org_name || 'Organization'}
        </Button>
        <Menu
          anchorEl={organizationAnchorEl}
          open={organizationOpen}
          onClose={handleOrganizationClose}
        >
          {organizationData?.data && organizationData.data.map((orgData: any, index: any) => (
            <MenuItem key={index} onClick={() => handleOrganizationSelection(orgData)}>
              {orgData.org_name}
            </MenuItem>
          ))}
        </Menu>
        <ModeToggler settings={settings} saveSettings={saveSettings} />
        <ShortcutsDropdown settings={settings} shortcuts={shortcuts} />
        <NotificationDropdown settings={settings} notifications={notifications} />
        <UserDropdown settings={settings} />
      </Box>

    </Box>
  )
}

export default AppBarContent
