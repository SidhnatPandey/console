import React, { useEffect, useState } from "react";
import { Card, Typography } from "@mui/material";
import PendingIcon from "@mui/icons-material/Pending";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import ProcessDetails from "./ProcessDetails";
// ** Custom Components Imports
import CustomAvatar from "src/@core/components/mui/avatar";
import Icon from "src/@core/components/icon";
import { supplyChainSteps } from "src/services/dashboardService";
import { Container } from "@mui/system";
import LoopIcon from "@mui/icons-material/Loop";
import Tooltip from "@mui/material/Tooltip";
import Skeleton from 'react-loading-skeleton';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

interface ProcessTileProps {
  stage: string;
  status: string;
  onClick: () => void;
  isSelected: boolean;
  loading: boolean
}

const ProcessTile: React.FC<ProcessTileProps> = ({
  stage,
  status,
  onClick,
  isSelected,
  loading
}) => {
  // Rotate the card by 45 degrees for the "Approval" process and set a purple background
  const cardStyle: React.CSSProperties = {
    minWidth: "120px",
    height: "120px",
    margin: "0 20px",
    borderRadius: "30px",
    textAlign: "center",
    padding: "30px 10px 10px 10px",
    border: isSelected
      ? "2px solid rgb(115, 83, 229)"
      : "2px solid transparent",
    cursor: "pointer",
    transform: stage === "Approval" ? "rotate(-45deg)" : "none",
    backgroundColor: stage === "Approval" ? "rgb(115, 83, 229)" : "transparent",
    boxShadow: "15",
  };

  // Rotate the content inside the "Approval" process by 45 degrees
  const contentStyle: React.CSSProperties = {
    transform: stage === "Approval" ? "rotate(45deg)" : "none",
  };

  const dotStyle: React.CSSProperties = {
    color: stage === "Approval" ? "white" : "primary", // Change the color to black for "Approval"
  };

  const textStyle: React.CSSProperties = {
    color: stage === "Approval" ? "white" : "inherit", // Change the text color to white for "Approval"
  };

  const getTileIcon = (status: string) => {
    const lstatus = status.toLowerCase();
    switch (lstatus) {
      case "succeeded":
        return (
          <CustomAvatar
            skin="light"
            color={"success"}
            sx={{ marginTop: -1, width: 42, height: 42 }}
            style={{ marginLeft: 25, marginBottom: 5 }}
          >
            <Icon icon={"ph:check-light"} />
          </CustomAvatar>
        );
      case "inprogress":
        return (
          <>
            <Container maxWidth="sm">
              <LoopIcon
                style={{ animation: "spin 4s linear infinite" }}
                color="primary"
                fontSize="large"
              />
              <style>{`
            @keyframes spin {
                 0% { transform: rotate(360deg); }
                 100% { transform: rotate(0deg); }
                  }`}</style>
            </Container>
          </>
        );
      case "waiting":
        return <PendingIcon fontSize="large" style={dotStyle} />;
      case "failed":
        return <ErrorOutlineIcon fontSize="large" style={{ color: "red" }} />;
      default:
        return <HelpOutlineIcon fontSize="large" style={{ color: "rgb(85, 85, 85)" }} />;
    }
  };

  return (
    <Tooltip title={`Status: ${status}`} arrow>
      <Card onClick={onClick} sx={cardStyle}>
        <div style={contentStyle}>
          {loading ? <Skeleton width={100} height={30} /> : getTileIcon(status)}
          <Typography variant="h6" className="mt-2" style={textStyle}>
            {loading ? <Skeleton width={100} height={20} /> : stage}
          </Typography>
        </div>
      </Card>
    </Tooltip>
  );
};

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
  gitBranch: string | undefined
}

const AppCreationFlow: React.FC<AppCreationFlow> = ({ supplyChainData, loading, timer, gitRepo, gitBranch }) => {
  const [selectedTile, setSelectedTile] = useState<string>(""); // Set the initial value to "Clone"
  const [supplyChainStepData, setSupplyChainStepData] = useState<any>(null); // State to hold the fetched data
  const [stepLoading, setStepLoading] = useState<boolean>(false); // State to hold the loading status
  const handleTileClick = (stage: string) => {
    setSelectedTile(stage === selectedTile ? '' : stage);
  };

  useEffect(() => {
    if (supplyChainData) {
      setStepLoading(true);
      getSupplyChainStep(
        supplyChainData.id,
        supplyChainData.steps[0].step_name
      );
    }
  }, [loading]);

  /* useEffect(() => {
    if (supplyChainData) {
      setStepLoading(true);
      getSupplyChainStep(
        supplyChainData.id,
        selectedTile
      );
    }
  }, [supplyChainData]); */

  const getSupplyChainStep = (id: string, step: string) => {
    setStepLoading(true);
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
      {(loading || (!loading && supplyChainData)) && <ProcessDetails supplyChainStepData={supplyChainStepData} gitRepo={gitRepo} gitBranch={gitBranch} loading={loading || stepLoading} />}
    </div>
  );
};

export default AppCreationFlow;
