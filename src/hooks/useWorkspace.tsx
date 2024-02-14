import { useContext } from "react";
import { AuthContext } from "src/context/AuthContext";


export default function useWorkspace() {

    const authContext = useContext(AuthContext);

    const getWorkspaceNameById = (id: string | undefined) => {
        if (id) {
            const filteredWorkspace = authContext.workspaces.filter((workspace: any) => workspace.id === id)[0];
            return filteredWorkspace.name;
        } else {
            return null
        }
    };

    return {
        getWorkspaceNameById,
    };
}