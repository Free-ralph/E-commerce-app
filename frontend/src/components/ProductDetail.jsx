import React, { useState, useEffect } from "react";
// import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
// import FavoriteIcon from "@mui/icons-material/Favorite";
import NumberFormat from "react-number-format";
import { useStateContext } from "../context/ContextProvider";

const ProductDetail = ({ id, title, description, price, image }) => {
  const [showMoreDetail, setshowMoreDetail] = useState(["", false, false]);
  const sliceddescription = `${description.slice(0, 200)}...`;
  const { addToCart } = useStateContext();
  // const [isFav, setisFav] = useState(false)
  // useEffect(() => {
  //   for (let fav of favourites) {
  //     if (fav.id == id) {
  //       setisFav(true)
  //     }
  //   }
  // }, [favChanged,]);

  useEffect(() => {
    description.length > 200
      ? setshowMoreDetail([sliceddescription, false, true])
      : setshowMoreDetail([description, true, false]);
  }, [id]);

  const handleReadMore = () => {
    if (showMoreDetail[1]) {
      setshowMoreDetail([sliceddescription, false, true]);
    } else {
      setshowMoreDetail([description, true, true]);
    }
  };

  return (
    <div className="h-screen md:h-[90vh] bg-secondary p-5 mx-auto md:block relative">
      <div className="">
        <img
          src={image}
          className="rounded-xl border-2 border-gray-300 object-fit object-cover w-full h-[18rem] md:h-[20rem]"
          alt="test"
        ></img>
      </div>
      <div className="flex flex-wrap mt-5 h-40 md:h-52 overflow-scroll">
        <p className="font-semibold text-xl md:text-2xl">{title}</p>
        <p className="text-gray-400 text-sm">
          {showMoreDetail[0]}{" "}
          <span
            className="text-pink-500 cursor-pointer"
            onClick={() => handleReadMore()}
          >
            {showMoreDetail[2] &&
              (showMoreDetail[1] ? "Show less" : "Read more")}
          </span>
        </p>
      </div>
      <div className="flex justify-between items-center mt-4 absolute bottom-2 w-full">
        <div
          onClick={() => addToCart(id)}
          className={`mr-9 md:mr-0 bg-pink-500 rounded-xl text-center text-secondary font-medium flex items-center justify-center w-[90%] py-4 hover:bg-secondary hover:text-primary hover:border-primary hover:border-1 cursor-pointer transition-all delay-75`}
        >
          &#8358;{" "}
          <span className="font-bold mx-1">
            <NumberFormat
              value={price}
              displayType="text"
              thousandSeparator={true}
              decimalScale={0}
            />
          </span>{" "}
          Add To Cart
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
