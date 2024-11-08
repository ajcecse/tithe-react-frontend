import React, { useState, useEffect } from "react"; // Update the path as necessary
import { Link } from "react-router-dom";
import logo from "../assets/cropped-eparchy_klpyEBM.png";
import { ImStatsDots } from "react-icons/im";
import { FaCross } from "react-icons/fa";
import { FaChurch } from "react-icons/fa6";
import { MdFamilyRestroom } from "react-icons/md";
import { FaPerson } from "react-icons/fa6";
import { FaPeopleGroup } from "react-icons/fa6";
import { FaMoneyBillWave } from "react-icons/fa6";
import { FaArrowRightArrowLeft } from "react-icons/fa6";
import { FaGears } from "react-icons/fa6";
import { FaPeopleRoof } from "react-icons/fa6";
import { FaPeopleCarry } from "react-icons/fa";
import DashboardButton from "../components/DashboardButton";

const Dashboard = () => {
  return (
    <div className="flex w-full">
      {/* Side Menu */}
      <div className="h-screen bg-gray-200 border-black border-2">
        <DashboardButton
          link="/finance"
          Icon={FaMoneyBillWave}
          title="Family Finance"
        />
        <DashboardButton
          link="/financesettings"
          Icon={FaGears}
          title="Finance Settings"
        />
        <DashboardButton
          link="/statistics"
          Icon={ImStatsDots}
          title="Statistics"
        />
        <DashboardButton
          link="/community"
          Icon={FaPeopleRoof}
          title="Manage Communities"
        />
        <DashboardButton
          link="/projects"
          Icon={FaPeopleCarry}
          title="Manage Other Projects"
        />
        <DashboardButton
          link="/moveperson"
          Icon={FaArrowRightArrowLeft}
          title="Move Person"
        />
        <DashboardButton
          link="/family"
          Icon={MdFamilyRestroom}
          title="Manage Families"
        />

        <DashboardButton
          link="/koottayma"
          Icon={FaPeopleGroup}
          title="Manage Kootayma"
        />
        <DashboardButton
          link="/movefamily"
          Icon={FaArrowRightArrowLeft}
          title="Move Family"
        />
        <DashboardButton link="/parish" Icon={FaChurch} title="Manage Parish" />
        <DashboardButton link="/forane" Icon={FaCross} title="Manage Forane" />
      </div>
      <div className="w-full">
        <img className="fadedown h-[10rem]" src={logo} />

        <h1 className="text-[2rem] font-bold mb-4 fadedown">
          Kanjirapally Diocese Finance Mangement
        </h1>
      </div>
    </div>
  );
};

export default Dashboard;
