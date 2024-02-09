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
import { useContext, useEffect, useState } from 'react'
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { LOCALSTORAGE_CONSTANTS } from 'src/@core/static/app.constant'
import { AuthContext } from 'src/context/AuthContext'
import usePlan from 'src/hooks/plan'
import AlertDialog from 'src/component/alertDialog'
import useUser from 'src/hooks/user'

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

  const router = useRouter();
  const plan = usePlan();
  const user = useUser();
  const authContext = useContext(AuthContext);
  // ** Props
  const { hidden, settings, saveSettings, toggleNavVisibility } = props;


  // State for selected organization
  const [organizationAnchorEl, setOrganizationAnchorEl] = useState<null | HTMLElement>(null);
  const organizationOpen = Boolean(organizationAnchorEl);
  const [selectedOrganization, setSelectedOrganization] = useState<Organization>(); // Default value can be an empty string
  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>('');

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
      authContext.organisations?.forEach(org => {
        if (org.org_id === orgId) { setSelectedOrganization(org) }
      });
    }
    updateMessage();
  }, [authContext.organisations]);

  // Handler for selecting an organization
  const handleOrganizationSelection = (organization: Organization) => {
    handleOrganizationClose();
    if (selectedOrganization?.org_id !== organization.org_id) {
      setSelectedOrganization(organization);
      localStorage.setItem(LOCALSTORAGE_CONSTANTS.ogrId, JSON.stringify(organization.org_id));
      localStorage.removeItem(LOCALSTORAGE_CONSTANTS.workspace);
      window.location.reload();
    }
  };

  const updateMessage = () => {
    if (user.isAdmin()) {
      setAlertMessage('Please go to billing to upgrade your plan')
    } else {
      setAlertMessage('Please contact your admin to upgrade plan')
    }
  }

  const createApp = () => {
    plan.isAppCrationAllowed() ? router.push('/create-app') : setOpenAlert(true);
  }

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
        <Button variant='contained' sx={{ marginRight: '10px' }} size="large" onClick={createApp}>Create</Button>
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
          {authContext.organisations && authContext.organisations.map((orgData: any, index: any) => (
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
      <AlertDialog open={openAlert} heading={'Plan Upgrade Needed'} message={alertMessage} onCancel={() => setOpenAlert(false)} />
    </Box>
  )
}

export default AppBarContent
