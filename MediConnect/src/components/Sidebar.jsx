// src/components/Sidebar.js
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

const Sidebar = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const userRole = userInfo?.user?.role;

  const menuItems = {
    Doctor: [
      { name: "Dashboard", path: "/doctor/dashboard" },
      { name: "Profile", path: "/doctor/profile" },
      { name: "Available Times", path: "/doctor/available-times" },
    ],
    Patient: [
      { name: "Dashboard", path: "/patient/dashboard" },
      { name: "Appointments", path: "/patient/appointments" },
      { name: "Profile", path: "/patient/profile" },
    ],
    Admin: [
      { name: "Dashboard", path: "/admin/dashboard" },
      { name: "Manage Users", path: "/admin/users" },
      { name: "Settings", path: "/admin/settings" },
    ],
  };

  const getMenuItems = () => menuItems[userRole] || [];

  return (
    <aside className="bg-[#4A8BBE] min-h-screen w-45 text-white">
      <nav className="p-4 space-y-2">
        {getMenuItems().map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `block p-2 rounded transition-colors duration-200 ${
                isActive ? "bg-[#6FA3D8]" : "hover:bg-[#6FA3D8]"
              }`
            }
          >
            {item.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
