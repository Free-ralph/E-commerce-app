import React from "react";
import { Rating } from "@mui/material";
import { Button } from "./Button";
import NumberFormat from "react-number-format";
import { useStateContext } from "../context/ContextProvider";

const Card = ({id,  name, image, ratings, popularity, price, onWhishlist, onClick }) => {
  const { addToCart } = useStateContext()
  return (
    <div className="border-2 border-gray-300 w-[98%] md:w-72 rounded-2xl h-96 m-auto overflow-hidden">
      <div className="w-full h-1/2 cursor-pointer border-b-2 border-gray-300"
        onClick={onClick}>
        <img
          src={image}
          alt={`${name} image`}
          className="h-full w-full object-cover object-center"
        />
      </div>
      <div className="px-6 pt-4 flex flex-col h-1/2">
        <div className=" h-3/5 cursor-pointer" onClick={onClick}>
          <p className="font-bold">{name}</p>
          <div className="flex justify-start items-center">
            <Rating name="read-only" value={ratings} readOnly sx={{
                  "& .MuiRating-iconFilled": {
                    color: "rgb(236 72 153 / var(--tw-bg-opacity))",
                  }
                }}/> ({popularity})
          </div>
        </div>
        <div className="flex justify-between mt-4 mb-2">
          <div className="">
            <p className="text-gray-400 text-sm">price</p>
            <p className="font-bold">&#8358;< NumberFormat value={price} displayType = 'text' thousandSeparator = {true}  decimalScale	= {0}/></p>
          </div>
          <Button
            color="bg-secondary"
            text="Add to Cart"
            onClick={() => addToCart(id)}
            extra="border-gray-300 border-1 px-5 font-semibold hover:bg-pink-500 hover:text-secondary text-sm"
          />
        </div>
      </div>
    </div>
  );
};

export default Card;
