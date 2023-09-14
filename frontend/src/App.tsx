import "./App.css";
import { Snackbar, Alert } from "@mui/material";
import { useStateContext } from "./context/StateContextProvider";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MainLayout from "./pages/MainLayout";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Shipping from "./pages/Shipping";
import Confirmation from "./pages/Confirmation";
import About from "./pages/About";

function App() {
  const { snackMessage, isSnackOpen, handleCloseSnack } = useStateContext();
  return (
    <div className=" bg-secondary w-screen h-screen overflow-hidden font-display">
      <Snackbar
        open={isSnackOpen}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        autoHideDuration={6000}
        onClose={handleCloseSnack}
      >
        <Alert
          onClose={handleCloseSnack}
          severity={snackMessage.severity}
          sx={{ width: "100%" }}
        >
          {snackMessage.message}
        </Alert>
      </Snackbar>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/shipping" element={<Shipping />} />
          <Route path="/confirm-order" element={<Confirmation />} />
          <Route path="/about" element={<About />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>

      {/* <Route path = '/cart'  element = {<PrivateRoute><Cart /></PrivateRoute>}/>
            <Route path = '/shipping'  element = {<PrivateRoute><Shipping /></PrivateRoute>}/>
            <Route path = '/confirm-order'  element = {<PrivateRoute><Confirmation /></PrivateRoute>}/> */}
      {/* <Route path = '/about'  element = {<About />}/> */}
    </div>
  );
}

export default App;
