import { Box, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@mui/material";
import { useContext, useState } from "react";
import { LOCALSTORAGE_CONSTANTS } from "src/@core/static/app.constant";
import { SecretContext } from "src/context/SecretContext";
import { encryptKey } from "src/secrets-util/encryption_decryption";
import { saveSecret } from "src/services/secretservice";

interface AddSecretProps {
    open: boolean,
    onDialogClose: any; //function
    fetchData: any; //function
}

const AddSecret: React.FC<AddSecretProps> = ({ open, onDialogClose, fetchData }) => {

    const secretContext = useContext(SecretContext);
    const [secretKeyName, setSecretKeyName] = useState("");
    const [selectedEnvironment, setSelectedEnvironment] = useState("test");
    const [secretValue, setSecretValue] = useState("");
    const [copyToOtherEnvironments, setCopyToOtherEnvironments] = useState(false);
    const [testValue, setTestValue] = useState("");
    const [stageValue, setStageValue] = useState("");
    const [prodValue, setProdValue] = useState("");
    const [keyNameError, setKeyNameError] = useState<string | null>(null);
    const [keyData, setKeyData] = useState({
        keyName: '',
        test: '',
        stage: '',
        prod: '',
        checkboxChecked: false,
    });


    const handleInputChange = (field: string, value: string) => {
        setKeyData((prevData) => {
            const newData = {
                ...prevData,
                [field]: value,
            };
            if (prevData.checkboxChecked && field === 'test') {
                newData.stage = value;
                newData.prod = value;
            } else if (prevData.checkboxChecked && field === 'stage') {
                newData.test = value;
                newData.prod = value;
            } else if (prevData.checkboxChecked && field === 'prod') {
                newData.test = value;
                newData.stage = value;
            }
            return newData;
        });
    };

    const handleCheckboxChange = () => {
        setKeyData((prevData) => ({
            ...prevData,
            checkboxChecked: !prevData.checkboxChecked,
        }));
    };

    const handleClose = () => {
        setSecretKeyName("");
        setSelectedEnvironment("test");
        setSecretValue("");
        setCopyToOtherEnvironments(false);
        setTestValue("");  // If these values are related to keyData.test, keyData.stage, and keyData.prod
        setStageValue("");
        setProdValue("");
        setKeyData({
            keyName: "",
            test: "",
            stage: "",
            prod: "",
            checkboxChecked: false,
        });
        setKeyNameError(null);
        onDialogClose();
    };
    

    const handleSave: React.MouseEventHandler<HTMLButtonElement> = async (event) => {
        if (!keyData.keyName.trim()) {
            setKeyNameError('Key is required');
            return;
        }
        setKeyNameError(null);
        if (!keyData.test.trim() && !keyData.stage.trim() && !keyData.prod.trim()) {
            setKeyNameError('At least one of the fields must have a value');
            return;
        }
        const requests: {
            workspace_id: string;
            environment: string;
            secretKeyCiphertext: string;
            secretKeyIV: string;
            secretKeyTag: string;
            secretValueCiphertext: string;
            secretValueIV: string;
            secretValueTag: string;
        }[] = [];
        const keysArray = [
            { key: 'test', value: keyData.test },
            { key: 'stage', value: keyData.stage },
            { key: 'prod', value: keyData.prod },
        ];

        const promises = keysArray.map(async (element) => {
            const privateKey = localStorage.getItem(LOCALSTORAGE_CONSTANTS.privateKey) ?? '';
            const key = keyData.keyName;
            const value = element.value;
            const environment = element.key;
            const encryptedKeysResponse = await encryptKey(privateKey, key, value, environment);
            const request = {
                "workspace_id": secretContext.workspace,
                "environment": encryptedKeysResponse.environment,
                "secretKeyCiphertext": encryptedKeysResponse.encrypted_key_ciphertext,
                "secretKeyIV": encryptedKeysResponse.encrypted_key_iv,
                "secretKeyTag": encryptedKeysResponse.encrypted_key_tag,
                "secretValueCiphertext": encryptedKeysResponse.encrypted_value_ciphertext,
                "secretValueIV": encryptedKeysResponse.encrypted_value_iv,
                "secretValueTag": encryptedKeysResponse.encrypted_value_tag
            };
            requests.push(request);
            return request;
        });
        try {
            const resolvedRequests = await Promise.all(promises);
            const saveSecretResponse = await saveSecret(resolvedRequests);
            if (saveSecretResponse.status === 200) {
                fetchData();
                if (keyData.checkboxChecked) {
                    setTestValue(keyData.test);
                    setStageValue(keyData.stage);
                    setProdValue(keyData.prod);
                }
                setKeyData({
                    keyName: "",
                    test: "",
                    stage: "",
                    prod: "",
                    checkboxChecked: false,
                });
                handleClose();
            } else {
                console.error('Error:', saveSecretResponse.statusText);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            style={{ zIndex: 1200 }}
            maxWidth={'lg'}
            fullWidth
        >
            <DialogTitle
                id="max-width-dialog-title"
                style={{ fontSize: "24px", textAlign: "center" }}
            >
                Create Secrets
            </DialogTitle>
            <DialogContent>
                <TableContainer sx={{ width: "100%" }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ borderBottom: 'none', textTransform: 'none' }}>
                                    <Box display="flex" alignItems="center">
                                        <h3>Key</h3>
                                    </Box>
                                </TableCell>
                                <TableCell sx={{ borderBottom: 'none', textTransform: 'none' }}>
                                    <Box display="flex" alignItems="center">
                                        <h3>Test</h3>
                                    </Box>
                                </TableCell>
                                <TableCell sx={{ borderBottom: 'none', textTransform: 'none' }}>
                                    <Box display="flex" alignItems="center">
                                        <h3>Stage</h3>
                                    </Box>
                                </TableCell>
                                <TableCell sx={{ borderBottom: 'none', textTransform: 'none' }}>
                                    <Box display="flex" alignItems="center">
                                        <h3>Prod</h3>
                                    </Box>
                                </TableCell>
                                <TableCell sx={{ borderBottom: 'none', textTransform: 'none' }}>
                                    <Box display="flex" alignItems="center">
                                        <h3>All</h3>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell sx={{ borderBottom: 'none', minHeight: '64px' }}>
                                    <TextField
                                        type="text"
                                        value={keyData.keyName}
                                        onChange={(e) => handleInputChange('keyName', e.target.value)}
                                        required
                                        error={!!keyNameError}
                                        helperText={keyNameError || '\u00A0'}
                                    /></TableCell>
                                <TableCell sx={{ borderBottom: 'none' }}>
                                    <TextField
                                        type="text"
                                        value={keyData.test}
                                        onChange={(e) => handleInputChange('test', e.target.value)}
                                        helperText={'\u00A0'}
                                    />
                                </TableCell>
                                <TableCell sx={{ borderBottom: 'none' }}>
                                    <TextField
                                        type="text"
                                        value={keyData.stage}
                                        onChange={(e) => handleInputChange('stage', e.target.value)}
                                        helperText={'\u00A0'}
                                    />
                                </TableCell>
                                <TableCell sx={{ borderBottom: 'none' }}>
                                    <TextField
                                        type="text"
                                        value={keyData.prod}
                                        onChange={(e) => handleInputChange('prod', e.target.value)}
                                        helperText={'\u00A0'}
                                    />
                                </TableCell>
                                <TableCell sx={{ borderBottom: 'none' }}>
                                    <Checkbox
                                        checked={keyData.checkboxChecked}
                                        onChange={handleCheckboxChange} />
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </DialogContent>
            <DialogActions
                className="dialog-actions-dense"
                sx={{ justifyContent: "center" }}
                style={{ marginBottom: "15px" }}>
                <Button variant="contained" onClick={handleSave}>
                    Save
                </Button>
                <Button onClick={handleClose}>Cancel</Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddSecret;