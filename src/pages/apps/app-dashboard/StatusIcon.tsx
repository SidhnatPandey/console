import React from 'react';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import PendingIcon from "@mui/icons-material/Pending";
import LoopIcon from "@mui/icons-material/Loop";
import CustomAvatar from "src/@core/components/mui/avatar";
import Icon from "src/@core/components/icon";
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

interface Props {
    status: string,
    isFromTile: boolean
}

const StatusIcon: React.FC<Props> = ({ status, isFromTile }) => {

    console.log("Icon" + status + isFromTile);


    const icon = () => {
        switch (status) {
            case "Succeeded":
                return (
                    <CustomAvatar
                        skin="light"
                        color={"success"}
                        sx={{
                            marginTop: 1,
                            width: isFromTile ? 42 : 20,
                            height: isFromTile ? 42 : 20,
                            display: "flex",
                            alignItems: "center",
                        }}
                        style={{ marginRight: 10 }}
                    >
                        <Icon icon={"ph:check-light"} />
                    </CustomAvatar>
                );
            case "InProgress":
                return (
                    <>
                        <LoopIcon
                            style={{ animation: "spin 4s linear infinite", marginLeft: "5px" }}
                            color="primary"
                            fontSize={isFromTile ? "large" : "medium"}
                        />
                        <style>
                            {`
                  @keyframes spin {
                    0% { transform: rotate(360deg); }
                    100% { transform: rotate(0deg); }
                  }`}
                        </style>
                    </>
                );
            case "Waiting":
                return (
                    <PendingIcon fontSize={isFromTile ? "large" : "medium"} style={{ color: "rgb(85, 85, 85)" }} />
                );
            case "Failed":
                return <ErrorOutlineIcon fontSize={isFromTile ? "large" : "medium"} style={{ color: "red" }} />;
            default:
                return (
                    <HelpOutlineIcon fontSize={isFromTile ? "large" : "medium"} style={{ color: "rgb(85, 85, 85)" }} />
                );
        }
    };

    return (
        <>{icon}</>
    )
}

export default StatusIcon