import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import ApexCharts from 'apexcharts';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';

import { ApexOptions } from 'apexcharts'
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
    const TotalCriticalCVEsArray: [number, number][] = [];
    const TotalHighCVEsArray: [number, number][] = [];
    const TotalMediumCVEsArray: [number, number][] = [];
    const TotalLowCVEsArray: [number, number][] = [];
    const TotalUnknownCVEsArray: [number, number][] = [];
    
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
        // Your data here
    ];

    const dataWithTimestamp = data1.map(entry => {
        const lastScannedTimestamp = new Date(entry.LastScanned).getTime();
        return { ...entry, LastScannedTimestamp: lastScannedTimestamp };
    });
    
    console.log(dataWithTimestamp);
    
    // Iterate over the data array and extract values into respective arrays
    dataWithTimestamp.forEach(item => {
      TotalCriticalCVEsArray.push([  item.LastScannedTimestamp,item.TotalCriticalCVEs]);
      TotalHighCVEsArray.push([ item.LastScannedTimestamp,item.TotalHighCVEs]);
      TotalMediumCVEsArray.push([ item.LastScannedTimestamp,item.TotalMediumCVEs]);
      TotalLowCVEsArray.push([ item.LastScannedTimestamp,item.TotalLowCVEs ]);
      TotalUnknownCVEsArray.push([  item.LastScannedTimestamp,item.TotalUnknownCVEs]);
    });

    const [series, setSeries] = useState([
        {
          name: 'Critical',
          data: TotalCriticalCVEsArray
        },
        {
          name: 'High',
          data: TotalHighCVEsArray
        },
        {
          name: 'Medium',
          data: TotalMediumCVEsArray
        },
        {
          name: 'Low',
          data: TotalLowCVEsArray
        },
        {
          name: 'Unknown',
          data: TotalUnknownCVEsArray
        }
      ]);
  
    const [options] = useState<ApexOptions>( {
        chart: {
          id: 'area-datetime',
          type: 'area',
          height: 350,
          zoom: {
            autoScaleYaxis: true
          },
          toolbar: {
            show: false
          }
        },
        dataLabels: {
          enabled: false
        },
        markers: {
          size: 0,
        //   style: 'hollow',
        },
        xaxis: {
          type: 'datetime',
          min: new Date('01 Mar 2024').getTime(),
          tickAmount: 6,
        },
        tooltip: {
          x: {
            format: 'dd MMM yyyy'
          }
        },
        fill: {
          type: 'gradient',
          gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.1,
            opacityTo: 0.2,
            stops: [0, 100]
          }
        },
        grid: {
          show: true,
          borderColor: "#f0f0f0", // Change the border color of the grid if needed
          strokeDashArray: 4, // Adjust the dash array for the grid lines if needed
          position: "back", // Specify the position of the grid relative to other elements
          xaxis: {
            lines: {
              show: true, // Show or hide grid lines along the x-axis
            },
          },
          yaxis: {
            lines: {
              show: true, // Show or hide grid lines along the y-axis
            },
          },
        },
        stroke: {
            width: 3 // Adjust the width here to decrease or increase line thickness
          },
        colors: ['#ff0000', '#ffa500', '#B39DDB', '#a9a9a9', '#00bfff']
    });

    const [selection, setSelection] = useState('one_year');

    const updateData = (timeline: string) => {
        setSelection(timeline);
        switch (timeline) {
          case 'one_month':
            ApexCharts.exec(
              'area-datetime',
              'zoomX',
              new Date('28 Jan 2024').getTime(),
              new Date('27 Feb 2024').getTime()
            )
            break;
          case 'six_months':
            ApexCharts.exec(
              'area-datetime',
              'zoomX',
              new Date('27 Sep 2023').getTime(),
              new Date('27 Feb 2024').getTime()
            )
            break;
          case 'one_year':
            ApexCharts.exec(
              'area-datetime',
              'zoomX',
              new Date('27 Feb 2023').getTime(),
              new Date('27 Feb 2024').getTime()
            )
            break;
          case 'ytd':
            ApexCharts.exec(
              'area-datetime',
              'zoomX',
              new Date('01 Jan 2024').getTime(),
              new Date('27 Feb 2024').getTime()
            )
            break;
          case 'all':
            ApexCharts.exec(
              'area-datetime',
              'zoomX',
              new Date('23 Jan 2023').getTime(),
              new Date('27 Feb 2024').getTime()
            )
            break;
          default:
        }
    };

    useEffect(() => {
        ApexCharts.exec(
            'area-datetime',
            'zoomX',
            new Date('28 Jan 2024').getTime(),
            new Date('27 Feb 2024').getTime()
          );
    }, []);

    return (
        <div>
            <div id="chart">
            <div id="chart-timeline">
          <Card sx={{ marginTop: "20px" }} data-testid="cve-chart-container">
            <CardHeader title="CVE Trend"  />
            <div className="toolbar">
          <button
            id="one_month"
            onClick={() => updateData("one_month")}
            className={selection === "one_month" ? "active" : ""}
          >
            1M
          </button>
          <button
            id="six_months"
            onClick={() => updateData("six_months")}
            className={selection === "six_months" ? "active" : ""}
          >
            6M
          </button>
          <button
            id="one_year"
            onClick={() => updateData("one_year")}
            className={selection === "one_year" ? "active" : ""}
          >
            1Y
          </button>
          <button
            id="ytd"
            onClick={() => updateData("ytd")}
            className={selection === "ytd" ? "active" : ""}
          >
            YTD
          </button>
          <button
            id="all"
            onClick={() => updateData("all")}
            className={selection === "all" ? "active" : ""}
          >
            ALL
          </button>
        </div>

            <CardContent>
              <ReactApexChart
                options={options}
                series={series}
                type="area"
                height={350}
              />
            </CardContent>
          </Card>
        </div>
            </div>
            <div id="html-dist"></div>
        </div>
    );
};

export default ApexChart;
