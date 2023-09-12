import React, { useState } from "react";
import { Card, Typography } from "@mui/material";
import PendingIcon from '@mui/icons-material/Pending';
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import ProcessDetails from "./ProcessDetails";

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
    border: isSelected ? "2px solid rgb(115, 83, 229)" : "2px solid transparent",
    cursor: "pointer",
    transform: title === "Approval" ? "rotate(-45deg)" : "none",
    backgroundColor: title === "Approval" ? "rgb(115, 83, 229)" : "transparent",
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
        {status === "running" ? (
          <PendingIcon fontSize="large" style={dotStyle} />
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

const AppCreationFlow: React.FC = () => {
  const [selectedTile, setSelectedTile] = useState<string | null>(null);

  // Update the processList to rename "Approval 1" and "Approval 2" to "Approval"
  const processList: { title: string; status: "completed" | "running" | "pending" }[] = [
    { title: "Clone", status: "completed" },
    { title: "Build", status: "completed" },
    { title: "Package", status: "completed" },
    { title: "SCA", status: "completed" },
    { title: "Scan", status: "completed" },
    { title: "Approval", status: "running" }, // Renamed "Approval 1" to "Approval"
    { title: "Stg", status: "completed" },
    { title: "Approval", status: "running" }, // Renamed "Approval 2" to "Approval"
    { title: "Prod", status: "completed" },
  ];

  const handleTileClick = (title: string) => {
    setSelectedTile(title === selectedTile ? null : title);
  };

  return (
    <div>
      <Card sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
        <div className={`scroll-container`}>
          {processList.map((process, index) => (
            <React.Fragment key={index}>
              <ProcessTile
                title={process.title}
                status={process.status}
                onClick={() => handleTileClick(process.title)}
                isSelected={selectedTile === process.title} />
              {index < processList.length - 1 && (
                <ArrowRightAltIcon
                  sx={{ fontSize: "60px", color: "rgb(115, 83, 229)" }} />
              )}
            </React.Fragment>
          ))}
        </div>
      </Card>
      <br></br>
      <Card sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
        <ProcessDetails title={selectedTile} />
      </Card>
    </div>
  );
};

export default AppCreationFlow;