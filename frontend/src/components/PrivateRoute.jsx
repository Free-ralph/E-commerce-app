import React, { Children } from "react";
import {Navigate} from "react-router-dom";
import { useStateContext } from "../context/ContextProvider";

const PrivateRoute = ({children}) => {
  const { user } = useStateContext();
  return (
    <>
    { !user.username ? <Navigate to="/login" /> : children}
    </>
  );
};

export default PrivateRoute;
