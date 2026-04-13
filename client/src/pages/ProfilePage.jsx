import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/auth/profile", {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        setProfile(response.data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch profile");
      }
    };

    if (user?.token) {
      fetchProfile();
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div
      style={{
        maxWidth: "700px",
        margin: "40px auto",
        padding: "24px",
        background: "#fff",
        borderRadius: "12px",
      }}
    >
      <h1 style={{ marginBottom: "16px" }}>My Profile</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {!profile ? (
        <p>Loading profile...</p>
      ) : (
        <div style={{ display: "grid", gap: "10px" }}>
          <p>
            <strong>Name:</strong> {profile.name}
          </p>
          <p>
            <strong>Email:</strong> {profile.email}
          </p>
          <p>
            <strong>Role:</strong> {profile.role}
          </p>
          <p>
            <strong>Course:</strong> {profile.course || "N/A"}
          </p>
          <p>
            <strong>Year:</strong> {profile.year || "N/A"}
          </p>
          <p>
            <strong>Study Goals:</strong> {profile.studyGoals || "N/A"}
          </p>
          <p>
            <strong>Exam Date:</strong> {profile.examDate || "N/A"}
          </p>

          <button onClick={handleLogout} style={{ width: "120px", marginTop: "16px" }}>
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;