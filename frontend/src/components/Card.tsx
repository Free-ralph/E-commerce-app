import { Rating } from "@mui/material";
import Button from "./Button";
import { NumericFormat } from "react-number-format";
import { ProductType } from "../types/api";
type CardProps = {
  addProductToCart: (id: number) => void;
  handleOpenProductDetail: (product: ProductType) => void;
  product: ProductType;
};

const Card = ({ product, handleOpenProductDetail, addProductToCart }: CardProps) => {
  return (
    <div className="border-2 border-gray-300 w-[98%] md:w-[85%] lg:w-72 rounded-2xl h-96 m-auto overflow-hidden">
      <div
        className="w-full h-1/2 cursor-pointer border-b-2 border-gray-300"
        onClick={() => handleOpenProductDetail(product)}
      >
        <img
          src={product.image}
          alt={`${product.title} image`}
          className="h-full w-full object-cover object-center"
        />
      </div>
      <div className="px-6 pt-4 flex flex-col h-1/2">
        <div
          className=" h-3/5 cursor-pointer"
          onClick={() => handleOpenProductDetail(product)}
        >
          <p className="font-bold">{product.title}</p>
          <div className="flex justify-start items-center">
            <Rating
              name="read-only"
              value={product.rating}
              readOnly
              sx={{
                "& .MuiRating-iconFilled": {
                  color: "rgb(236 72 153 / var(--tw-bg-opacity))",
                },
              }}
            />{" "}
            ({product.popularity})
          </div>
        </div>
        <div className="flex justify-between mt-4 mb-2">
          <div className="">
            <p className="text-gray-400 text-sm">price</p>
            <p className="font-bold">
              &#8358;
              <NumericFormat
                value={product.price}
                displayType="text"
                thousandSeparator={true}
                decimalScale={0}
              />
            </p>
          </div>
          <Button
            text="Add to Cart"
            onClick={() => addProductToCart(product.id)}
            style="border-1 px-5 font-semibold text-sm"
          />
        </div>
      </div>
    </div>
  );
};

export default Card;
