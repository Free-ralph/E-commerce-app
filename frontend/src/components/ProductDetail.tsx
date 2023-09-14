import { useState, useEffect } from "react";
import {NumericFormat} from "react-number-format";
import { ProductType } from "../types/api";

type productDetialProps = {
  addProductToCart : (id : number) => void  
} & ProductType
const ProductDetail = ({ id , title, description, price, image, addProductToCart } : productDetialProps) => {
  const [showMoreDetail, setshowMoreDetail] = useState(["", false, false]);
  const sliceddescription = `${description.slice(0, 200)}...`;

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
    <div className="h-screen flex flex-col md:h-[90vh] bg-secondary p-5 md:py-4 md:px-2 lg:p-5 mx-auto relative">
      <div className="md:h-[50%] h-[45%] ">
        <img
          src={image}
          className="rounded-xl border-2 border-gray-300 object-fit object-cover w-full h-full"
          alt={`image of ${title}`}
        ></img>
      </div>
      <div className="flex flex-wrap mt-5 h-[40%] md:h-[35%] overflow-scroll">
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
      <div className="h-[10%]"></div>
      <div className="flex justify-between items-center mt-4 absolute bottom-2 w-full ">
        <div
          onClick={() => addProductToCart(id)}
          className={`mr-9 md:mr-0 md:text-sm lg:text-base bg-pink-500 rounded-xl text-center text-secondary font-medium flex items-center justify-center w-[90%] py-4 hover:bg-secondary hover:text-primary hover:border-primary hover:border-1 cursor-pointer transition-all delay-75`}
        >
          &#8358;{" "}
          <span className="font-bold mx-1">
            <NumericFormat
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
