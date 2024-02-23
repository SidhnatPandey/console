






import React, { useState, useEffect } from 'react';
import ReactApexcharts from 'src/@core/components/react-apexcharts';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CustomDropdown from "src/component/customDropdown";
import { ApexOptions } from 'apexcharts';
import { Box } from '@mui/system';

import { getItemFromLocalstorage } from 'src/services/locastorageService';
import { settings } from 'nprogress';
interface DataEntry {
  ApplicationId: string;
  WorkspaceID: string;
  TotalCriticalCVEs: number;
  TotalHighCVEs: number;
  TotalMediumCVEs: number;
  TotalLowCVEs: number;
  TotalUnknownCVEs: number;
  RunID: string;
  LastScanned: string;
}

const ApexChart: React.FC = () => {
  const [series, setSeries] = useState<any[]>([]);
  const [Time, setTime] = useState<string>('1 M');
  const [Subheading, setSubheading] = useState<string>('1 M');
 

  const val = (window.localStorage.getItem('accessToken'));
  console.log(val);
const setting = JSON.parse(getItemFromLocalstorage('settings')!);
  console.log(setting.mode);
  useEffect(() => {
    
   setOptions({
   ...options,
    tooltip: {
      ...options.tooltip,
     
      theme:setting.mode,
     
      x: {
        format: 'dd MMM yyyy'
      },
     
    },
   
   })
      
  }, [setting.mode]);


  // console.log(theme);
//  console.log(theme);

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
          colors:'#546E7A' // Set the color of X-axis labels to white in dark mode
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
   
     
      theme:setting.mode,
     
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
          colors: '#566E7A', // Set the color of Y-axis labels to white in dark mode
      
      }, 
    }
  });

  const data1: DataEntry[] = [
    {
      "ApplicationId": "65c0d3ec3c2b2063f127550a",
      "WorkspaceID": "65c0d345e7fac7d93371c220",
      "TotalCriticalCVEs": 1,
      "TotalHighCVEs": 11,
      "TotalMediumCVEs": 21,
      "TotalLowCVEs": 0,
      "TotalUnknownCVEs": 5,
      "RunID": "65c0d3fff7ddfef09d47f11e",
      "LastScanned": "2024-02-05T18:00:10.88951+05:30"
    },
    {
      "ApplicationId": "65c0d3ec3c2b2063f127550a",
      "WorkspaceID": "65c0d345e7fac7d93371c220",
      "TotalCriticalCVEs": 1,
      "TotalHighCVEs": 11,
      "TotalMediumCVEs": 21,
      "TotalLowCVEs": 0,
      "TotalUnknownCVEs": 5,
      "RunID": "65c12621f7ddfef09d49e8e5",
      "LastScanned": "2024-02-05T23:52:28.882759+05:30"
    },
    {
      "ApplicationId": "65c0d3ec3c2b2063f127550a",
      "WorkspaceID": "65c0d345e7fac7d93371c220",
      "TotalCriticalCVEs": 1,
      "TotalHighCVEs": 11,
      "TotalMediumCVEs": 21,
      "TotalLowCVEs": 0,
      "TotalUnknownCVEs": 5,
      "RunID": "65c12621f7ddfef09d49e8e5",
      "LastScanned": "2024-02-05T23:52:47.868597+05:30"
    },
    {
      "ApplicationId": "65c0d3ec3c2b2063f127550a",
      "WorkspaceID": "65c0d345e7fac7d93371c220",
      "TotalCriticalCVEs": 1,
      "TotalHighCVEs": 11,
      "TotalMediumCVEs": 15,
      "TotalLowCVEs": 0,
      "TotalUnknownCVEs": 3,
      "RunID": "65c203cff7ddfef09d4eac6e",
      "LastScanned": "2024-02-06T15:35:45.690291+05:30"
    },
    {
      "ApplicationId": "65c0d3ec3c2b2063f127550a",
      "WorkspaceID": "65c0d345e7fac7d93371c220",
      "TotalCriticalCVEs": 1,
      "TotalHighCVEs": 11,
      "TotalMediumCVEs": 15,
      "TotalLowCVEs": 0,
      "TotalUnknownCVEs": 3,
      "RunID": "65c206a9f7ddfef09d4ec046",
      "LastScanned": "2024-02-06T15:47:20.082336+05:30"
    },
    {
      "ApplicationId": "65c0d3ec3c2b2063f127550a",
      "WorkspaceID": "65c0d345e7fac7d93371c220",
      "TotalCriticalCVEs": 1,
      "TotalHighCVEs": 11,
      "TotalMediumCVEs": 15,
      "TotalLowCVEs": 0,
      "TotalUnknownCVEs": 3,
      "RunID": "65c20752f7ddfef09d4ec547",
      "LastScanned": "2024-02-06T15:51:25.028899+05:30"
    },
    {
      "ApplicationId": "65c0d3ec3c2b2063f127550a",
      "WorkspaceID": "65c0d345e7fac7d93371c220",
      "TotalCriticalCVEs": 1,
      "TotalHighCVEs": 11,
      "TotalMediumCVEs": 15,
      "TotalLowCVEs": 0,
      "TotalUnknownCVEs": 3,
      "RunID": "65c21000f7ddfef09d4f0219",
      "LastScanned": "2024-02-06T16:26:33.61024+05:30"
    },
    {
      "ApplicationId": "65c0d3ec3c2b2063f127550a",
      "WorkspaceID": "65c0d345e7fac7d93371c220",
      "TotalCriticalCVEs": 1,
      "TotalHighCVEs": 11,
      "TotalMediumCVEs": 22,
      "TotalLowCVEs": 0,
      "TotalUnknownCVEs": 3,
      "RunID": "65c27882f7ddfef09d51e900",
      "LastScanned": "2024-02-06T23:53:18.752899+05:30"
    },
    {
      "ApplicationId": "65c0d3ec3c2b2063f127550a",
      "WorkspaceID": "65c0d345e7fac7d93371c220",
      "TotalCriticalCVEs": 2,
      "TotalHighCVEs": 11,
      "TotalMediumCVEs": 22,
      "TotalLowCVEs": 0,
      "TotalUnknownCVEs": 3,
      "RunID": "65c3226df7ddfef09d5610aa",
      "LastScanned": "2024-02-07T11:57:14.541881+05:30"
    },
    {
      "ApplicationId": "65c0d3ec3c2b2063f127550a",
      "WorkspaceID": "65c0d345e7fac7d93371c220",
      "TotalCriticalCVEs": 2,
      "TotalHighCVEs": 11,
      "TotalMediumCVEs": 22,
      "TotalLowCVEs": 0,
      "TotalUnknownCVEs": 3,
      "RunID": "65c3226df7ddfef09d5610aa",
      "LastScanned": "2024-02-07T12:01:10.477468+05:30"
    },
    {
      "ApplicationId": "65c0d3ec3c2b2063f127550a",
      "WorkspaceID": "65c0d345e7fac7d93371c220",
      "TotalCriticalCVEs": 2,
      "TotalHighCVEs": 11,
      "TotalMediumCVEs": 22,
      "TotalLowCVEs": 0,
      "TotalUnknownCVEs": 3,
      "RunID": "65c32485f7ddfef09d5623a1",
      "LastScanned": "2024-02-07T12:08:19.708281+05:30"
    },
    {
      "ApplicationId": "65c0d3ec3c2b2063f127550a",
      "WorkspaceID": "65c0d345e7fac7d93371c220",
      "TotalCriticalCVEs": 2,
      "TotalHighCVEs": 11,
      "TotalMediumCVEs": 22,
      "TotalLowCVEs": 0,
      "TotalUnknownCVEs": 3,
      "RunID": "65c32b02f7ddfef09d565288",
      "LastScanned": "2024-02-07T12:34:58.585608+05:30"
    },
    {
      "ApplicationId": "65c0d3ec3c2b2063f127550a",
      "WorkspaceID": "65c0d345e7fac7d93371c220",
      "TotalCriticalCVEs": 2,
      "TotalHighCVEs": 11,
      "TotalMediumCVEs": 22,
      "TotalLowCVEs": 0,
      "TotalUnknownCVEs": 3,
      "RunID": "65c32feef7ddfef09d567362",
      "LastScanned": "2024-02-07T12:56:09.209378+05:30"
    },
    {
      "ApplicationId": "65c0d3ec3c2b2063f127550a",
      "WorkspaceID": "65c0d345e7fac7d93371c220",
      "TotalCriticalCVEs": 2,
      "TotalHighCVEs": 11,
      "TotalMediumCVEs": 22,
      "TotalLowCVEs": 0,
      "TotalUnknownCVEs": 3,
      "RunID": "65c35562f7ddfef09d577b81",
      "LastScanned": "2024-02-07T15:35:00.975053+05:30"
    },
    {
      "ApplicationId": "65c0d3ec3c2b2063f127550a",
      "WorkspaceID": "65c0d345e7fac7d93371c220",
      "TotalCriticalCVEs": 2,
      "TotalHighCVEs": 11,
      "TotalMediumCVEs": 22,
      "TotalLowCVEs": 0,
      "TotalUnknownCVEs": 3,
      "RunID": "65c36681f7ddfef09d57f0d9",
      "LastScanned": "2024-02-07T16:48:14.984505+05:30"
    },
    {
      "ApplicationId": "65c0d3ec3c2b2063f127550a",
      "WorkspaceID": "65c0d345e7fac7d93371c220",
      "TotalCriticalCVEs": 2,
      "TotalHighCVEs": 11,
      "TotalMediumCVEs": 22,
      "TotalLowCVEs": 0,
      "TotalUnknownCVEs": 3,
      "RunID": "65c466fef7ddfef09d5e0028",
      "LastScanned": "2024-02-08T11:03:56.788448+05:30"
    },
    {
      "ApplicationId": "65c0d3ec3c2b2063f127550a",
      "WorkspaceID": "65c0d345e7fac7d93371c220",
      "TotalCriticalCVEs": 2,
      "TotalHighCVEs": 11,
      "TotalMediumCVEs": 22,
      "TotalLowCVEs": 0,
      "TotalUnknownCVEs": 3,
      "RunID": "65c4a524f7ddfef09d5f88be",
      "LastScanned": "2024-02-08T15:28:42.764298+05:30"
    },
    {
      "ApplicationId": "65c0d3ec3c2b2063f127550a",
      "WorkspaceID": "65c0d345e7fac7d93371c220",
      "TotalCriticalCVEs": 2,
      "TotalHighCVEs": 11,
      "TotalMediumCVEs": 22,
      "TotalLowCVEs": 0,
      "TotalUnknownCVEs": 3,
      "RunID": "65c4acabf7ddfef09d5fbc8f",
      "LastScanned": "2024-02-08T16:00:25.710423+05:30"
    },
    {
      "ApplicationId": "65c0d3ec3c2b2063f127550a",
      "WorkspaceID": "65c0d345e7fac7d93371c220",
      "TotalCriticalCVEs": 2,
      "TotalHighCVEs": 11,
      "TotalMediumCVEs": 22,
      "TotalLowCVEs": 0,
      "TotalUnknownCVEs": 3,
      "RunID": "65c52834f7ddfef09d62f8a3",
      "LastScanned": "2024-02-09T00:46:58.54745+05:30"
    },
    {
      "ApplicationId": "65c0d3ec3c2b2063f127550a",
      "WorkspaceID": "65c0d345e7fac7d93371c220",
      "TotalCriticalCVEs": 3,
      "TotalHighCVEs": 9,
      "TotalMediumCVEs": 20,
      "TotalLowCVEs": 0,
      "TotalUnknownCVEs": 3,
      "RunID": "65c9aa03f7ddfef09d7c9e12",
      "LastScanned": "2024-02-12T10:51:17.782674+05:30"
    },
    {
      "ApplicationId": "65c0d3ec3c2b2063f127550a",
      "WorkspaceID": "65c0d345e7fac7d93371c220",
      "TotalCriticalCVEs": 3,
      "TotalHighCVEs": 9,
      "TotalMediumCVEs": 20,
      "TotalLowCVEs": 0,
      "TotalUnknownCVEs": 3,
      "RunID": "65c9e4c6f7ddfef09d7e04eb",
      "LastScanned": "2024-02-12T15:01:19.686707+05:30"
    },
    {
      "ApplicationId": "65c0d3ec3c2b2063f127550a",
      "WorkspaceID": "65c0d345e7fac7d93371c220",
      "TotalCriticalCVEs": 3,
      "TotalHighCVEs": 9,
      "TotalMediumCVEs": 20,
      "TotalLowCVEs": 0,
      "TotalUnknownCVEs": 3,
      "RunID": "65c9e8b8f7ddfef09d7e1e50",
      "LastScanned": "2024-02-12T15:17:53.738359+05:30"
    },
    {
      "ApplicationId": "65c0d3ec3c2b2063f127550a",
      "WorkspaceID": "65c0d345e7fac7d93371c220",
      "TotalCriticalCVEs": 3,
      "TotalHighCVEs": 9,
      "TotalMediumCVEs": 20,
      "TotalLowCVEs": 0,
      "TotalUnknownCVEs": 3,
      "RunID": "65cb3567f7ddfef09d85dedd",
      "LastScanned": "2024-02-13T14:58:02.168817+05:30"
    },
    {
      "ApplicationId": "65c0d3ec3c2b2063f127550a",
      "WorkspaceID": "65c0d345e7fac7d93371c220",
      "TotalCriticalCVEs": 3,
      "TotalHighCVEs": 9,
      "TotalMediumCVEs": 20,
      "TotalLowCVEs": 0,
      "TotalUnknownCVEs": 3,
      "RunID": "65cb5fd4f7ddfef09d86e97d",
      "LastScanned": "2024-02-13T17:58:42.827891+05:30"
    },
    {
      "ApplicationId": "65c0d3ec3c2b2063f127550a",
      "WorkspaceID": "65c0d345e7fac7d93371c220",
      "TotalCriticalCVEs": 3,
      "TotalHighCVEs": 9,
      "TotalMediumCVEs": 20,
      "TotalLowCVEs": 0,
      "TotalUnknownCVEs": 3,
      "RunID": "65ca04abf7ddfef09d7ec7fb",
      "LastScanned": "2024-02-12T17:16:41.019782+05:30"
    },
    {
      "ApplicationId": "65c0d3ec3c2b2063f127550a",
      "WorkspaceID": "65c0d345e7fac7d93371c220",
      "TotalCriticalCVEs": 3,
      "TotalHighCVEs": 9,
      "TotalMediumCVEs": 20,
      "TotalLowCVEs": 0,
      "TotalUnknownCVEs": 3,
      "RunID": "65cb1191f7ddfef09d84f1d2",
      "LastScanned": "2024-02-13T13:15:35.273016+05:30"
    }
    //Your data here
  ];

  useEffect(() => {
    const TotalCriticalCVEsArray: [number, number][] = [];
    const TotalHighCVEsArray: [number, number][] = [];
    const TotalMediumCVEsArray: [number, number][] = [];
    const TotalLowCVEsArray: [number, number][] = [];
    const TotalUnknownCVEsArray: [number, number][] = [];

    data1.forEach(entry => {
      const lastScannedTimestamp = new Date(entry.LastScanned).getTime();
      TotalCriticalCVEsArray.push([lastScannedTimestamp, entry.TotalCriticalCVEs]);
      TotalHighCVEsArray.push([lastScannedTimestamp, entry.TotalHighCVEs]);
      TotalMediumCVEsArray.push([lastScannedTimestamp, entry.TotalMediumCVEs]);
      TotalLowCVEsArray.push([lastScannedTimestamp, entry.TotalLowCVEs]);
      TotalUnknownCVEsArray.push([lastScannedTimestamp, entry.TotalUnknownCVEs]);
    });

    setSeries([
      { name: 'Critical', data: TotalCriticalCVEsArray },
      { name: 'High', data: TotalHighCVEsArray },
      { name: 'Medium', data: TotalMediumCVEsArray },
      { name: 'Low', data: TotalLowCVEsArray },
      { name: 'Unknown', data: TotalUnknownCVEsArray }
    ]);
  }, []);

  const today = new Date();
  const endDate = today.getTime();
  let startDate: number;

  const updateData = (timeline: string) => {
    setTime(timeline);

    switch (timeline) {
      case '1 M':
        startDate = new Date(today.getFullYear(), today.getMonth() -1, today.getDate()).getTime();
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
        const twentyFourHoursAgo = new Date(today.getTime() - 24 * 60 * 60 * 1000); // 24 hours ago
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
              options={['1 D','1 W','1 M', '6 M', '1 Y']}
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









