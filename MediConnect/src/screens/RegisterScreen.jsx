import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../actions/authActions";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";

const RegisterScreen = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password2: "",
    tc: false,
    role: "Patient",
    license_number: "",
    timezone: "UTC",
  });

  const [showMessage, setShowMessage] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userRegister = useSelector((state) => state.userRegister);
  const { loading, success, message, error } = userRegister;

  useEffect(() => {
    if (success) {
      toast.success(message || "Registration successful!");
      setTimeout(() => navigate("/login"), 2000);
    }
    if (error) {
      toast.error(error);
    }
  }, [success, error, navigate, message]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { password, password2, role, license_number, ...rest } = formData;

    if (password !== password2) {
      toast.error("Passwords do not match");
      return;
    }

    const userData = {
      ...rest,
      password,
      password2,
      role,
      ...(role === "Doctor" ? { license_number } : {}),
    };

    dispatch(registerUser(userData));
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-lg bg-white p-8 shadow-xl rounded-lg">
        <h2 className="text-3xl font-bold text-center text-[#1E88E5] mb-6">
          Create Your Account
        </h2>

        <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

        {loading && <p className="text-center text-gray-600">Loading...</p>}

        {showMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 bg-blue-100 text-blue-700 rounded-lg text-sm"
          >
            Ensure your password is at least 8 characters long and contains a
            mix of letters, numbers, and special characters.
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[#1E88E5] font-medium">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-lg focus:ring focus:ring-[#1E88E5] outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-[#1E88E5] font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-lg focus:ring focus:ring-[#1E88E5] outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[#1E88E5] font-medium">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded-lg focus:ring focus:ring-[#1E88E5] outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-[#1E88E5] font-medium">
                Confirm Password
              </label>
              <input
                type="password"
                name="password2"
                value={formData.password2}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded-lg focus:ring focus:ring-[#1E88E5] outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[#1E88E5] font-medium">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-lg focus:ring focus:ring-[#1E88E5] outline-none bg-white"
            >
              <option value="Patient">Patient</option>
              <option value="Doctor">Doctor</option>
            </select>
          </div>

          {formData.role === "Doctor" && (
            <div>
              <label className="block text-[#1E88E5] font-medium">
                License Number
              </label>
              <input
                type="text"
                name="license_number"
                value={formData.license_number}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded-lg focus:ring focus:ring-[#1E88E5] outline-none"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-[#1E88E5] font-medium">Timezone</label>
            <select
              name="timezone"
              value={formData.timezone}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-lg focus:ring focus:ring-[#1E88E5] outline-none bg-white"
            >
              <option value="UTC">UTC</option>
              <option value="America/New_York">America/New_York</option>
              <option value="America/Chicago">America/Chicago</option>
              <option value="America/Denver">America/Denver</option>
              <option value="America/Los_Angeles">America/Los_Angeles</option>
              <option value="America/Toronto">America/Toronto</option>
              <option value="America/Vancouver">America/Vancouver</option>
              <option value="America/Sao_Paulo">America/Sao_Paulo</option>
              <option value="Europe/London">Europe/London</option>
              <option value="Europe/Paris">Europe/Paris</option>
              <option value="Europe/Berlin">Europe/Berlin</option>
              <option value="Europe/Madrid">Europe/Madrid</option>
              <option value="Europe/Rome">Europe/Rome</option>
              <option value="Europe/Moscow">Europe/Moscow</option>
              <option value="Asia/Kolkata">Asia/Kolkata</option>
              <option value="Asia/Dhaka">Asia/Dhaka</option>
              <option value="Asia/Dubai">Asia/Dubai</option>
              <option value="Asia/Tokyo">Asia/Tokyo</option>
              <option value="Asia/Shanghai">Asia/Shanghai</option>
              <option value="Asia/Singapore">Asia/Singapore</option>
              <option value="Asia/Seoul">Asia/Seoul</option>
              <option value="Australia/Sydney">Australia/Sydney</option>
              <option value="Australia/Melbourne">Australia/Melbourne</option>
              <option value="Australia/Brisbane">Australia/Brisbane</option>
              <option value="Pacific/Auckland">Pacific/Auckland</option>
            </select>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="tc"
              checked={formData.tc}
              onChange={handleChange}
              className="mr-2 accent-[#1E88E5] w-5 h-5"
              required
            />
            <span className="text-gray-700">
              I accept the{" "}
              <a href="#" className="text-[#1E88E5] hover:underline">
                Terms & Conditions
              </a>
            </span>
          </div>

          <button
            type="button"
            onClick={() => setShowMessage(!showMessage)}
            className="text-sm text-[#1E88E5] hover:underline"
          >
            {showMessage ? "Hide Tips" : "Show Password Tips"}
          </button>

          <button
            type="submit"
            className="w-full bg-[#1E88E5] text-white py-2 rounded-lg shadow-md hover:bg-[#1565C0] transition duration-300 flex items-center justify-center cursor-pointer"
            disabled={loading}
          >
            Register
          </button>

          <p className="text-center text-gray-600 mt-4">
            Already have an account?{" "}
            <a href="/login" className="text-[#1E88E5] hover:underline">
              Login here
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterScreen;
