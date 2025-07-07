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


const BrandNavbar = () => {
  const location = useLocation();

  const linkStyle = (path) =>
    `text-gray-700 hover:text-pink-600 text-base ${
      location.pathname === path ? "font-semibold text-pink-700" : ""
    }`;

  return (
    <nav className="bg-white shadow-md p-4 flex justify-between items-center">
      <Link to="/brand/home" className="text-2xl font-bold text-pink-600">
        Fluence House
      </Link>
      <div className="space-x-4">
        <Link to="/brand/post" className={linkStyle("/brand/post")}>
          Post Campaign
        </Link>
        <Link to="/brand/applicants" className={linkStyle("/brand/applicants")}>
          Applicants
        </Link>
        <Link to="/brand/payments" className={linkStyle("/brand/payments")}>
          Payments
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

export default BrandNavbar;
