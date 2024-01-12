import toast from "react-hot-toast";

const Toaster = {

    successToast: (message: string) => {
        toast.success(message);
    },

    errorToast: (message: string) => {
        toast.error(message);
    },

    infoToast: (message: string) => {
        toast(message, {
            icon: 'ℹ️',
        });
    },

    warningToast: (message: string) => {
        toast(message, {
            icon: '⚠️',
        });
    }
}

export default Toaster; 