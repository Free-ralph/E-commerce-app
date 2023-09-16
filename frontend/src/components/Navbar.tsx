import { Link, NavLink } from "react-router-dom";
import LocalMallIcon from "@mui/icons-material/LocalMallOutlined";
import CloseIcon from "@mui/icons-material/Close";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import { Tooltip } from "@mui/material";
import { useState } from "react";
import { useStateContext } from "../context/StateContextProvider";
import { useAuthStateContext } from "../context/AuthContextProvider";
import { useQuery } from "react-query";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { motion as m, AnimatePresence } from "framer-motion";

const NavBarVariant = {
  hidden: {
    height: "0px",
    transition: {
      delay: 0.2,
    },
  },
  visible: {
    height: "3.5rem",
    transition: {
      staggerChildren: 0.5,
    },
  },
};

const NavBarItemsVariant = {
  hidden: {
    opacity: 0,
  },

  visible: {
    opacity: 1,
    transition: {
      delay: 0.4,
    },
  },
};

const Navbar = () => {
  const axiosPrivate = useAxiosPrivate();
  const [activeNavbar, setActiveNavbar] = useState(false);
  const { AccountInfo } = useStateContext();
  const { logout } = useAuthStateContext();
  const handleCloseNavbar = () => {
    setActiveNavbar(false);
  };

  const activeStyle =
    "mr-5 border-b-4 text-center border-pink-500 h-full items-center flex font-semibold text-primary";
  const inActiveStyle =
    "mr-5 text-center h-full items-center flex text-gray-400";

  const { data } = useQuery({
    queryKey: ["cartSize"],
    queryFn: () =>
      axiosPrivate.get<{ size: string }>(`/cart-size`).then((res) => res.data),
  });

  return (
    <>
      <div className="w-full min-h-navbar border-b-2 border-muted text-primary">
        <div className="mx-7 flex items-center h-[9vh]">
          <Link to="/" className="font-bold w-1/4 text-pink-700">
            {AccountInfo?.username ? AccountInfo?.username : "TopShop"}
          </Link>
          <div className="lg:flex justify-between w-full h-full items-center hidden">
            <div className="flex w-1/4 h-full items-center">
              <NavLink
                to={"/"}
                className={({ isActive }) =>
                  isActive ? activeStyle : inActiveStyle
                }
              >
                <span className="hover:bg-muted  transition-all delay-75 px-4 py-2">
                  Shop
                </span>
              </NavLink>
              <NavLink className="font-semibold mr-3" to={"/about"}>
                {" "}
                About{" "}
              </NavLink>
            </div>
            <div className="flex justify-between">
              <Tooltip title="cart">
                <Link
                  to="/cart"
                  className="rounded-full hover:bg-muted p-4 relative"
                >
                  <LocalMallIcon />
                  {data && (
                    <span className="absolute -right-1 -bottom-2 lg:right-1 lg:bottom-2 w-5 h-5 text-xs font-semibold flex items-center justify-center bg-pink-500 rounded-full text-white">
                      {<span>{data.size}</span>}
                    </span>
                  )}
                </Link>
              </Tooltip>
              {AccountInfo?.username ? (
                <Tooltip title="logout">
                  <div
                    className="rounded-full hover:bg-muted p-4 relative"
                    onClick={logout}
                  >
                    <LogoutIcon />
                  </div>
                </Tooltip>
              ) : (
                <Tooltip title="login">
                  <Link
                    to="/login"
                    className="rounded-full hover:bg-muted p-4 relative"
                  >
                    <LoginIcon />
                  </Link>
                </Tooltip>
              )}
            </div>
          </div>
          {activeNavbar ? (
            <div
              onClick={() => setActiveNavbar((prev) => !prev)}
              className="lg:hidden w-full flex justify-end"
            >
              <CloseIcon />
            </div>
          ) : (
            <div
              onClick={() => setActiveNavbar((prev) => !prev)}
              className="lg:hidden w-full flex justify-end"
            >
              <MenuIcon />
            </div>
          )}
        </div>
        <AnimatePresence>
          {activeNavbar && (
            <m.div
              variants={NavBarVariant}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="text-secondary items-center  border-b-muted flex bg-primary"
            >
              <m.div
                variants={NavBarItemsVariant}
                className="mx-7 w-full justify-between items-center h-full flex"
              >
                <div className="">
                  <Link
                    className="font-semibold mr-3"
                    to={"/"}
                    onClick={handleCloseNavbar}
                  >
                    {" "}
                    Shop{" "}
                  </Link>
                  <NavLink className="font-semibold mr-3" to={"/about"}>
                    {" "}
                    About{" "}
                  </NavLink>
                </div>
                <div className="flex">
                  <Link
                    className="ml-4 relative"
                    to="/cart"
                    onClick={handleCloseNavbar}
                  >
                    <LocalMallIcon />
                    {data && (
                      <span className="absolute -right-1 -bottom-2 lg:right-1 lg:bottom-2 w-5 h-5 text-xs font-semibold flex items-center justify-center bg-pink-500 rounded-full text-white">
                        {<span>{data.size}</span>}
                      </span>
                    )}
                  </Link>
                  {/* <div className="ml-4 relative" onClick={handleFavourites}>
                <FavoriteBorderIcon />
              </div> */}
                  {!AccountInfo?.username ? (
                    <Link
                      className="ml-4 relative"
                      to="/login"
                      onClick={handleCloseNavbar}
                    >
                      {" "}
                      <LoginIcon />{" "}
                    </Link>
                  ) : (
                    <span
                      className="ml-4 "
                      onClick={() => {
                        logout();
                        handleCloseNavbar();
                      }}
                    >
                      <LogoutIcon />
                    </span>
                  )}
                </div>
              </m.div>
            </m.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default Navbar;
