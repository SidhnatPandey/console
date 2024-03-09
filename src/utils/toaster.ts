import toast from "react-hot-toast";

const Toaster = {
  successToast: (message: string) => {
    toast.success(message, { duration: 5000 });
  },

  errorToast: (message: string) => {
    toast.error(message, { duration: 5000 });
  },

  infoToast: (message: string) => {
    toast(message, {
      icon: "ℹ️",
    });
  },

  warningToast: (message: string) => {
    toast(message, {
      icon: "⚠️",
    });
  },
};

export default Toaster;
