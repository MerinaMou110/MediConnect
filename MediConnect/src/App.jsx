import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import DashboardLayout from "./components/DashboardLayout";
import HomeScreen from "./screens/HomeScreen";
import RegisterScreen from "./screens/RegisterScreen";
import ActivationScreen from "./screens/ActivationScreen";
import LoginScreen from "./screens/LoginScreen";
import DoctorScreen from "./screens/DoctorScreen";
import AdminDashboard from "./screens/AdminDashboard";
import PatientDashboard from "./screens/PatientDashboard";
import DoctorDashboard from "./screens/DoctorDashboard";
import PrivateRoute from "./components/PrivateRoute";
import DoctorProfileScreen from "./screens/DoctorProfileScreen";
import PatientProfileScreen from "./screens/PatientProfileScreen";
import DoctorAvailableTimeScreen from "./screens/DoctorAvailableTimeScreen";
import DoctorDetails from "./screens/DoctorDetails";
import "./index.css";

export default function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomeScreen />} />
            <Route path="/register" element={<RegisterScreen />} />
            <Route path="/login" element={<LoginScreen />} />
            <Route
              path="/activate/:uid/:token"
              element={<ActivationScreen />}
            />
            <Route path="/doctors" element={<DoctorScreen />} />
            <Route path="/doctor/:id" element={<DoctorDetails />} />

            {/* Admin Routes */}
            <Route
              path="/admin/*"
              element={
                <PrivateRoute allowedRoles={["Admin"]}>
                  <DashboardLayout />
                </PrivateRoute>
              }
            >
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="users" element={<h1>Manage Users</h1>} />
              <Route path="settings" element={<h1>Settings</h1>} />
            </Route>

            {/* Patient Routes */}
            <Route
              path="/patient/*"
              element={
                <PrivateRoute allowedRoles={["Patient"]}>
                  <DashboardLayout />
                </PrivateRoute>
              }
            >
              <Route path="dashboard" element={<PatientDashboard />} />
              <Route path="appointments" element={<h1>Appointments</h1>} />
              <Route path="profile" element={<PatientProfileScreen />} />
            </Route>

            {/* Doctor Routes */}
            <Route
              path="/doctor/*"
              element={
                <PrivateRoute allowedRoles={["Doctor"]}>
                  <DashboardLayout />
                </PrivateRoute>
              }
            >
              <Route path="dashboard" element={<DoctorDashboard />} />
              <Route path="profile" element={<DoctorProfileScreen />} />
              <Route
                path="available-times"
                element={<DoctorAvailableTimeScreen />}
              />
            </Route>
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
