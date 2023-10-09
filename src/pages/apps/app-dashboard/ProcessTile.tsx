import React, { useState } from "react";
import { Card, Typography } from "@mui/material";
import PendingIcon from "@mui/icons-material/Pending";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import ProcessDetails from "./ProcessDetails";
// ** Custom Components Imports
import CustomAvatar from "src/@core/components/mui/avatar";
import Icon from "src/@core/components/icon";
import ProcessLogs from "./ProcessLogs";
import { Container } from "@mui/system";
import LoopIcon from '@mui/icons-material/Loop';

interface ProcessTileProps {
  title: string;
  status: string;
  onClick: () => void;
  isSelected: boolean;
}

const ProcessTile: React.FC<ProcessTileProps> = ({
  title,
  status,
  onClick,
  isSelected,
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
    transform: title === "Approval" ? "rotate(-45deg)" : "none",
    backgroundColor: title === "Approval" ? "rgb(115, 83, 229)" : "transparent",
    boxShadow: '15'
  };

  // Rotate the content inside the "Approval" process by 45 degrees
  const contentStyle: React.CSSProperties = {
    transform: title === "Approval" ? "rotate(45deg)" : "none",
  };

  const dotStyle: React.CSSProperties = {
    color: title === "Approval" ? "white" : "primary", // Change the color to black for "Approval"
  };

  const textStyle: React.CSSProperties = {
    color: title === "Approval" ? "white" : "inherit", // Change the text color to white for "Approval"
  };

  const getTileIcon = (status: string) => {
    switch (status) {
      case 'Succeeded':
        return <CustomAvatar
          skin="light"
          color={"success"}
          sx={{ marginTop: -1, width: 42, height: 42 }}
          style={{ marginLeft: 25, marginBottom: 5 }}
        >
          <Icon icon={"ph:check-light"} />
        </CustomAvatar>;
      case 'Running':
        return <><Container maxWidth="sm">
          <LoopIcon style={{ animation: "spin 4s linear infinite" }} color="primary" fontSize="large" />
          <style>{`
            @keyframes spin {
                 0% { transform: rotate(360deg); }
                 100% { transform: rotate(0deg); }
                  }`}</style>
        </Container></>
      case 'waiting':
        return <PendingIcon fontSize="large" style={dotStyle} />
      default:
        return <PendingIcon fontSize="large" style={dotStyle} />;
    }
  }

  return (
    <Card onClick={onClick} sx={cardStyle}>
      <div style={contentStyle}>
        {getTileIcon(status)}
        <Typography variant="h6" className="mt-2" style={textStyle}>
          {title}
        </Typography>
      </div>
    </Card>
  );
};

interface AppCreationFlow {
  supplyChainData: {
    app_id: string,
    completed_at: string,
    id: string,
    run_name: string,
    started_at: string,
    status: string,
    steps: { status: string, step_name: string }[]
  }
}

const AppCreationFlow: React.FC<AppCreationFlow> = ({ supplyChainData }) => {
  const [selectedTile, setSelectedTile] = useState<string | null>("Clone"); // Set the initial value to "Clone"
  const handleTileClick = (title: string) => {
    setSelectedTile(title === selectedTile ? null : title);
  };

  return (
    <div>
      <Card
        sx={{ display: "flex", flexDirection: { xs: "column", md: "row" } }}
      >
        <div className={`scroll-container`}>
          {supplyChainData?.steps.map((process, index) => (
            <React.Fragment key={index}>
              <ProcessTile
                title={process.step_name}
                status={process.status}
                onClick={() => { if (process.status != 'waiting') { handleTileClick(process.step_name) } }}
                isSelected={selectedTile === process.step_name}
              />
              {index < supplyChainData.steps.length - 1 && (
                <ArrowRightAltIcon
                  sx={{ fontSize: "60px", color: "rgb(115, 83, 229)" }}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </Card>
      <br></br>
      {selectedTile != null && (
        <>
          <ProcessDetails title={selectedTile} />
          <br></br>
          <ProcessLogs />
        </>
      )}
    </div>
  );
};



export default AppCreationFlow;