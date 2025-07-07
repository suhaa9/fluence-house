import React from "react";
import { Link } from "react-router-dom";

import { signOut } from "firebase/auth";
import { auth } from "../firebase"; // adjust path if you're in nested file

const handleLogout = async () => {
  await signOut(auth);
  window.location.href = "/login"; // force redirect
};

// Inside return JSX:
<button onClick={handleLogout} className="text-sm text-red-500 ml-4">
  Logout
</button>

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md p-4 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold text-purple-600">
        Fluence House
      </Link>
      <div className="space-x-4">
        <Link to="/about" className="text-gray-700 hover:text-purple-600">About</Link>
        <Link to="/influencer" className="text-gray-700 hover:text-purple-600">Influencers</Link>
        <Link to="/brand" className="text-gray-700 hover:text-purple-600">Brands</Link>
        <Link to="/events" className="text-gray-700 hover:text-purple-600">Events</Link>
        <Link to="/contact" className="text-gray-700 hover:text-purple-600">Contact</Link>
        <Link to="/login" className="bg-purple-600 text-white px-4 py-1 rounded hover:bg-purple-700">Login</Link>
        <Link to="/signup">Sign Up</Link>
      </div>
    </nav>
  );
};

export default Navbar;