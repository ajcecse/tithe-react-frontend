import { Link, Outlet, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
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
import { TbLayoutSidebarLeftCollapseFilled } from "react-icons/tb";
import { TbLayoutSidebarRightCollapseFilled } from "react-icons/tb";
import { Collapse } from "@mui/material";

const Layout = () => {
  const [dash, setDash] = useState(false);
  const location = useLocation();
  const [menu, setMenu] = useState(true);
  const collapseMenu = () => {
    setMenu(!menu);
  };
  useEffect(() => {
    // Set dash to true if the current path is the dashboard ("/")
    if (location.pathname === "/finance") {
      setDash(true);
    } else {
      setDash(false);
    }
  }, [location.pathname]); // This effect runs every time the path changes
  return (
    <div className="flex  bg-gray-50 ">
      {/* Side Menu */}
      <div
        className={`h-screen bg-white border-black border-2 overflow-y-auto ${
          menu ? "w-[6%]" : "w-[20%]"
        }`}
      >
        <div
          className={`flex w-full items-center py-[2rem]  bg-white fadeup ${
            menu ? "justify-center" : " justify-between px-[1.7rem] "
          }`}
        >
          {!menu && (
            <Link to="/">
              <h1 className="font-bold text-[2rem]">Tithe</h1>
            </Link>
          )}
          {menu ? (
            <TbLayoutSidebarRightCollapseFilled
              className="text-[2.5rem] cursor-pointer"
              onClick={collapseMenu}
            />
          ) : (
            <TbLayoutSidebarLeftCollapseFilled
              className="text-[2.5rem] cursor-pointer"
              onClick={collapseMenu}
            />
          )}
        </div>
        <DashboardButton
          link="/finance"
          Icon={FaMoneyBillWave}
          title="Family Finance"
          collapse={menu}
        />
        <DashboardButton
          link="/financesettings"
          Icon={FaGears}
          title="Finance Settings"
          collapse={menu}
        />
        {/* <DashboardButton
          link="/statistics"
          Icon={ImStatsDots}
          title="Statistics"
          collapse={menu}
        /> */}
        <DashboardButton
          link="/community"
          Icon={FaPeopleRoof}
          title="Manage Communities"
          collapse={menu}
        />
        <DashboardButton
          link="/projects"
          Icon={FaPeopleCarry}
          title="Manage Other Projects"
          collapse={menu}
        />
        <DashboardButton
          link="/moveperson"
          Icon={FaArrowRightArrowLeft}
          title="Move Person"
          collapse={menu}
        />
        <DashboardButton
          link="/family"
          Icon={MdFamilyRestroom}
          title="Manage Families"
          collapse={menu}
        />
        <DashboardButton
          link="/koottayma"
          Icon={FaPeopleGroup}
          title="Manage Kootayma"
          collapse={menu}
        />
        <DashboardButton
          link="/movefamily"
          Icon={FaArrowRightArrowLeft}
          title="Move Family"
          collapse={menu}
        />
        <DashboardButton
          link="/parish"
          Icon={FaChurch}
          title="Manage Parish"
          collapse={menu}
        />
        <DashboardButton
          link="/forane"
          Icon={FaCross}
          title="Manage Forane"
          collapse={menu}
        />
      </div>
      <div className="w-full">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
