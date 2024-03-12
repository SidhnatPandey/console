import React, { useEffect, useState } from "react";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import ProcessDetails from "./ProcessDetails";
import ProcessTile from "./ProcessTile";
import useSWR from "swr";
import { getFetcher } from "src/services/fetcherService";
import Skeleton from "react-loading-skeleton";
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";
import { APP_API } from "src/@core/static/api.constant";
import { setApiBaseUrl } from "src/@core/services/interceptor";
import { rebuild } from "src/services/appService";
import Toaster from "src/utils/toaster";

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
  workspaceId: string;
}

const AppCreationFlow = (props: AppCreationFlow) => {
  const { supplyChainData, loading, timer, gitRepo, gitBranch, workspaceId } =
    props;
  const [selectedTile, setSelectedTile] = useState<string>("clone");
  const [rebuilding, setRebuilding] = useState<boolean>(false);
  const [timeDifference, setTimeDifference] = useState(0);

  const handleTileClick = (stage: string) => {
    localStorage.setItem("cStage", stage);
    setSelectedTile(stage);
  };

  let key = supplyChainData?.id ? APP_API.supplyChainSteps : undefined;
  key = key?.replace("{runId}", supplyChainData?.id);
  key = key?.replace("{stage}", selectedTile);
  setApiBaseUrl();
  const { data: supplyChainStepData, mutate: getStepData } = useSWR(
    key,
    getFetcher,
    {
      refreshInterval: timer,
    }
  );

  const getSupplyChainStep = (step: string) => {
    handleTileClick(step);
  };

  const handleRebuild = () => {
    if (!rebuilding) {
      setRebuilding(true);
      rebuild(supplyChainData.app_id, workspaceId)
        .then(() => {
          Toaster.successToast("Initiated Rebuild. Please wait for sometime.");
        })
        .catch(() => {
          setRebuilding(false);
          Toaster.errorToast("Failed to Rebuild");
        })
        .finally(() => {
          //setRebuilding(false);
        });
    }
  };

  const calculateTimeDifference = () => {
    const supplyChainStartedAt = new Date(supplyChainData?.started_at);
    const currentTime = new Date();
    const difference = currentTime.getTime() - supplyChainStartedAt.getTime();
    setTimeDifference(difference);
  };
  const formattedDate = new Date(timeDifference);
  const hours = formattedDate.getUTCHours();
  const minutes = formattedDate.getUTCMinutes();
  const seconds = formattedDate.getUTCSeconds();
  const formattedDifference = `${hours}H ${minutes}m ${seconds}s`;
  // console.log(formattedDifference1);

  useEffect(() => {
    calculateTimeDifference();
    const intervalId = setInterval(() => {
      calculateTimeDifference();
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  const getSupplyChain = () => {
    return supplyChainData ? (
      <div className={`scroll-container`} style={{ minHeight: "200px" }}>
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
      </div>
    ) : (
      <div
        style={{
          fontSize: "20px",
          padding: "40px",
          textAlign: "center",
          display: "flex",
        }}
      >
        <div style={{ display: "flex" }}>
          <CircularProgress
            size="2rem"
            color="primary"
            style={{
              marginRight: "5px",
              alignItems: "initial",
            }}
          />
        </div>
        <div style={{ marginLeft: "2rem", marginTop: "-2rem" }}>
          <h5 style={{ textAlign: "left", marginBottom: "-1.2rem" }}>
            Initiating Build(
            {formattedDifference})...{" "}
          </h5>
          <p>Status: Submitted/Initiated...</p>
        </div>
      </div>
    );
  };

  return (
    <div>
      <Card>
        {loading ? (
          <Skeleton width={200} height={20} style={{ margin: "20px" }} />
        ) : (
          <CardHeader
            subheader={"RunId: " + supplyChainData?.run_name}
            sx={{ "& .MuiCardHeader-action": { m: 0, alignSelf: "center" } }}
            action={
              <Typography
                variant="body2"
                data-testid="updated-time"
                sx={{ color: "text.disabled" }}
              >
                Updated {timer / 1000} seconds ago
                {supplyChainData?.status === "Failed" && !rebuilding && (
                  <Button
                    variant="contained"
                    color="secondary"
                    size="small"
                    style={{ marginLeft: "15px" }}
                    onClick={handleRebuild}
                  >
                    Rebuild
                  </Button>
                )}
              </Typography>
            }
          />
        )}

        <CardContent
          sx={{ display: "flex", flexDirection: { xs: "column", md: "row" } }}
          style={{ paddingBottom: "0px" }}
        >
          {loading ? (
            <div className={`scroll-container`}>
              <Skeleton
                width={120}
                height={120}
                style={{
                  margin: "5px",
                  marginRight: "80px",
                  borderRadius: "30px",
                }}
                count={6}
                inline
              />
            </div>
          ) : (
            getSupplyChain()
          )}
        </CardContent>
      </Card>
      <br></br>
      {(loading || (!loading && supplyChainData)) && (
        <ProcessDetails
          handleTrigger={getStepData}
          supplyChainStepData={supplyChainStepData?.data}
          gitRepo={gitRepo}
          gitBranch={gitBranch}
          loading={loading}
        />
      )}
    </div>
  );
};

export default AppCreationFlow;
