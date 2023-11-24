import { Tooltip } from "@mui/material";

const ColorMapping = {
  Critical: 'red',
  High: 'orange',
  Medium: '#7353E5',
  Low: '#D3D3D3',
  Unknown: 'yellow'
}

interface CVE {
  Count: number,
  Severity: "Critical" | "High" | "Low" | "Medium" | string
}

interface Props {
  Cves: CVE[]
}

const MultiStepBar: React.FC<Props> = ({ Cves }) => {

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
      {Cves.map((ele: CVE, index: number) => {
        const percent = (ele.Count / sum) * 100;
        const color = getColor(ele.Severity);
        let borderRadius = "0";
        if (index == 0) { borderRadius = "10px 0 0 10px" }
        if (index == Cves.length - 1) { borderRadius = "0 10px 10px 0" }
        if (Cves.length == 1) { borderRadius = "10px" }
        return (
          <Tooltip title={ele.Severity + ':' + ele.Count}>
            <div style={{ width: `${percent}%`, height: '10px', backgroundColor: color, borderRadius: `${borderRadius}` }}></div>
          </Tooltip>
        )
      })}
    </div>
  )
}

export default MultiStepBar