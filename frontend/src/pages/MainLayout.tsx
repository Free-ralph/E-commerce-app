import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
const MainLayout = () => {
  return (
    <div className="w-full h-full overflow-scroll  flex flex-col">
      <div className="">
      <Navbar />
      </div>
      <div className="md:mx-7 flex-grow">
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
