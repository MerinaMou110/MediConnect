import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    }
  }, [navigate, userInfo]);

  return (
    <div>
      <h1>Welcome, {userInfo?.name}!</h1>
      <p>Your role: {userInfo?.role}</p>
    </div>
  );
};

export default Dashboard;
