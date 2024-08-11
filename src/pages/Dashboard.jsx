import React, { useState, useEffect } from "react";
import axiosInstance from "../axiosConfig"; // Update the path as necessary

const Dashboard = () => {
  const [foranes, setForanes] = useState([]);
  const [parishCount, setParishCount] = useState(0);
  const [koottaymaCount, setKoottaymaCount] = useState(0);
  const [familyCount, setFamilyCount] = useState(0);
  const [personCount, setPersonCount] = useState(0);

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
      let allParishes = [];
      for (let i = 0; i < foranesData.length; i++) {
        const foraneId = foranesData[i]._id;
        const response = await axiosInstance.get(`/parish/forane/${foraneId}`);
        const parishes = response.data || [];
        totalParishCount += parishes.length;
        allParishes = [...allParishes, ...parishes];
      }
      setParishCount(totalParishCount);
      fetchAllKoottaymas(allParishes);
    } catch (error) {
      console.error("Error fetching parishes:", error);
    }
  };

  const fetchAllKoottaymas = async (parishes) => {
    try {
      let totalKoottaymaCount = 0;
      let allKoottaymas = [];
      for (let i = 0; i < parishes.length; i++) {
        const parishId = parishes[i]._id;
        const response = await axiosInstance.get(
          `/koottayma/parish/${parishId}`
        );
        const koottaymas = response.data || [];
        totalKoottaymaCount += koottaymas.length;
        allKoottaymas = [...allKoottaymas, ...koottaymas];
      }
      setKoottaymaCount(totalKoottaymaCount);
      fetchAllFamilies(allKoottaymas);
    } catch (error) {
      console.error("Error fetching koottaymas:", error);
    }
  };

  const fetchAllFamilies = async (koottaymas) => {
    try {
      let totalFamilyCount = 0;
      let allFamilies = [];
      for (let i = 0; i < koottaymas.length; i++) {
        const koottaymaId = koottaymas[i]._id;
        const response = await axiosInstance.get(
          `/family/kottayma/${koottaymaId}`
        );
        const families = response.data || [];
        totalFamilyCount += families.length;
        allFamilies = [...allFamilies, ...families];
      }
      setFamilyCount(totalFamilyCount);
      fetchAllPersons(allFamilies);
    } catch (error) {
      console.error("Error fetching families:", error);
    }
  };

  const fetchAllPersons = async (families) => {
    try {
      let totalPersonCount = 0;
      for (let i = 0; i < families.length; i++) {
        const familyId = families[i]._id;
        const response = await axiosInstance.get(`/person/${familyId}`);
        const persons = response.data || [];
        totalPersonCount += persons.length;
      }
      setPersonCount(totalPersonCount);
    } catch (error) {
      console.error("Error fetching persons:", error);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Kanjirapally</h1>
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
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-bold text-lg">Koottaymas</h2>
          <p className="text-3xl font-bold text-red-500">{koottaymaCount}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-bold text-lg">Families</h2>
          <p className="text-3xl font-bold text-yellow-500">{familyCount}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-bold text-lg">Persons</h2>
          <p className="text-3xl font-bold text-purple-500">{personCount}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
