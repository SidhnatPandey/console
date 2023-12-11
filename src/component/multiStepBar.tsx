import { Tooltip } from "@mui/material";
import { useEffect, useState } from "react";

const ColorMapping = {
  Critical: 'red',
  High: 'orange',
  Medium: '#7353E5',
  Low: 'grey',
  Unknown: '#D3D3D3'
}

interface CVE {
  Count: number,
  Severity: "Critical" | "High" | "Low" | "Medium" | string
}

interface Props {
  Cves: CVE[]
}

const MultiStepBar: React.FC<Props> = ({ Cves }) => {

  let [cveArr, setCveArr] = useState<CVE[]>([]);

  useEffect(() => {
    let high = 0, low = 0, medium = 0, critical = 0, unknown = 0;
    Cves.forEach((cve) => {
      switch (cve.Severity) {
        case 'High':
          high += 1; break;
        case 'Medium':
          medium += 1; break;
        case 'Low':
          low += 1; break;
        case 'Critical':
          critical += 1; break;
        case 'Unknown':
          unknown += 1; break;
      }
    })
    const arr = [
      { Count: high, Severity: "High" },
      { Count: medium, Severity: "Medium" },
      { Count: low, Severity: "Low" },
      { Count: critical, Severity: "Critical" },
      { Count: unknown, Severity: "Unknown" },
    ]
    setCveArr(arr);
  }, [Cves])

  const getColor = (severity: string) => {
    switch (severity) {
      case "Critical": return ColorMapping.Critical;
      case 'High': return ColorMapping.High;
      case 'Medium': return ColorMapping.Medium;
      case 'Low': return ColorMapping.Low;
      case 'Unknown': return ColorMapping.Unknown;
    }
  }

  const sum = Cves.reduce((accumulator, currentValue) => {
    return accumulator + currentValue.Count;
  }, 0);

  return (
    <div style={{ width: "100%", height: '10px', display: "flex", marginRight: "5px" }}>
      {cveArr.map((ele: CVE, index: number) => {
        const percent = (ele.Count / sum) * 100;
        const color = getColor(ele.Severity);
        let borderRadius = "0";
        if (index == 0) { borderRadius = "10px 0 0 10px" }
        if (index == Cves.length - 1) { borderRadius = "0 10px 10px 0" }
        if (Cves.length == 1) { borderRadius = "10px" }
        return (
          <Tooltip title={ele.Severity + ':' + ele.Count} key={index}>
            <div style={{ width: `${percent}%`, height: '10px', backgroundColor: color, borderRadius: `${borderRadius}` }}></div>
          </Tooltip>
        )
      })}
    </div>
  )
}

export default MultiStepBar