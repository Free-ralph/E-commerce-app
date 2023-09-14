import { useState } from "react";
import { useStateContext } from "../context/StateContextProvider";
import { NumericFormat } from "react-number-format";
import { ButtonLink } from "../components/Button";
import { PaystackButton } from "react-paystack";
import { useMutation, useQuery, useQueryClient } from "react-query";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { CartType } from "../types/api";
import Spinner from "../components/Spinner";

type PaymentType = {
  email: string;
  amount: number;
  name: string;
};
const Confirmation = () => {
  const queryClient = useQueryClient()
  const axiosPrivate = useAxiosPrivate();
  const { handleSnackMessage } = useStateContext();
  const [isPaid, setisPaid] = useState(false);
  const publicKey = "pk_test_bc08f65fc442d3b404d89f481d2d03187967e83d";

  const { data: order } = useQuery({
    queryKey: ["shopingCart"],
    queryFn: () =>
      axiosPrivate.get<CartType>("/get-cart-items").then((res) => res.data),
    onError: () => {
      handleSnackMessage("Your cart it is empty, select an item ", "warning");
    },
    onSuccess: (res) => {
      setisPaid(res.is_paid);
    },
  });

  const { data: payment } = useQuery({
    queryFn: () =>
      axiosPrivate.get<PaymentType>("/get-payment").then((res) => res.data),
  });
  const { mutate: confirmPayment, isLoading: isConfirmingPayment } =
    useMutation({
      mutationFn: () => axiosPrivate.get("/confirm-payment/PS"),
      onSuccess: () => {
        setisPaid(true);
        queryClient.invalidateQueries("cartSize")
      },
      onError: () => {
        handleSnackMessage("payment rejected", "error");
      },
    });
  const handleSuccess = (ref: any) => {
    if (ref.message === "Approved") {
      confirmPayment();
    } else {
      handleSnackMessage("payment rejected", "error");
    }
  };

  return (
    <div className="mt-10 p-3 flex flex-col m-auto w-full md:w-[70%] border text-primary border-gray-200 rounded-xl shadow-sm">
      {order && payment ? (
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
              {order.shipping_address?.address}
            </div>
          </div>
          <div className="flex justify-between text-sm md:text-base w-full border-b-2 border-gray-200 py-5 px-2">
            <div className="font-bold">Shipping Fee</div>
            <div className="text-sm md:text-base">
              &#8358;{" "}
              <NumericFormat
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
              <NumericFormat
                value={order.get_total_price}
                displayType="text"
                thousandSeparator={true}
                decimalScale={0}
              />
            </div>
          </div>
          {isConfirmingPayment ? (
            <div className="w-full justify-center flex">
              <Spinner />
            </div>
          ) : isPaid ? (
            <div className="flex flex-col mt-4">
              <p className="text-green-500 text-center">Payment successful</p>
              <ButtonLink
                to="/"
                text="continue shopping"
                style="hover:bg-secondary text-secondary bg-green-500 hover:text-primary hover:border-primary hover:border-1 text-sm md:text-base w-[60%] mt-3 md:w-[30%] m-auto"
              />
            </div>
          ) : (
            <div className="flex w-full justify-center">
              <PaystackButton
                className="w-[6rem] bg-pink-500 text-secondary rounded py-2 text-center"
                email={payment.email}
                amount={payment.amount}
                metadata={{ name: payment.name, phone: "0709333333" }}
                publicKey={publicKey}
                text="Pay Now"
                onSuccess={(ref) => handleSuccess(ref)}
                onClose={() => alert("Wait! Don't leave :(")}
              />
            </div>
          )}
        </span>
      ) : (
        <div className="">
          <div className="font-bold text-center text-xl">
            no summary to display
          </div>
          <ButtonLink
            to="/"
            text="continue shopping"
            style="hover:bg-secondary bg-green-500 text-secondary  hover:text-primary hover:border-primary hover:border-1 text-sm md:text-base w-[60%] mt-3 md:w-[30%] m-auto"
          />
        </div>
      )}
    </div>
  );
};

export default Confirmation;
