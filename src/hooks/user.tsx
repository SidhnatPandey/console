import { useContext } from 'react';
import { AuthContext } from 'src/context/AuthContext';

export default function useUser() {

    const authContext = useContext(AuthContext);

    const isAdmin = () => {
        return authContext.user?.role === 'admin' ? true : false;
    };

    return {
        isAdmin
    };
}