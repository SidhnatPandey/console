import { Box } from "@mui/material";
import SecretsDashboard from "./SecretsDashboard";
import SecretKeysTable from "./SecretKeysTable";
import { SecretProvider } from "src/context/SecretContext";

const Secret = () => {

    return (
        <SecretProvider>
            <Box sx={{ marginBottom: "20px" }}>
                <SecretsDashboard title="Secrets Management Dashboard" showWorkspaceDropdown={true} />
            </Box>
            <SecretKeysTable />
        </SecretProvider>
    );
};

export default Secret;