// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Third Party Imports
import { Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { useEffect, useState } from 'react'
import { getAllvulnerabilities } from 'src/services/securityService'

interface LabelProp {
  cx: number
  cy: number
  percent: number
  midAngle: number
  innerRadius: number
  outerRadius: number
}

const ColorMapping = {
  Critical: 'red',
  High: 'orange',
  Medium: '#7353E5',
  Low: '#D3D3D3',
  Unknown: 'yellow'
}

interface CVE {
  Count: number;
  Severity: string;
}

interface Vulnerability {
  name: string;
  value: number;
  color: string
}

const RADIAN = Math.PI / 180

const SecurityVulnerabilities = () => {

  const [vulnerabilities, setVulnerabilities] = useState<Vulnerability[]>([]);
  const [totalVulnerabilities, setTotalVulnerabilities] = useState<number>(0);

  const renderCustomizedLabel = (props: LabelProp) => {
    // ** Props
    const { cx, cy, midAngle, innerRadius, outerRadius, percent } = props

    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)
    /* const value = Math.ceil((totalVulnerabilities * percent));
    (${value}/${totalVulnerabilities}) */
    return (
      <text x={x} y={y} fill='#fff' textAnchor='middle' dominantBaseline='central'>
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    )
  }

  const getVulnerabilities = () => {
    getAllvulnerabilities().then((res) => {
      const totalV = res.data.reduce((total: number, cve: any) => total + cve.Count, 0);
      setTotalVulnerabilities(totalV);
      const newArr: Vulnerability[] = [];
      res.data.forEach((ele: CVE) => {
        const obj: Vulnerability = {
          name: ele.Severity,
          value: ele.Count,
          color: getColor(ele.Severity) || 'white'
        }
        newArr.push(obj);
      })
      setVulnerabilities(newArr);
    })
  };

  const getColor = (severity: string) => {
    switch (severity) {
      case "Critical": return ColorMapping.Critical;
      case 'High': return ColorMapping.High;
      case 'Medium': return ColorMapping.Medium;
      case 'Low': return ColorMapping.Low;
      case 'Unknown': return ColorMapping.Unknown;
    }
  }

  useEffect(() => {
    getVulnerabilities();
  }, [])

  return (
    <Card  sx={{ width: "38%" }} >
      <CardHeader
        title='Vulnerabilities'
        subheader='Analysis of Vulnerabilities in Apps'
        subheaderTypographyProps={{ sx: { color: theme => `${theme.palette.text.disabled} !important` } }}
      />
      <CardContent>
        <Box sx={{ height: 350 }}>
          <ResponsiveContainer>
            <PieChart height={350} style={{ direction: 'ltr' }}>
              <Pie data={vulnerabilities} innerRadius={80} dataKey='value' label={renderCustomizedLabel} labelLine={false} startAngle={-150} >
                {vulnerabilities.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>

              <Tooltip />
              <foreignObject x="-2" y="45%" width="100%" height="100%" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '18px', color: 'black' }}>CVEs</div>
                <div style={{ fontSize: '15px', color: 'gray' }}> {totalVulnerabilities}</div>
              </foreignObject>
            </PieChart>
          </ResponsiveContainer>
        </Box>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', mb: 4, justifyContent: 'center' }}>
          <Box
            sx={{
              mr: 6,
              display: 'flex',
              alignItems: 'center',
              '& svg': { mr: 1.5, color: 'lightgrey' }
            }}
          >
            <Icon icon='mdi:circle' fontSize='0.75rem' />
            <Typography variant='body2'>Low</Typography>
          </Box>
          <Box
            sx={{
              mr: 6,
              display: 'flex',
              alignItems: 'center',
              '& svg': { mr: 1.5, color: 'rgb(115, 83, 229)' }
            }}
          >
            <Icon icon='mdi:circle' fontSize='0.75rem' />
            <Typography variant='body2'>Medium</Typography>
          </Box>
          <Box
            sx={{
              mr: 6,
              display: 'flex',
              alignItems: 'center',
              '& svg': { mr: 1.5, color: 'darkorange' }
            }}
          >
            <Icon icon='mdi:circle' fontSize='0.75rem' />
            <Typography variant='body2'>High</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', '& svg': { mr: 1.5, color: 'red' } }}>
            <Icon icon='mdi:circle' fontSize='0.75rem' />
            <Typography variant='body2'>Critical</Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}

export default SecurityVulnerabilities
