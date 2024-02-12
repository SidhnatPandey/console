import React, { useMemo, useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableSortLabel,
  TablePagination,
  Typography,
  Divider,
} from "@mui/material";

export interface Column {
  id: string;
  label: string;
  sortable?: boolean;
  numeric?: boolean;
  showChip?: boolean;
}

interface Row {
  [key: string]: any;
}

interface DataTableProps {
  columns: Column[];
  data: Row[];
  showHeadings?: boolean;
  heading?: string | null;
}

const DataTable: React.FC<DataTableProps> = ({
  columns,
  data,
  showHeadings = true,
  heading,
}) => {
  // State variables and functions for sorting and pagination
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [orderBy, setOrderBy] = useState<string>("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Handler for sorting columns
  const handleRequestSort = (property: string) => {
    const isSortable = columns.find(
      (column) => column.id === property && column.sortable
    );
    if (isSortable) {
      const isAsc = orderBy === property && order === "asc";
      setOrder(isAsc ? "desc" : "asc");
      setOrderBy(property);
    }
  };

  // Render function for table rows
  const renderRows = useMemo(() => {
    return [...data]
      .sort((a, b) => {
        if (order === "asc") {
          return a[orderBy] > b[orderBy] ? 1 : -1;
        } else {
          return b[orderBy] > a[orderBy] ? 1 : -1;
        }
      })
      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
      .map((row, index) => (
        <TableRow key={index + 1}>
          {columns.map((column) => (
            <TableCell
              key={column.id}
            //  align={column.numeric ? "right" : "left"}
              align="left"
            >
              {row[column.id]}
            </TableCell>
          ))}
        </TableRow>
      ));
  }, [data, columns, order, orderBy, page, rowsPerPage]);

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%" }}>
        {heading && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "8px 16px",
            }}
          >
            <Typography variant="h3">{heading}</Typography>
            <div></div>
          </Box>
        )}
        {showHeadings && heading && <Divider />}
        {/* Table Header */}
        <TableContainer>
          <Table>
            {showHeadings && (
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell key={column.id}>
                      {column.sortable ? (
                        <TableSortLabel
                          active={orderBy === column.id}
                          direction={orderBy === column.id ? order : "asc"}
                          onClick={() => handleRequestSort(column.id)}
                          sx={{ typography: "body1" }}
                        >
                          {column.label}
                        </TableSortLabel>
                      ) : (
                        <Typography variant="body1">{column.label}</Typography>
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
            )}
            {/* Table Body */}
            <TableBody>{renderRows}</TableBody>
          </Table>
        </TableContainer>
        {/* Pagination */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(event: unknown, newPage: number) => setPage(newPage)}
          onRowsPerPageChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setRowsPerPage(parseInt(event.target.value, 10));
            setPage(0);
          }}
        />
      </Paper>
    </Box>
  );
};

export default DataTable;
