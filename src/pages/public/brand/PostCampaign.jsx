import React, { useState } from "react";
import BrandNavbar from "../../../components/BrandNavbar";
import { db, auth } from "../../../firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";

const PostCampaign = () => {
  const [formData, setFormData] = useState({
    title: "",
    brand: "",
    description: "",
    budget: "",
    deadline: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);

    const user = auth.currentUser;
    if (!user) {
      alert("You must be logged in to post a campaign.");
      setSubmitted(false);
      return;
    }

    try {
      await addDoc(collection(db, "campaigns"), {
        ...formData,
        brandId: user.uid, // ✅ REQUIRED for Firestore rule
        createdAt: Timestamp.now(),
      });

      alert("✅ Campaign posted successfully!");
      setFormData({
        title: "",
        brand: "",
        description: "",
        budget: "",
        deadline: "",
      });
    } catch (error) {
      console.error("❌ Error adding campaign:", error.message);
      alert("Failed to post campaign.");
    }

    setSubmitted(false);
  };

  return (
    <>
      <BrandNavbar />
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-pink-600 text-center mb-6">Post a Campaign</h1>

        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow">
          <input
            type="text"
            name="title"
            placeholder="Campaign Title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full border px-4 py-2 rounded focus:outline-pink-400"
          />
          <input
            type="text"
            name="brand"
            placeholder="Brand Name"
            value={formData.brand}
            onChange={handleChange}
            required
            className="w-full border px-4 py-2 rounded focus:outline-pink-400"
          />
          <textarea
            name="description"
            placeholder="Campaign Description"
            value={formData.description}
            onChange={handleChange}
            required
            className="w-full border px-4 py-2 rounded focus:outline-pink-400"
          />
          <input
            type="number"
            name="budget"
            placeholder="Budget (₹)"
            value={formData.budget}
            onChange={handleChange}
            required
            className="w-full border px-4 py-2 rounded focus:outline-pink-400"
          />
          <input
            type="date"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
            required
            className="w-full border px-4 py-2 rounded focus:outline-pink-400"
          />

          <button
            type="submit"
            disabled={submitted}
            className="bg-pink-600 text-white px-6 py-2 rounded hover:bg-pink-700 disabled:opacity-50"
          >
            {submitted ? "Posting..." : "Post Campaign"}
          </button>
        </form>

        {/* Live Preview */}
        {(formData.title || formData.brand || formData.description) && (
          <div className="mt-10 border-t pt-6">
            <h2 className="text-xl font-semibold text-pink-600 mb-2">Live Preview</h2>
            <div className="bg-pink-50 p-4 rounded">
              <h3 className="text-lg font-bold text-pink-700">{formData.title}</h3>
              <p className="text-sm text-gray-600 mb-1">by {formData.brand}</p>
              <p className="text-gray-700 mb-2">{formData.description}</p>
              <p className="text-sm text-gray-600">
                💰 Budget: ₹{formData.budget || "N/A"} | 📅 Deadline: {formData.deadline || "N/A"}
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default PostCampaign;
