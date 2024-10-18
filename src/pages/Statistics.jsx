import React, { useEffect, useState } from "react";
import axiosInstance from "../axiosConfig";
import StatBasicUnit from "../components/StatBasicUnit";
import { PieChart } from "@mui/x-charts/PieChart";
import { BarChart } from "@mui/x-charts/BarChart";
import { axisClasses } from "@mui/x-charts/ChartsAxis";
import { dataset, valueFormatter } from "../assets/dataset";
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
  const chartSetting = {
    yAxis: [
      {
        label: "Credit (mm)",
      },
    ],
    width: 1500,
    height: 400,
    sx: {
      [`.${axisClasses.left} .${axisClasses.label}`]: {
        transform: "translate(-10px, 0)",
      },
    },
  };
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
  const palettes = [
    ["lightcoral", "slateblue"],
    ["blue", "green", "lightblue"],
    ["Aquamarine", "DarkCyan", "CadetBlue"],
    ["Cyan", "DeepPink"],
  ];
  return (
    <div className="bg-gray-50 p-10 flex flex-col items-center">
      <h1 className="text-[2rem] font-bold fadedown">Overview</h1>
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
      <div className="flex flex-col items-center gap-5 py-10">
        <h1 className="text-[1.5rem] fadedown">Population Statistics</h1>
        <div className="flex fadedown">
          <PieChart
            colors={palettes[0]}
            series={[
              {
                data: [
                  { id: 0, value: 10, label: "Men" },
                  { id: 1, value: 15, label: "Women" },
                ],
              },
            ]}
            width={350}
            height={200}
          />
          <PieChart
            colors={palettes[1]}
            series={[
              {
                data: [
                  { id: 0, value: 10, label: "1-18 Yrs" },
                  { id: 1, value: 15, label: "19-35 Yrs" },
                  { id: 2, value: 30, label: "36-50 Yrs" },
                ],
              },
            ]}
            width={350}
            height={200}
          />
          <PieChart
            colors={palettes[2]}
            series={[
              {
                data: [
                  { id: 0, value: 30, label: "10 Pass" },
                  { id: 1, value: 25, label: "12 Pass" },
                  { id: 2, value: 10, label: "Degree" },
                ],
              },
            ]}
            width={350}
            height={200}
          />
          <PieChart
            colors={palettes[3]}
            series={[
              {
                data: [
                  { id: 0, value: 80, label: "Single" },
                  { id: 1, value: 45, label: "Married" },
                ],
              },
            ]}
            width={350}
            height={200}
          />
        </div>
      </div>
      <div className="flex flex-col items-center gap-5 pt-5">
        <h1 className="text-[1.5rem]">Financial Statistics</h1>
        <div className="flex">
          <BarChart
            dataset={dataset}
            xAxis={[{ scaleType: "band", dataKey: "month" }]}
            series={[
              {
                dataKey: "london",
                label: "Ponkunnam",
                valueFormatter,
              },
              { dataKey: "paris", label: "Ranni ", valueFormatter },
              {
                dataKey: "newYork",
                label: "Upputhara ",
                valueFormatter,
              },
              {
                dataKey: "seoul",
                label: "Velichiyani ",
                valueFormatter,
              },
            ]}
            {...chartSetting}
          />
        </div>
      </div>
    </div>
  );
};

export default Statistics;
