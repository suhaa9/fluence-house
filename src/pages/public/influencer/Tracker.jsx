import React, { useEffect, useState } from "react";
import { auth, db } from "../../../firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import InfluencerNavbar from "../../../components/InfluencerNavbar";

const Tracker = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const campaignsRef = collection(db, "campaigns");
      const campaignSnapshot = await getDocs(campaignsRef);

      const userApplications = [];

      for (const campaignDoc of campaignSnapshot.docs) {
        const applicantRef = doc(
          db,
          "campaigns",
          campaignDoc.id,
          "applicants",
          user.uid
        );

        const applicantSnap = await getDoc(applicantRef);

        if (applicantSnap.exists()) {
          const campaignData = campaignDoc.data();
          const applicantData = applicantSnap.data();

          userApplications.push({
            id: campaignDoc.id,
            title: campaignData.title || "Untitled",
            brand: campaignData.brand || "N/A",
            deadline: campaignData.deadline || "N/A",
            status: applicantData.status || "Pending",
          });
        }
      }

      setApplications(userApplications);
      setLoading(false);
    };

    fetchApplications();
  }, []);

  // Function to style status
  const getStatusStyle = (status) => {
    switch (status.toLowerCase()) {
      case "accepted":
        return "bg-green-100 text-green-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      case "pending":
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  return (
    <>
      <InfluencerNavbar />
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-purple-600 mb-6 text-center">
          My Campaign Tracker
        </h1>

        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : applications.length === 0 ? (
          <p className="text-center text-gray-400">
            You haven't applied to any campaigns yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto border border-gray-200">
              <thead className="bg-purple-100">
                <tr>
                  <th className="p-2 border">Campaign</th>
                  <th className="p-2 border">Brand</th>
                  <th className="p-2 border">Status</th>
                  <th className="p-2 border">Deadline</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app.id}>
                    <td className="p-2 border">{app.title}</td>
                    <td className="p-2 border">{app.brand}</td>
                    <td className="p-2 border">
                      <span
                        className={`px-2 py-1 text-sm font-medium rounded ${getStatusStyle(
                          app.status
                        )}`}
                      >
                        {app.status}
                      </span>
                    </td>
<td className="p-2 border">
  {new Date(app.deadline).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })}
</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default Tracker;
