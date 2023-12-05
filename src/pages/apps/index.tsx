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
import { convertDateFormat } from 'src/utils/dateUtil';
import CustomChip from 'src/@core/components/mui/chip'

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
      case 'Succeeded':
        return 'success'; // Green color for Deployed status
      case 'Running':
        return 'primary'; // Blue color for Running status
      case 'Failed':
        return 'error'; // Red color for Failed status
      default:
        return 'warning'; // Default color for other statuses
    }
  };

  const getCurrentEnv = (stage: any) => {
    switch (stage) {
      case 'deploy-test':
        return 'test';
      case 'test-approval':
        return 'test'
      case 'deploy-stg':
        return 'stg'
      case 'stg-approval':
        return 'stg'
      case 'deploy-prod':
        return 'prod'
      default:
        return '';
    }
  }

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
    <Paper>
      <TableContainer style={{ height: "100%" }}>
        <Table style={{ height: "100%" }}>
          <EnhancedTableHead
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
          />
          <TableBody style={{ height: "100%" }}>
            {appListData.length > 0 ? (
              appListData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row: any) => (
                  <TableRow
                    key={row.id}
                    onClick={() => handleRowClick(row.id)}
                    selected={selectedRow === row.id}
                    hover
                    style={{ cursor: 'pointer', height: '100%' }}
                  >
                    <TableCell style={{
                    fontSize: '14px',
                    fontWeight: 'bold',
                    color: '#7353e5'
                  }} >{row?.application_name}</TableCell>
                    <TableCell>{getCurrentEnv(row?.stage)}</TableCell>
                    <TableCell>{convertDateFormat(row?.last_deployed)}</TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}><a href={row?.url} target="_blank" rel="noopener noreferrer">{row.url}</a></TableCell>
                    <TableCell>
                      <CustomChip
                        rounded
                        skin='light'
                        label={row.status ? row.status : 'Pending'}
                        color={getStatusChipColor(row.status)}
                        variant="outlined"
                      />
                    </TableCell>
                  </TableRow>
                ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={5}
                  style={{
                    textAlign: 'center',
                    fontSize: '18px',
                    paddingTop: '50px', // Increase the top padding
                    paddingBottom: '50px', // Increase the bottom padding
                  }}
                >
                  No Apps
                </TableCell>

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
  );
};

export default Apps;