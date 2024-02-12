import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Card,
  Input,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import Link from "next/link";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import MultiStepBarChart from "src/component/multiStepBar";
import { sbom, vulnerabilitiesList } from "src/services/securityService";
import { SecurityContext } from "src/context/SecurityContext";
import { calculateDaysFromTodayString } from "src/@core/utils/format";
import { LOCALSTORAGE_CONSTANTS } from "src/@core/static/app.constant";

interface AppSecurityData {
  AppId: string;
  AppName: string;
  LastScanned: string;
  WorkspaceId: string;
  WorkspaceName: string;
  Cves: {
    Count: number;
    Severity: string;
  }[];
}

const ApplicationVulnerabilities = () => {
  const securityContext = useContext(SecurityContext);
  const [selectedWorkspace, setSelectedWorkspace] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [downloadInProgress, setDownloadInProgress] = useState<string | null>(
    null
  );

  const [vulnerabilityData, setVulnerabilityData] = useState<AppSecurityData[]>(
    []
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [sort, setSort] = useState<{
    column: keyof AppSecurityData | null;
    direction: "asc" | "desc";
  }>({
    column: null,
    direction: "asc",
  });

  const calculateTotalCVEs = (Cves: { Count: number; Severity: string }[]) => {
    return Cves?.reduce((total, cve) => total + cve.Count, 0);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleSort = (columnName: keyof AppSecurityData) => {
    setSort({
      column: columnName,
      direction:
        sort.column === columnName
          ? sort.direction === "asc"
            ? "desc"
            : "asc"
          : "asc",
    });

    setVulnerabilityData((prevData) =>
      [...prevData].sort((a, b) => {
        const valueA = a[columnName];
        const valueB = b[columnName];

        if (typeof valueA === "number" && typeof valueB === "number") {
          return sort.direction === "asc" ? valueA - valueB : valueB - valueA;
        }

        const stringA = String(valueA);
        const stringB = String(valueB);

        return sort.direction === "asc"
          ? stringA.localeCompare(stringB)
          : stringB.localeCompare(stringA);
      })
    );
  };

  // Modify filteredData to include workspace filtering
  const filteredData = vulnerabilityData?.filter((row) => {
    return (
      (selectedWorkspace ? row.WorkspaceName === selectedWorkspace : true) &&
      Object.values(row).some((value) =>
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  });

  useEffect(() => {
    getVulnerabilitesList(securityContext.workspace, securityContext.runType);
  }, [
    searchTerm,
    securityContext.workspace,
    securityContext.runType,
    selectedWorkspace,
  ]);

  const getVulnerabilitesList = (workspaceId: string, runType: string) => {
    setLoading(true);
    vulnerabilitiesList(workspaceId, runType).then((res) => {
      setVulnerabilityData(res?.data || []);
      setLoading(false);
    });
  };

  const getSBOMs = (appId: string, workspaceId: string) => {
    setDownloadInProgress(appId);
    sbom(appId, securityContext.runType, workspaceId).then((res) => {
      console.log(res.data);
      const url = `data:application/json;base64,${res.data}`;
      const a = document.createElement("a");
      a.href = url;
      a.download = "sbom.json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setDownloadInProgress(null);
    });
  };

  const handleAppNameClick = (workspaceId: string) => {
    localStorage.setItem(LOCALSTORAGE_CONSTANTS.workspace, workspaceId);
  };

  return (
    <Card sx={{ marginTop: "20px" }}>
      <Box display="flex" flexDirection="column">
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
          pb={2}
        >
          <h3 style={{ marginLeft: "20px", marginTop: "40px" }}>
            Application Vulnerabilities
          </h3>
          <Box
            display="flex"
            alignItems="center"
            sx={{ marginRight: "20px", marginTop: "30px" }}
          >
            <Input
              placeholder="Search"
              sx={{
                border: "1px solid #ced4da",
                borderRadius: "8px",
                padding: "8px",
              }}
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Box>
        </Box>
        <TableContainer sx={{ width: "100%" }}>
          <Table>
            <TableHead>
              <TableRow
                sx={{
                  backgroundColor: (theme) => theme.palette.primary.main + "10",
                }}
              >
                <TableCell
                  onClick={() => handleSort("AppName")}
                  style={{ width: 300 }}
                >
                  <Box display="flex" alignItems="center">
                    <span>App Name</span>
                    <Box display="flex" flexDirection="column" ml={6}>
                      <KeyboardArrowUpIcon
                        sx={{ color: "gray", marginBottom: "-6px" }}
                      />
                      <KeyboardArrowDownIcon
                        sx={{ color: "gray", marginTop: "-6px" }}
                      />
                    </Box>
                  </Box>
                </TableCell>
                <TableCell onClick={() => handleSort("WorkspaceName")}>
                  <Box display="flex" alignItems="center">
                    <span>workspace</span>
                    <Box display="flex" flexDirection="column" ml={6}>
                      <KeyboardArrowUpIcon
                        sx={{ color: "gray", marginBottom: "-6px" }}
                      />
                      <KeyboardArrowDownIcon
                        sx={{ color: "gray", marginTop: "-6px" }}
                      />
                    </Box>
                  </Box>
                </TableCell>
                <TableCell
                  onClick={() => handleSort("LastScanned")}
                  style={{ width: 300 }}
                >
                  <Box display="flex" alignItems="center">
                    <span>Last Scanned</span>
                    <Box display="flex" flexDirection="column" ml={6}>
                      <KeyboardArrowUpIcon
                        sx={{ color: "gray", marginBottom: "-6px" }}
                      />
                      <KeyboardArrowDownIcon
                        sx={{ color: "gray", marginTop: "-6px" }}
                      />
                    </Box>
                  </Box>
                </TableCell>
                <TableCell
                  onClick={() => handleSort("Cves")}
                  style={{ width: 600 }}
                >
                  <Box display="flex" alignItems="center">
                    <span>CVEs</span>
                    <Box display="flex" flexDirection="column" ml={6}>
                      <KeyboardArrowUpIcon
                        sx={{ color: "gray", marginBottom: "-6px" }}
                      />
                      <KeyboardArrowDownIcon
                        sx={{ color: "gray", marginTop: "-6px" }}
                      />
                    </Box>
                  </Box>
                </TableCell>
                <TableCell style={{ width: 100 }}>
                  <Box display="flex" alignItems="center">
                    <span>Download</span>
                    <Box display="flex" flexDirection="column" ml={6}>
                      <KeyboardArrowUpIcon
                        sx={{ color: "gray", marginBottom: "-6px" }}
                      />
                      <KeyboardArrowDownIcon
                        sx={{ color: "gray", marginTop: "-6px" }}
                      />
                    </Box>
                  </Box>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData && filteredData.length > 0 ? (
                filteredData
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Link
                          href={{
                            pathname: `/security/app/${row.AppId}`,
                            query: {
                              data: JSON.stringify({
                                appName: row.AppName,
                                wid: row.WorkspaceId,
                              }),
                            },
                          }}
                          as={`/security/app/${row.AppId}`}
                          style={{ textDecoration: "none" }}
                          onClick={() => {
                            handleAppNameClick(row.WorkspaceId);
                          }}
                        >
                          {row.AppName}
                        </Link>
                      </TableCell>
                      <TableCell>{row.WorkspaceName}</TableCell>
                      <TableCell>
                        {calculateDaysFromTodayString(row.LastScanned)}
                      </TableCell>
                      <TableCell>
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <MultiStepBarChart Cves={row.Cves} />
                          <span>{calculateTotalCVEs(row.Cves)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <a
                          onClick={() => getSBOMs(row.AppId, row.WorkspaceId)}
                          style={{
                            cursor:
                              downloadInProgress === row.AppId
                                ? "not-allowed"
                                : "pointer",
                            opacity: downloadInProgress === row.AppId ? 0.5 : 1,
                            pointerEvents:
                              downloadInProgress === row.AppId
                                ? "none"
                                : "auto",
                          }}
                        >
                          {downloadInProgress === row.AppId
                            ? "Downloading..."
                            : "SBOM"}
                        </a>
                      </TableCell>
                    </TableRow>
                  ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    style={{
                      textAlign: "center",
                      fontSize: "18px",
                      paddingTop: "50px", // Increase the top padding
                      paddingBottom: "50px", // Increase the bottom padding
                    }}
                  >
                    {loading ? "Loading ..." : "No Apps Available"}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{ marginLeft: "16px" }}
        />
      </Box>
    </Card>
  );
};

export default ApplicationVulnerabilities;
