// ** MUI Imports
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';

// ** Third Party Imports
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ChartData, ChartOptions } from 'chart.js';

// Registering required components for Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface LineProps {
  white: string;
  warning: string;
  primary: string;
  success: string;
  labelColor: string;
  borderColor: string;
  legendColor: string;
}

const SecurityCveChart = (props: LineProps) => {
    // ** Props
    const { white, primary, success, warning, labelColor, borderColor, legendColor } = props;
  
  // Function to generate month-year labels in the format 'MM/YY'
const generateMonthYearLabels = (): string[] => {
    let labels: string[] = [];
    let currentDate = new Date();
    currentDate.setDate(1); // Set to the first day of the current month
  
    for (let i = 0; i < 12; i++) {
      // Get month as a number (1-12)
      let month = currentDate.getMonth() + 1;
      // Format month to ensure it is two digits
      let formattedMonth = month < 10 ? '0' + month.toString() : month.toString();
      // Get last two digits of the year
      let year = currentDate.getFullYear().toString().slice(-2);
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
          max: 400,
          ticks: {
            stepSize: 100,
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
  
    const data: ChartData<'line'> = {
      labels: months, 
      datasets: [
      ]
    };
  
    return (
      <Card sx={{ marginTop: "20px" }}>
        <CardHeader title='CVE Trend' subheader='Last 12 Months' />
        <CardContent>
          <Line data={data} height={400} options={options} />
        </CardContent>
      </Card>
    );
  };
  
  export default SecurityCveChart;