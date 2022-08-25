import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useStateContext } from "../context/ContextProvider";

const Register = () => {
  const [username, setusername] = useState("");
  const [password, setpassword] = useState("");
  const [password2, setpassword2] = useState("");
  const [email, setemail] = useState("");
  const { registerUser, registerError, setRegisterError } = useStateContext()
  const handleSubmit = (e, username, password, password2, email) => {
    e.preventDefault()
    if (password !== password2){
        setRegisterError({password2 : "passwords don't match"})
    }else{
        registerUser(username, password, password2, email)
    }
  };
  console.log(email)
  return (
    <div className="h-screen w-screen bg-secondary">
      <div className="flex flex-col items-center justify-center h-full w-full">
        <h2 className="text-5xl font-bold mb-5 tracking-tighter text-primary">
          Join Us
        </h2>
        <form className="flex flex-col justify-around w-4/5 md:w-2/5" onSubmit={(e) => handleSubmit(e, username, password, password2, email)}>
          <input
            type="text"
            className={`rounded-xl border-1 p-4 bg-secondary border-muted focus:border-pink-300 focus:shadow-pink-300 focus:ring-pink-300 ${
                registerError.username ? "border-red-500" : "border-primary "
            }`}
            placeholder="Username"
            value={username}
            onChange={(e) => {
              setusername(e.target.value);
            }}
          />
          {registerError.username && (
            <p className="text-red-500 text-sm mt-1 mb-1    text-center">
              {registerError.username}
            </p>
          )}
          <input
            type="email"
            className={`mt-5 rounded-xl border-1 p-4 bg-secondary border-muted focus:border-pink-300 focus:shadow-pink-300 focus:ring-pink-300 ${
                registerError.email ? "border-red-500" : "border-primary "
            }`}
            placeholder="Email"
            value={email}
            onChange={(e) => {
              setemail(e.target.value);
            }}
          />
          {registerError.email && (
            <p className="text-red-500 text-sm mt-1 mb-1    text-center">
              {registerError.email}
            </p>
          )}

          <input
            type="password"
            className={`rounded-xl border-1 p-4 mt-5 bg-secondary border-muted focus:border-pink-300 focus:shadow-pink-300 focus:ring-pink-300 ${
                registerError.password ? "border-red-500" : "border-primary "
            }`}
            placeholder="password"
            value={password}
            onChange={(e) => {
              setpassword(e.target.value);
            }}
          />
          {registerError.password && (
            <p className="text-red-500 text-sm mt-1 mb-1    text-center">
              {registerError.password}
            </p>
          )}
          <input
            type="password"
            className={`rounded-xl border-1 p-4 mt-5 bg-secondary border-muted focus:border-pink-300 focus:shadow-pink-300 focus:ring-pink-300 ${
                registerError.password2 ? "border-red-500" : "border-primary "
            }`}

            placeholder="Retype Password"
            value={password2}
            onChange={(e) => {
              setpassword2(e.target.value);
            }}
          />
          {registerError.password2 && (
            <p className="text-red-500 text-sm mt-1 mb-1    text-center">
              {registerError.password2}
            </p>
          )}
          <h2 className="font-bold my-3 text-center">
            <Link to="/register" className="text-blue-500">
              {" "}
              Log in!{" "}
            </Link>
            if you've joined us already
          </h2>
          <input
            type="submit"
            className="bg-pink-500 rounded-xl font-bold m-auto border-2 px-5 py-2 hover:border-primary hover:bg-secondary hover:border-1 hover:text-primary text-center ${textColor} font-semibold py-2 flex items-center justify-center ${extra} cursor-pointer transition-all delay-75 text-secondary"
            value="Register"
          />
        </form>
      </div>
    </div>
  );
};

export default Register;
