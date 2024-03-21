import React, { useState } from "react";
import { useRouter } from "next/router";
import { convertDateFormat } from "src/utils/dateUtil";
import DataTable, { Column } from "src/component/DataTable";
import { Box } from "@mui/system";
import { APP_API } from "src/@core/static/api.constant";
import { setApiBaseUrl } from "src/@core/services/interceptor";
import useSWR from "swr";
import { getFetcher } from "src/services/fetcherService";





interface AppListProps {
  selectedRow: number | null;
  setSelectedRow?: React.Dispatch<React.SetStateAction<number | null>>;
  workspace_id: string | undefined;
}

const Apps: React.FC<AppListProps> = ({ workspace_id }) => {

  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const key = APP_API.appList + '?workspace_id=' + workspace_id;
  setApiBaseUrl();
  const { data } = useSWR(key, getFetcher)

  const getStatusChipColor = (status: any) => {
    switch (status) {
      case "Deployed":
        return "success";
      case "inProgress":
        return "primary";
      case "Running":
        return "primary";
      case "Pending Approval":
        return "warning";
      case "Initializing":
        return "secondary";
      case "Initialized":
        return "info";
      case "Error":
        return "error";
      case "Failed":
        return "error";
      default:
        return "success";
    }
  };

  const getCurrentEnv = (stage: any) => {
    switch (stage) {
      case "deploy-test":
        return "Test";
      case "test-approval":
        return "Test";
      case "deploy-stg":
        return "Stg";
      case "prod-approval":
        return "Stg";
      case "deploy-prod":
        return "Prod";
      default:
        return "";
    }
  };

  const handleRowClick = ({ id }: any) => {
    router.push({
      pathname: "/workspace/app-dashboard",
      query: { appId: id },
    });

  };

  const columns: Column[] = [
    { id: "application_name", label: "Name", sortable: true },
    { id: "stage", label: "Current Env", sortable: true, strictFunction: getCurrentEnv },
    { id: "last_deployed", label: "Last Deployed", sortable: true, strictFunction: convertDateFormat },
    { id: "url", label: "Live App Url", sortable: false, normalLink: true, },
    { id: "status", label: "Status", sortable: false, showChip: true, strictFunction: getStatusChipColor },
  ];

  return (
    <Box>
      <DataTable
        columns={columns}
        data={data?.data}
        loading={loading}
        rowClickHandler={handleRowClick}
      />
    </Box>
  );
};

export default Apps;
