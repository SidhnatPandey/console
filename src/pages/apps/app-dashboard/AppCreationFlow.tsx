import React, { useState } from "react";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import ProcessDetails from "./ProcessDetails";
import ProcessTile from "./ProcessTile";
import useSWR from "swr";
import { getFetcher } from "src/services/fetcherService";
import Skeleton from 'react-loading-skeleton';
import { Card, CardHeader, CardContent, Typography } from "@mui/material";
import { APP_API } from "src/@core/static/api.constant";
import { setApiBaseUrl } from "src/@core/services/interceptor";

interface AppCreationFlow {
  supplyChainData: {
    app_id: string;
    completed_at: string;
    id: string;
    run_name: string;
    started_at: string;
    status: string;
    steps: { status: string; step_name: string }[];
  };
  loading: boolean;
  timer: number;
  gitRepo: string | undefined;
  gitBranch: string | undefined;
  hanldeChildTrigger: any;
}

const AppCreationFlow: React.FC<AppCreationFlow> = ({ supplyChainData, loading, timer, gitRepo, gitBranch, hanldeChildTrigger }) => {
  const [selectedTile, setSelectedTile] = useState<string>("clone");

  const handleTileClick = (stage: string) => {
    localStorage.setItem('cStage', stage);
    setSelectedTile(stage);
  };

  let key = supplyChainData?.id ? APP_API.supplyChainSteps : undefined;
  key = key?.replace('{runId}', supplyChainData?.id);
  key = key?.replace('{stage}', selectedTile);
  setApiBaseUrl();
  const { data: supplyChainStepData } = useSWR(key, getFetcher);

  const handleDetailsTrigger = () => {
    hanldeChildTrigger();
  };

  const getSupplyChainStep = (step: string) => {
    handleTileClick(step);
  };

  const getSupplyChain = () => {
    return (supplyChainData ? <div className={`scroll-container`} style={{ minHeight: '200px' }}>
      {supplyChainData?.steps.map((process, index) => (
        <React.Fragment key={index}>
          <ProcessTile
            stage={process.step_name}
            status={process.status}
            onClick={() => {
              if (process.status.toLowerCase() !== "waiting") {
                getSupplyChainStep(process.step_name);
              }
            }}
            isSelected={selectedTile === process.step_name}
            loading={loading}
          />
          {index < supplyChainData.steps.length - 1 && (
            <ArrowRightAltIcon
              data-testid="ArrowRightAltIcon"
              sx={{ fontSize: "60px", color: "rgb(115, 83, 229)" }}
            />
          )}
        </React.Fragment>
      ))}
    </div> : <div
      style={{ fontSize: '20px', padding: "40px", margin: "0 auto", textAlign: 'center' }}>
      No Data Available
    </div>)
  };

  return (
    <div>
      <Card>
        {loading ? <Skeleton width={200} height={20} style={{ margin: "20px" }} /> : <CardHeader
          subheader={"RunId: " + (supplyChainData?.run_name)}
          sx={{ '& .MuiCardHeader-action': { m: 0, alignSelf: 'center' } }}
          action={
            <Typography variant='body2' data-testid="updated-time" sx={{ color: 'text.disabled' }}>
              Updated {(timer) / 1000} seconds ago
            </Typography>
          }
        />}

        <CardContent sx={{ display: "flex", flexDirection: { xs: "column", md: "row" } }} style={{ paddingBottom: '0px' }}>
          {loading ? <div className={`scroll-container`}>
            <Skeleton width={120} height={120} style={{ margin: '5px', marginRight: '80px', borderRadius: '30px' }} count={6} inline /></div> : getSupplyChain()}
        </CardContent>
      </Card>
      <br></br>
      {(loading || (!loading && supplyChainData)) && <ProcessDetails handleTrigger={handleDetailsTrigger} supplyChainStepData={supplyChainStepData?.data} gitRepo={gitRepo} gitBranch={gitBranch} loading={loading} />}
    </div>
  );
};

export default AppCreationFlow;
