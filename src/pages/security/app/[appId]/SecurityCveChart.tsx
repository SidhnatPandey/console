// ** MUI Imports
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import { useTheme } from '@mui/material/styles'

// ** Third Party Imports
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ChartData, ChartOptions } from 'chart.js';
import { useContext, useEffect, useState } from 'react';
import { CveHistory } from 'src/services/securityService';
import { SecurityContext } from 'src/context/SecurityContext';

// Registering required components for Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface APIData {
  MonthYear: string,
  TotalCriticalCVEs: number,
  TotalHighCVEs: number,
  TotalMediumCVEs: number,
  TotalLowCVEs: number,
  TotalUnknownCVEs: number
}

interface Props {
  appId: string
}

const SecurityCveChart = (props: Props) => {
  const { appId } = props;
  const [apiData, setApiData] = useState<APIData[]>([])
  const securityContext = useContext(SecurityContext)
  const theme = useTheme()

  //colors
  const borderColor = theme.palette.divider
  const labelColor = theme.palette.text.disabled
  const legendColor = theme.palette.text.secondary
  const white = '#fff'
  const ColorMapping = {
    Critical: 'red',
    High: 'orange',
    Medium: '#7353E5',
    Low: 'grey',
    Unknown: '#D3D3D3'
  }

  useEffect(() => {
    getCveHistory(appId, securityContext.runType, securityContext.workspace);
  }, [securityContext.workspace, securityContext.runType, appId])

  const getCveHistory = (appId: string, runType: string, workspaceId: string) => {
    CveHistory(appId, runType, workspaceId).then((res) => {
      if (res.data.length > 0) {
        setApiData(res.data);
      }
    });
  };


  // Function to generate month-year labels in the format 'MM/YY'
  const generateMonthYearLabels = (): string[] => {
    const labels: string[] = [];
    const currentDate = new Date();
    currentDate.setDate(1); // Set to the first day of the current month

    for (let i = 0; i < 12; i++) {
      // Get month as a number (1-12)
      const month = currentDate.getMonth() + 1;
      // Format month to ensure it is two digits
      const formattedMonth = month < 10 ? '0' + month.toString() : month.toString();
      // Get last two digits of the year
      const year = currentDate.getFullYear().toString().slice(-2);
      labels.push(`${formattedMonth}/${year}`);
      currentDate.setMonth(currentDate.getMonth() - 1);
    }

    return labels.reverse();
  };

  const months = generateMonthYearLabels();

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: 'category', // Change type to 'category' for month labels
        labels: months,
        ticks: { color: labelColor },
        grid: {
          display: true, // Ensuring grid lines are displayed
          color: borderColor
        }
      },
      y: {
        min: 0,
        //max: 100,
        ticks: {
          //stepSize: 25,
          color: labelColor
        },
        grid: {
          display: true,
          color: borderColor
        }
      }
    },
    plugins: {
      legend: {
        align: 'end',
        position: 'top',
        labels: {
          padding: 25,
          boxWidth: 10,
          color: legendColor,
          usePointStyle: true
        }
      }
    }
  };

  const defaultData: any = {
    Critical: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    High: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    Medium: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    Low: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    Unknown: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  }

  const data: ChartData<'line'> = {
    labels: months,
    datasets: [
      {
        fill: false,
        tension: 0.5,
        pointRadius: 1,
        label: 'Critical',
        pointHoverRadius: 5,
        pointStyle: 'circle',
        borderColor: ColorMapping.Critical,
        backgroundColor: ColorMapping.Critical,
        pointHoverBorderWidth: 5,
        pointHoverBorderColor: white,
        pointBorderColor: 'transparent',
        pointHoverBackgroundColor: ColorMapping.Critical,
        data: [80, 150, 180, 270, 210, 160, 160, 202, 265, 210, 270, 255]
      },
      {
        fill: false,
        tension: 0.5,
        label: 'High',
        pointRadius: 1,
        pointHoverRadius: 5,
        pointStyle: 'circle',
        borderColor: ColorMapping.High,
        backgroundColor: ColorMapping.High,
        pointHoverBorderWidth: 5,
        pointHoverBorderColor: white,
        pointBorderColor: 'transparent',
        pointHoverBackgroundColor: ColorMapping.High,
        data: [80, 125, 105, 130, 215, 195, 140, 160, 230, 300, 220, 170, 210, 200, 280]
      },
      {
        fill: false,
        tension: 0.5,
        pointRadius: 1,
        label: 'Medium',
        pointHoverRadius: 5,
        pointStyle: 'circle',
        borderColor: ColorMapping.Medium,
        backgroundColor: ColorMapping.Medium,
        pointHoverBorderWidth: 5,
        pointHoverBorderColor: white,
        pointBorderColor: 'transparent',
        pointHoverBackgroundColor: ColorMapping.Medium,
        data: [80, 99, 82, 90, 115, 115, 74, 75, 130, 155, 125, 90, 140, 130, 180]
      },
      {
        fill: false,
        tension: 0.5,
        label: 'Low',
        pointRadius: 1,
        pointHoverRadius: 5,
        pointStyle: 'circle',
        borderColor: ColorMapping.Low,
        backgroundColor: ColorMapping.Low,
        pointHoverBorderWidth: 5,
        pointHoverBorderColor: white,
        pointBorderColor: 'transparent',
        pointHoverBackgroundColor: ColorMapping.Low,
        data: [80, 125, 105, 130, 23, 195, 140, 160, 260, 300, 220, 370, 210, 20, 180]
      },
      {
        fill: false,
        tension: 0.5,
        pointRadius: 1,
        label: 'Unknown',
        pointHoverRadius: 5,
        pointStyle: 'circle',
        borderColor: ColorMapping.Unknown,
        backgroundColor: ColorMapping.Unknown,
        pointHoverBorderWidth: 5,
        pointHoverBorderColor: white,
        pointBorderColor: 'transparent',
        pointHoverBackgroundColor: ColorMapping.Unknown,
        data: [80, 79, 82, 90, 165, 125, 74, 75, 330, 155, 142, 90, 156, 130, 120]
      }
    ]
  };

  useEffect(() => {
    apiData.forEach((element: APIData) => {
      const index = months.indexOf(element.MonthYear);
      defaultData.Critical.splice(index, 0, element.TotalCriticalCVEs);
      defaultData.Medium.splice(index, 0, element.TotalMediumCVEs);
      defaultData.High.splice(index, 0, element.TotalHighCVEs);
      defaultData.Low.splice(index, 0, element.TotalLowCVEs);
      defaultData.Unknown.splice(index, 0, element.TotalUnknownCVEs);
    });
    updateChartData();
  }, [apiData])

  const updateChartData = () => {
    data.datasets.forEach((ele: any) => {
      switch (ele.label) {
        case 'Critical':
          ele.data = defaultData.Critical;
          break;
        case 'Medium':
          ele.data = defaultData.Medium;
          break;
        case 'High':
          ele.data = defaultData.High;
          break;
        case 'Low':
          ele.data = defaultData.Low;
          break;
        case 'Unknown':
          ele.data = defaultData.Unknown;
          break;
      }
    })
    console.log(data);
  }

  return (
    <Card sx={{ marginTop: "20px" }}>
      <CardHeader title='CVE Trend' subheader='Last 12 Months' />
      <CardContent>
        <Line redraw={true} data={data} height={400} options={options} />
      </CardContent>
    </Card>
  );
};

export default SecurityCveChart;