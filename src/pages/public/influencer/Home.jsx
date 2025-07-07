import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../../firebase";
import {
  doc,
  getDoc,
  collectionGroup,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import InfluencerNavbar from "../../../components/InfluencerNavbar";

const Home = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [overview, setOverview] = useState({
    appliedCount: 0,
    totalPaid: 0,
    totalPending: 0,
    lastApplied: null,
  });

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        navigate("/login");
      } else {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUserInfo({ email: user.email, role: docSnap.data().role });

          // 🔁 Realtime snapshot listener on applicant docs
          const applicantQuery = query(
            collectionGroup(db, "applicants"),
            where("uid", "==", user.uid)
          );

          const unsubscribeSnapshot = onSnapshot(applicantQuery, (snapshot) => {
            let appliedCount = 0;
            let totalPaid = 0;
            let totalPending = 0;
            let lastApplied = null;

            snapshot.forEach((doc) => {
              const data = doc.data();
              if (data.status === "Approved") {
                appliedCount++;
                if (data.paymentStatus === "Paid") {
                  totalPaid += Number(data.payout || 0);
                } else if (data.paymentStatus === "Pending") {
                  totalPending += Number(data.payout || 0);
                }

                const appliedAt = data.appliedAt?.toDate?.();
                if (appliedAt && (!lastApplied || appliedAt > lastApplied)) {
                  lastApplied = appliedAt;
                }
              }
            });

            setOverview({
              appliedCount,
              totalPaid,
              totalPending,
              lastApplied,
            });
          });

          // Clean up Firestore listener when component unmounts
          return () => unsubscribeSnapshot();
        }
      }
    });

    // Clean up auth listener when component unmounts
    return () => unsubscribeAuth();
  }, [navigate]);

  const formatDate = (dateObj) =>
    dateObj?.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  return (
    <>
      <InfluencerNavbar />
      <div className="p-10 max-w-4xl mx-auto text-center">
        <h1 className="text-3xl font-bold text-purple-600 mb-2">
          Welcome, Influencer!
        </h1>
        {userInfo && (
          <p className="mb-6 text-gray-600">
            Logged in as <strong>{userInfo.email}</strong> ({userInfo.role})
          </p>
        )}

        {/* ✅ DASHBOARD OVERVIEW */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-left mb-8">
          <div className="p-4 border rounded shadow">
            <p className="text-sm text-gray-500">Campaigns Applied</p>
            <p className="text-xl font-bold">{overview.appliedCount}</p>
          </div>
          <div className="p-4 border rounded shadow">
            <p className="text-sm text-gray-500">Total Earnings</p>
            <p className="text-xl font-bold text-green-600">
              ₹{overview.totalPaid}
            </p>
          </div>
          <div className="p-4 border rounded shadow">
            <p className="text-sm text-gray-500">Pending Payments</p>
            <p className="text-xl font-bold text-yellow-600">
              ₹{overview.totalPending}
            </p>
          </div>
          <div className="p-4 border rounded shadow">
            <p className="text-sm text-gray-500">Last Applied</p>
            <p className="text-sm font-medium">
              {overview.lastApplied ? formatDate(overview.lastApplied) : "-"}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
