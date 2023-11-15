import { Box, Card} from "@mui/material";

const ApplicationVulnerabilities = () => {
  return (
    <Card sx={{ marginTop: "180px" }}>
      <Box
        p={2}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <h1>Application Vulnerabilities</h1>
      </Box>
    </Card>
  );
};

export default ApplicationVulnerabilities;
