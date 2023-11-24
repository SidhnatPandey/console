import React, { useEffect, useState } from "react";
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
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import OptionsMenu from "src/@core/components/option-menu";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import pagination from "src/@core/theme/overrides/pagination";
import MultiStepBarChart from "src/component/multiStepBar";
interface AppSecurityData {
  AppName: string;
  WorkspaceId: string;
  LastScanned: string;
  Cves: {
    Count: number;
    Severity: string;
  }[];
}
const ApplicationVulnerabilities = () => {
  const [vulnerabilityData, setVulnerabilityData] = useState<AppSecurityData[]>([
    {
      AppName: "App 1",
      WorkspaceId: "WorkspaceId A",
      LastScanned: "2023-01-15",
      Cves: [
        { Count: 1, Severity: "Critical" },
        { Count: 2, Severity: "High" },
        { Count: 10, Severity: "Low" },
        { Count: 3, Severity: "Medium" },
        { Count: 2, Severity: "Unknown" },
      ],
    },
    {
      AppName: "App 2",
      WorkspaceId: "WorkspaceId B",
      LastScanned: "2023-01-20",
      Cves: [
        { Count: 1, Severity: "Critical" },

        { Count: 2, Severity: "Unknown" },
      ],
    },
    {
      AppName: "App 3",
      WorkspaceId: "WorkspaceId A",
      LastScanned: "2023-01-15",
      Cves: [
        { Count: 3, Severity: "Medium" },
        { Count: 2, Severity: "Unknown" },
      ],
    },
    {
      AppName: "App 4",
      WorkspaceId: "WorkspaceId B",
      LastScanned: "2023-01-20",
      Cves: [{ Count: 3, Severity: "Medium" }],
    },
    {
      AppName: "App 1",
      WorkspaceId: "WorkspaceId A",
      LastScanned: "2023-01-15",
      Cves: [
        { Count: 3, Severity: "Medium" },
        { Count: 2, Severity: "Unknown" },
      ],
    },
    {
      AppName: "App 2",
      WorkspaceId: "WorkspaceId B",
      LastScanned: "2023-01-20",
      Cves: [{ Count: 1, Severity: "Critical" }],
    },
    {
      AppName: "App 3",
      WorkspaceId: "WorkspaceId A",
      LastScanned: "2023-01-15",
      Cves: [{ Count: 3, Severity: "Medium" }],
    },
  ]);

  const calculateTotalCVEs = (Cves: { Count: number; Severity: string }[]) => {
    return Cves.reduce((total, cve) => total + cve.Count, 0);
  };

  const SeverityColors: Record<string, string> = {
    Low: "lightgrey",
    Medium: "rgb(115, 83, 229)",
    High: "darkorange",
    Critical: "red",
    Unknown: "white",
  };

  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 10;
  const [searchTerm, setSearchTerm] = useState("");

  const [sort, setSort] = useState<{
    column: keyof AppSecurityData | null;
    direction: "asc" | "desc";
  }>({
    column: null,
    direction: "asc",
  });

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
  const renderOptionsMenuCell = () => (
    <TableCell>
      <Box display="flex" flexDirection="column">
        <OptionsMenu
          options={["Refresh", "Edit", "Share"]}
          iconButtonProps={{ size: "small", sx: { color: "gray" } }}
        />
      </Box>
    </TableCell>
  );

  const filteredData = vulnerabilityData.filter((row) =>
    Object.values(row).some(
      (value) =>
        value &&
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );
  const totalPages = Math.ceil(filteredData.length / entriesPerPage);

  const startIndex = Math.max((currentPage - 1) * entriesPerPage, 0);
  const endIndex = Math.min(
    startIndex + entriesPerPage - 1,
    filteredData.length - 1
  );

  useEffect(() => {
    const validPage = Math.min(Math.max(currentPage, 1), totalPages);
    setCurrentPage(validPage);
  }, [currentPage, totalPages, searchTerm]);

  return (
    <Card sx={{ marginTop: "180px" }}>
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
        {filteredData.length > 0 ? (
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
                  {/* <TableCell onClick={() => handleSort("WorkspaceId")}>
                    <Box display="flex" alignItems="center">
                      <span>WorkspaceId</span>
                      <Box display="flex" flexDirection="column" ml={6}>
                        <KeyboardArrowUpIcon
                          sx={{ color: "gray", marginBottom: "-6px" }}
                        />
                        <KeyboardArrowDownIcon
                          sx={{ color: "gray", marginTop: "-6px" }}
                        />
                      </Box>
                    </Box>
                  </TableCell> */}
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
                  <TableCell onClick={() => handleSort("Cves")} style={{ width: 600 }}>
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
                  {renderOptionsMenuCell()}
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData
                  .slice(startIndex, endIndex + 1)
                  .map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{row.AppName}</TableCell>
                      {/* <TableCell>{row.WorkspaceId}</TableCell> */}
                      <TableCell>{row.LastScanned}</TableCell>
                      <TableCell>
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <MultiStepBarChart Cves={row.Cves} />
                          <span>{calculateTotalCVEs(row.Cves)}</span>
                        </div>
                      </TableCell>

                      {renderOptionsMenuCell()}
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Box textAlign="center" mt={2}>
            <span>No Apps</span>
          </Box>
        )}
        <Box
          display="flex"
          mt={6}
          ml="20px"
          marginBottom={"20px"}
          alignItems="center"
        >
          <span>
            Showing {filteredData.length > 0 ? startIndex + 1 : 0} to{" "}
            {endIndex + 1} of {filteredData.length} entries
          </span>
          <Stack
            spacing={2}
            mt={3}
            ml="auto"
            marginBottom={"20px"}
            alignItems="flex-end"
          >
            {filteredData.length > 0 ? (
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
