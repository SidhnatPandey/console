import React, { useEffect, useState } from "react";
import { Card, Typography } from "@mui/material";
import PendingIcon from "@mui/icons-material/Pending";
// ** Custom Components Imports
import CustomAvatar from "src/@core/components/mui/avatar";
import Icon from "src/@core/components/icon";
import { Container } from "@mui/system";
import LoopIcon from "@mui/icons-material/Loop";
import Tooltip from "@mui/material/Tooltip";
import Skeleton from 'react-loading-skeleton';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

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

  const checkApproval = () => {
    return stage.toLowerCase().includes("approval")
  }
  // Rotate the card by 45 degrees for the "Approval" process and set a purple background
  const cardStyle: React.CSSProperties = {
    minWidth: checkApproval() ? "130px" : "120px",
    height: checkApproval() ? "130px" : "120px",
    margin: "0 20px",
    borderRadius: "30px",
    textAlign: "center",
    padding: "30px 10px 10px 10px",
    border: isSelected
      ? checkApproval() ? "2px solid rgb(157, 141, 211)" : "2px solid rgb(115, 83, 229)"
      : "2px solid transparent",
    cursor: "pointer",
    transform: checkApproval() ? "rotate(-45deg)" : "none",
    backgroundColor: checkApproval() ? "rgb(115, 83, 229)" : "transparent",
    boxShadow: "15",
  };

  // Rotate the content inside the "Approval" process by 45 degrees
  const contentStyle: React.CSSProperties = {
    transform: checkApproval() ? "rotate(45deg)" : "none",
  };

  const dotStyle: React.CSSProperties = {
    color: checkApproval() ? "white" : "primary", // Change the color to black for "Approval"
  };

  const textStyle: React.CSSProperties = {
    color: checkApproval() ? "white" : "inherit", // Change the text color to white for "Approval"
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
      case "pending":
        return <PendingIcon fontSize="large" style={dotStyle} />;
      case "approved":
        return (
          <CustomAvatar
            color={"success"}
            sx={{ marginTop: -1, width: 42, height: 42 }}
            style={{ marginLeft: 32, marginBottom: 5 }}
          >
            <Icon icon={"ph:check-light"} />
          </CustomAvatar>
        );
      case "rejected":
        return <CloseIcon fontSize="large" style={{ color: "red" }} />;
      case "failed":
        return <ErrorOutlineIcon fontSize="large" style={{ color: "red" }} />;
      default:
        return <HelpOutlineIcon fontSize="large" style={{ color: "rgb(85, 85, 85)" }} />;
    }
  };

  return (
    <Tooltip title={`Status: ${status}`} arrow data-testid="Tooltip">
      <Card data-testid="Card" onClick={onClick} sx={cardStyle}>
        <div data-testid="status" style={contentStyle}>
          {loading ? <Skeleton width={100} height={30} /> : getTileIcon(status)}
          <Typography data-testid="stage" variant="h6" className="mt-2" style={textStyle}>
            {loading ? <Skeleton width={100} height={20} /> : stage}
          </Typography>
        </div>
      </Card>
    </Tooltip>
  );
};

export default ProcessTile;
