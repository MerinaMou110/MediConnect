import { Link, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { FaBars, FaTimes, FaChevronDown } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../actions/authActions";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dashboardOpen, setDashboardOpen] = useState(false);
  const profileRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // ✅ Get user authentication state from Redux
  const { userInfo } = useSelector((state) => state.auth);

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleDashboardDropdown = () => setDashboardOpen(!dashboardOpen);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login");
  };

  // ✅ Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setDashboardOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ Helper function for role-based checks
  const checkRole = (role) => userInfo?.user?.role === role;

  return (
    <nav className="bg-[#4A8BBE] text-white shadow-md z-20 relative">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-bold hover:text-[#B7D3E3] transition"
        >
          MediConnect
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-6 text-lg items-center">
          <li>
            <Link to="/" className="hover:text-[#B7D3E3] transition">
              Home
            </Link>
          </li>
          <li>
            <Link to="/about" className="hover:text-[#B7D3E3] transition">
              About
            </Link>
          </li>
          <li>
            <Link to="/services" className="hover:text-[#B7D3E3] transition">
              Services
            </Link>
          </li>
          <li>
            <Link to="/contact" className="hover:text-[#B7D3E3] transition">
              Contact
            </Link>
          </li>

          {/* Role-based Dashboard Dropdown */}
          {(checkRole("Doctor") ||
            checkRole("Patient") ||
            checkRole("Admin")) && (
            <li className="relative" ref={profileRef}>
              <button
                onClick={toggleDashboardDropdown}
                className="flex items-center space-x-2 hover:text-gray-200 transition"
              >
                <span>Dashboard</span>
                <FaChevronDown />
              </button>
              {dashboardOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 bg-white text-black shadow-lg rounded-lg w-48 z-20"
                >
                  {checkRole("Doctor") && (
                    <Link
                      to="/doctor"
                      className="block px-4 py-2 hover:bg-gray-200"
                    >
                      Doctor Dashboard
                    </Link>
                  )}
                  {checkRole("Patient") && (
                    <Link
                      to="/patient"
                      className="block px-4 py-2 hover:bg-gray-200"
                    >
                      Patient Dashboard
                    </Link>
                  )}
                  {checkRole("Admin") && (
                    <Link
                      to="/admin"
                      className="block px-4 py-2 hover:bg-gray-200"
                    >
                      Admin Dashboard
                    </Link>
                  )}
                </motion.div>
              )}
            </li>
          )}
        </ul>

        {/* Authentication */}
        {userInfo ? (
          <div className="hidden md:flex items-center space-x-4">
            <span>{userInfo?.user?.name}</span>
            <button
              onClick={handleLogout}
              className="bg-white text-[#4A8BBE] px-4 py-2 rounded-lg shadow-md hover:bg-gray-200 transition"
            >
              Logout
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            className="hidden md:block bg-white text-[#4A8BBE] px-4 py-2 rounded-lg shadow-md hover:bg-gray-200 transition"
          >
            Login
          </Link>
        )}

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={toggleMenu}
        >
          {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-[#4A8BBE] px-6 py-4 z-20"
        >
          <ul className="flex flex-col space-y-4 text-lg">
            <li>
              <Link to="/" className="hover:text-gray-200 transition">
                Home
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-gray-200 transition">
                About
              </Link>
            </li>
            <li>
              <Link to="/services" className="hover:text-gray-200 transition">
                Services
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-gray-200 transition">
                Contact
              </Link>
            </li>

            {/* Role-based Dashboard Links */}
            {checkRole("Doctor") && (
              <li>
                <Link
                  to="/doctor-dashboard"
                  className="hover:text-gray-200 transition"
                >
                  Doctor Dashboard
                </Link>
              </li>
            )}
            {checkRole("Patient") && (
              <li>
                <Link
                  to="/patient-dashboard"
                  className="hover:text-gray-200 transition"
                >
                  Patient Dashboard
                </Link>
              </li>
            )}
            {checkRole("Admin") && (
              <li>
                <Link
                  to="/admin-dashboard"
                  className="hover:text-gray-200 transition"
                >
                  Admin Dashboard
                </Link>
              </li>
            )}

            {/* Authentication for Mobile */}
            {!userInfo ? (
              <Link
                to="/login"
                className="bg-white text-[#4A8BBE] px-4 py-2 rounded-lg shadow-md hover:bg-gray-200 transition text-center"
              >
                Login
              </Link>
            ) : (
              <button
                onClick={handleLogout}
                className="text-center hover:text-gray-200 transition"
              >
                Logout
              </button>
            )}
          </ul>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
