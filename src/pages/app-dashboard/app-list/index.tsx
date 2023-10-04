import React, { useState } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';

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

interface EnhancedTableProps {
  onRequestSort: (property: keyof Row) => void;
  order: 'asc' | 'desc';
  orderBy: string;
}
const EnhancedTableHead: React.FC<EnhancedTableProps> = ({
  onRequestSort,
  order,
  orderBy,
}) => {
  const headCells: { id: string| keyof Row; label: string }[] = [
    { id: '1', label: 'NAME' },
    { id: '2', label: 'Current Env' },
    { id: '3', label: 'Last Deployed' },
    { id: '4', label: 'LIVE APP URL' },
    { id: '5', label: 'STATUS' }
  ];

  const createSortHandler = (property: any) => {
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
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

const AppList: React.FC<AppListProps> = ({ selectedRow, setSelectedRow }) => {
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = useState<keyof Row>('id');

  const handleRequestSort = (property: keyof Row) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleRowClick = (rowId: number) => {
    setSelectedRow(rowId);
    // Render your component here based on the selected row ID
    console.log(`Clicked row with ID: ${rowId}`);
  };

  return (
    <Paper>
      <TableContainer>
        <Table>
          <EnhancedTableHead
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
          />
          <TableBody>
            {rows
              .slice()
              .sort((a, b) =>
                order === 'asc'
                  ? a[orderBy] > b[orderBy]
                    ? 1
                    : -1
                  : b[orderBy] > a[orderBy]
                  ? 1
                  : -1
              )
              .map((row) => (
                <TableRow
                  key={row.id}
                  onClick={() => handleRowClick(row.id)}
                  selected={selectedRow === row.id}
                  hover
                  style={{ cursor: 'pointer' }}
                >
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.currentEnv}</TableCell>
                  <TableCell>{row.lastDeployed}</TableCell>
                  <TableCell>{row.liveAppUrl}</TableCell>
                  <TableCell>{row.status}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default AppList;
