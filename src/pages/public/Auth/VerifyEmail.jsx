import React from "react";
import { auth } from "../../../firebase";
import { sendEmailVerification } from "firebase/auth";
import { toast } from "react-toastify";

const VerifyEmail = () => {
  const resendVerification = async () => {
    const user = auth.currentUser;
    if (user && !user.emailVerified) {
      await sendEmailVerification(user);
      toast.success("Verification email resent!");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4 text-purple-700">Verify Your Email</h2>
      <p className="mb-4 text-gray-600">
        A verification email has been sent to your inbox. Please click the link to activate your account.
      </p>
      <button
        onClick={resendVerification}
        className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
      >
        Resend Email
      </button>
    </div>
  );
};

export default VerifyEmail;
