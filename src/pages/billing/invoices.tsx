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

const rows = [
  {
    id: "65c2682ea35f9ec843f30950",
    invoice_number: 1000000,
    plan_id: "65b0b5117b92b25fe3ecbbff",
    org_id: "65bd07d8ffa05c77d828eaaa",
    org_name: "DemoOrg",
    pdf: "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BgYjjBoYjDBqYDDCqIHBCKMGBiOMGhgAAAAAAAD4bwAAAP//Y9ObUAplbmRzdHJlYW0KZW5kb2JqCjggMCBvYmoKPDwvVHlwZSAvWE9iamVjdAovU3VidHlwZSAvSW1hZ2UKL1dpZHRoIDE3NQovSGVpZ2h0IDQyCi9Db2xvclNwYWNlIC9EZXZpY2VHcmF5Ci9CaXRzUGVyQ29tcG9uZW50IDgKL0ZpbHRlciAvRmxhdGVEZWNvZGUKL0RlY29kZVBhcm1zIDw8L1ByZWRpY3RvciAxNSAvQ29sb3JzIDEgL0JpdHNQZXJDb21wb25lbnQgOCAvQ29sdW1ucyAxNzU+PgovTGVuZ3RoIDEwMz4+CnN0cmVhbQp4AezW0QnAIBDG4Gtd3M11CfMQyDfBEf5SvzMqv+ra6V5Ye2DVl1Vflq2v7X9su9e2h7XZ7+M12x5s99r2W1+WbQ/dy6ovq76s+rLqy7L17X3Gsu2he1n1ZdWXZet7AwAA//9FdwfICmVuZHN0cmVhbQplbmRvYmoKMiAwIG9iago8PAovUHJvY1NldCBbL1BERiAvVGV4dCAvSW1hZ2VCIC9JbWFnZUMgL0ltYWdlSV0KL0ZvbnQgPDwKL0YwYTc2NzA1ZDE4ZTA0OTRkZDI0Y2I1NzNlNTNhYTBhOGM3MTBlYzk5IDYgMCBSCi9GZjVkMmRlNWYzYTcxNjk5YWU0YjJkODMxNzllNjJkMDllNmZjNDEyNiA1IDAgUgo+PgovWE9iamVjdCA8PAovSWYxN2QwMzgwYWM1M2JiYmNhYWFiNDBmODEwNWJiNTY1OTQ0NDU0NWUgNyAwIFIKPj4KL0NvbG9yU3BhY2UgPDwKPj4KPj4KZW5kb2JqCjkgMCBvYmoKPDwKL1Byb2R1Y2VyICj+/wBGAFAARABGACAAMQAuADcpCi9DcmVhdGlvbkRhdGUgKEQ6MjAyNDAyMDYyMjQxMTApCi9Nb2REYXRlIChEOjIwMjQwMjA2MjI0MTEwKQo+PgplbmRvYmoKMTAgMCBvYmoKPDwKL1R5cGUgL0NhdGFsb2cKL1BhZ2VzIDEgMCBSCi9OYW1lcyA8PAovRW1iZWRkZWRGaWxlcyA8PCAvTmFtZXMgWwogIApdID4+Cj4+Cj4+CmVuZG9iagp4cmVmCjAgMTEKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAxMTg2IDAwMDAwIG4gCjAwMDAwMDQ5MDIgMDAwMDAgbiAKMDAwMDAwMDAwOSAwMDAwMCBuIAowMDAwMDAwMTQzIDAwMDAwIG4gCjAwMDAwMDEyNzMgMDAwMDAgbiAKMDAwMDAwMTM3NCAwMDAwMCBuIAowMDAwMDAxNDcwIDAwMDAwIG4gCjAwMDAwMDQ1NTggMDAwMDAgbiAKMDAwMDAwNTE2MSAwMDAwMCBuIAowMDAwMDA1Mjc0IDAwMDAwIG4gCnRyYWlsZXIKPDwKL1NpemUgMTEKL1Jvb3QgMTAgMCBSCi9JbmZvIDkgMCBSCj4+CnN0YXJ0eHJlZgo1MzcyCiUlRU9GCg==",
    status: "paid",
    created_at: "2024-02-06T17:11:10.461Z",
    total_cost: 0.65725,
  },
  {
    id: "65c328b54ae7ab9251829e3f",
    invoice_number: 1000001,
    plan_id: "65b0b5117b92b25fe3ecbbff",
    org_id: "65bd07d8ffa05c77d828eaaa",
    org_name: "DemoOrg",
    pdf: "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GhiMMGpgMMKogcEIowYGI4waGAAAAAAAAPhvAAAA//9j05tQCmVuZHN0cmVhbQplbmRvYmoKOCAwIG9iago8PC9UeXBlIC9YT2JqZWN0Ci9TdWJ0eXBlIC9JbWFnZQovV2lkdGggMTc1Ci9IZWlnaHQgNDIKL0NvbG9yU3BhY2UgL0RldmljZUdyYXkKL0JpdHNQZXJDb21wb25lbnQgOAovRmlsdGVyIC9GbGF0ZURlY29kZQovRGVjb2RlUGFybXMgPDwvUHJlZGljdG9yIDE1IC9Db2xvcnMgMSAvQml0c1BlckNvbXBvbmVudCA4IC9Db2x1bW5zIDE3NT4+Ci9MZW5ndGggMTAzPj4Kc3RyZWFtCngB7NbRCcAgEMbga13czXUJ8xDIN8ER/lK/Myq/6trpXlh7YNWXVV+Wra/tf2y717aHtdnv4zXbHmz32vZbX5ZtD93Lqi+rvqz6surLsvXtfcay7aF7WfVl1Zdl63sDAAD//0V3B8gKZW5kc3RyZWFtCmVuZG9iagoyIDAgb2JqCjw8Ci9Qcm9jU2V0IFsvUERGIC9UZXh0IC9JbWFnZUIgL0ltYWdlQyAvSW1hZ2VJXQovRm9udCA8PAovRjBhNzY3MDVkMThlMDQ5NGRkMjRjYjU3M2U1M2FhMGE4YzcxMGVjOTkgNiAwIFIKL0ZmNWQyZGU1ZjNhNzE2OTlhZTRiMmQ4MzE3OWU2MmQwOWU2ZmM0MTI2IDUgMCBSCj4+Ci9YT2JqZWN0IDw8Ci9JZjE3ZDAzODBhYzUzYmJiY2FhYWI0MGY4MTA1YmI1NjU5NDQ0NTQ1ZSA3IDAgUgo+PgovQ29sb3JTcGFjZSA8PAo+Pgo+PgplbmRvYmoKOSAwIG9iago8PAovUHJvZHVjZXIgKP7/AEYAUABEAEYAIAAxAC4ANykKL0NyZWF0aW9uRGF0ZSAoRDoyMDI0MDIwNzEyMjIxMykKL01vZERhdGUgKEQ6MjAyNDAyMDcxMjIyMTMpCj4+CmVuZG9iagoxMCAwIG9iago8PAovVHlwZSAvQ2F0YWxvZwovUGFnZXMgMSAwIFIKL05hbWVzIDw8Ci9FbWJlZGRlZEZpbGVzIDw8IC9OYW1lcyBbCiAgCl0gPj4KPj4KPj4KZW5kb2JqCnhyZWYKMCAxMQowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDExODIgMDAwMDAgbiAKMDAwMDAwNDg5OCAwMDAwMCBuIAowMDAwMDAwMDA5IDAwMDAwIG4gCjAwMDAwMDAxNDMgMDAwMDAgbiAKMDAwMDAwMTI2OSAwMDAwMCBuIAowMDAwMDAxMzcwIDAwMDAwIG4gCjAwMDAwMDE0NjYgMDAwMDAgbiAKMDAwMDAwNDU1NCAwMDAwMCBuIAowMDAwMDA1MTU3IDAwMDAwIG4gCjAwMDAwMDUyNzAgMDAwMDAgbiAKdHJhaWxlcgo8PAovU2l6ZSAxMQovUm9vdCAxMCAwIFIKL0luZm8gOSAwIFIKPj4Kc3RhcnR4cmVmCjUzNjgKJSVFT0YK",
    status: "unpaid",
    created_at: "2024-02-07T06:52:37.984Z",
    total_cost: 1.2,
  },
];

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

function EnhancedTable() {
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [orderBy, setOrderBy] = useState<keyof Data>("total_cost");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [invoices, setInvoices] = useState<Data[]>([]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
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
  }, [order, orderBy]);

  const getListOfInvoices = () => {
    listOfInvoice().then(
      response => {
        if (response) { setInvoices(response.data) }
      }
    )
  }

  useEffect(() => {
    getListOfInvoices();
  }, [])

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
              {sortedRows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => (
                  <TableRow key={index + 1}>
                    <TableCell> {row.id}</TableCell>
                    <TableCell align="left">$ {row.total_cost}</TableCell>
                    <TableCell align="left">
                      {formatDate(row.created_at)}
                    </TableCell>
                    <TableCell align="left">
                      {/* <object style={{width: '100%', height: '200pt'}} type="application/pdf" data={'data:application/pdf;base64,'+row.pdf}>DOWNLOAD</object> */}
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
                        label={row.status ? toTitleCase(row.status) : "Pending"}
                        color={getStatusChipColor(row.status)}
                        variant="outlined"
                      />
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={invoices.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
}

export default EnhancedTable;
