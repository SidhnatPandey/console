// ** MUI Imports
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import { useTheme } from "@mui/material/styles";

// ** Third Party Imports
import { Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { TooltipProps } from "recharts";
// ** Icon Imports
import Icon from "src/@core/components/icon";
import { useContext, useEffect, useState } from "react";
import { getAllvulnerabilities } from "src/services/securityService";
import { SecurityContext } from "src/context/SecurityContext";
import { COLOR_PALLET } from "src/@core/static/color.constants";

interface LabelProp {
  cx: number;
  cy: number;
  percent: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  index: number;
}

interface CVE {
  Count: number;
  Severity: string;
}

interface Vulnerability {
  name: string;
  value: number;
  color: string;
}

const RADIAN = Math.PI / 180;

interface Props {
  appId?: string;
}

const SecurityVulnerabilities = (props: Props) => {
  const { appId } = props;
  const theme = useTheme();

  const [vulnerabilities, setVulnerabilities] = useState<Vulnerability[]>([]);
  const [totalVulnerabilities, setTotalVulnerabilities] = useState<number>(0);
  const securityContext = useContext(SecurityContext);

  const renderCustomizedLabel = (props: LabelProp) => {
    // ** Props
    const { cx, cy, midAngle, innerRadius, outerRadius, index } = props;

    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    /* const value = Math.ceil((totalVulnerabilities * percent));
    (${value}/${totalVulnerabilities}) */

    const count = vulnerabilities[index].value;
    return (
      <text
        x={x}
        y={y}
        fill="#fff"
        textAnchor="middle"
        dominantBaseline="central"
      >
        {count}
      </text>
    );
  };

  const getVulnerabilities = (
    workspaceId: string,
    runType: string,
    appId?: string
  ) => {
    getAllvulnerabilities(workspaceId, runType, appId).then((res) => {
      const data = res?.data ?? [];

      let negligibleCount = 0;

      data.forEach((ele: CVE) => {
        if (ele.Severity === 'Unknown' || ele.Severity === 'Negligible') {
          negligibleCount = negligibleCount + ele.Count;
        }
      });

      const filteredArr = data.filter((ele: CVE) => (ele.Severity !== 'Unknown' && ele.Severity !== 'Negligible'));

      const totalV = data.reduce(
        (total: number, cve: any) => total + cve.Count,
        0
      );
      setTotalVulnerabilities(totalV);

      const newArr: Vulnerability[] = filteredArr.map((ele: CVE) => ({
        name: ele.Severity,
        value: ele.Count,
        color: getColor(ele.Severity) || "white",
      }));

      if (negligibleCount > 0) {
        newArr.push({
          name: 'Negligible',
          value: negligibleCount,
          color: COLOR_PALLET.info
        })
      }

      setVulnerabilities(newArr);
    });
  };

  const getColor = (severity: string) => {
    switch (severity) {
      case "Critical":
        return COLOR_PALLET.error;
      case "High":
        return COLOR_PALLET.warning;
      case "Medium":
        return COLOR_PALLET.primary;
      case "Low":
        return COLOR_PALLET.secondary;
      case "Negligible":
        return COLOR_PALLET.info;
      case "Unknown":
        return COLOR_PALLET.info;
    }
  };

  useEffect(() => {
    getVulnerabilities(
      securityContext.workspace,
      securityContext.runType,
      appId
    );
  }, [securityContext.workspace, securityContext.runType, appId]);

  const totalSum = vulnerabilities.reduce((acc, item) => acc + item.value, 0);

  const CustomTooltip: React.FC<TooltipProps<number, string>> = ({
    active,
    payload,
  }) => {
    const theme = useTheme();

    if (active && payload && payload.length > 0) {
      const payloadData = payload[0];
      if (payloadData && payloadData.value !== undefined) {
        return (
          <div
            className="custom-tooltip"
            style={{
              backgroundColor: theme.palette.mode === "dark" ? "#333" : "white",
              color: theme.palette.mode === "dark" ? "white" : "black",
              padding: "5px",
              border: "1px solid #ddd",
              boxShadow: "0px 0px 5px #ddd",
            }}
          >
            <p className="label">
              {`${payloadData.name} : ${(
                (payloadData.value / totalSum) *
                100
              ).toFixed(0)}%`}
            </p>
          </div>
        );
      }
    }

    return null;
  };

  return (
    <Card sx={{ width: "49%" }} data-testid="vulnerability-card">
      <CardHeader
        title="Vulnerabilities"
        data-testid="card-header"
        subheader="Analysis of Vulnerabilities in Apps"
        subheaderTypographyProps={{
          sx: { color: (theme) => `${theme.palette.text.disabled} !important` },
        }}
      />
      <CardContent>
        <Box sx={{ height: 350, marginTop: "-10px" }} data-testid="box">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart
              height={350}
              style={{ direction: "ltr" }}
              data-testid="pieChart"
            >
              <Pie
                data={vulnerabilities}
                innerRadius={80}
                outerRadius={160}
                dataKey="value"
                label={renderCustomizedLabel}
                labelLine={false}
                startAngle={-150}
                data-testid="pie"
              >
                {vulnerabilities.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} data-testid="tooltip" />
              <text
                x="50%"
                y="47%"
                fill="gray"
                textAnchor="middle"
                dominantBaseline="central"
                style={{
                  fontSize: "18px",
                  fontWeight: "bold",
                  color: "gray",
                  fontFamily: theme.typography.fontFamily,
                }}
                data-testid="CVEs-title"
              >
                CVEs
              </text>
              <text
                x="50%"
                y="55%"
                fill="#666666"
                textAnchor="middle"
                dominantBaseline="central"
                style={{
                  fontSize: "20px",
                  fontWeight: "bold",
                }}
                data-testid="total-vulnerability"
              >
                {totalVulnerabilities}
              </text>
            </PieChart>
          </ResponsiveContainer>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            mb: 4,
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              mr: 5,
              display: "flex",
              alignItems: "center",
              "& svg": { mr: 1.5, color: "#A8AAAE" },
            }}
          >
            <Icon icon="mdi:circle" fontSize="0.9rem" />
            <Typography variant="body2" data-testid="low-severity">
              Low
            </Typography>
          </Box>
          <Box
            sx={{
              mr: 5,
              display: "flex",
              alignItems: "center",
              "& svg": { mr: 1.5, color: "#7367F0" },
            }}
          >
            <Icon icon="mdi:circle" fontSize="0.9rem" />
            <Typography variant="body2" data-testid="medium-severity">
              Medium
            </Typography>
          </Box>
          <Box
            sx={{
              mr: 5,
              display: "flex",
              alignItems: "center",
              "& svg": { mr: 1.5, color: "#FF9F43" },
            }}
          >
            <Icon icon="mdi:circle" fontSize="0.9rem" />
            <Typography variant="body2" data-testid="high-severity">
              High
            </Typography>
          </Box>
          <Box
            sx={{
              mr: 5,
              display: "flex",
              alignItems: "center",
              "& svg": { mr: 1.5, color: "#EA5455" },
            }}
          >
            <Icon icon="mdi:circle" fontSize="0.9rem" />
            <Typography variant="body2" data-testid="critical-severity">
              Critical
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              "& svg": { mr: 1.5, color: "#00CFE8" },
            }}
          >
            <Icon icon="mdi:circle" fontSize="0.9rem" />
            <Typography variant="body2" data-testid="unknown-severity">
              Negligible
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default SecurityVulnerabilities;
