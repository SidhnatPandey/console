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
  TableRow,
} from "@mui/material";
import Link from 'next/link'
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import pagination from "src/@core/theme/overrides/pagination";
import MultiStepBarChart from "src/component/multiStepBar";
import { vulnerabilitiesList } from "src/services/securityService";
import { SecurityContext } from "src/context/SecurityContext";
import { calculateDaysFromTodayString } from "src/@core/utils/format";
interface AppSecurityData {
  AppId?: string;
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
  const securityContext = useContext(SecurityContext)
  const [selectedWorkspace, setSelectedWorkspace] = useState("");

  const [vulnerabilityData, setVulnerabilityData] = useState<AppSecurityData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sort, setSort] = useState<{
    column: keyof AppSecurityData | null;
    direction: "asc" | "desc";
  }>({
    column: null,
    direction: "asc",
  });
  const entriesPerPage = 5;

  const calculateTotalCVEs = (Cves: { Count: number; Severity: string }[]) => {
    return Cves?.reduce((total, cve) => total + cve.Count, 0);
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
        value
          .toString()
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      )
    );
  });
  const totalPages = Math.ceil(filteredData?.length / entriesPerPage);

  const startIndex = Math.max((currentPage - 1) * entriesPerPage, 0);
  const endIndex = Math.min(
    startIndex + entriesPerPage - 1,
    filteredData?.length - 1
  );

  useEffect(() => {
    const validPage = Math.min(Math.max(currentPage, 1), totalPages);
    setCurrentPage(validPage);
    getVulnerabilitesList(securityContext.workspace, securityContext.runType);
  }, [currentPage, totalPages, searchTerm, securityContext.workspace, securityContext.runType, selectedWorkspace]);

  useEffect(() => {
    if (vulnerabilityData.length === 0) {
      setCurrentPage(1);
    }
  }, [vulnerabilityData]);

  const getVulnerabilitesList = (workspaceId: string, runType: string) => {
    vulnerabilitiesList(workspaceId, runType).then((res) => {
      setVulnerabilityData(res?.data || []);
    });
  };

  const setWorkspaceValue = (workspaceId: string) => {
    securityContext.setWorkspace(workspaceId);
  }

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
          <Table sx={{ border: "1px solid #ced4da" }}>
            <TableHead>
              <TableRow>
                <TableCell onClick={() => handleSort("AppName")}>
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
                <TableCell onClick={() => handleSort("LastScanned")}>
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
                  style={{ width: 400 }}
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
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData && filteredData.length > 0 ? (
                filteredData
                  .slice(startIndex, endIndex + 1)
                  .map((row, index) => (
                    <TableRow key={index}>
                      <TableCell><Link href={`/security/app/${row.AppId}`} onClick={() => setWorkspaceValue(row.WorkspaceId)}>{row.AppName}</Link></TableCell>
                      <TableCell>{row.WorkspaceName}</TableCell>
                      <TableCell>{calculateDaysFromTodayString(row.LastScanned)}</TableCell>
                      <TableCell>
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <MultiStepBarChart Cves={row.Cves} />
                          <span>{calculateTotalCVEs(row.Cves)}</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))

              ) : (

                <TableRow>
                  <TableCell colSpan={4}>
                    <Box textAlign="center" mt={2}>
                      <span>No Apps Available</span>
                    </Box>
                  </TableCell>
                </TableRow>

              )}</TableBody>
          </Table>
        </TableContainer>
        <Box
          display="flex"
          mt={6}
          ml="20px"
          marginBottom={"20px"}
          alignItems="center"
        >
          <span>
            Showing {filteredData?.length > 0 ? startIndex + 1 : 0} to{" "}
            {endIndex + 1} of {filteredData?.length} entries
          </span>
          <Stack
            spacing={2}
            mt={3}
            ml="auto"
            marginBottom={"20px"}
            alignItems="flex-end"
          >
            {filteredData?.length > 0 ? (
              <Pagination
                {...pagination}
                shape="rounded"
                color="primary"
                count={totalPages}
                page={currentPage}
                onChange={(_event, page) => setCurrentPage(page)}
              />
            ) : (
              <Pagination
                shape="rounded"
                color="primary"
                count={1}
                page={1}
                onChange={(_event, page) => setCurrentPage(page)}
              />
            )}
          </Stack>
        </Box>
      </Box>
    </Card>
  );
};

export default ApplicationVulnerabilities;