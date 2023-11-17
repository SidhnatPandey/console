import React, { useState } from "react";
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
  LinearProgress,
} from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import OptionsMenu from "src/@core/components/option-menu";

import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import pagination from "src/@core/theme/overrides/pagination";

const ApplicationVulnerabilities = () => {
  const vulnerabilityData = [
    {
      appName: "App 1",
      workspace: "Workspace A",
      lastScanned: "2023-01-15",
      CVEs: 10,
    },
    {
      appName: "App 2",
      workspace: "Workspace B",
      lastScanned: "2023-01-20",
      CVEs: 5,
    },
  ];
  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 10;

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
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = Math.min(
    startIndex + entriesPerPage - 1,
    vulnerabilityData.length
  );
  return (
    <Card sx={{ marginTop: "180px" }}>
      <Box p={2} display="flex" flexDirection="column">
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
          pb={2}
        >
          <h3 style={{ marginLeft: "20px" }}>Application Vulnerabilities</h3>
          <Box display="flex" alignItems="center" sx={{ marginRight: "20px" }}>
            <Input
              placeholder="Search"
              sx={{
                border: "1px solid #ced4da",
                borderRadius: "8px",
                padding: "8px",
              }}
            />
          </Box>
        </Box>

        <TableContainer>
          <Table sx={{ border: "1px solid #ced4da" }}>
            <TableHead>
              <TableRow>
                <TableCell>
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
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <span>Workspace</span>
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
                <TableCell>
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
                <TableCell>
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
              {vulnerabilityData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.appName}</TableCell>
                  <TableCell>{row.workspace}</TableCell>
                  <TableCell>{row.lastScanned}</TableCell>
                  <TableCell>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <LinearProgress
                        variant="determinate"
                        value={(row.CVEs / 150) * 100}
                        sx={{ marginRight: "8px", width: "100%" }}
                      />
                      <span>{row.CVEs}</span>
                    </div>
                  </TableCell>

                  {renderOptionsMenuCell()}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box display="flex" mt={6} alignItems="center">
          <span>
            Showing {startIndex + 1} to {endIndex + 1} of{" "}
            {vulnerabilityData.length} entries
          </span>
          <Stack spacing={2} mt={3} ml="auto" alignItems="flex-end">
            <Pagination {...pagination} shape="rounded" color="primary" />
          </Stack>
        </Box>
      </Box>
    </Card>
  );
};

export default ApplicationVulnerabilities;
