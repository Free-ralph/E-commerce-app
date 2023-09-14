import { useState } from "react";
import EnhancedTable from "../components/Table";
import { ButtonLink } from "../components/Button";
import { NumericFormat } from "react-number-format";
import Input from "../components/Input";
import { useStateContext } from "../context/StateContextProvider";
import { CartType, CoupnType } from "../types/api";
import { useMutation, useQuery, useQueryClient } from "react-query";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { motion as m, AnimatePresence } from "framer-motion";
import { FadeVariant } from "../utils/Variants";
import Spinner from "../components/Spinner";

const Cart = () => {
  const queryClient = useQueryClient()
  const [coupon, setcoupon] = useState("");
  const [couponError, setcouponError] = useState<any>();
  const { handleSnackMessage } = useStateContext();
  const axiosPrivate = useAxiosPrivate();

  const shoppingQuery = useQuery({
    queryKey: ["shopingCart"],
    queryFn: () =>
      axiosPrivate.get<CartType>("/get-cart-items").then((res) => res.data),
    onError: () => {
      handleSnackMessage("Your cart it is empty, select an item ", "warning");
    },
  });

  const couponQuery = useQuery({
    queryKey: ["coupon"],
    queryFn: () =>
      axiosPrivate.get<CoupnType>("/get-dummy-coupon").then((res) => res.data),
  });

  const { mutate: applyCoupon, isLoading: isApplyingCoupon } = useMutation({
    mutationFn: (coupon: string) =>
      axiosPrivate.post("/apply-coupon", { coupon_code: coupon }),
    onSuccess: () => {
      queryClient.invalidateQueries("shopingCart")
      handleSnackMessage("coupon applied", "success");
    },
    onError: (err: any) => {
      if (err.response.data.coupon) {
        handleSnackMessage(err.response.data.coupon, "error");
        setcouponError(err.response.data.coupon);
      } else {
        handleSnackMessage("Coupon does'nt exist", "error");
      }
    },
  });

  const handleDummyCoupon = () => {
    if (couponQuery.data) {
      setcoupon(couponQuery.data.coupon_code);
      applyCoupon(couponQuery.data.coupon_code);
    }
  };

  if (shoppingQuery.isLoading) {
    return (
      <div className="w-full h-full flex mt-[10rem] justify-center">
        <Spinner size={50} />
      </div>
    );
  }

  return (
    <>
      <AnimatePresence>
        {shoppingQuery.data && shoppingQuery.data.order_product.length > 0 ? (
          <m.div
            variants={FadeVariant}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <EnhancedTable shopingCart={shoppingQuery.data} />
            <div className="flex flex-col md:flex-row w-full justify-between mt-5 text-primary p-3">
              <div className=" md:w-[48%]">
                <form className="">
                  <p className="font-bold bg-gray-200 p-5 tracking-tighter">
                    Coupon Code
                  </p>
                  {couponQuery.data && (
                    <p className=" text-gray-400 text-sm font-semibold mt-3">
                      try dummy coupon{" "}
                      <span
                        className="text-pink-700 cursor-pointer hover:underline transition-all delay-75"
                        onClick={handleDummyCoupon}
                      >
                        {couponQuery.data.coupon_code}
                      </span>
                    </p>
                  )}
                  <div className="flex flex-col items-center mt-4">
                    <div className="w-full flex">
                      <Input
                        type="text "
                        styles="w-3/4 border-1"
                        onChange={(e) => {
                          setcoupon(e.target.value);
                        }}
                        placeholder="Enter Coupon"
                        value={coupon}
                        errors={[]}
                      />
                      <button
                        onClick={() => applyCoupon(coupon)}
                        className="text-sm md:text-base h-[3rem] ml-1 bg-pink-500 rounded-xl m-auto border-2 w-[9rem]  md:w-[11rem] md:px-5 hover:border-primary hover:bg-secondary hover:border-1 hover:text-primary text-center font-semibold py-2 flex items-center justify-center cursor-pointer transition-all delay-75 text-secondary"
                        type="button"
                        disabled = {isApplyingCoupon}
                      >
                        {isApplyingCoupon ? <Spinner color="#fff" /> : " Apply Coupon"}
                      </button>
                    </div>
                    {couponError && (
                      <p className="text-red-400 text-sm font-semibold mt-1 text-center">
                        {couponError[0]}
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
                  Shipping and additional costs are calculated based on values
                  you have entered.
                </p>
                <div className="flex justify-between">
                  <p className="text-primary font-bold">Order Subtotal</p>
                  <p className="text-primary font-semibold">
                    &#8358;{" "}
                    <NumericFormat
                      value={shoppingQuery.data.get_summed_price}
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
                    <NumericFormat
                      value={1500}
                      displayType="text"
                      thousandSeparator={true}
                      decimalScale={0}
                    />
                  </p>
                </div>
                {shoppingQuery.data.get_summed_coupon !== 0 && (
                  <div className="flex justify-between mt-3">
                    <p className="text-primary font-bold">Coupon Discount</p>
                    <p className="text-primary font-semibold">
                      - &#8358;{" "}
                      <NumericFormat
                        value={shoppingQuery.data.get_summed_coupon}
                        displayType="text"
                        thousandSeparator={true}
                        decimalScale={2}
                      />
                    </p>
                  </div>
                )}
                <div className="flex justify-between mt-3">
                  <p className="text-primary font-bold">Total</p>
                  <p className="text-primary font-semibold">
                    &#8358;{" "}
                    <NumericFormat
                      value={shoppingQuery.data.get_total_price}
                      displayType="text"
                      thousandSeparator={true}
                      decimalScale={0}
                    />
                  </p>
                </div>
                <div className="flex justify-between mt-3 text-center">
                  <ButtonLink
                    to="/shipping"
                    text="Proceed To Checkout"
                    style="border-primary border-1 md:h-[3rem] hover:bg-secondary text-sm md:text-base hover:text-primary hover:border-primary hover:border-1 w-[48%]"
                  />
                  <ButtonLink
                    to="/"
                    text="Continue Shopping"
                    style="border-primary border-1 md:h-[3rem] hover:bg-secondary text-sm md:text-base hover:text-primary hover:border-primary hover:border-1 w-[48%]"
                  />
                </div>
              </div>
            </div>
          </m.div>
        ) : (
          <div className="">
            <p className="mt-36 font-bold text-primary text-2xl  text-center ">
              Your cart is empty
            </p>
            <ButtonLink
              to="/"
              text="Continue Shopping"
              style="w-[12rem] m-auto mt-4 border-1 border-primary hover:text-primary hover:bg-secondary"
            />
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Cart;
