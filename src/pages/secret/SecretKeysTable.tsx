import React, { useContext, useEffect, useState } from "react";
import { Box, Button, Card, IconButton, Input, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField } from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { LOCALSTORAGE_CONSTANTS } from "src/@core/static/app.constant";
import { deleteSecret, getsecretkeys, saveSecret, updateEditedSecret } from "src/services/secretservice";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import SaveIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { SecretContext } from "src/context/SecretContext";
import { decryptKey, encryptKey } from "./encryption_decryption";
import DragDropFile, { FileData } from "../create-app/dragdropfile";
import ConfirmationDialog from "src/component/ConfirmationDialog";
import AddSecret from "./AddSecret";

interface Row {
    id: number;
    name: string;
    testSecret_id: string;
    stageSecret_id: string;
    prodSecret_id: string;
    test: string;
    stage: string;
    prod: string;
    editedTest: string;
    editedStage: string;
    editedProd: string;
    isEditingTest: boolean;
    isEditingStage: boolean;
    isEditingProd: boolean;
    [key: string]: string | number | boolean; // Allow boolean type for specific keys
}

interface OrganizedData {
    key: string;
    secret_id: string[];
    value: string[];
    environment: string[];
}

type SortConfig = {
    column: string;
    direction: 'ascending' | 'descending';
};

