import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../../firebase";
import { doc, getDoc } from "firebase/firestore";
import BrandNavbar from "../../../components/BrandNavbar";

const Home = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        navigate("/login");
      } else {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserInfo({ email: user.email, role: docSnap.data().role });
        }
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  return (
    <>
      <BrandNavbar />
      <div className="p-10 text-center">
        <h1 className="text-3xl font-bold text-pink-600">Welcome, Brand Partner!</h1>
        {userInfo && (
          <p className="mt-2 text-gray-600">
            Logged in as <strong>{userInfo.email}</strong> ({userInfo.role})
          </p>
        )}
      </div>
    </>
  );
};

export default Home;
