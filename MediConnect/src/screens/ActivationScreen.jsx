import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { activateUser } from "../actions/authActions";
import { motion } from "framer-motion";
import { CheckCircleIcon, XCircleIcon, Loader2Icon } from "lucide-react";

const ActivationScreen = () => {
  const { uid, token } = useParams(); // Extract from URL
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const activateAccount = async () => {
      try {
        const response = await dispatch(activateUser(uid, token));
        setMessage(response.msg);
        setSuccess(true);

        // If the response message contains "pending", do not redirect
        if (response.msg.includes("pending admin approval")) {
          setLoading(false);
          return;
        }

        // Redirect to login after 3 seconds
        setTimeout(() => navigate("/login"), 3000);
      } catch (error) {
        setMessage(error.message || "Activation failed.");
        setSuccess(false);
      } finally {
        setLoading(false);
      }
    };

    activateAccount();
  }, [dispatch, uid, token, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white p-8 shadow-xl rounded-lg text-center"
      >
        <h2 className="text-3xl font-bold text-[#1E88E5] mb-4">
          Account Activation
        </h2>

        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ repeat: Infinity, duration: 1 }}
            className="flex flex-col items-center justify-center"
          >
            <Loader2Icon className="animate-spin text-[#1E88E5] w-12 h-12 mb-4" />
            <p className="text-gray-600 text-lg">Activating your account...</p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center"
          >
            {success ? (
              <CheckCircleIcon className="text-green-500 w-16 h-16 mb-3" />
            ) : (
              <XCircleIcon className="text-red-500 w-16 h-16 mb-3" />
            )}
            <p
              className={`text-lg ${
                success ? "text-green-600" : "text-red-600"
              }`}
            >
              {message}
            </p>

            {success && !message.includes("pending admin approval") && (
              <p className="text-gray-600 mt-2">Redirecting to login...</p>
            )}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default ActivationScreen;
