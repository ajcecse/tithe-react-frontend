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
import Statistics from "../components/Statistics";
import { TbLayoutSidebarLeftCollapseFilled } from "react-icons/tb";
import { TbLayoutSidebarRightCollapseFilled } from "react-icons/tb";
import { Collapse } from "@mui/material";
const Dashboard = () => {
  const [menu, setMenu] = useState(true);
  const collapseMenu = () => {
    setMenu(!menu);
  };
  return (
    <div className="flex w-full">
      <div className="w-full flex flex-col items-center">
        <div className="items-center flex flex-col">
          <img className="fadedown h-[10rem]" src={logo} />
          <h1 className="text-[2rem] font-bold mb-4 fadedown">
            Kanjirapally Diocese Finance Mangement
          </h1>
        </div>
        <Statistics />
      </div>
    </div>
  );
};

export default Dashboard;
