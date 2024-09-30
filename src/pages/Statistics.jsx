import React, { useEffect, useState } from "react";
import axiosInstance from "../axiosConfig";
import StatBasicUnit from "../components/StatBasicUnit";
import { FaCross } from "react-icons/fa";
import { FaChurch } from "react-icons/fa6";
import { MdFamilyRestroom } from "react-icons/md";
import { FaPerson } from "react-icons/fa6";
import { FaPeopleGroup } from "react-icons/fa6";
const Statistics = () => {
  const [stats, setStats] = useState({ genderStats: [], occupationStats: [] });
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
      console.log(allFamilies);
      fetchAllPersons(allFamilies);
    } catch (error) {
      console.error("Error fetching families:", error);
    }
  };

  const fetchAllPersons = async (families) => {
    try {
      let totalPersonCount = 0;
      for (let i = 0; i < families.length; i++) {
        const familyId = families[i].id;
        const response = await axiosInstance.get(`/person/family/${familyId}`);
        const persons = response.data || [];
        totalPersonCount += persons.length;
      }
      setPersonCount(totalPersonCount);
    } catch (error) {
      console.error("Error fetching persons:", error);
    }
  };
  useEffect(() => {
    const fetchStats = async () => {
      const response = await fetch("/api/stats");
      const data = await response.json();
      setStats(data);
    };
    fetchStats();
  }, []);

  return (
    <div className="bg-gray-50 p-10 flex flex-col items-center">
      <h1 className="text-[2rem] font-bold">Overview</h1>
      <div className="flex gap-[5rem] p-5">
        <StatBasicUnit unit="Foranes" number={foranes.length} Icon={FaCross} />
        <StatBasicUnit unit="Parishes" number={parishCount} Icon={FaChurch} />
        <StatBasicUnit
          unit="Koottaymas"
          number={koottaymaCount}
          Icon={FaPeopleGroup}
        />
        <StatBasicUnit
          unit="Families"
          number={familyCount}
          Icon={MdFamilyRestroom}
        />
        <StatBasicUnit unit="Persons" number={personCount} Icon={FaPerson} />
      </div>
    </div>
  );
};

export default Statistics;
