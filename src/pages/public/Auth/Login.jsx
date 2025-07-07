import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../firebase";
import { useNavigate } from "react-router-dom";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../../../firebase";
import { toast } from "react-toastify"; // ✅ added this

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

const handleLogin = async (e) => {
  e.preventDefault();
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    if (!user.emailVerified) {
      toast.error("Please verify your email before logging in.");
      return;
    }

    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const userRole = docSnap.data().role;
      toast.success("Login successful!");
      navigate(userRole === "brand" ? "/brand/home" : "/influencer/home");
    } else {
      toast.error("No role found for this user.");
    }
  } catch (error) {
    toast.error(error.message);
  }
};

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center text-purple-600">
        Log In to Fluence House
      </h1>
      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700"
        >
          Log In
        </button>
        <p
  onClick={() => navigate("/reset-password")}
  className="text-sm text-purple-600 text-center cursor-pointer hover:underline mt-2"
>
  Forgot password?
</p>

      </form>
    </div>
  );
};

export default Login;
