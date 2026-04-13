import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const HomePage = () => {
  const { isAuthenticated, user } = useAuth();

  if (isAuthenticated && user?.role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  if (isAuthenticated && user?.role === "student") {
    return <Navigate to="/student" replace />;
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h1>AI Study Assistant</h1>
      <p style={{ margin: "12px 0" }}>
        Your smart study partner built with MERN and RAG.
      </p>

      <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
      </div>
    </div>
  );
};

export default HomePage;