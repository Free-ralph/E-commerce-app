import React from "react";
import { Link, NavLink } from "react-router-dom";
import LocalMallIcon from "@mui/icons-material/LocalMallOutlined";
// import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
// import FavoriteIcon from '@mui/icons-material/Favorite';
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import { Tooltip } from "@mui/material";
import { useState } from "react";
import { useStateContext } from "../context/ContextProvider";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import { Button } from "./Button";
// import { fetchData } from "../utils/FetchData";

const Navbar = () => {
  const [activeNavbar, setActiveNavbar] = useState(false);
  const { user, logOutUser, order} =
    useStateContext();
  const [open, setOpen] = useState(false);
  // const [activeFav, setactiveFav] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  // const handleFavourites = async () => {
  //   if (!activeFav) {
      
  //     setmessage({
  //       message: `Here are your favourite Products`,
  //       severity: "success",
  //     });
  //     setSnackbar(true);
  //     setfavChanged('')
  //     setproducts(favourites);
  //     setactiveFav(true);
  //     navigate('/')
  //   } else {
  //     const { response, status } = await fetchData(
  //       "/api/products",
  //       "GET"
  //     );
  //     if (status === 200) {
  //       setproducts(response);
  //       setactiveFav(false)
  //     } else {
  //       console.log("something went wrong");
  //     }
  //   }
  // };

  const midLinks = [
    { name: "Shop", link: "/" },
    { name: "About", link: "/about" },
  ];
  const activeStyle =
    "mr-5 border-b-4 text-center border-pink-500 h-full items-center flex font-semibold text-primary";
  const inActiveStyle =
    "mr-5 text-center h-full items-center flex text-gray-400";
  return (
    <>
      <div className="w-full min-h-navbar border-b-2 border-muted text-primary">
        <div className="mx-7 flex items-center h-16">
          <Link to="/" className="font-bold w-1/4 text-pink-700">
            {user.username ? user.username : "TopShop"}
          </Link>
          <div className="md:flex justify-between w-full h-full items-center hidden">
            <div className="flex w-1/4 h-full items-center">
              {midLinks.map((links) => (
                <NavLink
                  to={links.link}
                  key={links.name}
                  className={({ isActive }) =>
                    isActive ? activeStyle : inActiveStyle
                  }
                >
                  <span className="hover:bg-muted  transition-all delay-75 px-4 py-2">
                    {links.name}
                  </span>
                </NavLink>
              ))}
            </div>
            <div className="flex justify-between">
              <Tooltip title="cart">
                <Link
                  to="/cart"
                  className="rounded-full hover:bg-muted p-4 relative"
                >
                  <LocalMallIcon />
                  {order && <span className="absolute -right-1 -bottom-2 md:right-1 md:bottom-2 w-5 h-5 text-xs font-semibold flex items-center justify-center bg-pink-500 rounded-full text-white">
                    {<span>{order.order_product.length}</span>}
                  </span>}
                </Link>
              </Tooltip>
              {/* <Tooltip title="wishList">
                <div
                  className="rounded-full hover:bg-muted p-4 relative"
                  onClick={handleFavourites}
                >
                  {activeFav ? <span className="text-pink-500"><FavoriteIcon /></span> : <FavoriteBorderIcon />}
                </div>
              </Tooltip> */}
              {user.username ? (
                <Tooltip title="logout">
                  <div
                    className="rounded-full hover:bg-muted p-4 relative"
                    onClick={handleOpen}
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
          <div
            onClick={() => setActiveNavbar((prev) => !prev)}
            className="md:hidden w-full flex justify-end"
          >
            <MenuIcon />
          </div>
        </div>
        <div
          className={`transition-all delay-75 text-secondary items-center  border-b-muted flex bg-primary ${
            activeNavbar ? "h-14" : "h-0"
          }`}
        >
          <div
            className={`mx-7 w-full justify-between items-center h-full flex ${
              activeNavbar ? "flex" : "hidden"
            }`}
          >
            <div className="">
              {midLinks.map((link) => (
                <Link
                  className="font-semibold mr-3"
                  to={link.link}
                  key={link.name}
                >
                  {" "}
                  {link.name}{" "}
                </Link>
              ))}
            </div>
            <div className="flex">
              <Link className="ml-4 relative" to="/cart">
                <LocalMallIcon />
                <span className="absolute -right-1 -bottom-2 md:right-1 md:bottom-2 w-5 h-5 text-xs font-semibold flex items-center justify-center bg-pink-500 rounded-full text-white">
                  <span>1</span>
                </span>
              </Link>
              {/* <div className="ml-4 relative" onClick={handleFavourites}>
                <FavoriteBorderIcon />
              </div> */}
              {!user.username ? (
                <Link className="ml-4 relative" to="/login">
                  {" "}
                  <LoginIcon />{" "}
                </Link>
              ) : (
                <span className="ml-4 " onClick={handleOpen}>
                  <LogoutIcon />
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <Box
            className="bg-secondary rounded-xl"
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              border: "2px solid #000",
              boxShadow: 24,
              p: 4,
            }}
          >
            <div>
              <p className="text-2xl font-bold text-center">Confirm Logout</p>

              <div className="flex mt-5 justify-around items-align">
                <Button
                  onClick={() => {
                    logOutUser();
                    handleClose();
                  }}
                  text="confirm"
                  color="bg-pink-500"
                  textColor="text-secondary"
                  extra="border-1 border-primary hover:bg-secondary hover:text-primary px-5 py-2"
                />
                <Button
                  onClick={handleClose}
                  text="Take me back"
                  color="bg-secondary"
                  textColor="text-primary"
                  extra="border-1 border-primary hover:bg-primary hover:text-secondary px-5 py-2"
                />
              </div>
            </div>
          </Box>
        </Fade>
      </Modal>
    </>
  );
};

export default Navbar;
