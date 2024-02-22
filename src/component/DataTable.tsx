import { toTitleCase } from "src/utils/stringUtils";
import React, { useMemo, useState } from "react";
import CustomChip from "src/@core/components/mui/chip";
import CircularProgress from '@mui/material/CircularProgress';
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
  strictFunction?: (value: any) => any;
  strictdata?: string;
  downloadableLink?: boolean;
}

interface DataTableProps {
  columns: Column[];
  data: Row[];
  heading?: string | null;
  loading?: boolean;
}

export interface Row {
  [key: string]: any;
}

const DataTable: React.FC<DataTableProps> = ({
  columns,
  data,
  heading,
  loading,
}) => {
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [orderBy, setOrderBy] = useState<string>("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

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

  const renderRows = useMemo(() => {
    if (!data || data.length === 0) {
      return (
        <TableRow>
          <TableCell
            colSpan={columns.length}
            style={{
              textAlign: "center",
              fontSize: "18px",
              paddingTop: "50px",
              paddingBottom: "50px",
            }}
          >
            {loading ? <CircularProgress color="primary" /> : "No Data"}
          </TableCell>
        </TableRow>
      );
    }

    return data
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
            <TableCell key={column.id} align="left">
              {typeof column.strictFunction === "function" &&
                column.showChip ? (
                <CustomChip
                  rounded
                  skin="light"
                  label={row.status ? toTitleCase(row.status) : "Pending"}
                  color={column.strictFunction(row[column.id])}
                  variant="outlined"
                />
              ) : typeof column.strictFunction === "function" &&
                !column.showChip ? (
                column.strictFunction(row[column.id])
              ) : column.downloadableLink ? (
                <a
                  href={`data:application/pdf;base64,${row[column.id]}`}
                  download="document.pdf"
                >
                  {column.strictdata ? column.strictdata : "Download"}
                </a>
              ) : (
                column.strictdata || row[column.id]
              )}
            </TableCell>
          ))}
        </TableRow>
      ));
  }, [data, columns, order, orderBy, page, rowsPerPage, loading]);

  return (


    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%" }}>

        {heading && (
          /* heading of  the table */

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

        {heading && <Divider />}
        <TableContainer>
          <Table>

            {
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
            }
            <TableBody>{renderRows}</TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={data?.length || 0}
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
