import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';

import Home from './pages/public/Home';
import About from './pages/public/About';
import Events from './pages/public/Events';

import BrandHome from './pages/public/brand/Home';
import PostCampaign from './pages/public/brand/PostCampaign';
import Applicants from './pages/public/brand/Applicants';
import Payments from './pages/public/brand/Payments';

import InfluencerHome from './pages/public/influencer/Home';
import Profile from './pages/public/influencer/Profile';
import Campaigns from './pages/public/influencer/Campaigns';
import Tracker from './pages/public/influencer/Tracker';
import Earnings from './pages/public/influencer/Earnings';

import Signup from './pages/public/Auth/Signup';
import Login from './pages/public/Auth/Login';

import ProtectedRoute from './components/ProtectedRoute';

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import VerifyEmail from "./pages/public/Auth/VerifyEmail";
import ResetPassword from "./pages/public/Auth/ResetPassword";

function App() {
  const location = useLocation();

  const hideNavbar =
    location.pathname.startsWith('/influencer') ||
    location.pathname.startsWith('/brand');

  return (
    <>
      {!hideNavbar && <Navbar />}

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/events" element={<Events />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* Brand Dashboard (Protected) */}
        <Route
          path="/brand/home"
          element={
            <ProtectedRoute>
              <BrandHome />
            </ProtectedRoute>
          }
        />
        <Route
          path="/brand/post"
          element={
            <ProtectedRoute>
              <PostCampaign />
            </ProtectedRoute>
          }
        />
        <Route
          path="/brand/applicants"
          element={
            <ProtectedRoute>
              <Applicants />
            </ProtectedRoute>
          }
        />
        <Route
          path="/brand/payments"
          element={
            <ProtectedRoute>
              <Payments />
            </ProtectedRoute>
          }
        />

        {/* Influencer Dashboard (Protected) */}
        <Route
          path="/influencer/home"
          element={
            <ProtectedRoute>
              <InfluencerHome />
            </ProtectedRoute>
          }
        />
        <Route
          path="/influencer/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/influencer/campaigns"
          element={
            <ProtectedRoute>
              <Campaigns />
            </ProtectedRoute>
          }
        />
        <Route
          path="/influencer/tracker"
          element={
            <ProtectedRoute>
              <Tracker />
            </ProtectedRoute>
          }
        />
        <Route
          path="/influencer/earnings"
          element={
            <ProtectedRoute>
              <Earnings />
            </ProtectedRoute>
          }
        />
        <Route path="/verify-email" element={<VerifyEmail />} />
<Route path="/reset-password" element={<ResetPassword />} />


      </Routes>

      <ToastContainer position="top-center" autoClose={2000} />
    </>
  );
}

export default App;
