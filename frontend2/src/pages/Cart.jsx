import React, { useState, useEffect } from "react";
import EnhancedTable from "../components/Table";
import { ButtonLink } from "../components/Button";
import NumberFormat from "react-number-format";
import Input from "../components/Input";
import { fetchData } from "../utils/FetchData";
import { useStateContext } from "../context/ContextProvider";

const Cart = () => {
  const [coupon, setcoupon] = useState("");
  const [couponError, setcouponError] = useState('');
  const { authToken, cartItems, order, GetCartItems } = useStateContext();
  const handleCoupon = async (e) => {
    const { response, status } = await fetchData(
      "/api/apply-coupon",
      "POST",
      { coupon_code: coupon },
      { Authorization: "Bearer " + String(authToken.access) }
    );
    if (status === 200) {
      console.log(response);
    } else {
      console.log(response);
      setcouponError(response);
    }
  };

  useEffect(() => {
    GetCartItems()
  })
  return (
    <>
      {cartItems ? (
        <>
          
          <EnhancedTable authToken={authToken} />
          <div className="flex flex-col md:flex-row w-full justify-between mt-5 text-primary">
            <div className=" md:w-[48%]">
              <form className="">
                <p className="font-bold bg-gray-200 p-5 tracking-tighter">
                  Coupon Code
                </p>
                <p className=" text-gray-400 text-sm font-semibold mt-3">
                  if you have a Coupon, please enter it in the box below
                </p>
                <div className="flex flex-col items-center mt-4">
                  <div className="w-full flex">
                    <Input
                      type="text "
                      styles="w-3/4 border-1"
                      onChange={(e) => setcoupon(e.target.value)}
                      placeholder="Enter Coupon"
                      value={coupon}
                      errors={couponError && []}
                    />
                    <button
                      onClick={handleCoupon}
                      className="text-sm md:text-base bg-pink-500 rounded-xl m-auto border-2 px-5 hover:border-primary hover:bg-secondary hover:border-1 hover:text-primary text-center font-semibold py-2 flex items-center justify-center cursor-pointer transition-all delay-75 text-secondary"
                      type="button"
                    >
                      Apply Coupon
                    </button>
                  </div>
                  {couponError && (
                    <p className="text-red-400 text-sm font-semibold mt-1 text-center">
                      {couponError.message && couponError.message}
                      {couponError.coupon_code && couponError.coupon_code}
                    </p>
                  )}
                </div>
              </form>
            </div>
            <div className=" mt-6 md:mt-0 md:w-[48%]">
              <p className="font-bold bg-gray-200 p-5 tracking-tighter">
                Order Summary
              </p>
              <p className="text-gray-400 text-sm font-semibold mt-3">
                Shipping and additional costs are calculated based on values you
                have entered.
              </p>
              <div className="flex justify-between">
                <p className="text-primary font-bold">Order Subtotal</p>
                <p className="text-primary font-semibold">
                  &#8358;{" "}
                  <NumberFormat
                    value={order.get_summed_price}
                    displayType="text"
                    thousandSeparator={true}
                    decimalScale={0}
                  />
                </p>
              </div>
              <div className="flex justify-between mt-3">
                <p className="text-primary font-bold">Shipping fee</p>
                <p className="text-primary font-semibold">
                  + &#8358;{" "}
                  <NumberFormat
                    value={1500}
                    displayType="text"
                    thousandSeparator={true}
                    decimalScale={0}
                  />
                </p>
              </div>
              <div className="flex justify-between mt-3">
                <p className="text-primary font-bold">Total</p>
                <p className="text-primary font-semibold">
                  &#8358;{" "}
                  <NumberFormat
                    value={order.get_total_price}
                    displayType="text"
                    thousandSeparator={true}
                    decimalScale={0}
                  />
                </p>
              </div>
              <div className="flex justify-between mt-3">
                <ButtonLink
                  to="/shipping"
                  color="bg-pink-500"
                  text="Proceed To Checkout"
                  textColor="text-secondary"
                  extra="border-primary border-1 hover:bg-secondary text-sm md:text-base hover:text-primary hover:border-primary hover:border-1 w-[48%]"
                />
                <ButtonLink
                  to="/"
                  color="bg-pink-500"
                  text="Continue Shopping"
                  textColor="text-secondary"
                  extra="border-primary border-1 hover:bg-secondary text-sm md:text-base hover:text-primary hover:border-primary hover:border-1 w-[48%]"
                />
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="">
          <p className="mt-36 font-bold text-primary text-2xl  text-center ">
            Your cart is empty
          </p>
          <ButtonLink
            to="/"
            text="Continue Shopping"
            color="bg-pink-500"
            textColor="text-secondary"
            extra="w-[12rem] m-auto mt-4 border-1 border-primary hover:text-primary hover:bg-secondary"
          />
        </div>
      )}
    </>
  );
};

export default Cart;