const SecretKeysTable = () => {
    const secretContext = useContext(SecretContext);
    const [selectedWorkspace, setSelectedWorkspace] = useState("");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [loading, setLoading] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [tableData, setTableData] = useState<Row[]>([]);
    const [visibleRows, setVisibleRows] = useState<{ [key: number]: boolean }>({});
    const [editedSecretDataArray, setEditedSecretDataArray] = useState<Row[]>([...tableData]);
    const [decryptedResults, setDecryptedResults] = useState<{ key: string; value: string; environment: string; id: string }[]>([]);
    const environments = ['test', 'stage', 'prod'];
    const [isAddSecretModalOpen, setIsAddSecretModalOpen] = useState(false);
    const [filteredData, setFilteredData] = useState<{ key: string; value: string; environment: string; id: string }[]>([]);
    const isSecret: boolean = true;
    const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
    const [confirmDialog, setConfirmDialog] = useState<boolean>(false);
    const [message, setMessage] = useState<string>('');
    const [confirmData, setConfirmData] = useState<Row | null>(null);

    const handleChangePage = (event: any, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: { target: { value: string } }) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    useEffect(() => {
        const fetchDataAndFilter = async () => {
            await fetchData();
            filterData();
        };

    }, [searchTerm, decryptedResults, setTableData]);

    useEffect(() => {
        fetchData();
    }, [searchTerm, secretContext.workspace, selectedWorkspace]);

    const filterData = async () => {
        if (!searchTerm) {
            setFilteredData(decryptedResults);
        } else {
            const filteredResults = decryptedResults.filter((item) => {
                return (
                    item.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item.value.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item.environment.toLowerCase().includes(searchTerm.toLowerCase())
                );
            });
            setFilteredData(filteredResults);
            // Now, you can safely call organizeArrayByEnvironment with the updated filteredData
            await organizeArrayByEnvironment(filteredData);
        }
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const promises = environments.map(async (element) => {
                const res = await getsecretkeys(secretContext.workspace, element);
                return res?.data?.data;
            });
            const resultsArray = await Promise.all(promises);
            const decryptedResultsArray = [];
            for (const dataArray of resultsArray) {
                if (dataArray) {
                    for (const secretData of dataArray) {
                        const privateKey = localStorage.getItem(LOCALSTORAGE_CONSTANTS.privateKey) ?? '';

                        const decryptedKey = await decryptKey(
                            privateKey,
                            secretData.id,
                            secretData.secretKeyIV,
                            secretData.secretKeyTag,
                            secretData.secretKeyCiphertext,
                            secretData.secretValueIV,
                            secretData.secretValueTag,
                            secretData.secretValueCiphertext
                        );
                        decryptedResultsArray.push({ key: decryptedKey.key, value: decryptedKey.value, environment: secretData.environment, id: secretData.id });
                    }
                }
            }
            setDecryptedResults(decryptedResultsArray);
            await organizeArrayByEnvironment(decryptedResultsArray);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const organizeArrayByEnvironment = async (
        arr: { key: string; value: string; environment: string, id: string }[]
    ): Promise<OrganizedData[]> => {
        const organizedData: { [key: string]: OrganizedData } = {};
        arr.forEach(obj => {
            const key = obj.key;
            // const secret_id = obj.id
            const environment = obj.environment;
            if (!organizedData[key]) {
                organizedData[key] = {
                    key: key,
                    secret_id: [],
                    value: [],
                    environment: [],
                };
            }
            organizedData[key].value.push(obj.value);
            organizedData[key].environment.push(environment);
            organizedData[key].secret_id.push(obj.id);
        });

        const updatedTableData: Row[] = Object.values(organizedData).map(
            (result, index) => ({
                id: index + 1,
                name: result.key,
                testSecret_id: result.environment.includes('test') ? result.secret_id[result.environment.indexOf('test')] : '',
                stageSecret_id: result.environment.includes('stage') ? result.secret_id[result.environment.indexOf('stage')] : '',
                prodSecret_id: result.environment.includes('prod') ? result.secret_id[result.environment.indexOf('prod')] : '',
                test: result.environment.includes('test') ? result.value[result.environment.indexOf('test')] : '',
                stage: result.environment.includes('stage') ? result.value[result.environment.indexOf('stage')] : '',
                prod: result.environment.includes('prod') ? result.value[result.environment.indexOf('prod')] : '',
                editedTest: '',
                editedStage: '',
                editedProd: '',
                isEditingTest: false,
                isEditingStage: false,
                isEditingProd: false,
            })
        );
        await setTableData(updatedTableData);
        return Object.values(organizedData);
    };

    const handleSort = (column: string) => {
        setSortConfig((prevConfig) => {
            if (!prevConfig || prevConfig.column !== column) {
                return { column, direction: 'ascending' };
            }
            return { column, direction: prevConfig.direction === 'ascending' ? 'descending' : 'ascending' };
        });
        setTableData((prevData) => {
            const newData = [...prevData];
            newData.sort((a, b) => {
                const valueA = String(a[column]).toLowerCase();
                const valueB = String(b[column]).toLowerCase();
                return (sortConfig?.direction === 'ascending') ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
            });
            return newData;
        });
    };

    const handleAction = (action: string, rowData: Row) => {
        switch (action) {
            case 'Visibility':
                setVisibleRows((prevState) => ({
                    ...prevState,
                    [rowData.id]: !prevState[rowData.id],
                }));
                break;
            case 'Save':
                setEditedSecretDataArray((prevArray) => {
                    const existingIndex = prevArray.findIndex((item) => item.id === rowData.id);
                    if (existingIndex !== -1) {
                        prevArray[existingIndex] = {
                            ...rowData,
                            editedTest: rowData.editedTest,
                            editedStage: rowData.editedStage,
                            editedProd: rowData.editedProd,
                        };
                    } else {
                        prevArray.push({
                            ...rowData,
                            editedTest: rowData.editedTest,
                            editedStage: rowData.editedStage,
                            editedProd: rowData.editedProd,
                        });
                    }
                    return [...prevArray];
                });
                updateEditedSecrets([...editedSecretDataArray]).then(result => {
                    if (result?.length != null) {
                        fetchData();
                        rowData.isEditingTest = false;
                        rowData.isEditingStage = false;
                        rowData.isEditingProd = false;
                        setVisibleRows((prevState) => ({
                            ...prevState,
                            [rowData.id]: !prevState[rowData.id],
                        }));
                    }

                });
                break;
            case 'Discard':
                setTableData((prevData) =>
                    prevData.map((prevRow) =>
                        prevRow.id === rowData.id
                            ? {
                                ...prevRow,
                                editedTest: prevRow.test,
                                editedStage: prevRow.stage,
                                editedProd: prevRow.prod,
                                isEditing: false,
                                isEditingTest: false,
                                isEditingStage: false,
                                isEditingProd: false,
                            }
                            : prevRow
                    )
                );
                break;
            case 'Delete':
                setMessage('Are you sure you want to delete this element ?');
                setConfirmDialog(true);
                setConfirmData(rowData);
                break;
            default:
                break;
        }
    };

    const handleConfirm = (rowData: Row | null) => {
        setConfirmDialog(false);
        if (rowData) {
            const { testSecret_id, stageSecret_id, prodSecret_id } = rowData;
            const idsToDelete: { id: any }[] = [];
            if (testSecret_id) idsToDelete.push({ id: testSecret_id });
            if (stageSecret_id) idsToDelete.push({ id: stageSecret_id });
            if (prodSecret_id) idsToDelete.push({ id: prodSecret_id });
            deleteSecret(idsToDelete)
                .then((result) => {
                    if (result.status === 200) {
                        fetchData();
                    }
                })
                .catch((error) => {
                    console.error('Error deleting secrets', error);
                });
            setTableData((prevData) => prevData.filter((prevRow) => idsToDelete.every(({ id }) => prevRow.id !== id)));
        }
    };


    const updateEditedSecrets = async (editedSecretDataArray: Row[]) => {
        const putRequests = [];
        const postRequests: any[] = [];
        for (const element of editedSecretDataArray) {
            const envs = [];
            if (element.isEditingTest) {
                envs.push({ isTest: "test" });
            }
            if (element.isEditingStage) {
                envs.push({ isStage: "stage" });
            }
            if (element.isEditingProd) {
                envs.push({ isProd: "prod" });
            }
            for (const env of envs) {
                if (element.isEditingTest || element.isEditingStage || element.isEditingProd) {
                    const key = element.name;
                    const value = env.isTest ? element.editedTest : env.isStage ? element.editedStage : element.editedProd;
                    const secret_id = env.isTest ? element.testSecret_id : env.isStage ? element.stageSecret_id : element.prodSecret_id;
                    const environment = env.isTest ? 'test' : env.isStage ? 'stage' : 'prod';
                    const privateKey = localStorage.getItem(LOCALSTORAGE_CONSTANTS.privateKey) ?? '';
                    const encryptedKeysResponse = await encryptKey(privateKey, key, value, environment);
                    if (secret_id != "") {
                        const putRequest = {
                            "environment": environment,
                            "id": secret_id,
                            "workspace_id": secretContext.workspace,
                            "secretKeyCiphertext": encryptedKeysResponse.encrypted_key_ciphertext,
                            "secretKeyIV": encryptedKeysResponse.encrypted_key_iv,
                            "secretKeyTag": encryptedKeysResponse.encrypted_key_tag,
                            "secretValueCiphertext": encryptedKeysResponse.encrypted_value_ciphertext,
                            "secretValueIV": encryptedKeysResponse.encrypted_value_iv,
                            "secretValueTag": encryptedKeysResponse.encrypted_value_tag
                        };
                        putRequests.push(putRequest);
                    } else if (!secret_id || secret_id === "") {
                        const postRequest = {
                            "environment": environment,
                            "workspace_id": secretContext.workspace,
                            "secretKeyCiphertext": encryptedKeysResponse.encrypted_key_ciphertext,
                            "secretKeyIV": encryptedKeysResponse.encrypted_key_iv,
                            "secretKeyTag": encryptedKeysResponse.encrypted_key_tag,
                            "secretValueCiphertext": encryptedKeysResponse.encrypted_value_ciphertext,
                            "secretValueIV": encryptedKeysResponse.encrypted_value_iv,
                            "secretValueTag": encryptedKeysResponse.encrypted_value_tag
                        };
                        postRequests.push(postRequest);
                    }
                }
            }
        }        
        let saveSecretResponses: [] = [];
        if (putRequests.length > 0) {
            saveSecretResponses = await updateEditedSecret(putRequests);
        } 
        if (postRequests.length > 0) {
            saveSecretResponses = await saveSecret(postRequests);
        }
        const updateResults = await Promise.all([
            saveSecretResponses
        ]);
    
        let result = updateResults.find((res) => res);

        return result
    };

    const setEditedValue = (field: string, id: number, value: string) => {
        setTableData((prevData: any) => {
            const updatedData = prevData.map((prevRow: any) =>
                prevRow.id === id
                    ? {
                        ...prevRow,
                        editedTest: prevRow.editedTest ? prevRow.editedTest : '',
                        [`edited${field.charAt(0).toUpperCase() + field.slice(1)}`]: value,
                    }
                    : prevRow
            );
            return updatedData;
        });
    };

    const handleAddSecretOpen = () => {
        setIsAddSecretModalOpen(true);
    };

    const handleAddSecretClose = () => {
        setIsAddSecretModalOpen(false);
    };

    const handleOnClick = (row: Row, column: string) => {
        setTableData((prevData) =>
            prevData.map((prevRow) =>
                prevRow.id === row.id
                    ? {
                        ...prevRow,
                        isEditingTest: column === 'test' ? !prevRow.isEditingTest : prevRow.isEditingTest,
                        isEditingStage: column === 'stage' ? !prevRow.isEditingStage : prevRow.isEditingStage,
                        isEditingProd: column === 'prod' ? !prevRow.isEditingProd : prevRow.isEditingProd,
                        editedTest: column === 'test' ? row.test : prevRow.editedTest,
                        editedStage: column === 'stage' ? row.stage : prevRow.editedStage,
                        editedProd: column === 'prod' ? row.prod : prevRow.editedProd,
                    }
                    : prevRow
            )
        );
    };

    const handleUpdateForm = async (data: FileData[], isTest: boolean, isStg: boolean, isProd: boolean,) => {
        const envs = [{ isTest: isTest ? "test" : '' },
        { isStage: isStg ? "stage" : '' },
        { isProd: isProd ? "prod" : '' }]
        const requests: any[] = [];

        for (const element of data) {
            for (let index = 0; index < envs.length; index++) {
                const env = envs[index];

                if (env.isTest || env.isStage || env.isProd) {
                    const key = element.key;
                    const value = element.value;
                    const environment = env.isTest ? 'test' : env.isStage ? 'stage' : 'prod';
                    const privateKey = localStorage.getItem(LOCALSTORAGE_CONSTANTS.privateKey) ?? '';
                    const encryptedKeysResponse = await encryptKey(privateKey, key, value, environment);

                    const request = {
                        "environment": environment,
                        "workspace_id": secretContext.workspace,
                        "secretKeyCiphertext": encryptedKeysResponse.encrypted_key_ciphertext,
                        "secretKeyIV": encryptedKeysResponse.encrypted_key_iv,
                        "secretKeyTag": encryptedKeysResponse.encrypted_key_tag,
                        "secretValueCiphertext": encryptedKeysResponse.encrypted_value_ciphertext,
                        "secretValueIV": encryptedKeysResponse.encrypted_value_iv,
                        "secretValueTag": encryptedKeysResponse.encrypted_value_tag
                    };
                    requests.push(request);
                }
            }
        }
        const saveSecretResponse = await saveSecret(requests);
        if (saveSecretResponse.status === 200) {
            fetchData();
        }
    }

    return (
        <><Card sx={{ marginTop: "20px" }}>
            <Box display="flex" flexDirection="column">
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={2}
                    pb={2}
                >
                    <Button variant="contained" color="primary" style={{ marginLeft: '10px', padding: '10px', marginTop: '10px' }} onClick={handleAddSecretOpen}>
                        <AddIcon style={{ marginRight: '5px' }} />
                        Add Secret
                    </Button>
                    <Box
                        display="flex"
                        alignItems="center"
                        sx={{ marginRight: "20px", marginTop: "30px" }}
                    >
                        <Input
                            placeholder="Search"
                            sx={{
                                border: "1px solid #ced4da",
                                borderRadius: "8px",
                                padding: "8px",
                            }}
                            size="small"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)} />
                    </Box>
                </Box>
                <AddSecret open={isAddSecretModalOpen} onDialogClose={handleAddSecretClose} fetchData={fetchData} />
                <TableContainer sx={{ width: "100%" }}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{
                                backgroundColor: (theme) => theme.palette.primary.main + "10",
                            }}>
                                <TableCell
                                    onClick={() => handleSort("name")}
                                    style={{ width: 300 }}>
                                    <Box display="flex" alignItems="center">
                                        <span>Name</span>
                                        <Box display="flex" flexDirection="column" ml={6}>
                                            <KeyboardArrowUpIcon
                                                sx={{ color: "gray", marginBottom: "-6px" }} />
                                            <KeyboardArrowDownIcon
                                                sx={{ color: "gray", marginTop: "-6px" }} />
                                        </Box>
                                    </Box>
                                </TableCell>
                                <TableCell
                                    onClick={() => handleSort("test")}
                                    style={{ width: 300 }}>
                                    <Box display="flex" alignItems="center">
                                        <span>Test</span>
                                        <Box display="flex" flexDirection="column" ml={6}>
                                            <KeyboardArrowUpIcon
                                                sx={{ color: "gray", marginBottom: "-6px" }} />
                                            <KeyboardArrowDownIcon
                                                sx={{ color: "gray", marginTop: "-6px" }} />
                                        </Box>
                                    </Box>
                                </TableCell>
                                <TableCell
                                    onClick={() => handleSort("stage")}
                                    style={{ width: 300 }}>
                                    <Box display="flex" alignItems="center">
                                        <span>Stage</span>
                                        <Box display="flex" flexDirection="column" ml={6}>
                                            <KeyboardArrowUpIcon
                                                sx={{ color: "gray", marginBottom: "-6px" }} />
                                            <KeyboardArrowDownIcon
                                                sx={{ color: "gray", marginTop: "-6px" }} />
                                        </Box>
                                    </Box>
                                </TableCell>
                                <TableCell
                                    onClick={() => handleSort("prod")}
                                    style={{ width: 300 }}>
                                    <Box display="flex" alignItems="center">
                                        <span>Prod</span>
                                        <Box display="flex" flexDirection="column" ml={6}>
                                            <KeyboardArrowUpIcon
                                                sx={{ color: "gray", marginBottom: "-6px" }} />
                                            <KeyboardArrowDownIcon
                                                sx={{ color: "gray", marginTop: "-6px" }} />
                                        </Box>
                                    </Box>
                                </TableCell>
                                <TableCell>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {tableData && tableData.length > 0 ? (
                                tableData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                                    <TableRow key={row.id}>
                                        <TableCell>{row.name}</TableCell>
                                        <TableCell>
                                            {row.isEditingTest ? (
                                                <TextField
                                                    value={row.editedTest || ''}
                                                    onChange={(e) => setEditedValue('test', row.id, e.target.value)}
                                                    onFocus={(e) => e.stopPropagation()}
                                                    autoFocus />
                                            ) : (
                                                <div
                                                    style={{ cursor: 'pointer' }}
                                                    onClick={() => handleOnClick(row, 'test')}
                                                >
                                                    {visibleRows[row.id] ? row.test || 'NA' : '******'}
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {row.isEditingStage ? (
                                                <TextField
                                                    value={row.editedStage || ''}
                                                    onChange={(e) => setEditedValue('stage', row.id, e.target.value)}
                                                    onFocus={(e) => e.stopPropagation()}
                                                    autoFocus />
                                            ) : (
                                                <div
                                                    style={{ cursor: 'pointer' }}
                                                    onClick={() => handleOnClick(row, 'stage')} >
                                                    {visibleRows[row.id] ? row.stage || 'NA' : '******'}
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {row.isEditingProd ? (
                                                <TextField
                                                    value={row.editedProd || ''}
                                                    onChange={(e) => setEditedValue('prod', row.id, e.target.value)}
                                                    onFocus={(e) => e.stopPropagation()}
                                                    autoFocus />
                                            ) : (
                                                <div
                                                    style={{ cursor: 'pointer' }}
                                                    onClick={() => handleOnClick(row, 'prod')}
                                                >
                                                    {visibleRows[row.id] ? row.prod || 'NA' : '******'}
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            {(row.isEditingTest || row.isEditingStage || row.isEditingProd) ? (
                                                <>
                                                    <IconButton onClick={() => handleAction('Save', row)}>
                                                        <SaveIcon />
                                                    </IconButton>
                                                    <IconButton onClick={() => handleAction('Discard', row)}>
                                                        <ClearIcon />
                                                    </IconButton>
                                                </>
                                            ) : (
                                                <>
                                                    <IconButton onClick={() => handleAction('Visibility', row)}>
                                                        {visibleRows[row.id] ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                                    </IconButton>
                                                    <IconButton onClick={() => handleAction('Delete', row)}>
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={5}
                                        style={{
                                            textAlign: "center",
                                            fontSize: "18px",
                                            paddingTop: "50px",
                                            paddingBottom: "50px",
                                        }}
                                    >
                                        {loading ? "Loading ..." : "No Data Available"}
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={tableData.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage} />
            </Box>
        </Card >
            <ConfirmationDialog open={confirmDialog} onConfirm={() => handleConfirm(confirmData)} onCancel={() => setConfirmDialog(false)} message={message} />
            <div style={{ marginTop: 15 }}>
                <DragDropFile updateForm={handleUpdateForm} isSecret={isSecret} />
            </div>
        </>
    );
};

export default SecretKeysTable;