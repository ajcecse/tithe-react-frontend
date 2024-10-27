import React, { useState, useEffect } from "react";
import axiosInstance from "../axiosConfig"; // Adjust the import path as needed
import Button from "../components/Button";
import { FaPeopleRoof } from "react-icons/fa6";
import { FaChurch } from "react-icons/fa6";
import { FaPeopleCarry } from "react-icons/fa";
const FinanceSettings = () => {
  return (
    <div className=" p-8 shadow-lg w-full h-[100vh]">
      {/* Header and Title */}
      <div className="text-center my-[3rem] fadeup">
        {/* turn this into a drop down */}
        <button className="bg-gray-200 px-4 py-2 text-lg font-bold mb-4">
          YEAR
        </button>

        <h1 className="text-3xl font-bold mb-2">Finance Allocation Settings</h1>
      </div>

      {/* Buttons Section */}
      <div className="flex gap-[5rem] justify-center">
        <Button Icon={FaPeopleRoof} title="Communities" link="community" />
        <Button Icon={FaChurch} title="Parishes" link="forane" />
        {/* <p className="absolute text-xs text-blue-600 top-1 right-2 italic">
            if Community allocated only then buttons clearly visible
          </p> */}
        <Button Icon={FaPeopleCarry} title="Other Projects" link="forane" />
      </div>

      {/* Total Collection Section */}
      <div className="text-center mt-8 fadeup">
        <h2 className="text-[1.75rem] font-bold my-[2rem]">Total Collection</h2>
        <div className="flex justify-center gap-[10rem]">
          <div className="text-left text-[1.5rem]">
            <p className="font-semibold">Communities</p>
            <p className=" font-semibold">Parishes</p>
            <p className="font-semibold">Other Projects</p>
          </div>
          <div className="text-right text-[1.5rem]">
            <p>Allocated amount</p>
            <p>Allocated amount</p>
            <p>Allocated amount</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinanceSettings;
