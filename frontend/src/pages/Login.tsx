import { FormEvent, useState } from "react";
import Button from "../components/Button";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import { useStateContext } from "../context/StateContextProvider";
import { useAuthStateContext } from "../context/AuthContextProvider";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation, useQuery } from "react-query";
import Spinner from "../components/Spinner";
import RefreshIcon from "@mui/icons-material/Refresh";

type loginInputErrors = {
  username: string[];
  password: string[];
};

type RandomUserType = {
  username: string;
  password: string;
  name: string;
  id : number;
};
const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<loginInputErrors | null>(
    null
  );
  const { handleSnackMessage } = useStateContext();
  const navigate = useNavigate();
  const { setAuth} = useAuthStateContext();

  const {
    data: randomUser,
    refetch: refetchRandomUser,
    isFetching: randomUserIsFetching,
  } = useQuery({
    queryFn: () =>
      axios.get<RandomUserType>("/random_account/").then((res) => res.data),
  });

  const { mutate: login, isLoading } = useMutation({
    mutationFn: () =>
      axios
        .post("/token", {
          username,
          password,
        })
        .then((res) => res.data),
    onSuccess: (res) => {
      setAuth(res);
      navigate("/");
    },
    onError: (err: any) => {
      if (err.response.data.detail) {
        handleSnackMessage(err.response.data.detail, "error");
      } else {
        handleSnackMessage("login operation failed", "error");
      }
      setErrorMessage(err.response.data);
    },
  });

  const { mutate: loginRandomUser, isLoading: loginRandomIsLoading } =
    useMutation({
      mutationFn: ({ username, password, name, id }: RandomUserType) =>
        axios
          .post("/random-login", {
            username,
            password,
            name,
            id
          })
          .then((res) => res.data),
      onSuccess: (res) => {
        setAuth(res);
        navigate("/");
      },
      onError: (err: any) => {
        if (err.response.data.detail) {
          handleSnackMessage(err.response.data.detail, "error");
        } else {
          handleSnackMessage("login operation failed", "error");
        }
        setErrorMessage(err.response.data);
      },
    });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    login();
  };

  const LoginRandomUser = () => {
    if (randomUser) {
      if (randomUser) {
        setUsername(randomUser.username);
        setPassword(randomUser.password);
      }
      loginRandomUser({
        username: randomUser.username,
        password: randomUser.password,
        name: randomUser.name,
        id : randomUser.id
      });
    }
  };

  return (
    <div>
      <AnimatePresence>
        <motion.form
          initial={{
            opacity: 0,
            scale: 0.9,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          exit={{
            opacity: 0,
            scale: 0.5,
          }}
          className=" w-full lg:w-[70%] m-auto mt-[8rem] md:mt-[10rem] flex flex-col items-center"
          onSubmit={handleSubmit}
        >
          <div className="text-center font-bold text-3xl text-primary mt-5">
            Sign In
          </div>
          <div className="flex flex-col w-[95%] lg:w-[65%]">
            <input
              placeholder="Username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={`${
                errorMessage?.username ? "border-red-500" : "border-primary"
              }  rounded-xl border-1 p-4 my-5 bg-secondary focus:border-pink-300 focus:shadow-pink-300 focus:ring-pink-300  `}
            />
            {errorMessage?.username && (
              <div className="w-full p-2 pl-2">
                {errorMessage?.username?.map((message, i) => (
                  <p key={i} className="text-red-500">
                    {message}
                  </p>
                ))}
              </div>
            )}
          </div>
          <div className="flex flex-col w-[95%] lg:w-[65%]">
            <input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`${
                errorMessage?.password ? "border-red-500" : "border-primary"
              } rounded-xl border-1 p-4 bg-secondary focus:border-pink-300 focus:shadow-pink-300 focus:ring-pink-300 `}
            />
            {errorMessage?.password && (
              <div className="w-full p-2 pl-2">
                {errorMessage?.password.map((message, i) => (
                  <p key={i} className="text-red-500">
                    {message}
                  </p>
                ))}
              </div>
            )}

            <div className="w-full  mt-2 flex">
              Sign in as
              <span
                className="text-pink-700 cursor-pointer mx-2"
                onClick={LoginRandomUser}
              >
                {randomUserIsFetching ? (
                  <span className="mr-4">
                    <Spinner size={25} />
                  </span>
                ) : (
                  randomUser && randomUser.name
                )}{" "}
              </span>
              <span
                className="text-pink-500"
                onClick={() => refetchRandomUser()}
              >
                <RefreshIcon />
              </span>
            </div>

            <p className="mr-auto">
              or create an account,{" "}
              <Link className="text-pink-700 font-bold" to="/register">
                Join us
              </Link>
            </p>
          </div>
          <Button
            text={isLoading || loginRandomIsLoading ? "" : "Submit"}
            style="w-[6rem] h-[3rem] mt-3"
            icon={(isLoading || loginRandomIsLoading) && <Spinner size = {30} color="#fff" />}
            disabled={isLoading || loginRandomIsLoading}
          />
        </motion.form>
      </AnimatePresence>
    </div>
  );
};

export default Login;
