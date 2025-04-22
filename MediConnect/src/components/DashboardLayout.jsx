// src/components/DashboardLayout.js
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen">
      <Sidebar /> {/* Sidebar stays persistent */}
      <main className="flex-1 p-6">
        <Outlet /> {/* Render nested routes here */}
      </main>
    </div>
  );
};

export default DashboardLayout;
