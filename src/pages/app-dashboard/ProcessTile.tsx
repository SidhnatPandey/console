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
  return (
    <Card
      onClick={onClick}
      sx={{
        minWidth: "120px",
        height: "120px",
        margin: "0 20px",
        borderRadius: "30px",
        textAlign: "center",
        padding: "30px 10px 10px 10px",
        border: isSelected ? "2px solid rgb(115, 83, 229)" : "2px solid transparent",
        cursor: "pointer",
        
      }}
    >
      {status === "running" ? (
        <PendingIcon fontSize="large" color="primary" />
      ) : (
        <PendingIcon fontSize="large" />
      )}
      <Typography variant="h6" className="mt-2">
        {title}
      </Typography>
    </Card>
  );
};

const AppCreationFlow: React.FC = () => {
  const [selectedTile, setSelectedTile] = useState<string | null>(null);

  const processList: { title: string; status: "completed" | "running" | "pending" }[] = [
    { title: "Clone", status: "completed" },
    { title: "Build", status: "completed" },
    { title: "Package", status: "completed" },
    { title: "SCA", status: "completed" },
    { title: "Scan", status: "completed" },
    { title: "Approval 1", status: "running" },
    { title: "Stg", status: "completed" },
    { title: "Approval 2", status: "running" },
    { title: "Prod", status: "completed" },
  ];

  const handleTileClick = (title: string) => {
    setSelectedTile(title === selectedTile ? null : title);
  };

  return (
    <><Card sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>

      <div
        className={`scroll-container`}
      >
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
      </Card></>

  );
};

export default AppCreationFlow;
