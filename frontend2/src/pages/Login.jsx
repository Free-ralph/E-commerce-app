import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useStateContext } from "../context/ContextProvider";

const Login = () => {
  const { loginUser, loginError } = useStateContext();
  const [username, setusername] = useState("");
  const [password, setpassword] = useState("");
  // const navigate = useNavigate()
  return (
    <div className="h-screen w-screen bg-secondary">
      <div className="flex flex-col items-center justify-center h-full w-full">
        <h2 className="text-5xl font-bold mb-5 tracking-tighter text-primary">
          Welcome Back
        </h2>
        {loginError.detail && <p className="text-red-400 text-sm font-semibold mb-2 text-center">{loginError.detail}</p>}
        <form
          className="flex flex-col justify-around w-4/5 md:w-2/5"
          onSubmit={(e) => loginUser(e, username, password)}
        >
          <input
            type="text"
            className={`rounded-xl border-1 p-4 bg-secondary border-muted focus:border-pink-300 focus:shadow-pink-300 focus:ring-pink-300 ${
              loginError.username ? "border-red-500" : "border-primary "
            }`}
            placeholder="Username"
            value={username}
            onChange={(e) => {
              setusername(e.target.value);
            }}
          />
          {loginError.username &&
            loginError.username.map((error, i) => (
              <p key = {i} className="text-red-400 text-sm font-semibold mt-1 text-center">
                {error}
              </p>
            ))}

          <input
            type="password"
            className={`rounded-xl border-1 p-4 mt-5 bg-secondary border-muted focus:border-pink-300 focus:shadow-pink-300 focus:ring-pink-300 ${
              loginError.password ? "border-red-500" : "border-primary "
            }`}
            placeholder="password"
            value={password}
            onChange={(e) => {
              setpassword(e.target.value);
            }}
          />
          {loginError.password &&
            loginError.password.map((error, i) => (
              <p key = {i} className="text-red-400 text-sm font-semibold mt-1 text-center">
                {error}
              </p>
            ))}
          <h2 className="font-bold my-3 text-center">
            <Link to="/register" className="text-blue-500">
              {" "}
              Join us!{" "}
            </Link>
            if you haven't already
          </h2>
          <input
            type="submit"
            className="bg-pink-500 rounded-xl font-bold m-auto border-2 px-5 py-2 hover:border-primary hover:bg-secondary hover:border-1 hover:text-primary text-center ${textColor} font-semibold py-2 flex items-center justify-center ${extra} cursor-pointer transition-all delay-75 text-secondary"
            value="Log in"
          />
        </form>
      </div>
    </div>
  );
};

export default Login;
