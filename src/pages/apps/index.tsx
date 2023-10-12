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
import AppDashboardHome from './app-dashboard';
import { useRouter } from 'next/router';
import { appList } from 'src/services/dashboardService';

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

const createData = ({
  name,
  currentEnv,
  lastDeployed,
  liveAppUrl,
  status,
}: {
  name: string;
  currentEnv: string;
  lastDeployed: string;
  liveAppUrl: string;
  status: string;
}): Row => {
  return {
    id: Math.floor(Math.random() * 1000), // Generate a unique ID for the row
    name,
    currentEnv,
    lastDeployed,
    liveAppUrl,
    status,
  };
};

const rows: Row[] = [
  createData({
    name: 'App 1',
    currentEnv: 'Production',
    lastDeployed: '28 Days ago',
    liveAppUrl: 'http://app1.com',
    status: 'Active',
  }),
  createData({
    name: 'App 2',
    currentEnv: 'Development',
    lastDeployed: '20 Days ago',
    liveAppUrl: 'http://app2.com',
    status: 'Inactive',
  }),
  createData({
    name: 'App 3',
    currentEnv: 'Testing',
    lastDeployed: '15 Days ago',
    liveAppUrl: 'http://app3.com',
    status: 'Active',
  }),
  createData({
    name: 'App 4',
    currentEnv: 'Production',
    lastDeployed: '10 Days ago',
    liveAppUrl: 'http://app4.com',
    status: 'Inactive',
  }),
  createData({
    name: 'App 5',
    currentEnv: 'Development',
    lastDeployed: '5 Days ago',
    liveAppUrl: 'http://app5.com',
    status: 'Active',
  }),
];

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
  const [apiData, setApiData] = useState<Row[]>([]); // State to store API data
  const [appListData, setAppListData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const router = useRouter();

  useEffect(() => {
    getAppList('auth0|64f06f85f372cefc09f3460e');
  }, []);

  const getAppList = (id: string) => {
    appList(id)
      .then((response: any) => {
        setAppListData(response.data);
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
        return 'default'; // Default color for other statuses
    }
  };

  const handleRequestSort = (property: keyof Row) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleRowClick = (rowId: number) => {
    setSelectedRow(rowId);
    router.push('/apps/app-dashboard');
    // Render your component here based on the selected row ID
    console.log(`Clicked row with ID: ${rowId}`);
  };

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, appListData.length - page * rowsPerPage);

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
        <TableContainer>
          <Table>
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
            <TableBody>
              {appListData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row: any) => (
                  <TableRow
                    key={row.id}
                    onClick={() => handleRowClick(row.id)}
                    selected={selectedRow === row.id}
                    hover
                    style={{ cursor: 'pointer' }}
                  >
                    <TableCell>{row.application_name}</TableCell>
                    <TableCell>{row.currentEnv}</TableCell>
                    <TableCell>{row.lastDeployed}</TableCell>
                    <TableCell>{row.liveAppUrl}</TableCell>
                    <TableCell>
                      <Chip
                        label={row.status}
                        color={getStatusChipColor(row.status)}
                        variant="outlined"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={5} />
                </TableRow>
              )}
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
