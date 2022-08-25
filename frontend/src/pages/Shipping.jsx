import React, { useState } from "react";
import Input from "../components/Input";
import { fetchData } from "../utils/FetchData";
import { useNavigate } from 'react-router-dom'
import { useStateContext } from "../context/ContextProvider";


const Shipping = () => {
  const [firstName, setfirstName] = useState("");
  const [shippingAddress, setshippingAddress] = useState("");
  const [email, setemail] = useState("");
  const [paymentMethod, setpaymentMethod] = useState("");
  const [lastName, setlastName] = useState('')
  const navigate = useNavigate()
  const { authToken } = useStateContext()
  const [shippingError, setshippingError] = useState({})


  const handleSubmit = async (e) => {
    e.preventDefault()
    if(authToken.access){
      const { response, status } = await fetchData(
        '/api/shipping',
        'POST',
        {
          'first_name' : firstName,
          'last_name' : lastName,
          email,
          'payment_method' : paymentMethod.value ,
          'address' : shippingAddress
        },
        { Authorization: "Bearer " + String(authToken.access) }
      )

      if (status === 200){
        navigate('/confirm-order')
      }else{
        console.log(response)
        setshippingError(response)
      }
    }
    
  };
  return (
    <div className="mt-10 md:mt-20 bg-secondary">
      <div className="flex flex-col items-center justify-center h-full w-full ">
        <h2 className="text-3xl md:text-5xl font-bold mb-5 tracking-tighter text-primary">
          Shipping Address
        </h2>
        <form
          className="flex flex-col justify-around w-full md:w-[60%]"
          onSubmit={(e) => handleSubmit(e)}
        >
          <div className="flex justify-between">
            <Input
              type="text "
              styles="w-[48%]"
              onChange={(e) => setfirstName(e.target.value)}
              placeholder="First Name"
              value={firstName}
              errors = {shippingError.first_name}
            />

            <Input
              type="text "
              styles="w-[48%]"
              onChange={(e) => setlastName(e.target.value)}
              placeholder="Last Name"
              value={lastName}
              errors = {shippingError.last_name}
            />
          </div>
          <Input
            type="text "
            styles="w-full mt-3"
            onChange={(e) => setemail(e.target.value)}
            placeholder="Email"
            value={email}
            errors = {shippingError.email}
          />
          <Input
            type="text "
            styles="w-full mt-3"
            onChange={(e) => setshippingAddress(e.target.value)}
            placeholder="Address"
            value={shippingAddress} 
            errors = {shippingError.address}
          />
          <select
            onChange={(e) => setpaymentMethod({ value: e.target.value })}
            className="rounded-xl border-1 p-4 mt-3 justify-center flex items-center focus:border-pink-300 focus:ring-pink-500"
          >
            <option value = ''>choose payment method</option>
            <option value = 'PS'>Pay safe with Paystack</option>
            <option value = 'CD'>Cash on delivery</option>
          </select>
          <input
            type="submit"
            className="mt-3 bg-pink-500 rounded-xl font-bold m-auto border-2 px-5 py-2 hover:border-primary hover:bg-secondary hover:border-1 hover:text-primary text-center ${textColor} font-semibold py-2 flex items-center justify-center ${extra} cursor-pointer transition-all delay-75 text-secondary"
            value="Submit"
          />
        </form>
      </div>
    </div>
  );
};

export default Shipping;
