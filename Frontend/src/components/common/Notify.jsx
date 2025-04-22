import { toast } from "react-hot-toast";

export const showSuccess = (message) => {
  toast.success(message, {
    position: "top-right",
    duration: 3000,
    style: {
      background: "#4caf50",
      color: "#fff",
    },
  });
};

export const showError = (message) => {
  toast.error(message, {
    position: "top-right",
    duration: 3000,
    style: {
      background: "#f44336",
      color: "#fff",
    },
  });
};
