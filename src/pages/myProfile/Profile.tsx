import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import CheckIcon from '@mui/icons-material/Check';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FlagIcon from '@mui/icons-material/Flag';
import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk';
import MailOutlineIcon from '@mui/icons-material/MailOutline';

const Profile = () => {
  const userData = {
    fullName: 'John Doe',
    status: 'Active',
    city: 'New York',
    country: 'USA',
    contact: '(123) 456-7890',
    email: 'example@email.com',
  };

  return (
    <Grid container spacing={6} marginTop="10px">
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" component="div" gutterBottom color="textSecondary">
              ABOUT
            </Typography>
            <Box marginBottom="16px">
              <Typography variant="subtitle1" color="textSecondary" display="flex" alignItems="center">
              <PermIdentityIcon /> <strong style={{ marginLeft: '8px', marginRight: '8px' }}>Full Name:</strong> {userData.fullName}
              </Typography>
              <Typography variant="subtitle1" color="textSecondary" display="flex" alignItems="center">
                <CheckIcon /> <strong style={{ marginLeft: '8px', marginRight: '8px' }}>Status: </strong> {userData.status}
              </Typography>
              <Typography variant="subtitle1" color="textSecondary" display="flex" alignItems="center">
                <LocationOnIcon /> <strong style={{ marginLeft: '8px', marginRight: '8px' }}>City: </strong> {userData.city}
              </Typography>
              <Typography variant="subtitle1" color="textSecondary" display="flex" alignItems="center">
                <FlagIcon /> <strong style={{ marginLeft: '8px', marginRight: '8px' }}>Country: </strong> {userData.country}
              </Typography>
            </Box>

            <Typography variant="h6" component="div" marginTop="20px" gutterBottom color="textSecondary">
              CONTACTS
            </Typography>
            <Box>
              <Typography variant="subtitle1" color="textSecondary" display="flex" alignItems="center">
                <PhoneInTalkIcon /> <strong style={{ marginLeft: '8px', marginRight: '8px' }}>Contact: </strong> {userData.contact}
              </Typography>
              <Typography variant="subtitle1" color="textSecondary" display="flex" alignItems="center">
                <MailOutlineIcon /> <strong style={{ marginLeft: '8px', marginRight: '8px' }}>Email: </strong> {userData.email}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default Profile;
