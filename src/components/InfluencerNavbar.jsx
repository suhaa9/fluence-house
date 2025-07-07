import React from "react";
import { Link, useLocation } from "react-router-dom";

import { signOut } from "firebase/auth";
import { auth } from "../firebase";

import { toast } from "react-toastify";

const handleLogout = () => {
  signOut(auth)
    .then(() => {
      toast.success("Logged out successfully!"); // ✅ Toast message
    })
    .catch((error) => {
      console.error("Logout failed:", error);
      toast.error("Failed to logout. Try again.");
    });
};

<button
  onClick={handleLogout}
  className="text-red-500 hover:underline text-base"
>
  Logout
</button>


const InfluencerNavbar = () => {
  const location = useLocation();

  const linkStyle = (path) =>
    `text-gray-700 hover:text-purple-600 text-base ${
      location.pathname === path ? "font-semibold text-purple-700" : ""
    }`;

  return (
    <nav className="bg-white shadow-md p-4 flex justify-between items-center">
      <Link to="/influencer/home" className="text-2xl font-bold text-purple-600">
        Fluence House
      </Link>
      <div className="space-x-4">
        <Link to="/influencer/profile" className={linkStyle("/influencer/profile")}>
          Profile
        </Link>
        <Link to="/influencer/campaigns" className={linkStyle("/influencer/campaigns")}>
          Campaigns
        </Link>
        <Link to="/influencer/tracker" className={linkStyle("/influencer/tracker")}>
          Tracker
        </Link>
        <Link to="/influencer/earnings" className={linkStyle("/influencer/earnings")}>
          Earnings
        </Link>
<button
  onClick={handleLogout}
  className="text-red-500 hover:underline text-base"
>
  Logout
</button>
      </div>
    </nav>
  );
};

export default InfluencerNavbar;
