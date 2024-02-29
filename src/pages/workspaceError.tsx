// ** React Imports
import { ReactNode, useContext } from "react";

// ** Next Import
import Link from "next/link";

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
import { useRouter } from "next/router";

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

const workspaceError = () => {
  const router = useRouter();

  const handleRedirect = () => {
    router.push("/workspace/create");
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
            No Workspace Found
          </Typography>
          <Typography sx={{ mb: 6, color: "text.secondary" }}>
            Create Atleast One Workspace!.
          </Typography>
          <Button
            onClick={handleRedirect}
            variant="contained"
            style={{ color: "white" }}
          >
            Create Workspace
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

workspaceError.getLayout = (page: ReactNode) => (
  <BlankLayout>{page}</BlankLayout>
);
workspaceError.acl = {
  action: "read",
  subject: PERMISSION_CONSTANTS.orgError,
};

export default workspaceError;
