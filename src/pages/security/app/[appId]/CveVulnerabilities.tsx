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
import { cveVulnerabilitiesList } from "src/services/securityService";
import { SecurityContext } from "src/context/SecurityContext";
import ChipsRounded from "src/component/Chip";
interface CVESecurityData {
  WorkspaceName?: string;
  CveID: string;
  Severity: string;
  PackageName: string;
  Version: string;
  Description: string;
}

interface Props {
  appId: string;
}

const CveVulnerabilities = (props: Props) => {
  const { appId } = props;
  const securityContext = useContext(SecurityContext);
  const [vulnerabilityData, setVulnerabilityData] = useState<CVESecurityData[]>(
    []
  );
  const [expandedRows, setExpandedRows] = useState<Record<number, boolean>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const toggleDescription = (index: number) => {
    setExpandedRows((prevExpandedRows) => {
      const isExpanded = !prevExpandedRows[index];
      return { ...prevExpandedRows, [index]: isExpanded };
    });
  };
  const [searchTerm, setSearchTerm] = useState("");
  const [sort, setSort] = useState<{
    column: keyof CVESecurityData | null;
    direction: "asc" | "desc";
  }>({
    column: null,
    direction: "asc",
  });

  const handleSort = (columnName: keyof CVESecurityData) => {
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

  const filteredData = vulnerabilityData?.filter((row) => {
    return Object.values(row).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  useEffect(() => {
    getVulnerabilitesList(
      appId,
      securityContext.runType,
      securityContext.workspace
    );
  }, [securityContext.workspace, securityContext.runType, appId]);

  const getVulnerabilitesList = (
    appId: string,
    runType: string,
    workspaceId: string
  ) => {
    setLoading(true);
    cveVulnerabilitiesList(appId, runType, workspaceId).then((res) => {
      setVulnerabilityData(res?.data || []);
      setLoading(false);
    });
  };

  const getCVEColor = (severity: string) => {
    switch (severity) {
      case "Critical":
        return "error";
      case "High":
        return "warning";
      case "Medium":
        return "primary";
      case "Low":
        return "secondary";
      case "Unknown":
        return "info";
      default:
        return "success";
    }
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
            Vulnerabilities
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
                <TableCell onClick={() => handleSort("CveID")}>
                  <Box display="flex" alignItems="center">
                    <span>CVEID</span>
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
                <TableCell onClick={() => handleSort("Severity")}>
                  <Box display="flex" alignItems="center">
                    <span>SEVERITY</span>
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
                <TableCell onClick={() => handleSort("PackageName")}>
                  <Box display="flex" alignItems="center">
                    <span>PACKAGE</span>
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
                <TableCell onClick={() => handleSort("Version")}>
                  <Box display="flex" alignItems="center">
                    <span>VERSION</span>
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
                <TableCell onClick={() => handleSort("Description")}>
                  <Box display="flex" alignItems="center">
                    <span>DESCRIPTION</span>
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
                          href={`/security/cve/${row.CveID}`}
                          style={{ textDecoration: "none" }}
                        >
                          {row.CveID}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <ChipsRounded
                          label={row.Severity}
                          color={getCVEColor(row.Severity)}
                        ></ChipsRounded>
                      </TableCell>
                      <TableCell>{row.PackageName}</TableCell>
                      <TableCell>{row.Version}</TableCell>
                      <TableCell>
                        {expandedRows[index] ? (
                          <div>
                            {row.Description}
                            <span
                              style={{ color: "blue", cursor: "pointer" }}
                              onClick={() => toggleDescription(index)}
                            >
                              {" "}
                              Show Less
                            </span>
                          </div>
                        ) : (
                          <div>
                            {row.Description.length > 100 ? (
                              <span>
                                {row.Description.substring(0, 100)}
                                <span
                                  style={{ color: "blue", cursor: "pointer" }}
                                  onClick={() => toggleDescription(index)}
                                >
                                  {" "}
                                  Show More
                                </span>
                              </span>
                            ) : (
                              <span>{row.Description}</span>
                            )}
                          </div>
                        )}
                      </TableCell>{" "}
                    </TableRow>
                  ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    style={{
                      textAlign: "center",
                      fontSize: "18px",
                      paddingTop: "50px", // Increase the top padding
                      paddingBottom: "50px", // Increase the bottom padding
                    }}
                  >
                    {loading ? "Loading ..." : "No CVEs Available"}
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

export default CveVulnerabilities;
