// ** React Imports
import { ReactNode, useContext } from "react";

// ** MUI Components
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Box, { BoxProps } from "@mui/material/Box";

// ** Layout Import
import BlankLayout from "src/@core/layouts/BlankLayout";

// ** Demo Imports
import FooterIllustrations from "src/views/pages/misc/FooterIllustrations";
import { PERMISSION_CONSTANTS } from "src/@core/static/app.constant";
import { AuthContext } from "src/context/AuthContext";

// ** Styled Components
const BoxWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  [theme.breakpoints.down("md")]: {
    width: "90vw",
  },
}));

const Img = styled("img")(({ theme }) => ({
  [theme.breakpoints.down("lg")]: {
    height: 450,
    marginTop: theme.spacing(10),
  },
  [theme.breakpoints.down("md")]: {
    height: 400,
  },
  [theme.breakpoints.up("lg")]: {
    marginTop: theme.spacing(20),
  },
}));

const orgError = () => {
  const { logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
  };
  return (
    <Box className="content-center">
      <Box
        sx={{
          p: 5,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <BoxWrapper>
          <Typography variant="h2" sx={{ mb: 1.5 }}>
            No Organization Found
          </Typography>
          <Typography sx={{ mb: 6, color: "text.secondary" }}>
            You are not a part of any Organisation!.
          </Typography>
          <Button
            onClick={handleLogout}
            variant="contained"
            style={{ color: "white" }}
          >
            Log Out
          </Button>
        </BoxWrapper>
        <Img
          height="500"
          alt="error-illustration"
          src="/images/pages/404.png"
        />
      </Box>
      <FooterIllustrations />
    </Box>
  );
};

orgError.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>;
orgError.acl = {
  action: "read",
  subject: PERMISSION_CONSTANTS.orgError,
};

export default orgError;
