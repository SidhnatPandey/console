import { Card, CardContent, Typography, Box } from "@mui/material";
import ChipsRounded from "src/component/Chip";

interface AppsAffectedByCVEDataProps {
  appsAffectedData?: {
    CveId: string;
    Severity: string;
    ExpoProbability: string;
  };
  setAppsAffectedData?: (value: any) => void;
}

const SeverityEpss = ({ appsAffectedData }: AppsAffectedByCVEDataProps) => {
  const getChipColor = (severity: string) => {
    switch (severity) {
      case "Critical":
        return "error";
      case "High":
        return "warning";
      case "Medium":
        return "primary";
      case "Low":
        return "secondary";
      case "Unknown":
        return "info";
      case "Negligible":
        return "info";
      default:
        return "success";
    }
  };

  return (
    <Card sx={{ mt: 4 }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" gap={4}>
          <Box display="flex" alignItems="center" gap={10}>
            <Typography variant="h5">SEVERITY</Typography>
            <ChipsRounded
              label={
                appsAffectedData?.Severity === "Unknown"
                  ? "Negligible"
                  : appsAffectedData?.Severity || "N/A"
              }
              color={getChipColor(appsAffectedData?.Severity || "N/A")}
            />
          </Box>
          <Box display="flex" alignItems="center" gap={10}>
            <Box>
              <Typography variant="h5">EXPLOIT PROBABILITY</Typography>
              <Typography variant="subtitle2">in next 30 days</Typography>
            </Box>
            <Box>
              <ChipsRounded
                label={
                  appsAffectedData?.ExpoProbability === "Unknown"
                    ? "Negligible"
                    : appsAffectedData?.ExpoProbability || "N/A"
                }
                color={getChipColor(appsAffectedData?.ExpoProbability || "N/A")}
              />
            </Box>
          </Box>
          <Box display="flex" alignItems="center" gap={10}>
            <Box>
              <Typography variant="h5">EPSS SCORE</Typography>
              <Typography variant="subtitle2">
                Exploit Prediction Scoring System
              </Typography>
            </Box>
            <Box>
              <ChipsRounded
                label={
                  appsAffectedData?.ExpoProbability === "Unknown" ||
                  appsAffectedData?.ExpoProbability === "Negligible"
                    ? "<1%"
                    : appsAffectedData?.ExpoProbability === "Low"
                    ? "<25%"
                    : appsAffectedData?.ExpoProbability === "Medium"
                    ? "<50%"
                    : appsAffectedData?.ExpoProbability === "High"
                    ? "<75%"
                    : appsAffectedData?.ExpoProbability === "Critical"
                    ? "<=100%"
                    : "N/A"
                }
                color={getChipColor(appsAffectedData?.ExpoProbability || "N/A")}
              />
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default SeverityEpss;
