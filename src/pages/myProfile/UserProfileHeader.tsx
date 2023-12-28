import React from "react";
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
import { useRouter } from "next/router";
import { getMonthAndYear } from "src/utils/dateUtil";
import { UserProfile } from './index';

const ProfilePicture = styled("img")(({ theme }) => ({
  width: 108,
  height: 108,
  borderRadius: theme.shape.borderRadius,
  border: `4px solid ${theme.palette.common.white}`,
  [theme.breakpoints.down("md")]: {
    marginBottom: theme.spacing(4),
  },
}));

interface ProfileProps {
  profileData: UserProfile,
}

const UserProfileHeader: React.FC<ProfileProps> = ({ profileData }) => {

  const router = useRouter(); // Initialize the useNavigate hook

  const handleEditProfileClick = () => {
    // Redirect to the settings page when the "Edit Profile" button is clicked
    router.push("/settings");
  };

  return (
    <Card>
      <CardMedia
        component="img"
        alt="profile-header"
        image={"/images/pages/profile-banner.png"}
        sx={{
          height: { xs: 150, md: 250 },
        }}
        data-testid="profile-banner"
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
        <ProfilePicture
          src={
            profileData?.user_info.profile_picture
              ? "data:image/jpeg;base64," + profileData?.user_info.profile_picture
              : "/images/avatars/user-default-avatar.png"
          }
          alt="profile-picture"
          data-testid="profile-picture"
        />
        <Box
          sx={{
            width: "100%",
            display: "flex",
            ml: { xs: 0, md: 6 },
            alignItems: "flex-end",
            flexWrap: ["wrap", "nowrap"],
            justifyContent: ["center", "space-between"],
          }}
          data-testid="box-container"
        >
          <Box
            sx={{
              mb: [6, 0],
              display: "flex",
              flexDirection: "column",
              alignItems: ["center", "flex-start"],
            }}
            data-testid="info-box"
          >
            <Typography variant="h6" sx={{ mb: 2.5 }}>
              { }
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
                <Typography data-testid="role" sx={{ color: "text.secondary" }}>
                  {profileData?.role}
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
                <Typography
                  data-testid="address"
                  sx={{ color: "text.secondary" }}
                >
                  {profileData?.user_info.address.city &&
                    `${profileData?.user_info.address.city}, `}
                  {profileData?.user_info.address.country}
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
                <Typography
                  sx={{ color: "text.secondary" }}
                  data-testid="joined-date"
                >
                  Joined {getMonthAndYear(profileData?.created_at)}
                </Typography>
              </Box>
            </Box>
          </Box>
          <Button
            variant="contained"
            sx={{ "& svg": { mr: 2 } }}
            onClick={handleEditProfileClick}
            data-testid="edit-profile-button"
          >
            Edit Profile
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default UserProfileHeader;
