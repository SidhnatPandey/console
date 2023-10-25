import React, { useEffect, useState } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import TablePagination from '@mui/material/TablePagination';
import Chip from '@mui/material/Chip'; // Import Chip component
import { useRouter } from 'next/router';
import { appList } from 'src/services/appService';

interface Row {
  id: number;
  name: string;
  currentEnv: string;
  lastDeployed: string;
  liveAppUrl: string;
  status: string;
}

interface AppListProps {
  selectedRow: number | null;
  setSelectedRow: React.Dispatch<React.SetStateAction<number | null>>;
}

const EnhancedTableHead: React.FC<{
  onRequestSort: (property: keyof Row) => void;
  order: 'asc' | 'desc';
  orderBy: string;
}> = ({ onRequestSort, order, orderBy }) => {

  const headCells: { id: keyof Row; label: string }[] = [
    { id: 'name', label: 'NAME' },
    { id: 'currentEnv', label: 'Current Env' },
    { id: 'lastDeployed', label: 'Last Deployed' },
    { id: 'liveAppUrl', label: 'LIVE APP URL' },
    { id: 'status', label: 'STATUS' },
  ];

  const createSortHandler = (property: keyof Row) => {
    return () => {
      onRequestSort(property);
    };
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={() => {
                createSortHandler(headCell.id)
              }}
            >
              {headCell.label}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

const rowsPerPageOptions = [5, 10, 25]; // Options for rows per page

const Apps: React.FC<AppListProps> = () => {
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = useState<keyof Row>('name'); // Default sorting by 'name'
  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  const [appListData, setAppListData] = useState<Row[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const router = useRouter();

  useEffect(() => {
    getAppList();
  }, []);

  const getAppList = () => {
    appList()
      .then((response: { data: Row[] }) => {
        const data = response.data
        setAppListData(data);
      })
      .catch((error: any) => {
        console.log(error);
      });
  }

  const getStatusChipColor = (status: any) => {
    switch (status) {
      case 'Deployed':
        return 'success'; // Green color for Deployed status
      case 'Running':
        return 'primary'; // Blue color for Running status
      case 'Failed':
        return 'error'; // Red color for Failed status
      default:
        return 'warning'; // Default color for other statuses
    }
  };

  const handleRequestSort = (property: keyof Row) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleRowClick = (rowId: number) => {
    setSelectedRow(rowId);
    router.push({ pathname: '/apps/app-dashboard', query: { appId: rowId } });
    // Render your component here based on the selected row ID
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      <Paper>
        <TableContainer style={{ height: "100%" }}>
          <Table style={{ height: "100%" }}>
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
            />
            {/* // .slice()
              // .sort((a, b) =>
              //   order === 'asc'
              //     ? a[orderBy] > b[orderBy]
              //       ? 1
              //       : -1
              //     : b[orderBy] > a[orderBy]
              //       ? 1
              //       : -1
              // ) */}
            <TableBody style={{ height: "100%" }}>
              {appListData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row: any) => (
                  <TableRow
                    key={row.id}
                    onClick={() => handleRowClick(row.id)}
                    selected={selectedRow === row.id}
                    hover
                    style={{ cursor: 'pointer', height: "100%" }}
                  >
                    <TableCell>{row.application_name}</TableCell>
                    <TableCell>{row.currentEnv}</TableCell>
                    <TableCell>{row.lastDeployed}</TableCell>
                    <TableCell>{row.liveAppUrl}</TableCell>
                    <TableCell>
                      <Chip
                        label={row.status ? row.status : 'unknown'}
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
          rowsPerPageOptions={rowsPerPageOptions}
          component="div"
          count={appListData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </>
  );
};

export default Apps;