import React, { useEffect, useState } from "react";
import { useStateContext } from "../context/ContextProvider";
import { Button } from "./Button";
import CloseIcon from "@mui/icons-material/Close";
import Drawer from "@mui/material/Drawer";
import { Hidden } from "@mui/material";
import { fetchData } from "../utils/FetchData";
import CachedIcon from "@mui/icons-material/Cached";

const SideBarContent = () => {
  const [checkedCategory, setcheckedCategory] = useState("");
  const { setOpenDrawer, setproducts, products } = useStateContext();
  const [categories, setcategories] = useState([]);
  // const [filterByRating, setfilterByRating] = useState(false);
  // const [ratingValue, setratingValue] = useState(0);
  const [priceFilterVariant, setPriceFilterVariant] = useState({
    value: "Min",
  });
  const [priceRange, setPriceRange] = useState(0);

  useEffect(() => {
    const fetchCategories = async () => {
      const { response } = await fetchData(
        "/api/product/categories",
        "GET"
      );
      const categoriesData = response 
      setcategories(categoriesData);
    };
    fetchCategories();
  }, []);

  // const handleFilterByRating = (e) => {
  //   if (e.target.checked) {
  //     setfilterByRating(true);
  //   } else {
  //     setfilterByRating(false);
  //   }
  // };

  // const handleRating = (newValue) => {
  //   if (filterByRating) {
  //     const filteredProducts = products.filter((product) => (
  //       product.rating === newValue
  //     ))

  //     setproducts(filteredProducts)
  //   }
  // };

  const handlePriceFilter = async (e) => {
    e.preventDefault();
    let filteredProducts;
    // const {response } = await fetchData(`/api/products`);
    if (priceFilterVariant.value === "Min") {
      filteredProducts = products.filter(
        (product) => parseInt(product.price) >= priceRange
      );
    } else {
      filteredProducts = products.filter(
        (product) => parseInt(product.price) <= priceRange
      );
    }
    setproducts(filteredProducts);
  };

  const handleReset = async (e) => {
    const { response } = await fetchData(`/api/products`);
    const allProducts = response 
    if (checkedCategory) {
      const filteredProducts = allProducts.filter(
        (product) =>
          product.category.toLowerCase() === checkedCategory.toLowerCase()
      );
      setproducts(filteredProducts);
    }else{
      setproducts(allProducts)
    }
  }

  const handleCheckbox = async (e) => {
    const { response } = await fetchData(
      "/api/products",
      "GET"
    );
    const allProducts = response
    if (e.target.value === checkedCategory) {
      e.target.checked = false;
      setcheckedCategory("");
      setproducts(allProducts);
    } else {
      const filteredProducts = allProducts.filter(
        (product) =>
          product.category.toLowerCase() === e.target.value.toLowerCase()
      );
      setproducts(filteredProducts);
      setcheckedCategory(e.target.value);
    }
  };

  const isChecked = (category) =>
    checkedCategory === category ? "font-bold" : "";
  return (
    // <Drawer>
    <div className="w-60 md:border-r-2 h-screen md:border-muted text-primary relative">
      <div>
        <p className="font-semibold mt-3">Filter</p>
        <div
          className="absolute right-2 -top-1 md:hidden"
          onClick={() => setOpenDrawer(false)}
        >
          <CloseIcon />
        </div>
        <div className="">
          <p className="mt-10 font-bold">Categories</p>

          {categories.map((category) => (
            <div className="flex items-center flex-row h-8" key={category.id}>
              <input
                type="radio"
                name="category"
                value={category.name}
                onClick={handleCheckbox}
                className="mr-3 rounded-sm border-gray-400 border-1 bg-secondary checked:text-pink-500 focus:ring-pink-500"
              />
              <span className={isChecked(category.name)}>{category.name}</span>
            </div>
          ))}
        </div>
        <form>
          <div className=" mr-10 mt-10">
            <span className="font-bold text-primary">Price range</span>
            <div className="mt-4 flex justify-between">
              <select
                onChange={(e) =>
                  setPriceFilterVariant({ value: e.target.value })
                }
                className="h-9 w-24 rounded-xl bg-muted text-gray-400 justify-center flex items-center focus:border-pink-300 focus:ring-pink-500"
                name="filterByPrice"
              >
                <option className="hover:bg-pink-500" value="Min">
                  Min
                </option>
                <option value="Max">Max</option>
              </select>
              <input
                className="rounded-xl h-9 w-20 border-2 bg-secondary border-muted focus:border-pink-300 focus:shadow-pink-300 focus:ring-pink-300"
                type="text"
                onChange={(e) => setPriceRange(e.target.value)}
                placeholder="&#8358;"
              />
            </div>
            <div className="flex justify-between mt-3 h-10">
              <Button
                color="bg-pink-500"
                text="Set Price"
                onClick={handlePriceFilter}
                textColor="text-secondary"
                extra="hover:bg-secondary hover:text-primary hover:border-primary hover:border-1 w-4/5"
              />
              <div className="flex items-center justify-center border-1 bg-gray-200 rounded-xl ml-2 cursor-pointer hover:bg-secondary hover:border-primary transition-all delay-75 p-4"
                onClick={() => handleReset()}>
                {" "}
                <CachedIcon />
              </div>
            </div>
          </div>
        </form>
        {/* <div className="mt-6">
          <p className="font-bold">Rating</p>
          <div className="flex items-center mt-3">
            <input
              type="checkbox"
              onChange={handleFilterByRating}
              value="rating"
              className="mr-3 rounded-sm border-gray-400 border-1 bg-secondary checked:text-pink-500 focus:ring-pink-500"
            />
            <Rating
              name="simple-controlled"
              value={ratingValue}
              onChange={(e, newValue) => {
                setratingValue(newValue);
                handleRating(newValue);
              }}
              sx={{
                "& .MuiRating-iconFilled": {
                  color: "rgb(236 72 153 / var(--tw-bg-opacity))",
                },
                "& .MuiRating-iconFocus": {
                  color: "rgb(236 72 153 / var(--tw-bg-opacity))",
                },
                "& .MuiRating-iconHover": {
                  color: "rgb(236 72 153 / var(--tw-bg-opacity))",
                },
              }}
            />
          </div>
        </div> */}
      </div>
    </div>
    // </Drawer>
  );
};

const Sidebar = () => {
  const { openDrawer, setOpenDrawer } = useStateContext();

  return (
    <>
      <span className="hidden md:inline">
        <SideBarContent />
      </span>
      <Hidden>
        <Drawer open={openDrawer} onClose={() => setOpenDrawer(false)}>
          <div className="p-4">
            <SideBarContent />
          </div>
        </Drawer>
      </Hidden>
    </>
  );
};

export default Sidebar;
