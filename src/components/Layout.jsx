import { Link, Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="flex h-screen  bg-gray-100">
      <aside className="w-64 fixed h-screen bg-gray-800 text-white p-4">
        <nav className="">
          <ul>
            <li>
              <Link to="/" className="block py-2 px-4 hover:bg-gray-700">
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/forane" className="block py-2 px-4 hover:bg-gray-700">
                Forane
              </Link>
            </li>
            <li>
              <Link to="/parish" className="block py-2 px-4 hover:bg-gray-700">
                Parish
              </Link>
            </li>
            <li>
              <Link
                to="/koottayma"
                className="block py-2 px-4 hover:bg-gray-700"
              >
                Koottayma
              </Link>
            </li>
          </ul>
        </nav>
      </aside>
      <main className="flex-1 p-8 pl-[16rem]">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
