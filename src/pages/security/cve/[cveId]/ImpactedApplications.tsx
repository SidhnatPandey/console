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
import { LOCALSTORAGE_CONSTANTS } from "src/@core/static/app.constant";

interface AppsAffectedByCVEDataProps {
  appsAffectedData?: {
    AppsAffected: {
      AppName: string;
      AppID: string;
      WorkspaceId: string;
      WorkspaceName: string;
      [key: string]: string;
    }[];
  };
  setAppsAffectedData: (value: any) => void;
  loading: boolean;
}

const ImpactedApplications = ({
  appsAffectedData,
  loading,
  setAppsAffectedData,
}: AppsAffectedByCVEDataProps) => {
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [sortColumn, setSortColumn] = useState<string | null>(null);

  const appsAffectedDatas = appsAffectedData
    ? appsAffectedData?.AppsAffected?.filter((row) => {
        return Object.values(row).some((value) =>
          value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );
      })
    : null;

  const sortData = (column: string) => {
    if (!appsAffectedDatas || appsAffectedDatas.length <= 1) {
      return;
    }
    const isAsc = sortColumn === column && sortOrder === "asc";
    setSortOrder(isAsc ? "desc" : "asc");
    setSortColumn(column);

    const sortedData = appsAffectedDatas?.slice().sort((a, b) => {
      const aValue = a[column];
      const bValue = b[column];
      return isAsc
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    });

    const slicedData = sortedData?.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );

    setAppsAffectedData({
      ...appsAffectedData,
      AppsAffected: slicedData,
    });
  };

  const handleAppNameClick = (workspaceId: string) => {
    localStorage.setItem(LOCALSTORAGE_CONSTANTS.workspace, workspaceId);
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
            Impacted Applications
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
                <TableCell onClick={() => sortData("AppName")}>
                  <Box display="flex" alignItems="center">
                    <span>APPLICATION</span>
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
                <TableCell onClick={() => sortData("WorkspaceName")}>
                  <Box display="flex" alignItems="center">
                    <span>WORKSPACE</span>
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
              {appsAffectedDatas && appsAffectedDatas.length > 0 ? (
                appsAffectedDatas
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Link
                          href={{
                            pathname: `/security/app/${row?.AppID}`,
                            query: {
                              data: JSON.stringify({
                                appName: row?.AppName,
                                wid: row?.WorkspaceId,
                              }),
                            },
                          }}
                          as={`/security/app/${row?.AppID}`}
                          style={{ textDecoration: "none" }}
                          onClick={() => {
                            handleAppNameClick(row?.WorkspaceId);
                          }}
                        >
                          {row?.AppName}
                        </Link>
                      </TableCell>
                      <TableCell>{row?.WorkspaceName}</TableCell>
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
          count={appsAffectedDatas?.length || 0}
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

export default ImpactedApplications;
