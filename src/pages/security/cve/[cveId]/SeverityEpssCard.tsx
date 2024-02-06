import { Chip, Card, CardContent, Typography, Box } from "@mui/material";
import router from "next/router";
import { useEffect, useState } from "react";
import { convertToString } from "src/@core/utils/string";
import ChipsRounded from "src/component/Chip";
import { getEpssScore } from "src/services/securityService";

interface AppsAffectedByCVEDataProps {
  appsAffectedData?: {
    Severity?: string | undefined;
  };
  setAppsAffectedData: (value: any) => void;
}

const SeverityEpss = ({
  appsAffectedData,
  setAppsAffectedData,
}: AppsAffectedByCVEDataProps) => {
  const [epssData, setEpssData] = useState<any>({ epss: 0 });
  const getCVEColor = (severity: string) => {
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
      default:
        return "success";
    }
  };

  const getEPSSCategory = (score: number) => {
    if (score >= 0 && score < 0.25) {
      return "info";
    } else if (score >= 0.25 && score < 0.5) {
      return "primary";
    } else if (score >= 0.5 && score < 0.75) {
      return "warning";
    } else if (score >= 0.75 && score <= 1) {
      return "error";
    } else {
      return "success";
    }
  };

  let { cveId } = router.query;
  useEffect(() => {
    getEpssScores(convertToString(cveId));
  }, [cveId]);

  const getEpssScores = (cveId: string) => {
    getEpssScore(cveId).then((res) => {
      setEpssData(res?.data);
    });
  };
  return (
    <Card sx={{ mt: 4 }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={4}>
            <Typography variant="h5">SEVERITY</Typography>
            <ChipsRounded
              label={appsAffectedData?.Severity || "N/A"}
              color={getCVEColor(appsAffectedData?.Severity || "N/A")}
            />
          </Box>
          <Box>
            <Typography variant="h5">EXPLOIT PROBABILITY</Typography>
            <Box display="flex" alignItems="center">
              <Typography variant="subtitle2">in next 30 days</Typography>
              <ChipsRounded
                label={
                  epssData?.epss !== undefined
                    ? getEPSSCategory(epssData?.epss) === "info"
                      ? "Low"
                      : getEPSSCategory(epssData?.epss) === "primary"
                      ? "Medium"
                      : getEPSSCategory(epssData?.epss) === "warning"
                      ? "High"
                      : getEPSSCategory(epssData?.epss) === "error"
                      ? "Critical"
                      : "N/A"
                    : "N/A"
                }
                color={getEPSSCategory(epssData?.epss || "N/A")}
              />
            </Box>
          </Box>
          <Box>
            <Typography variant="h5">EPSS SCORE</Typography>
            <Box display="flex" alignItems="center">
              <Typography variant="subtitle2">
                Exploit Prediction Scoring System
              </Typography>
              <ChipsRounded
                label={epssData?.epss || "N/A"}
                color={getEPSSCategory(epssData?.epss || "N/A")}
              />
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default SeverityEpss;
