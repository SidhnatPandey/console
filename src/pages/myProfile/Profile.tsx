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

const Profile = (user_info:any) => {
  const formatted_number =
  user_info.user_info?.user_info?.phone_number
    ? `(${user_info.user_info?.user_info?.phone_number.toString().slice(0, 3)}) ${user_info.user_info?.user_info?.phone_number.toString().slice(3, 6)}-${user_info.user_info?.user_info?.phone_number.toString().slice(6)}`
    : null;
    
  return (
    <Grid container spacing={6} marginTop="10px" data-testid="profile-container">
      <Grid item xs={12}>
        <Card data-testid="profile-card">
          <CardContent>
            <Typography variant="h6" component="div" gutterBottom color="textSecondary" data-testid="about-section">
              ABOUT
            </Typography>
            <Box marginBottom="16px">
              <Typography variant="subtitle1" color="textSecondary" display="flex" alignItems="center" data-testid="full-name">
              <PermIdentityIcon /> <strong style={{ marginLeft: '8px', marginRight: '8px' }}>Full Name:</strong> {user_info.user_info?.user_info?.first_name} {user_info.user_info?.user_info?.last_name}
              </Typography>
              <Typography variant="subtitle1" color="textSecondary" display="flex" alignItems="center" data-testid="status">
                <CheckIcon /> <strong style={{ marginLeft: '8px', marginRight: '8px' }}>Status: </strong> {user_info.user_info?.status}
              </Typography>
              <Typography variant="subtitle1" color="textSecondary" display="flex" alignItems="center" data-testid="city">
                <LocationOnIcon /> <strong style={{ marginLeft: '8px', marginRight: '8px' }}>City: </strong> {user_info.user_info?.user_info?.address?.city}
              </Typography>
              <Typography variant="subtitle1" color="textSecondary" display="flex" alignItems="center" data-testid="country">
                <FlagIcon /> <strong style={{ marginLeft: '8px', marginRight: '8px' }}>Country: </strong> {user_info.user_info?.user_info?.address?.country}
              </Typography>
            </Box>

            <Typography variant="h6" component="div" marginTop="20px" gutterBottom color="textSecondary" data-testid="contacts-section">
              CONTACTS
            </Typography>
            <Box>
              <Typography variant="subtitle1" color="textSecondary" display="flex" alignItems="center" data-testid="contact">
                <PhoneInTalkIcon /> <strong style={{ marginLeft: '8px', marginRight: '8px' }}>Contact: </strong> {formatted_number}
              </Typography>
              <Typography variant="subtitle1" color="textSecondary" display="flex" alignItems="center" data-testid="email">
                <MailOutlineIcon /> <strong style={{ marginLeft: '8px', marginRight: '8px' }}>Email: </strong> {user_info.user_info?.email}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default Profile;
