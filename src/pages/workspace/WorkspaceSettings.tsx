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
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import DestroyWorkspace from './DestroyWorkspace';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import CloseIcon from '@mui/icons-material/Close';

const WorkspaceSettings: React.FC = () => {
    const workspaceSettingsData = [
        { id: 1, userFullName: 'John Doe', role: 'Admin', emailAddress: 'john@example.com', status: 'Active' },
    ];

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [selectedRow, setSelectedRow] = React.useState<number | null>(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [isAddUserDialogOpen, setAddUserDialogOpen] = useState(false);

    const handleMenuClick = (event: React.MouseEvent<HTMLElement>, rowId: number) => {
        setAnchorEl(event.currentTarget);
        setSelectedRow(rowId);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedRow(null);
    };

    const handleOptionClick = (option: string) => {
        console.log(`Option '${option}' clicked for row ${selectedRow}`);
        handleMenuClose();
    };

    const handleAddUserClick = () => {
        setAddUserDialogOpen(true);
    };

    const handleAddUserDialogClose = () => {
        setAddUserDialogOpen(false);
    };

    const handleAddUser = () => {
        console.log('User added');
        handleAddUserDialogClose();
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
            <Card sx={{ margin: '0 0 30px 0' }}>
                <Typography variant="h3" gutterBottom>Workspace Settings</Typography>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <Typography variant="h5">Workspace Users</Typography>
                    <Button variant="contained" color="primary" onClick={handleAddUserClick} sx={{ marginLeft: 'auto' }}>Add User</Button>
                </div>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: theme => theme.palette.primary.main + '10' }}>
                                <TableCell>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>UserFullName</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="subtitle1">Role</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="subtitle1">Email Address</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="subtitle1">Status</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="subtitle1">Action</Typography>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {(rowsPerPage > 0
                                ? workspaceSettingsData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                : workspaceSettingsData
                            ).map((row) => (
                                <TableRow key={row.id}>
                                    <TableCell>
                                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                            {row.userFullName}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary" component="div">
                                            @{row.userFullName.split(' ')[0]}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>{row.role}</TableCell>
                                    <TableCell>{row.emailAddress}</TableCell>
                                    <TableCell>
                                        <span style={{ color: row.status === 'Active' ? 'green' : 'red' }}>
                                            {row.status}
                                        </span>
                                    </TableCell>
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
                                            <MenuItem onClick={() => handleOptionClick('b')}>Remove</MenuItem>
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
                    sx={{ marginLeft: '16px' }}
                />
            </Card>
            <Card sx={{ margin: '16px 0 0 0' }}>
                <DestroyWorkspace onConfirmDestroy={() => console.log('Destroy Workspace')} loading={false} />
            </Card>
            <Dialog open={isAddUserDialogOpen} onClose={handleAddUserDialogClose} maxWidth="sm" fullWidth>
                <DialogTitle>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        Add User
                        <IconButton onClick={handleAddUserDialogClose} sx={{ marginLeft: 'auto' }}>
                            <CloseIcon />
                        </IconButton>
                    </Typography>
                </DialogTitle>
                <DialogContent> 
                    <Typography variant="h6" sx={{ fontWeight: 'bold', textAlign: 'center' }}>Invite User</Typography>
                    <Typography variant="subtitle1" sx={{ textAlign: 'center' }}>Add User to the workspace</Typography>
                    <TextField label="User Email" fullWidth sx={{ marginTop: '16px' }} />
                    <TextField
                        label="Role"
                        fullWidth
                        select
                        SelectProps={{
                            native: false, // Set to true for using native select
                        }}
                        sx={{ marginTop: '16px', display: 'inline-block', width: 'calc(50% - 8px)', marginRight: '8px' }}
                    >
                        <MenuItem value="admin">Admin</MenuItem>
                        <MenuItem value="workspaceAdmin">Workspace Admin</MenuItem>
                        <MenuItem value="developer">Developer</MenuItem>
                    </TextField>
                    <Button onClick={handleAddUser} color="primary" sx={{ marginTop: '16px', display: 'inline-block' }}>Add</Button>
                </DialogContent>
                <DialogActions></DialogActions>
            </Dialog>
        </>
    );
};

export default WorkspaceSettings;
