import { useEffect, useState } from "react";
import { getAppLogs } from "src/services/dashboardService";
import ProcessLogs from "./ProcessLogs";

interface AppLogsProps {
    appName: string | undefined,
}

interface LogsData {
    run_name: string;
    log: string;
}

const AppLogs: React.FC<AppLogsProps> = ({ appName }) => {

    const [data, setData] = useState<LogsData[]>();

    useEffect(() => {
        if (appName) { getLogs(appName) }
    }, [appName])

    const getLogs = (app: string) => {
        getAppLogs(app).then((res) => {
            if (res) {
                setConvertedState(res)
            }
        })
    }

    const setConvertedState = (data: any) => {
        const convertedData: LogsData[] = [];
        convertedData.push({ run_name: 'prod', log: data.prod.log });
        convertedData.push({ run_name: 'stg', log: data.stg.log })
        convertedData.push({ run_name: 'test', log: data.test.log })
        setData(convertedData);
    }

    return (
        <ProcessLogs loading={false} steps={data} tabHeading="Environments" />
    )
}

export default AppLogs;