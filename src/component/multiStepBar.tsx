import { Tooltip } from "@mui/material";
import { useEffect, useState } from "react";
import { COLOR_PALLET } from "src/@core/static/color.constants";
interface CVE {
  Count: number,
  Severity: "Critical" | "High" | "Low" | "Medium" | "Negligible" | string
}
interface Props {
  Cves: CVE[]
}

const MultiStepBar: React.FC<Props> = ({ Cves }) => {

  const [cveArr, setCveArr] = useState<CVE[]>([]);
  const [sum, setSum] = useState<number>(0);

  useEffect(() => {
    let high = 0, low = 0, medium = 0, critical = 0, negligible = 0;
    Cves?.forEach((cve) => {
      switch (cve.Severity) {
        case 'High':
          high += cve.Count; break;
        case 'Medium':
          medium += cve.Count; break;
        case 'Low':
          low += cve.Count; break;
        case 'Critical':
          critical += cve.Count; break;
        case 'Negligible':
          negligible += cve.Count; break;
        case 'Unknown':
          negligible += cve.Count; break;
      }
    })
    const arr = [];
    if (high != 0) { arr.push({ Count: high, Severity: "High" }) }
    if (low != 0) { arr.push({ Count: low, Severity: "Low" }) }
    if (medium != 0) { arr.push({ Count: medium, Severity: "Medium" }) }
    if (negligible != 0) { arr.push({ Count: negligible, Severity: "Negligible" }) }
    if (critical != 0) { arr.push({ Count: critical, Severity: "Critical" }) }
    setCveArr(arr);
    setSum(calcsum)
  }, [Cves])

  const getColor = (severity: string) => {
    switch (severity) {
      case "Critical": return COLOR_PALLET.error;
      case 'High': return COLOR_PALLET.warning;
      case 'Medium': return COLOR_PALLET.primary;
      case 'Low': return COLOR_PALLET.secondary;
      case 'Negligible': return COLOR_PALLET.info;
    }
  }

  const calcsum = Cves?.reduce((accumulator, currentValue) => {
    return accumulator + currentValue.Count;
  }, 0);

  return (
    <div style={{ width: "100%", height: '10px', display: "flex", marginRight: "5px" }}>
      {cveArr.map((ele: CVE, index: number) => {
        const percent = (ele.Count / sum) * 100;
        const color = getColor(ele.Severity);
        let borderRadius = "0";
        if (index == 0) { borderRadius = "10px 0 0 10px" }
        if (index == cveArr?.length - 1) { borderRadius = "0 10px 10px 0" }
        if (cveArr?.length == 1) { borderRadius = "10px" }
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