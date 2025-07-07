import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="p-10 text-center">
      <h1 className="text-4xl font-bold text-purple-600">Welcome to Fluence House</h1>
      <p className="mt-4 text-gray-600">Connecting influencers and brands for powerful collaborations.</p>
      
      <div className="mt-8 space-x-4">
        <Link
          to="/login?role=influencer"
          className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700"
        >
          Join as Influencer
        </Link>
        <Link
          to="/login?role=brand"
          className="bg-pink-500 text-white px-6 py-2 rounded hover:bg-pink-600"
        >
          Join as Brand
        </Link>
      </div>
    </div>
  );
};

export default Home;
