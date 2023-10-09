import React, { useState } from "react";
import { Card, Typography } from "@mui/material";
import PendingIcon from "@mui/icons-material/Pending";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import ProcessDetails from "./ProcessDetails";
// ** Custom Components Imports
import CustomAvatar from "src/@core/components/mui/avatar";
import Icon from "src/@core/components/icon";
import ProcessLogs from "./ProcessLogs";



interface ProcessTileProps {
  title: string;
  status: "completed" | "running" | "pending";
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



  return (
    <Card onClick={onClick} sx={cardStyle}>
      <div style={contentStyle}>
        {status === "completed" ? (
          // <PendingIcon fontSize="large" style={dotStyle} />
          <CustomAvatar
            skin="light"
            color={"success"}
            sx={{ marginTop: -1, width: 42, height: 42 }}
            style={{ marginLeft: 25, marginBottom: 5 }}
          >
            <Icon icon={"ph:check-light"} />
          </CustomAvatar>
        ) : (
          <PendingIcon fontSize="large" style={dotStyle} />
        )}
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
    steps: string[]
  }
}

const AppCreationFlow: React.FC<AppCreationFlow> = ({ supplyChainData }) => {
  const [selectedTile, setSelectedTile] = useState<string | null>("Clone"); // Set the initial value to "Clone"

  // Update the processList to rename "Approval 1" and "Approval 2" to "Approval"
  /*   const processList: {
      title: string;
      status: "completed" | "running" | "pending";
    }[] = [
        { title: "Clone", status: "completed" },
        { title: "Build", status: "completed" },
        { title: "Package", status: "completed" },
        { title: "SCA", status: "pending" },
        { title: "Scan", status: "pending" },
        { title: "Approval", status: "running" }, // Renamed "Approval 1" to "Approval"
        { title: "Stg", status: "pending" },
        { title: "Approval", status: "running" }, // Renamed "Approval 2" to "Approval"
        { title: "Prod", status: "pending" },
      ];
   */
  const handleTileClick = (title: string) => {
    setSelectedTile(title === selectedTile ? null : title);
  };

  return (
    <div>
      <Card
        sx={{ display: "flex", flexDirection: { xs: "column", md: "row" } }}
      >
        <div className={`scroll-container`}>
          {supplyChainData.steps.map((process, index) => (
            <React.Fragment key={index}>
              <ProcessTile
                title={process}
                status={"completed"}
                onClick={() => handleTileClick(process)}
                isSelected={selectedTile === process}
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