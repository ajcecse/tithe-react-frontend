import { Link, Outlet, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
const Layout = () => {
  const [dash, setDash] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Set dash to true if the current path is the dashboard ("/")
    if (location.pathname === "/finance") {
      setDash(true);
    } else {
      setDash(false);
    }
  }, [location.pathname]); // This effect runs every time the path changes
  return (
    <div className="flex h-screen bg-gray-100">
      {/* <aside
        className={
          dash
            ? "w-32 fixed h-screen bg-gray-800 text-white p-4"
            : "w-64 fixed h-screen bg-gray-800 text-white p-4"
        }
      >
        <nav className="">
          <ul>
            <li>
              <Link to="/" className="block py-2 px-4 hover:bg-gray-700">
                Dashboard
              </Link>
            </li>
            <li>
             
            </li>
            <li>
              
            </li>
            <li>
              
            </li>
            <li>
              <Link to="/family" className="block py-2 px-4 hover:bg-gray-700">
                Family
              </Link>
            </li>
            <li>
              <Link
                to="/familymanage"
                className="block py-2 px-4 hover:bg-gray-700"
              >
                Person
              </Link>
            </li>
            <li>
              <Link to="/finance" className="block py-2 px-4 hover:bg-gray-700">
                Finance
              </Link>
            </li>
          </ul>
        </nav>
      </aside> */}
      <main className="flex-1 p-10">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
