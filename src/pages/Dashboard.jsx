import React, { useState, useEffect } from "react";
import axiosInstance from "../axiosConfig"; // Update the path as necessary

const Dashboard = () => {
  const [foranes, setForanes] = useState([]);
  const [parishCount, setParishCount] = useState(0);

  useEffect(() => {
    fetchForanes();
  }, []);

  const fetchForanes = async () => {
    try {
      const response = await axiosInstance.get("/forane");
      const foranesData = response.data;
      setForanes(foranesData);
      fetchAllParishes(foranesData);
    } catch (error) {
      console.error("Error fetching foranes:", error);
    }
  };

  const fetchAllParishes = async (foranesData) => {
    try {
      let totalParishCount = 0;
      for (let i = 0; i < foranesData.length; i++) {
        const foraneId = foranesData[i]._id;
        const response = await axiosInstance.get(`/parish/forane/${foraneId}`);
        const parishes = response.data || [];
        totalParishCount += parishes.length;
      }
      setParishCount(totalParishCount);
    } catch (error) {
      console.error("Error fetching parishes:", error);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <p>Welcome to your dashboard. Here's an overview of your key metrics.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-bold text-lg">Foranes</h2>
          <p className="text-3xl font-bold text-blue-500">{foranes.length}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-bold text-lg">Parishes</h2>
          <p className="text-3xl font-bold text-green-500">{parishCount}</p>
        </div>
        {/* <div className="bg-white p-4 rounded shadow">
          <h2 className="font-bold text-lg">Active Products</h2>
          <p className="text-3xl font-bold text-purple-500">567</p>
        </div> */}
      </div>
    </div>
  );
};

export default Dashboard;
