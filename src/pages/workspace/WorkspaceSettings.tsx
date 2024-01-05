import React, { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import { Typography } from '@mui/material';
import DestroyWorkspace from './DestroyWorkspace';

const WorkspaceSettings: React.FC = () => {
    // Dummy data for illustration
    const workspaceSettingsData = [
        { id: 1, userFullName: 'John Doe', role: 'Admin', emailAddress: 'john@example.com', status: 'Active' },
        // Add more rows as needed
    ];

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [selectedRow, setSelectedRow] = React.useState<number | null>(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const handleMenuClick = (event: React.MouseEvent<HTMLElement>, rowId: number) => {
        setAnchorEl(event.currentTarget);
        setSelectedRow(rowId);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedRow(null);
    };

    const handleOptionClick = (option: string) => {
        // Handle the click for each option ('a' or 'b')
        console.log(`Option '${option}' clicked for row ${selectedRow}`);
        handleMenuClose();
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <div>
            <Typography variant="h4" gutterBottom>Workspace Settings</Typography>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <Typography variant="h5">Workspace Users</Typography>
                <Button variant="contained" color="primary" onClick={() => console.log('Add User clicked')}>Add User</Button>
            </div>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>UserFullName</TableCell>
                            <TableCell>Role</TableCell>
                            <TableCell>Email Address</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {(rowsPerPage > 0
                            ? workspaceSettingsData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            : workspaceSettingsData
                        ).map((row) => (
                            <TableRow key={row.id}>
                                <TableCell>{row.userFullName}</TableCell>
                                <TableCell>{row.role}</TableCell>
                                <TableCell>{row.emailAddress}</TableCell>
                                <TableCell>{row.status}</TableCell>
                                <TableCell>
                                    <IconButton
                                        aria-label="more"
                                        aria-controls="long-menu"
                                        aria-haspopup="true"
                                        onClick={(e: React.MouseEvent<HTMLElement, MouseEvent>) => handleMenuClick(e, row.id)}
                                    >
                                        <MoreVertIcon />
                                    </IconButton>
                                    <Menu
                                        id="long-menu"
                                        anchorEl={anchorEl}
                                        keepMounted
                                        open={Boolean(anchorEl && selectedRow === row.id)}
                                        onClose={handleMenuClose}
                                    >
                                        <MenuItem onClick={() => handleOptionClick('a')}>Option A</MenuItem>
                                        <MenuItem onClick={() => handleOptionClick('b')}>Option B</MenuItem>
                                    </Menu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={workspaceSettingsData.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
            <DestroyWorkspace onConfirmDestroy={() => console.log('Destroy Workspace')} loading={false} />
        </div>
    );
};

export default WorkspaceSettings;
