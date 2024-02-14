// pages/settings/index.tsx
import React, { useState } from 'react';
import Link from 'next/link';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TeamsIcon from '@mui/icons-material/People';
import AccountsIcon from '@mui/icons-material/AccountBox';
import TabAccount from './TabAccount';
import { PERMISSION_CONSTANTS } from 'src/@core/static/app.constant';

const Settings = () => {
  const [selectedPage, setSelectedPage] = useState('accounts'); // Set 'accounts' as the initial value

  const handleTeamsClick = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setSelectedPage('teams');
  };

  const handleAccountsClick = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setSelectedPage('accounts');
  };

  return (
    <>
      <div style={{ display: 'flex', gap: '16px' }}>
        <Link href="/settings/teams" passHref>
          <Button
            component="a"
            onClick={handleTeamsClick}
            variant={selectedPage === 'teams' ? "contained" : undefined}
            // color={selectedPage === 'teams' ? 'primary' : 'default'}
            startIcon={<TeamsIcon />}
            sx={{ '&:hover': { backgroundColor: "none" } }}
          >
            <Typography style={{ color: selectedPage === 'teams' ? 'white' : 'inherit' }}>Teams</Typography>
          </Button>
        </Link>
        <Link href="/settings/accounts" passHref>
          <Button
            component="a"
            onClick={handleAccountsClick}
            variant={selectedPage === 'accounts' ? "contained" : undefined}
            // color={selectedPage === 'accounts' ? 'primary' : 'default'}
            startIcon={<AccountsIcon />}
            sx={{ '&:hover': { backgroundColor: "none" } }}
          >
            <Typography style={{ color: selectedPage === 'accounts' ? 'white' : 'inherit' }}>Accounts</Typography>
          </Button>
        </Link>
      </div>
      <div style={{ marginTop: '16px' }}>
        {selectedPage === 'teams' ? <p>Under Development</p> : null}
        {selectedPage === 'accounts' ? <TabAccount /> : null}
      </div>
    </>
  );
};

Settings.acl = {
  action: 'read',
  subject: PERMISSION_CONSTANTS.editProfile
}

export default Settings;
