import React, { useState, useEffect, useContext } from 'react';
import ReactApexcharts from 'src/@core/components/react-apexcharts';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CustomDropdown from "src/component/customDropdown";
import { ApexOptions } from 'apexcharts';
import { Box } from '@mui/system';
import { cveHistory } from 'src/services/securityService';
import { getItemFromLocalstorage } from 'src/services/locastorageService';
import { SecurityContext } from 'src/context/SecurityContext';

interface Props {
  appId: string;
}
interface Row {
  ApplicationId: string;
  WorkspaceID: string;
  TotalCriticalCVEs: number;
  TotalHighCVEs: number;
  TotalMediumCVEs: number;
  TotalLowCVEs: number;
  TotalNegligibleCVEs: number;
  TotalUnknownCVEs: number;
  RunID: string;
  LastScanned: string;
}
const ApexChart: React.FC<Props> = (props) => {
  const { appId } = props;
  const [series, setSeries] = useState<any[]>([]);
  const [Time, setTime] = useState<string>('1 M');
  const [Subheading, setSubheading] = useState<string>('1 M');
  const setting = JSON.parse(getItemFromLocalstorage('settings')!);
  useEffect(() => {
    setOptions({
      ...options,
      tooltip: {
        ...options.tooltip,
        theme: setting?.mode,
        x: {
          format: 'dd MMM yyyy'
        },
      },
    })
  }, [setting?.mode]);

  const workspaceId = (getItemFromLocalstorage('workspaceId')!);
  const securityContext = useContext(SecurityContext);
  const [cveData, setCveData] = useState<Row[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const getListOfCveHIstory = (appId: string, runtype: string, workspaceId: string) => {
    setLoading(true);
    cveHistory(appId, runtype, workspaceId).then((response) => {
      if (response) {
        setLoading(false);
        setCveData(response.data);
      }
    });
  };
  useEffect(() => {
    getListOfCveHIstory(appId, securityContext.runType, workspaceId);
  }, [securityContext.runType]);

  useEffect(() => {
    const TotalCriticalCVEsArray: [number, number][] = [];
    const TotalHighCVEsArray: [number, number][] = [];
    const TotalMediumCVEsArray: [number, number][] = [];
    const TotalLowCVEsArray: [number, number][] = [];
    const TotalUnknownCVEsArray: [number, number][] = [];
    cveData.forEach(entry => {
      const lastScannedTimestamp = new Date(entry.LastScanned).getTime();
      TotalCriticalCVEsArray.push([lastScannedTimestamp, entry.TotalCriticalCVEs]);
      TotalHighCVEsArray.push([lastScannedTimestamp, entry.TotalHighCVEs]);
      TotalMediumCVEsArray.push([lastScannedTimestamp, entry.TotalMediumCVEs]);
      TotalLowCVEsArray.push([lastScannedTimestamp, entry.TotalLowCVEs]);
      TotalUnknownCVEsArray.push([lastScannedTimestamp, entry.TotalUnknownCVEs + entry.TotalNegligibleCVEs]);
    });
    setSeries([
      { name: 'Critical', data: TotalCriticalCVEsArray },
      { name: 'High', data: TotalHighCVEsArray },
      { name: 'Medium', data: TotalMediumCVEsArray },
      { name: 'Low', data: TotalLowCVEsArray },
      { name: 'Negligible', data: TotalUnknownCVEsArray }
    ]);
  }, [cveData]);

  const [options, setOptions] = useState<ApexOptions>({
    chart: {
      background: 'transparent',
      id: 'area-datetime',
      type: 'area',
      height: 300,
      zoom: {
        autoScaleYaxis: true
      },
      toolbar: {
        show: false
      }
    },
    dataLabels: {
      enabled: false,
    },
    markers: {
      size: 0,
    },
    xaxis: {
      type: 'datetime',
      tickAmount: 6,
      labels: {
        style: {
          colors: '#546E7A' // Set the color of X-axis labels to white in dark mode
        },
        datetimeUTC: true,
        datetimeFormatter: {
          year: 'dd  MMM',
          month: " dd MMM",
          day: 'dd MMM',
          hour: 'HH:mm dd MMM',
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: '#546E7A', // Set the color of Y-axis labels to white in dark mode
        },
      },
    },
    tooltip: {
      theme: setting?.mode,
      x: {
        format: 'dd MMM yyyy'
      },
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.0,
        opacityTo: 0.0,
        stops: [0, 100]
      }
    },
    grid: {
      show: true,
      borderColor: "lightgrey",
      strokeDashArray: 4,
      position: "back",
      xaxis: {
        lines: {
          show: true
        }
      },
      yaxis: {
        lines: {
          show: true
        }
      }
    },
    stroke: {
      width: 3
    },
    colors: ['#ff0000', '#ffa500', '#B39DDB', '#a9a9a9', '#00bfff'],
    legend: {
      position: 'bottom',
      horizontalAlign: 'center',
      markers: {
        radius: 15,
      },
      labels: {
        colors: '#566E7A',
      },
    }
  });

  const today = new Date();
  const endDate = today.getTime();
  let startDate: number;
  let twentyFourHoursAgo: Date;

  const updateData = (timeline: string) => {
    setTime(timeline);
    switch (timeline) {
      case '1 M':
        startDate = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate()).getTime();
        setSubheading('this month');
        break;
      case '6 M':
        startDate = new Date(today.getFullYear(), today.getMonth() - 6, today.getDate()).getTime();
        setSubheading('six-months');
        break;
      case '1 Y':
        startDate = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate()).getTime();
        setSubheading('one year');
        break;
      case '1 D':
        twentyFourHoursAgo = new Date(today.getTime() - 24 * 60 * 60 * 1000); // 24 hours ago
        startDate = twentyFourHoursAgo.getTime();
        setSubheading('one day');
        break;
      case '1 W':
        startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7).getTime();
        setSubheading('one week');
        break;
      default:
        return;
    }

    setOptions({
      ...options,
      xaxis: {
        ...options.xaxis,
        min: startDate,
        max: endDate

      }
    });
  };

  useEffect(() => {
    updateData('1 M');
  }, []);

  return (

    <div>
      <div id="chart">
        <Card sx={{ marginTop: "20px" }} >
          <Box sx={{ minWidth: 120, float: 'right', marginTop: '20px', marginRight: '20px' }}>
            <CustomDropdown
              options={['1 D', '1 W', '1 M', '6 M', '1 Y']}
              value={Time}
              onChange={updateData}
              label="Select Time Period"
            />
          </Box>
          <CardHeader title="CVE Trend" subheader={Subheading} />
          <CardContent>
            <ReactApexcharts
              options={options}
              series={series}
              type="area"
              height={350}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ApexChart;









