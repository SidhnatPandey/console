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

interface LabelProp {
  cx: number
  cy: number
  percent: number
  midAngle: number
  innerRadius: number
  outerRadius: number
}

const data = [
    { name: 'Critical', value: 28, color: 'red' },
  
  { name: 'High', value: 14, color: 'darkorange' },
  { name: 'Medium', value: 72, color: 'rgb(115, 83, 229)' },
  { name: 'Low', value: 36, color: 'lightgrey' }
 
]

const RADIAN = Math.PI / 180
const renderCustomizedLabel = (props: LabelProp) => {
  // ** Props
  const { cx, cy, midAngle, innerRadius, outerRadius, percent } = props

  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)

  return (
    <text x={x} y={y} fill='#fff' textAnchor='middle' dominantBaseline='central'>
      {`${(percent * 150).toFixed(0)}%`}
    </text>
  )
}

const SecurityVulnerabilities = () => {
  return (
    <Card sx={{ width: '30%',position: 'absolute', right: 25, top: 104 }}>
      <CardHeader
        title='Vulnerabilities'
        subheader='Analysis of Vulnerabilities in Apps'
        subheaderTypographyProps={{ sx: { color: theme => `${theme.palette.text.disabled} !important` } }}
      />
      <CardContent>
        <Box sx={{ height: 350 }}>
          <ResponsiveContainer>
            <PieChart height={350} style={{ direction: 'ltr' }}>
              <Pie data={data} innerRadius={80} dataKey='value' label={renderCustomizedLabel} labelLine={false} startAngle={-150} >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              
              <Tooltip />
              <foreignObject x="-2" y="45%" width="100%" height="100%" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '18px' ,color: 'black' }}>CVEs</div>
                <div style={{ fontSize: '15px', color: 'gray' }}> 150</div>
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
