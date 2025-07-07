import React, { useEffect, useState } from "react";
import { db, auth } from "../../../firebase";
import {
  collectionGroup,
  getDocs,
  getDoc,
} from "firebase/firestore";
import InfluencerNavbar from "../../../components/InfluencerNavbar";

const Earnings = () => {
  const [applications, setApplications] = useState([]);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    const fetchEarnings = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const querySnapshot = await getDocs(collectionGroup(db, "applicants"));

      const approved = [];

      for (const docSnap of querySnapshot.docs) {
        const data = docSnap.data();
        const campaignId = docSnap.ref.parent.parent.id;

        if (data.uid === user.uid && data.status === "Approved") {
          const campaignRef = docSnap.ref.parent.parent;
          const campaignDoc = await getDoc(campaignRef);
          const campaignData = campaignDoc.data();

          approved.push({
            id: campaignId,
            title: campaignData?.title,
            brand: campaignData?.brand,
            payout: data.payout || 0,
            status: data.paymentStatus || "Pending",
            deadline: campaignData?.deadline || "-",
          });
        }
      }

      setApplications(approved);
    };

    fetchEarnings();
  }, []);

  const totalEarnings = applications
    .filter((a) => a.status === "Paid")
    .reduce((sum, a) => sum + Number(a.payout), 0);

  const getStatusColor = (status) => {
    if (status === "Paid") return "text-green-600";
    if (status === "Pending") return "text-yellow-600";
    return "text-gray-600";
  };

  const filteredApps =
    filter === "All"
      ? applications
      : applications.filter((a) => a.status === filter);

  return (
    <>
      <InfluencerNavbar />
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-purple-600 mb-4">My Earnings</h1>

        <div className="mb-4 flex justify-between items-center">
          <p className="text-lg font-medium text-gray-800">
            Total Earnings: ₹{totalEarnings}
          </p>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="All">All</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
          </select>
        </div>

        {filteredApps.length === 0 ? (
          <p className="text-gray-500">No earnings found.</p>
        ) : (
          <table className="w-full text-left border">
            <thead className="bg-purple-100">
              <tr>
                <th className="p-2">Campaign</th>
                <th className="p-2">Brand</th>
                <th className="p-2">Payout (₹)</th>
                <th className="p-2">Deadline</th>
                <th className="p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredApps.map((a) => (
                <tr key={a.id} className="border-t">
                  <td className="p-2">{a.title}</td>
                  <td className="p-2">{a.brand}</td>
                  <td className="p-2">{a.payout}</td>
                  <td className="p-2">
                    {a.deadline
                      ? new Date(a.deadline).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                      : "-"}
                  </td>
                  <td className={`p-2 font-semibold ${getStatusColor(a.status)}`}>
                    {a.status}
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

export default Earnings;
