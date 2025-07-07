import React, { useEffect, useState } from "react";
import { auth, db } from "../../../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import InfluencerNavbar from "../../../components/InfluencerNavbar";
import { toast } from "react-toastify";

const Profile = () => {
  const [profile, setProfile] = useState({
    name: "",
    bio: "",
    instagram: "",
    niche: "",
    age: "",
    location: "",
    contentTypes: "",
    followers: "",
    otherSocials: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setProfile((prev) => ({
          ...prev,
          name: data.name || "",
          bio: data.bio || "",
          instagram: data.instagram || "",
          niche: data.niche || "",
          age: data.age || "",
          location: data.location || "",
          contentTypes: data.contentTypes || "",
          followers: data.followers || "",
          otherSocials: data.otherSocials || "",
        }));
      }

      setLoading(false);
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const requiredFields = Object.keys(profile);
    const missingField = requiredFields.find((field) => !profile[field]?.trim());

    if (missingField) {
      toast.error(`Please fill out the "${missingField}" field.`);
      return;
    }

    try {
      const docRef = doc(db, "users", user.uid);
      await setDoc(
        docRef,
        {
          ...profile,
          email: user.email,
          role: "influencer",
        },
        { merge: true }
      );
      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <>
      <InfluencerNavbar />
      <div className="max-w-xl mx-auto p-6 bg-white rounded shadow mt-4">
        <h2 className="text-2xl font-bold mb-4 text-purple-600">My Profile</h2>

        {[
          { label: "Full Name", name: "name", type: "text" },
          { label: "Bio", name: "bio", type: "textarea" },
          { label: "Instagram Handle", name: "instagram" },
          { label: "Niche", name: "niche" },
          { label: "Age", name: "age", type: "number" },
          { label: "Location", name: "location" },
          { label: "Content Types (comma-separated)", name: "contentTypes" },
          { label: "Followers Count", name: "followers", type: "number" },
          { label: "Other Social Links", name: "otherSocials" },
        ].map(({ label, name, type }) => (
          <div key={name}>
            <label className="block mb-1 font-medium">{label}</label>
            {type === "textarea" ? (
              <textarea
                className="w-full mb-3 p-2 border rounded"
                name={name}
                value={profile[name]}
                onChange={handleChange}
                required
              />
            ) : (
              <input
                className="w-full mb-3 p-2 border rounded"
                type={type || "text"}
                name={name}
                value={profile[name]}
                onChange={handleChange}
                required
              />
            )}
          </div>
        ))}

        <button
          onClick={handleSave}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 w-full"
        >
          Save Profile
        </button>
      </div>
    </>
  );
};

export default Profile;
