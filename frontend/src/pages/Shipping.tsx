import { FormEvent, useState } from "react";
import Input from "../components/Input";
import { useNavigate } from "react-router-dom";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useMutation } from "react-query";
import { useStateContext } from "../context/StateContextProvider";
import Spinner from "../components/Spinner";

type shippingError = {
  first_name?: string[];
  last_name?: string[];
  email?: string[];
  payment_method?: string[];
  address?: string[];
};
const Shipping = () => {
  const { handleSnackMessage } = useStateContext();
  const axiosPrivate = useAxiosPrivate();
  const [firstName, setfirstName] = useState("");
  const [shippingAddress, setshippingAddress] = useState("");
  const [email, setemail] = useState("");
  const [paymentMethod, setpaymentMethod] = useState("");
  const [lastName, setlastName] = useState("");
  const navigate = useNavigate();
  const [shippingError, setshippingError] = useState<shippingError>({
    first_name: [],
    last_name: [],
    email: [],
    payment_method: [],
    address: [],
  });

  const { mutate: addShipping, isLoading } = useMutation({
    mutationFn: () =>
      axiosPrivate.post("/shipping", {
        first_name: firstName,
        last_name: lastName,
        email,
        payment_method: paymentMethod,
        address: shippingAddress,
      }),
    onSuccess: () => {
      navigate("/confirm-order");
    },
    onError: (err: any) => {
      handleSnackMessage("form invalid", "error");
      console.log(err);
      setshippingError(err.response.data as shippingError);
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (paymentMethod) {
      addShipping();
    } else {
      setshippingError({
        payment_method: ["This field is required"],
      });
    }
  };
  return (
    <div className="mt-10 md:mt-20 bg-secondary">
      <div className="flex flex-col items-center justify-center h-full w-full">
        <h2 className="text-3xl md:text-5xl font-bold mb-5 tracking-tighter text-primary">
          Shipping Address
        </h2>
        <form
          className="flex flex-col justify-around w-full md:w-[60%] px-5"
          onSubmit={(e) => handleSubmit(e)}
        >
          <div className="flex justify-between">
            <Input
              type="text "
              styles="w-[48%]"
              onChange={(e) => setfirstName(e.target.value)}
              placeholder="First Name"
              value={firstName}
              required={true}
              errors={shippingError.first_name ? shippingError.first_name : []}
            />

            <Input
              type="text "
              styles="w-[48%]"
              onChange={(e) => setlastName(e.target.value)}
              placeholder="Last Name"
              value={lastName}
              errors={shippingError.last_name ? shippingError.last_name : []}
            />
          </div>
          <Input
            type="text "
            styles="w-full mt-3"
            onChange={(e) => setemail(e.target.value)}
            placeholder="Email"
            value={email}
            required={true}
            errors={shippingError.email ? shippingError.email : []}
          />
          <Input
            type="text "
            styles="w-full mt-3"
            onChange={(e) => setshippingAddress(e.target.value)}
            placeholder="Address"
            value={shippingAddress}
            required={true}
            errors={shippingError.address ? shippingError.address : []}
          />
          <select
            onChange={(e) => setpaymentMethod(e.target.value)}
            className={`${
              shippingError?.payment_method &&
              shippingError.payment_method.length > 0
                ? "border-red-500"
                : "border-primary"
            } rounded-xl border-1 p-4 mt-3 justify-center flex items-center focus:border-pink-300 focus:ring-pink-500`}
          >
            <option value="">choose payment method</option>
            <option value="PS">Pay safe with Paystack</option>
          </select>
          {shippingError?.payment_method &&
            shippingError?.payment_method.map((error, i) => (
              <p
                key={i}
                className="text-red-400 text-sm font-semibold mt-1 text-center"
              >
                {error}
              </p>
            ))}
          <button
            type="submit"
            disabled={isLoading}
            className="mt-3 bg-pink-500 rounded-xl m-auto border-2 w-[6rem] h-[3.5rem] hover:border-primary hover:bg-secondary hover:border-1 hover:text-primary text-center font-semibold flex items-center justify-center cursor-pointer transition-all delay-75 text-secondary"
          >
            {isLoading ? <Spinner color="#fff" /> : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Shipping;
