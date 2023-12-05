// ** React Imports
import { useEffect, useState } from "react";

// ** MUI Components
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

// ** Icon Imports
import Icon from "src/@core/components/icon";

// ** Types
import { ProfileHeaderType } from "src/@fake-db/types";
import { getUserInfo } from "src/services/userInfo";

const ProfilePicture = styled("img")(({ theme }) => ({
  width: 108,
  height: 108,
  borderRadius: theme.shape.borderRadius,
  border: `4px solid ${theme.palette.common.white}`,
  [theme.breakpoints.down("md")]: {
    marginBottom: theme.spacing(4),
  },
}));

const UserProfileHeader = () => {
  const [userData, setUserData] = useState({
    id: 'string',
    type: 'string',
    user_id: 'string',
    role: 'string',
    org: 'string',
    org_id: 'string',
    email: 'string',
    username: 'string',
    password: 'string',
    created_at: 'string',
    updated_at: 'string',
    nickname: 'string',
    user_info: {
      first_name: 'string',
      last_name: 'string',
      phone_number: 'number',
      address: {
        country: 'string',
        state: 'string',
        zip_code: 'number',
        city: 'string',
        street_address: 'string'
      }
    },
    status: 'string'
    }
    );

  useEffect(() => {
    const getUserData = () => {
      getUserInfo()
        .then((response) => {
          setUserData(response?.data || {});
         
          console.log(response);
        })
        .catch((error) => {
          console.error(error);
        });
    };

    getUserData();
  }, []);

  return (
    <Card>
      <CardMedia
        component="img"
        alt="profile-header"
        image={"/images/pages/profile-banner.png"}
        sx={{
          height: { xs: 150, md: 250 },
        }}
      />
      <CardContent
        sx={{
          pt: 0,
          mt: -8,
          display: "flex",
          alignItems: "flex-end",
          flexWrap: { xs: "wrap", md: "nowrap" },
          justifyContent: { xs: "center", md: "flex-start" },
        }}
      >
        <ProfilePicture src={"/images/pages/14.png"} alt="profile-picture" />
        <Box
          sx={{
            width: "100%",
            display: "flex",
            ml: { xs: 0, md: 6 },
            alignItems: "flex-end",
            flexWrap: ["wrap", "nowrap"],
            justifyContent: ["center", "space-between"],
          }}
        >
          <Box
            sx={{
              mb: [6, 0],
              display: "flex",
              flexDirection: "column",
              alignItems: ["center", "flex-start"],
            }}
          >
            <Typography variant="h6" sx={{ mb: 2.5 }}>
              {}
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: ["center", "flex-start"],
              }}
            >
              <Box
                sx={{
                  mr: 4,
                  display: "flex",
                  alignItems: "center",
                  "& svg": { mr: 1.5, color: "text.secondary" },
                }}
              >
                <BusinessCenterIcon />
                <Typography sx={{ color: "text.secondary" }}>
                  {"Admin"}
                </Typography>
              </Box>
              <Box
                sx={{
                  mr: 4,
                  display: "flex",
                  alignItems: "center",
                  "& svg": { mr: 1.5, color: "text.secondary" },
                }}
              >
                <LocationOnIcon />
                <Typography sx={{ color: "text.secondary" }}>
                  {"Dallas"}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  "& svg": { mr: 1.5, color: "text.secondary" },
                }}
              >
                <CalendarMonthIcon />{" "}
                <Typography sx={{ color: "text.secondary" }}>
                  Joined {userData.created_at}
                </Typography>
              </Box>
            </Box>
          </Box>
          <Button variant="contained" sx={{ "& svg": { mr: 2 } }}>
            Edit Profile
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default UserProfileHeader;
