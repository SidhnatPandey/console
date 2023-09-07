import React, { useState } from "react";
import { Card, Typography } from "@mui/material";
import GridViewIcon from "@mui/icons-material/GridView";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";

interface ProcessTileProps {
  title: string;
  isApproval?: boolean;
  onClick: () => void;
  isSelected: boolean;
}

const ProcessTile: React.FC<ProcessTileProps> = ({
  title,
  isApproval = false,
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
      {isApproval ? (
        <GridViewIcon fontSize="large" color="primary" /> // Use GridViewIcon for Approval
      ) : (
        <GridViewIcon fontSize="large" />
      )}
      <Typography variant="h6" className="mt-2">
        {title}
      </Typography>
    </Card>
  );
};

const AppCreationFlow: React.FC = () => {
  const [selectedTile, setSelectedTile] = useState<string | null>(null);

  const handleTileClick = (title: string) => {
    setSelectedTile(title === selectedTile ? null : title);
  };

  return (
    <div
      style={{
        overflowX: "auto",
        display: "flex",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <ProcessTile
        title="Clone"
        onClick={() => handleTileClick("Clone")}
        isSelected={selectedTile === "Clone"}
      />

      <ArrowRightAltIcon sx={{ fontSize: "60px", color: "rgb(115, 83, 229)" }} />

      <ProcessTile
        title="Build"
        onClick={() => handleTileClick("Build")}
        isSelected={selectedTile === "Build"}
      />

      <ArrowRightAltIcon sx={{ fontSize: "60px", color: "rgb(115, 83, 229)" }} />

      <ProcessTile
        title="Package"
        onClick={() => handleTileClick("Package")}
        isSelected={selectedTile === "Package"}
      />

      <ArrowRightAltIcon sx={{ fontSize: "60px", color: "rgb(115, 83, 229)" }} />

      <ProcessTile
        title="SCA"
        onClick={() => handleTileClick("SCA")}
        isSelected={selectedTile === "SCA"}
      />

      <ArrowRightAltIcon sx={{ fontSize: "60px", color: "rgb(115, 83, 229)" }} />

      <ProcessTile
        title="Scan"
        onClick={() => handleTileClick("Scan")}
        isSelected={selectedTile === "Scan"}
      />

      <ArrowRightAltIcon sx={{ fontSize: "60px", color: "rgb(115, 83, 229)" }} />

      <ProcessTile
        title="Approval" // Give a unique title
        isApproval
        onClick={() => handleTileClick("Approval 1")}
        isSelected={selectedTile === "Approval 1"}
      />

      <ArrowRightAltIcon sx={{ fontSize: "60px", color: "rgb(115, 83, 229)" }} />

      <ProcessTile
        title="Stg"
        onClick={() => handleTileClick("Stg")}
        isSelected={selectedTile === "Stg"}
      />

      <ArrowRightAltIcon sx={{ fontSize: "60px", color: "rgb(115, 83, 229)" }} />

      <ProcessTile
        title="Approval" // Give a unique title
        isApproval
        onClick={() => handleTileClick("Approval 2")}
        isSelected={selectedTile === "Approval 2"}
      />

      <ArrowRightAltIcon sx={{ fontSize: "60px", color: "rgb(115, 83, 229)" }} />

      <ProcessTile
        title="Prod"
        onClick={() => handleTileClick("Prod")}
        isSelected={selectedTile === "Prod"}
      />
    </div>
  );
};

export default AppCreationFlow;
