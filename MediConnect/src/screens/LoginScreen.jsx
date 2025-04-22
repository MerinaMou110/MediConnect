import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../actions/authActions";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Toast from "../components/Toast"; // Import the Toast Component

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showError, setShowError] = useState(false); // For hidden error message
  const [toastMessage, setToastMessage] = useState(""); // For toast notification

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo, error } = useSelector((state) => state.auth);

  useEffect(() => {
    console.log("UserInfo: ", userInfo);

    if (userInfo?.user?.role) {
      const role = userInfo.user.role;

      if (role === "Doctor") {
        navigate("/doctor/profile");
      } else if (role === "Patient") {
        navigate("/patient/profile");
      } else if (role === "Admin") {
        navigate("/admin/profile");
      }
    }
  }, [userInfo?.user?.role, navigate]);

  useEffect(() => {
    if (error) {
      setShowError(true); // Show hidden message
      setToastMessage(error); // Show toast notification

      setTimeout(() => {
        setShowError(false); // Hide error message after 5 sec
      }, 5000);
    }
  }, [error]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    await dispatch(loginUser(email, password));
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#E3F2FD]">
      {/* Toast Message */}
      {toastMessage && <Toast message={toastMessage} type="error" />}

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white p-8 shadow-lg rounded-2xl"
      >
        <h2 className="text-3xl font-semibold text-center text-[#1E88E5] mb-6">
          Welcome Back
        </h2>

        {/* Hidden Error Message */}
        {showError && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-500 text-center mb-4 bg-red-100 p-2 rounded"
          >
            {error}
          </motion.p>
        )}

        <form onSubmit={submitHandler} className="space-y-5">
          <div>
            <label className="block text-[#1E88E5] font-medium">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#42A5F5]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-[#1E88E5] font-medium">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#42A5F5]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#1E88E5] text-white py-2 rounded-lg shadow-md hover:bg-[#1565C0] transition duration-300 flex items-center justify-center cursor-pointer"
            disabled={loading}
          >
            {loading ? (
              <svg
                className="animate-spin h-5 w-5 mr-3 text-white"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
            ) : (
              "Login"
            )}
          </button>
        </form>

        <p className="mt-4 text-center text-gray-600">
          Don&apos;t have an account?{" "}
          <a href="/register" className="text-[#1E88E5] hover:underline">
            Sign up
          </a>
        </p>
      </motion.div>
    </div>
  );
};

export default LoginScreen;
