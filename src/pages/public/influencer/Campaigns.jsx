import React, { useEffect, useState } from "react";
import InfluencerNavbar from "../../../components/InfluencerNavbar";
import { db, auth } from "../../../firebase";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { toast } from "react-toastify";

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [applied, setApplied] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // ✅ Ensure Firebase Auth is initialized
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });

    return () => unsubscribe();
  }, []);

  // ✅ Fetch campaigns and applied status after user is available
  useEffect(() => {
    if (!user) return;

    const fetchCampaigns = async () => {
      try {
        const snapshot = await getDocs(collection(db, "campaigns"));
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCampaigns(data);
      } catch (error) {
        console.error("Error fetching campaigns:", error);
        toast.error("Failed to load campaigns.");
      }
    };

    const fetchAppliedCampaigns = async () => {
      try {
        const snapshot = await getDocs(collection(db, "campaigns"));
        const appliedCampaigns = [];

        for (const docSnap of snapshot.docs) {
          const applicantRef = doc(
            db,
            "campaigns",
            docSnap.id,
            "applicants",
            user.uid
          );
          const applicantSnap = await getDoc(applicantRef);
          if (applicantSnap.exists()) {
            appliedCampaigns.push(docSnap.id);
          }
        }

        setApplied(appliedCampaigns);
      } catch (error) {
        console.error("Error fetching applied campaigns:", error);
      }
    };

    const fetchAll = async () => {
      setLoading(true);
      await fetchCampaigns();
      await fetchAppliedCampaigns();
      setLoading(false);
    };

    fetchAll();
  }, [user]);

  const handleApply = async (campaignId) => {
    if (!user) {
      toast.error("Please login first.");
      return;
    }

    const applicantRef = doc(
      db,
      "campaigns",
      campaignId,
      "applicants",
      user.uid
    );

    try {
      const alreadyApplied = await getDoc(applicantRef);
      if (alreadyApplied.exists()) {
        toast.info("You’ve already applied to this campaign.");
        return;
      }

      await setDoc(applicantRef, {
        uid: user.uid,
        email: user.email,
        appliedAt: serverTimestamp(),
        status: "Pending",
        payout: 0,
        paymentStatus: "Pending",
      });

      setApplied((prev) => [...prev, campaignId]);
      toast.success("Successfully applied!");
    } catch (error) {
      console.error("Error applying:", error);
      toast.error("Application failed. Try again.");
    }
  };

  return (
    <>
      <InfluencerNavbar />
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-purple-600 mb-6 text-center">
          Available Campaigns
        </h1>

        {loading ? (
          <p className="text-center text-gray-500">Loading campaigns...</p>
        ) : campaigns.length === 0 ? (
          <p className="text-center text-gray-400">No campaigns available.</p>
        ) : (
          <div className="space-y-6">
            {campaigns.map((campaign) => (
              <div
                key={campaign.id}
                className="border rounded-lg p-4 shadow-sm bg-white"
              >
                <h2 className="text-xl font-semibold text-purple-700">
                  {campaign.title}
                </h2>
                <p className="text-sm text-gray-500 mb-2">
                  By {campaign.brand}
                </p>
                <p className="text-gray-700 mb-2">{campaign.description}</p>
                <p className="text-sm text-gray-600 mb-2">
                  💰 Budget: ₹{campaign.budget} | 📅 Deadline: {campaign.deadline}
                </p>

                <button
                  onClick={() => handleApply(campaign.id)}
                  disabled={applied.includes(campaign.id)}
                  className={`mt-2 px-4 py-2 rounded ${
                    applied.includes(campaign.id)
                      ? "bg-gray-400 text-white cursor-not-allowed"
                      : "bg-purple-600 text-white hover:bg-purple-700"
                  }`}
                >
                  {applied.includes(campaign.id) ? "Applied" : "Apply"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Campaigns;
