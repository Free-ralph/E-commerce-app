import React, { useEffect, useState } from "react";
import { useStateContext } from "../context/ContextProvider";
import { fetchData } from "../utils/FetchData";
import NumberFormat from "react-number-format";
import { useNavigate } from "react-router-dom";
import { Button, ButtonLink } from "../components/Button";
import { PaystackButton } from "react-paystack";


const Confirmation = () => {
  const { order, authToken } = useStateContext();
  const [payment, setpayment] = useState({});
  const [isPaid, setisPaid] = useState(order.is_paid);
  const publicKey = "pk_test_bc08f65fc442d3b404d89f481d2d03187967e83d";
  const componentProps = {
    email: payment.email,
    amount: payment.amount,
    metadata: {
      name: payment.name,
      phone: "0709333333",
    },
    publicKey,
    text: "Pay Now",
    onSuccess: (ref) => handleSuccess(ref),
    onClose: () => alert("Wait! Don't leave :("),
  };
  const handleSuccess = async (ref) => {
    if (ref.message === "Approved") {
      const { status } = await fetchData(
        `/api/confirm-payment/PS`,
        "GET",
        null,
        { Authorization: "Bearer " + String(authToken.access) }
      );
      if (status === 200) {
        setisPaid(true);
      } else {
        alert("payment rejected");
      }
    } else {
      alert("payment rejected");
    }
  };
  useEffect(() => {
    if (authToken.access) {
      const GetPaymentInstance = async () => {
        const { response, status } = await fetchData(
          "/api/get-payment",
          "GET",
          null,
          {
            Authorization: "Bearer " + String(authToken.access),
          }
        );
        if (status === 200) {
          setpayment(response);
        } else {
          console.log(response);
        }
      };
      GetPaymentInstance();
    }
  });

  return (
    <div className="mt-10 p-3 flex flex-col m-auto w-full md:w-[70%] border text-primary border-gray-200 rounded-xl shadow-sm">
      {order ? (
        <span>
          <p className="font-bold text-center text-3xl">Order Summary</p>
          <div className="flex justify-between text-sm md:text-base w-full border-b-2 border-gray-200 py-5 px-2">
            <div className="font-bold">Name</div>
            <div className="text-sm md:text-base">{order.name}</div>
          </div>
          <div className="flex justify-between text-sm md:text-base w-full border-b-2 border-gray-200 py-5 px-2">
            <div className="font-bold">Email</div>
            <div className="text-sm md:text-base">{payment.email}</div>
          </div>
          <div className="flex justify-between text-sm md:text-base w-full border-b-2 border-gray-200 py-5 px-2">
            <div className="font-bold">Shipping Address</div>
            <div className="text-sm md:text-base">
              {order.shipping_address.address}
            </div>
          </div>
          <div className="flex justify-between text-sm md:text-base w-full border-b-2 border-gray-200 py-5 px-2">
            <div className="font-bold">Shipping Fee</div>
            <div className="text-sm md:text-base">
              &#8358;{" "}
              <NumberFormat
                value={1500}
                displayType="text"
                thousandSeparator={true}
                decimalScale={0}
              />
            </div>
          </div>
          <div className="flex justify-between text-sm md:text-base w-full border-b-2 border-gray-200 py-5 px-2">
            <div className="font-bold">Payment Method</div>
            <div className="text-sm md:text-base">PayStack</div>
          </div>
          <div className="flex justify-between text-sm md:text-base w-full border-b-2 border-gray-200 py-5 px-2">
            <div className="font-bold">Total Amount</div>
            <div className="text-sm md:text-base">
              &#8358;{" "}
              <NumberFormat
                value={order.get_total_price}
                displayType="text"
                thousandSeparator={true}
                decimalScale={0}
              />
            </div>
          </div>
          {isPaid ? (
            <div className="flex flex-col mt-4">
              <p className="text-green-500 text-center">Payment successful</p>
              <ButtonLink
                to="/"
                color="bg-green-500"
                text="continue shopping"
                textColor="text-secondary"
                extra="hover:bg-secondary hover:text-primary hover:border-primary hover:border-1 text-sm md:text-base w-[60%] mt-3 md:w-[30%] m-auto"
              />
            </div>
          ) : (
            <Button
              color="bg-pink-500"
              text={
                <PaystackButton className="w-full h-full" {...componentProps} />
              }
              textColor="text-secondary"
              extra="hover:bg-secondary hover:text-primary hover:border-primary hover:border-1 text-sm md:text-base w-[60%] mt-3 md:w-[30%] m-auto"
            />
          )}
        </span>
      ) : (
        <div className="">
          <div className="font-bold text-center text-xl">
            no summary to display
          </div>
          <ButtonLink
            to="/"
            color="bg-green-500"
            text="continue shopping"
            textColor="text-secondary"
            extra="hover:bg-secondary hover:text-primary hover:border-primary hover:border-1 text-sm md:text-base w-[60%] mt-3 md:w-[30%] m-auto"
          />
        </div>
      )}
    </div>
  );
};

export default Confirmation;
