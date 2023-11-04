import React, { useEffect, useState } from "react";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import ProcessDetails from "./ProcessDetails";
import ProcessTile from "./ProcessTile"; // Import the ProcessTile component
import { supplyChainSteps } from "src/services/dashboardService";
import Skeleton from 'react-loading-skeleton';
import { Card, Typography } from "@mui/material";

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
  timer: number,
  gitRepo: string | undefined,
  gitBranch: string | undefined,
  hanldeChildTrigger: Function
}

const AppCreationFlow: React.FC<AppCreationFlow> = ({ supplyChainData, loading, timer, gitRepo, gitBranch, hanldeChildTrigger }) => {
  const [selectedTile, setSelectedTile] = useState<string>(""); // Set the initial value to "Clone"
  const [supplyChainStepData, setSupplyChainStepData] = useState<any>(null); // State to hold the fetched data
  const [stepLoading, setStepLoading] = useState<boolean>(false); // State to hold the loading status
  const handleTileClick = (stage: string) => {
    setSelectedTile(stage);
  };

  const handleDetailsTrigger = (stage: string) => {
    getSupplyChainStep(
      supplyChainData.id,
      stage
    );
    hanldeChildTrigger();
  }

  useEffect(() => {
    if (supplyChainData) {
      setStepLoading(true);
      getSupplyChainStep(
        supplyChainData.id,
        supplyChainData.steps[0].step_name
      );
    }
  }, [loading]);

  useEffect(() => {
    if (supplyChainData) {
      // setStepLoading(true);
      getSupplyChainStep(
        supplyChainData.id,
        selectedTile
      );
    }
  }, [supplyChainData]);

  const getSupplyChainStep = (id: string, step: string) => {
    //setStepLoading(true);
    handleTileClick(step);
    supplyChainSteps(id, step)
      .then((response: any) => {
        setSupplyChainStepData(response.data);
        setStepLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setStepLoading(false);
      });
  };

  const getSupplyChain = () => {
    return (supplyChainData ? <div className={`scroll-container`}>
      {supplyChainData?.steps.map((process, index) => (
        <React.Fragment key={index}>
          <ProcessTile
            stage={process.step_name}
            status={process.status}
            onClick={() => {
              if (process.status.toLowerCase() != "waiting") {
                getSupplyChainStep(supplyChainData.id, process.step_name);
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
    </div> : <div style={{ fontSize: '20px', padding: "40px", margin: "0 auto" }}>No Data</div>)
  }

  return (
    <div>
      <Card
        sx={{ display: "flex", flexDirection: { xs: "column", md: "row" } }}
      >
        {loading ? <div className={`scroll-container`}>
          <Skeleton width={120} height={120} style={{ margin: '5px', marginRight: '80px', borderRadius: '30px' }} count={6} inline /></div> : getSupplyChain()}
      </Card>
      <br></br>
      {(loading || (!loading && supplyChainData)) && <ProcessDetails handleTrigger={handleDetailsTrigger} supplyChainStepData={supplyChainStepData} gitRepo={gitRepo} gitBranch={gitBranch} loading={loading || stepLoading} />}
    </div>
  );
};

export default AppCreationFlow;
