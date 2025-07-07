import React, { useState } from "react";
import BrandNavbar from "../../../components/BrandNavbar";

const initialPayments = [
  {
    id: 1,
    influencer: "Neha Desai",
    campaign: "Streetwear Collab",
    amount: 4000,
    status: "Paid",
  },
  {
    id: 2,
    influencer: "Aarav Sharma",
    campaign: "Summer Skincare Launch",
    amount: 5000,
    status: "Pending",
  },
  {
    id: 3,
    influencer: "Rohan Mehta",
    campaign: "Reel Challenge",
    amount: 3000,
    status: "Pending",
  },
];

const Payments = () => {
  const [payments, setPayments] = useState(initialPayments);

  const markAsPaid = (id) => {
    const updated = payments.map((p) =>
      p.id === id ? { ...p, status: "Paid" } : p
    );
    setPayments(updated);
  };

  return (
    <>
      <BrandNavbar />
      <div className="p-6 max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-pink-600 text-center mb-6">
          Payment Overview
        </h1>

        <table className="w-full table-auto border-collapse shadow-sm">
          <thead>
            <tr className="bg-pink-100 text-pink-800 text-left">
              <th className="p-3">Influencer</th>
              <th className="p-3">Campaign</th>
              <th className="p-3">Amount (₹)</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id} className="border-b hover:bg-pink-50">
                <td className="p-3 font-medium">{payment.influencer}</td>
                <td className="p-3">{payment.campaign}</td>
                <td className="p-3">₹{payment.amount}</td>
                <td className="p-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      payment.status === "Paid"
                        ? "bg-green-200 text-green-700"
                        : "bg-yellow-200 text-yellow-800"
                    }`}
                  >
                    {payment.status}
                  </span>
                </td>
                <td className="p-3">
                  {payment.status === "Pending" && (
                    <button
                      onClick={() => markAsPaid(payment.id)}
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                    >
                      Mark as Paid
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Payments;
