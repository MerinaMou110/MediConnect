import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { XCircleIcon } from "lucide-react";
import PropTypes from "prop-types";

const Toast = ({ message, type = "success", duration = 3000, onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (typeof onClose === "function") {
        onClose();
      }
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!message || !visible) return null;

  const typeStyles = {
    error: "bg-red-600 text-white",
    success: "bg-green-600 text-white",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className={`fixed bottom-5 right-5 px-4 py-3 rounded shadow-md flex items-center justify-between w-64 ${typeStyles[type]}`}
    >
      <p className="text-sm">{message}</p>
      <button onClick={() => setVisible(false)} className="ml-2">
        <XCircleIcon className="w-5 h-5 text-white" />
      </button>
    </motion.div>
  );
};
// ✅ Define PropTypes
Toast.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.string,
  duration: PropTypes.number,
  onClose: PropTypes.func,
};

export default Toast;
