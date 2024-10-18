import React, { useState, useEffect } from "react";
import axiosInstance from "../axiosConfig"; // Update the path as necessary
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
const Dashboard = () => {
  return (
    <div className="flex flex-col items-center p-5">
      <img className="fadedown h-[10rem]" src={logo} />
      <h1 className="text-[2rem] font-bold mb-4 fadedown">
        Kanjirapally Diocese Finance Mangement
      </h1>

      <div className="flex flex-col mt-2 w-full">
        <div className="flex justify-center p-2 gap-10">
          <div className="bg-white p-5 rounded shadow w-[50%] flex justify-center fadeup">
            <Link
              to="/finance"
              className="font-bold text-lg hover:underline underline-offset-8 cursor-pointer"
            >
              <div className="flex flex-col gap-5 items-center">
                <div className="flex gap-3 text-[2rem]">
                  <FaMoneyBillWave />
                </div>
                <h1 className="text-[1.3rem] font-regular">Family Finance</h1>
              </div>
            </Link>
          </div>

          <div className="bg-white p-5 rounded shadow w-[50%] flex justify-center fadeup">
            <Link
              to="/statistics"
              className="flex items-center gap-5 font-bold text-lg hover:underline underline-offset-8 cursor-pointer"
            >
              <div className="flex flex-col gap-5 items-center">
                <div className="flex gap-3 text-[2rem]">
                  <ImStatsDots />
                </div>

                <h1 className="text-[1.3rem] font-regular">Statistics</h1>
              </div>
            </Link>
          </div>
        </div>

        <div className="flex p-3 gap-[3rem]">
          {/* <div className="bg-white p-4 rounded shadow w-full flex justify-center fadeup">
            <h2 className="font-bold text-lg hover:underline underline-offset-8 cursor-pointer">
              <h1>Manage Family</h1>
            </h2>
          </div> */}
          <div className="bg-white p-4 rounded shadow w-full flex justify-center fadeup">
            <Link
              to="/moveperson"
              className="font-bold text-lg hover:underline underline-offset-8 cursor-pointer"
            >
              <div className="flex flex-col gap-5 items-center">
                <div className="flex gap-3 text-[2rem]">
                  <FaPerson />
                  <FaArrowRightArrowLeft />
                  <FaPerson />
                </div>
                <h1 className="text-[1.3rem] font-regular">Move Person</h1>
              </div>
            </Link>
          </div>
          <div className="bg-white py-5 px-[0rem] rounded shadow w-full flex justify-center fadeup">
            <Link
              to="/movefamily"
              className="font-bold text-lg hover:underline underline-offset-8 cursor-pointer"
            >
              <div className="flex flex-col gap-5 items-center">
                <div className="flex gap-3 text-[2rem]">
                  <MdFamilyRestroom />
                  <FaArrowRightArrowLeft />
                  <MdFamilyRestroom />
                </div>

                <h1 className="text-[1.3rem] font-regular">Move Family</h1>
              </div>
            </Link>
          </div>
        </div>
        {/* <div className="flex p-3 gap-[3rem]">
          <div className="bg-white p-4 rounded shadow w-full flex justify-center fadeup">
            <Link
              to="/familymanage"
              className="font-bold text-lg hover:underline underline-offset-8 cursor-pointer"
            >
              <h1>Add Person</h1>
            </Link>
          </div>
          <div className="bg-white p-4 rounded shadow w-full flex justify-center fadeup">
            <Link
              to="/familymanage"
              className="font-bold text-lg hover:underline underline-offset-8 cursor-pointer"
            >
              <h1>Manage Person</h1>
            </Link>
          </div>
        </div> */}
        <div className="flex p-3 gap-[3rem]">
          <div className="bg-white p-4 rounded shadow w-full flex justify-center fadeup">
            <Link
              to="/family"
              className="font-bold text-lg hover:underline underline-offset-8 cursor-pointer"
            >
              <div className="flex gap-5 items-center">
                <MdFamilyRestroom />
                <h1>Create/Manage Family</h1>
              </div>
            </Link>
          </div>
          <div className="bg-white p-4 rounded shadow w-full flex justify-center fadeup">
            <Link
              to="/koottayma"
              className="font-bold text-lg hover:underline underline-offset-8 cursor-pointer"
            >
              <div className="flex gap-5 items-center">
                <FaPeopleGroup />
                <h1>Create/Manage Koottayma</h1>
              </div>
            </Link>
          </div>
          <div className="bg-white p-4 rounded shadow w-full flex justify-center fadeup">
            <Link
              to="/parish"
              className="font-bold text-lg hover:underline underline-offset-8 cursor-pointer"
            >
              <div className="flex gap-5 items-center">
                <FaChurch />
                <h1>Create/Manage Parish</h1>
              </div>
            </Link>
          </div>
          <div className="bg-white p-4 rounded shadow w-full flex justify-center fadeup">
            <Link
              to="/forane"
              className="font-bold text-lg hover:underline underline-offset-8 cursor-pointer"
            >
              <div className="flex gap-5 items-center">
                <FaCross />
                <h1>Create/Manage Forane</h1>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
