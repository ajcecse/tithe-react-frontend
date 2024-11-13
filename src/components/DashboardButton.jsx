import { Link } from "react-router-dom";

function DashboardButton({ link, Icon, title, collapse }) {
  return (
    <div className="bg-white p-5 rounded shadow flex fadeup ">
      <Link
        to={link}
        className="font-bold text-lg hover:underline underline-offset-8 cursor-pointer"
      >
        <div className="flex gap-5 items-center">
          <div className="flex gap-3 text-[1.5rem]">
            <Icon />
          </div>
          {collapse ? (
            ""
          ) : (
            <h1 className="text-[1.3rem] font-regular">{title}</h1>
          )}
        </div>
      </Link>
    </div>
  );
}

export default DashboardButton;
