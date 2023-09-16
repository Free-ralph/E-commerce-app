import { ChangeEvent, useEffect, useState } from "react";
import Card from "./Card";
import { Pagination } from "@mui/material";
import ProductDetail from "./ProductDetail";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { ProductType } from "../types/api";
import SearchIcon from "@mui/icons-material/Search";
import { motion as m, AnimatePresence } from "framer-motion";
import { useMutation, useQueryClient } from "react-query";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useStateContext } from "../context/StateContextProvider";
import { useNavigate } from "react-router-dom";
import { FadeVariant } from "../utils/Variants";
import Spinner from "./Spinner";

type ProductProps = {
  filteredProducts: ProductType[];
  products: ProductType[];
  isLoadingProducts: boolean;
  handleFilteredProducts: (filteredProducts: ProductType[]) => void;
};
const Products = ({
  products,
  filteredProducts,
  handleFilteredProducts,
  isLoadingProducts,
}: ProductProps) => {
  const queryClient = useQueryClient();
  const { handleSnackMessage } = useStateContext();
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const [currentPage, setcurrentPage] = useState(1);
  const productsPerPage = 6;
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfirstProduct = indexOfLastProduct - productsPerPage;
  const CurrentProducts = filteredProducts.slice(
    indexOfirstProduct,
    indexOfLastProduct
  );
  const [activeProductDetail, setactiveProductDetail] = useState<ProductType>();
  const [searchValue, setsearchValue] = useState("");

  const { mutate: addToCartMutate } = useMutation({
    mutationFn: (id: number) => axiosPrivate.get(`add-to-cart/${id}`),
    onSuccess: () => {
      handleSnackMessage("item added to cart successfully", "success");
      queryClient.invalidateQueries("shopingCart");
      queryClient.invalidateQueries("cartSize");
      navigate("/cart");
    },
    onError: () => {
      handleSnackMessage("Something went wrong", "error");
    },
  });

  const addProductToCart = (id: number) => {
    addToCartMutate(id);
  };

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setsearchValue(e.target.value);
    const searchedProducts = products.filter(
      (product) =>
        e.target.value === "" ||
        product.title.toLowerCase().includes(e.target.value.toLowerCase()) ||
        product.category.some((c) =>
          c.name.toLocaleLowerCase().includes(e.target.value.toLowerCase())
        )
    );
    handleFilteredProducts(searchedProducts);
  };

  const paginate = (e: React.ChangeEvent<unknown>, value: number) => {
    e;
    window.scrollTo({ top: 0, behavior: "smooth" });
    setcurrentPage(value);
  };

  const handleOpenProductDetail = (product: ProductType) => {
    // setfavChanged(Math.random)
    setactiveProductDetail(product);
  };

  useEffect(() => {
    setcurrentPage(1);
  }, [filteredProducts]);
  return (
    <div className=" text-primary flex w-full h-[90vh] pt-2">
      <div className=" w-full md:w-[60%] lg:w-4/6 border-r-2 h-full border-muted">
        <div className=" w-11/12 flex mx-auto flex-col h-full">
          <div className="w-full flex flex-col text-primary">
            <div className="flex flex-col mx-auto w-full ">
              <div className="flex w-full h-14">
                <button className="bg-muted rounded-l-xl border-0 px-4">
                  <SearchIcon />
                </button>
                <input
                  type="search"
                  value={searchValue}
                  placeholder="Search"
                  className="w-full px-3 bg-muted border-0 rounded-r-xl focus-visible:outline-pink-300 focus:border-pink-300 focus:ring-pink-500"
                  onChange={(e) => handleSearch(e)}
                />
              </div>
              {searchValue && (
                <p className="text-gray-500 w-3/4 mt-4">
                  search results for {searchValue}
                </p>
              )}
            </div>
          </div>
          {isLoadingProducts ? (
            <div className="w-full justify-center flex mt-[8rem]">
              <Spinner />
            </div>
          ) : (
            <>
              <AnimatePresence>
                <m.div
                  variants={FadeVariant}
                  key={currentPage}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="flex flex-wrap gap-6 lg:gap-5 justify-between mt-2 md:h-full md:overflow-scroll"
                >
                  {CurrentProducts.map((product, i) => (
                    <Card
                      key={i}
                      product={product}
                      addProductToCart={addProductToCart}
                      handleOpenProductDetail={handleOpenProductDetail}
                    />
                  ))}
                </m.div>
              </AnimatePresence>
              <div className="flex m-auto mt-5">
                <Pagination
                  count={Math.ceil(filteredProducts.length / productsPerPage)}
                  page={currentPage}
                  defaultPage={1}
                  color="standard"
                  size="small"
                  onChange={paginate}
                  shape="rounded"
                  sx={{
                    "& .Mui-selected": {
                      backgroundColor: "#ec4899 !important",
                      color: "#f7f7f8",
                    },
                  }}
                />
              </div>
            </>
          )}
        </div>
      </div>
      {activeProductDetail ? (
        <div className="fixed z-50 h-full bototm-0 left-0 w-full top-0 md:static md:block md:w-[40%] lg:w-2/6">
          <AnimatePresence>
            {activeProductDetail && (
              <m.div
                key={activeProductDetail.id}
                variants={FadeVariant}
                initial={"hidden"}
                animate={"visible"}
                exit={"hidden"}
                transition={{ ease: "easeInOut  " }}
              >
                <ProductDetail
                  addProductToCart={addProductToCart}
                  {...activeProductDetail}
                />
                <div
                  className="absolute bg-secondary p-4 left-3 top-3 md:hidden rounded-xl border-2 border-primary"
                  onClick={() => setactiveProductDetail(undefined)}
                >
                  <ArrowBackIcon />
                </div>
              </m.div>
            )}
          </AnimatePresence>
        </div>
      ) : (
        <div className="hidden md:block fixed z-50 h-full  bototm-0 left-0 w-full top-0 md:static md:w-[40%] lg:w-2/6">
          <p className="font-semibold text-2xl p-5 text-center mt-[10rem]">
            Select a Product to display details
          </p>
        </div>
      )}
    </div>
  );
};

export default Products;
