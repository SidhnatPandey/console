import { Card, CardContent, Typography, Box } from "@mui/material";
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
  appsAffectedData
}: AppsAffectedByCVEDataProps) => {
  const [epssData, setEpssData] = useState<any>();
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
    const obj: {color: "error" | "warning" | "primary" | "secondary" | "info" | "success", label: string} = {color: 'secondary', label: ''}
    if (score >= 0 && score < 0.25) {
      obj.color = 'info';
      obj.label = 'Low'
      return obj;
    } else if (score >= 0.25 && score < 0.5) {
      obj.color = 'primary';
      obj.label = 'Medium'
      return obj;
    } else if (score >= 0.5 && score < 0.75) {
      obj.color = 'warning';
      obj.label = 'High'
      return obj;
    } else if (score >= 0.75 && score <= 1) {
      obj.color = 'error';
      obj.label = 'Critical'
      return obj;
    } else {
      obj.color = 'secondary';
      obj.label = 'Unknown'
      return obj;
    }
  };

  const { cveId } = router.query;
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
        <Box display="flex" justifyContent="space-between"  gap={4}>
          <Box display="flex" alignItems="center" gap={10}>
            <Typography variant="h5">SEVERITY</Typography>
            <ChipsRounded
              label={appsAffectedData?.Severity || "N/A"}
              color={getCVEColor(appsAffectedData?.Severity || "N/A")}
            />
          </Box>
          <Box  display="flex" alignItems="center"  gap={10}>
            <Box>
            <Typography variant="h5">EXPLOIT PROBABILITY</Typography>
            <Typography variant="subtitle2">in next 30 days</Typography>
            </Box>
            <Box>
              <ChipsRounded
                label={
                  epssData?.epss !== undefined ? getEPSSCategory(epssData?.epss).label  : "N/A"
                }
                color={getEPSSCategory(epssData?.epss || "N/A").color}
              />
            </Box>
          </Box>
          <Box display="flex" alignItems="center"  gap={10}>
            <Box>
            <Typography variant="h5">EPSS SCORE</Typography>
            <Typography variant="subtitle2">
                Exploit Prediction Scoring System
              </Typography>
            </Box>
            <Box>
              <ChipsRounded
                label={Number(epssData?.epss).toFixed(2) || "N/A"}
                color={getEPSSCategory(epssData?.epss || "N/A").color}
              />
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default SeverityEpss;
