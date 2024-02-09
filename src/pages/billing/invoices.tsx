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
import CustomChip from "src/@core/components/mui/chip";
import { toTitleCase } from "src/utils/stringUtils";
import { listOfInvoice } from "src/services/billingService";
import { ChangeEvent, useEffect, useMemo, useState } from "react";

interface Data {
  id: string;
  invoice_number: number;
  plan_id: string;
  org_id: string;
  org_name: string;
  pdf: string;
  status: string;
  created_at: string;
  total_cost: number;
}


interface HeadCell {
  disablePadding: boolean;
  id: keyof Data;
  label: string;
  numeric: boolean;
}

const headCells: readonly HeadCell[] = [
  {
    id: "id",
    numeric: false,
    disablePadding: true,
    label: "ID",
  },
  {
    id: "total_cost",
    numeric: true,
    disablePadding: false,
    label: "TOTAL",
  },
  {
    id: "created_at",
    numeric: true,
    disablePadding: false,
    label: "INVOICE DATE",
  },
  {
    id: "pdf",
    numeric: true,
    disablePadding: false,
    label: "DOWNLOAD",
  },
  {
    id: "status",
    numeric: true,
    disablePadding: false,
    label: "STATUS",
  },
];

function InvoiceTable() {
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [orderBy, setOrderBy] = useState<keyof Data>("created_at");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [invoices, setInvoices] = useState<Data[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  


  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRequestSort = (property: keyof Data) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const getStatusChipColor = (status: any) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "success";
      case "deleted":
        return "error";
      default:
        return "warning";
    }
  };

  function formatDate(timestamp: string): string {
    const months: string[] = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const date: Date = new Date(timestamp);
    const day: number = date.getDate();
    const month: string = months[date.getMonth()];
    const year: number = date.getFullYear();

    return `${day} ${month} ${year}`;
  }

  const sortedRows = useMemo(() => {
    return [...invoices].sort((a, b) => {
      if (order === "asc") {
        return a[orderBy] > b[orderBy] ? 1 : -1;
      } else {
        return b[orderBy] > a[orderBy] ? 1 : -1;
      }
    });
  }, [invoices,order, orderBy]);

  const getListOfInvoices = () => {

    setLoading(true);
    listOfInvoice().then((response) => {
      if (response) {
        setLoading(false);
        setInvoices(response.data);
      
      }
    });
  };

  useEffect(() => {
    getListOfInvoices();
  }, []);

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "8px 16px",
          }}
        >
          <Typography variant="h3">Billing History</Typography>
          <div></div> {/* This empty div creates space */}
        </Box>
        <Divider />
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {headCells.map((headCell) => (
                  <TableCell
                    key={headCell.id}
                    //align={headCell.numeric ? 'right' : 'left'}
                    align={"left"}
                    padding={headCell.disablePadding ? "none" : "normal"}
                  >
                    <TableSortLabel
                      active={orderBy === headCell.id}
                      direction={orderBy === headCell.id ? order : "asc"}
                      onClick={() => handleRequestSort(headCell.id)}
                    >
                      {headCell.label}
                    </TableSortLabel>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedRows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5}  style={{
                    textAlign: 'center',
                    fontSize: '18px',
                    paddingTop: '50px',
                    paddingBottom: '50px', 
                  }}>
                  

                    {loading ? 'Loading ...' : 'No Apps'}
                  </TableCell>
                </TableRow>
              ) : (
                sortedRows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => (
                    <TableRow key={index + 1}>
                      <TableCell>{row.id}</TableCell>
                      <TableCell align="left">$ {row.total_cost}</TableCell>
                      <TableCell align="left">
                        {formatDate(row.created_at)}
                      </TableCell>
                      <TableCell align="left">
                        <a
                          href={`data:application/pdf;base64,${row.pdf}`}
                          download="document.pdf"
                        >
                          Download
                        </a>
                      </TableCell>
                      <TableCell align="left">
                        <CustomChip
                          rounded
                          skin="light"
                          label={
                            row.status ? toTitleCase(row.status) : "Pending"
                          }
                          color={getStatusChipColor(row.status)}
                          variant="outlined"
                        />
                      </TableCell>
                    </TableRow>
                  ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={invoices?.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
}

export default InvoiceTable;
