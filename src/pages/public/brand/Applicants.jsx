import React, { useEffect, useState } from "react";
import BrandNavbar from "../../../components/BrandNavbar";
import { db } from "../../../firebase";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";

import { auth } from "../../../firebase";
import { query, where } from "firebase/firestore";

const Applicants = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchApplicants = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      // 🔒 Only fetch campaigns created by current brand
      const campaignsQuery = query(
        collection(db, "campaigns"),
        where("brandId", "==", user.uid)
      );
      const campaignsSnapshot = await getDocs(campaignsQuery);

      const allApplications = [];

      for (const campaignDoc of campaignsSnapshot.docs) {
        const campaignId = campaignDoc.id;
        const campaignTitle = campaignDoc.data().title;

        const applicantsSnapshot = await getDocs(
          collection(db, "campaigns", campaignId, "applicants")
        );

        applicantsSnapshot.forEach((appDoc) => {
          const data = appDoc.data();
          allApplications.push({
            id: appDoc.id,
            campaignId,
            campaignTitle,
            influencerEmail: data.email,
            appliedAt: data.appliedAt?.toDate(),
            status: data.status || "Pending",
            payout: data.payout || 0,
            paymentStatus: data.paymentStatus || "Pending",
          });
        });
      }

      setApplications(allApplications);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching applicants:", error);
    }
  };

  fetchApplicants();
}, []);


  const handleStatusChange = async (campaignId, userId, newStatus) => {
    try {
      const docRef = doc(db, "campaigns", campaignId, "applicants", userId);
      await updateDoc(docRef, { status: newStatus });

      setApplications((prev) =>
        prev.map((app) =>
          app.id === userId && app.campaignId === campaignId
            ? { ...app, status: newStatus }
            : app
        )
      );
    } catch (err) {
      console.error("Status update failed:", err);
    }
  };

  const handlePayoutChange = async (campaignId, userId, newPayout) => {
    try {
      const docRef = doc(db, "campaigns", campaignId, "applicants", userId);
      await updateDoc(docRef, { payout: Number(newPayout) });

      setApplications((prev) =>
        prev.map((app) =>
          app.id === userId && app.campaignId === campaignId
            ? { ...app, payout: Number(newPayout) }
            : app
        )
      );
    } catch (err) {
      console.error("Payout update failed:", err);
    }
  };

  const handlePaymentStatusChange = async (campaignId, userId, newStatus) => {
    try {
      const docRef = doc(db, "campaigns", campaignId, "applicants", userId);
      await updateDoc(docRef, { paymentStatus: newStatus });

      setApplications((prev) =>
        prev.map((app) =>
          app.id === userId && app.campaignId === campaignId
            ? { ...app, paymentStatus: newStatus }
            : app
        )
      );
    } catch (err) {
      console.error("Payment status update failed:", err);
    }
  };

  return (
    <>
      <BrandNavbar />
      <div className="p-6 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-pink-600 text-center mb-6">
          Campaign Applicants
        </h1>

        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : applications.length === 0 ? (
          <p className="text-center text-gray-400">No applications found.</p>
        ) : (
          <table className="w-full table-auto border-collapse shadow-sm text-sm">
            <thead>
              <tr className="bg-pink-100 text-pink-800 text-left">
                <th className="p-3">Influencer</th>
                <th className="p-3">Campaign</th>
                <th className="p-3">Applied At</th>
                <th className="p-3">Status</th>
                <th className="p-3">Payout</th>
                <th className="p-3">Payment</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={`${app.campaignId}-${app.id}`} className="border-b">
                  <td className="p-3">{app.influencerEmail}</td>
                  <td className="p-3">{app.campaignTitle}</td>
                  <td className="p-3">
                    {app.appliedAt
                      ? `${app.appliedAt.getDate()}-${app.appliedAt.getMonth() + 1}-${app.appliedAt.getFullYear()}`
                      : "N/A"}
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        app.status === "Approved"
                          ? "bg-green-200 text-green-700"
                          : app.status === "Rejected"
                          ? "bg-red-200 text-red-700"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {app.status}
                    </span>
                  </td>
                  <td className="p-3">
                    ₹{" "}
                    <input
                      type="number"
                      value={app.payout}
                      className="w-20 border px-2 py-1 text-xs"
                      onChange={(e) =>
                        handlePayoutChange(app.campaignId, app.id, e.target.value)
                      }
                    />
                  </td>
                  <td className="p-3">
                    <select
                      className="border px-2 py-1 text-xs"
                      value={app.paymentStatus}
                      onChange={(e) =>
                        handlePaymentStatusChange(
                          app.campaignId,
                          app.id,
                          e.target.value
                        )
                      }
                    >
                      <option value="Pending">Pending</option>
                      <option value="Paid">Paid</option>
                    </select>
                  </td>
                  <td className="p-3 space-x-2">
                    <button
                      className="bg-green-500 text-white px-3 py-1 rounded text-xs hover:bg-green-600"
                      onClick={() =>
                        handleStatusChange(app.campaignId, app.id, "Approved")
                      }
                    >
                      Approve
                    </button>
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600"
                      onClick={() =>
                        handleStatusChange(app.campaignId, app.id, "Rejected")
                      }
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};

export default Applicants;
