import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const role = queryParams.get("role");

  const handleLogin = () => {
    if (role === "influencer") {
      navigate("/influencer/home");
    } else if (role === "brand") {
      navigate("/brand/home");
    } else {
      alert("Please select a valid role");
    }
  };

  return (
    <div className="p-10 text-center">
      <h1 className="text-3xl font-bold text-purple-600">Login to Fluence House</h1>
      <p className="mt-4 text-gray-600">
        You are logging in as: <strong>{role ? role.charAt(0).toUpperCase() + role.slice(1) : "Unknown"}</strong>
      </p>

      <button
        onClick={handleLogin}
        className="mt-6 bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700"
      >
        Continue
      </button>
    </div>
  );
};

export default Login;
