// ** MUI Imports
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";

// ** Third Party Imports
import { Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { TooltipProps } from "recharts";
// ** Icon Imports
import Icon from "src/@core/components/icon";
import { useContext, useEffect, useState } from "react";
import { getAllvulnerabilities } from "src/services/securityService";
import { SecurityContext } from "src/context/SecurityContext";

interface LabelProp {
  cx: number;
  cy: number;
  percent: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  index: number;
}

const ColorMapping = {
  Critical: "red",
  High: "orange",
  Medium: "#7353E5",
  Low: "lightgrey",
  Unknown: "grey",
};

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
  appId: string
}

const SecurityVulnerabilities = (props: Props) => {

  const { appId } = props;

  const [vulnerabilities, setVulnerabilities] = useState<Vulnerability[]>([]);
  const [totalVulnerabilities, setTotalVulnerabilities] = useState<number>(0);
  const securityContext = useContext(SecurityContext);

  const renderCustomizedLabel = (props: LabelProp) => {
    // ** Props
    const { cx, cy, midAngle, innerRadius, outerRadius, index } =
      props;

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
      const totalV = res?.data.reduce(
        (total: number, cve: any) => total + cve.Count,
        0
      );
      setTotalVulnerabilities(totalV);
      const newArr: Vulnerability[] = [];
      res?.data.forEach((ele: CVE) => {
        const obj: Vulnerability = {
          name: ele.Severity,
          value: ele.Count,
          color: getColor(ele.Severity) || "white",
        };
        newArr.push(obj);
      });
      setVulnerabilities(newArr);
    });
  };

  const getColor = (severity: string) => {
    switch (severity) {
      case "Critical":
        return ColorMapping.Critical;
      case "High":
        return ColorMapping.High;
      case "Medium":
        return ColorMapping.Medium;
      case "Low":
        return ColorMapping.Low;
      case "Unknown":
        return ColorMapping.Unknown;
    }
  };

  useEffect(() => {
    getVulnerabilities(securityContext.workspace, securityContext.runType, appId);
  }, [securityContext.workspace, securityContext.runType, appId]);

  const totalSum = vulnerabilities.reduce((acc, item) => acc + item.value, 0);

  const CustomTooltip: React.FC<TooltipProps<number, string>> = ({
    active,
    payload,
  }) => {
    if (active && payload && payload.length > 0) {
      const payloadData = payload[0];
      if (payloadData && payloadData.value !== undefined) {
        return (
          <div className="custom-tooltip" style={{
            backgroundColor: 'white',
            padding: '5px',
            border: '1px solid #ddd',
            boxShadow: '0px 0px 5px #ddd',
          }}>
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
    <Card sx={{ width: "38%" }}data-testid="vulnerability-card">
      <CardHeader
        title="Vulnerabilities"
        data-testid="card-header"
        subheader="Analysis of Vulnerabilities in Apps"
        subheaderTypographyProps={{
          sx: { color: (theme) => `${theme.palette.text.disabled} !important` },
        }}
      />
      <CardContent>
        <Box sx={{ height: 350, marginTop: "-30px" }} data-testid="box">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart height={350} style={{ direction: "ltr" }}data-testid="pieChart">
              <Pie
                data={vulnerabilities}
                innerRadius={80}
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
                x={170}
                y={170}
                fill="grey"
                textAnchor="middle"
                dominantBaseline="central"
                style={{ fontSize: "18px", fontWeight: "bold" }}
                data-testid="CVEs-title"
              >
                CVEs
              </text>
              <text
                x={170}
                y={190}
                fill="grey"
                textAnchor="middle"
                dominantBaseline="central"
                style={{ fontSize: "15px" }}
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
              "& svg": { mr: 1.5, color: "lightgrey" },
            }}
          >
            <Icon icon="mdi:circle" fontSize="0.5rem" />
            <Typography variant="body2" data-testid="low-severity">Low</Typography>
          </Box>
          <Box
            sx={{
              mr: 5,
              display: "flex",
              alignItems: "center",
              "& svg": { mr: 1.5, color: "rgb(115, 83, 229)" },
            }}
          >
            <Icon icon="mdi:circle" fontSize="0.5rem" />
            <Typography variant="body2" data-testid="medium-severity">Medium</Typography>
          </Box>
          <Box
            sx={{
              mr: 5,
              display: "flex",
              alignItems: "center",
              "& svg": { mr: 1.5, color: "darkorange" },
            }}
          >
            <Icon icon="mdi:circle" fontSize="0.5rem" />
            <Typography variant="body2" data-testid="high-severity">High</Typography>
          </Box>
          <Box
            sx={{
              mr: 5,
              display: "flex",
              alignItems: "center",
              "& svg": { mr: 1.5, color: "red" },
            }}
          >
            <Icon icon="mdi:circle" fontSize="0.5rem" />
            <Typography variant="body2" data-testid="critical-severity">Critical</Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              "& svg": { mr: 1.5, color: "grey" },
            }}
          >
            <Icon icon="mdi:circle" fontSize="0.5rem" />
            <Typography variant="body2" data-testid="unknown-severity">Unknown</Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default SecurityVulnerabilities;
