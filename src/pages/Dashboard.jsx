import React, { useState, useEffect } from "react";
import axiosInstance from "../axiosConfig"; // Update the path as necessary
import { Link } from "react-router-dom";
import logo from "../assets/cropped-eparchy_klpyEBM.png";
import { ImStatsDots } from "react-icons/im";
const Dashboard = () => {
  return (
    <div className="flex flex-col items-center">
      <img src={logo} />
      <h1 className="text-2xl font-bold mb-4">
        Kanjirapally Diocese Finance Mangement
      </h1>

      <div className="flex flex-col mt-2 w-full">
        <div className="flex justify-center p-2 gap-10">
          <div className="bg-white p-5 rounded shadow w-[50%] flex justify-center">
            <Link
              to="/finance"
              className="font-bold text-lg hover:underline underline-offset-8 cursor-pointer"
            >
              <h1>Family Finance</h1>
            </Link>
          </div>

          <div className="bg-white p-5 rounded shadow w-[50%] flex justify-center">
            <Link
              to="/statistics"
              className="flex items-center gap-5 font-bold text-lg hover:underline underline-offset-8 cursor-pointer"
            >
              <ImStatsDots />
              <h1>Statistics</h1>
            </Link>
          </div>
        </div>

        <div className="flex p-3 gap-[3rem]">
          <div className="bg-white p-4 rounded shadow w-full flex justify-center">
            <Link
              to="/family"
              className="font-bold text-lg hover:underline underline-offset-8 cursor-pointer"
            >
              <h1>Add Family</h1>
            </Link>
          </div>
          <div className="bg-white p-4 rounded shadow w-full flex justify-center">
            <h2 className="font-bold text-lg hover:underline underline-offset-8 cursor-pointer">
              <h1>Manage Family</h1>
            </h2>
          </div>
          <div className="bg-white p-4 rounded shadow w-full flex justify-center">
            <Link
              to="/movefamily"
              className="font-bold text-lg hover:underline underline-offset-8 cursor-pointer"
            >
              <h1>Move Family</h1>
            </Link>
          </div>
        </div>
        <div className="flex p-3 gap-[3rem]">
          <div className="bg-white p-4 rounded shadow w-full flex justify-center">
            <Link
              to="/familymanage"
              className="font-bold text-lg hover:underline underline-offset-8 cursor-pointer"
            >
              <h1>Add Person</h1>
            </Link>
          </div>
          <div className="bg-white p-4 rounded shadow w-full flex justify-center">
            <Link
              to="/familymanage"
              className="font-bold text-lg hover:underline underline-offset-8 cursor-pointer"
            >
              <h1>Manage Person</h1>
            </Link>
          </div>
          <div className="bg-white p-4 rounded shadow w-full flex justify-center">
            <Link
              to="/moveperson"
              className="font-bold text-lg hover:underline underline-offset-8 cursor-pointer"
            >
              <h1>Move Person</h1>
            </Link>
          </div>
        </div>
        <div className="flex p-3 gap-[3rem]">
          <div className="bg-white p-4 rounded shadow w-full flex justify-center">
            <Link
              to="/koottayma"
              className="font-bold text-lg hover:underline underline-offset-8 cursor-pointer"
            >
              <h1>Create/Manage Koottayma</h1>
            </Link>
          </div>
          <div className="bg-white p-4 rounded shadow w-full flex justify-center">
            <Link
              to="/parish"
              className="font-bold text-lg hover:underline underline-offset-8 cursor-pointer"
            >
              <h1>Create/Manage Parish</h1>
            </Link>
          </div>
          <div className="bg-white p-4 rounded shadow w-full flex justify-center">
            <Link
              to="/forane"
              className="font-bold text-lg hover:underline underline-offset-8 cursor-pointer"
            >
              <h1>Create/Manage Forane</h1>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
