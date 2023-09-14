import { ChangeEvent, useEffect, useState } from "react";
import { useStateContext } from "../context/StateContextProvider";
import Button from "./Button";
import CloseIcon from "@mui/icons-material/Close";
import Drawer from "@mui/material/Drawer";
import { Hidden } from "@mui/material";
import CachedIcon from "@mui/icons-material/Cached";
import { CategoryType, ProductType } from "../types/api";
import { useQuery } from "react-query";
import axios from "../api/axios";

type SideBarProps = {
  products: ProductType[];
  handleFilteredProducts: (filteredProducts: ProductType[]) => void;
};
const Sidebar = ({ products, handleFilteredProducts }: SideBarProps) => {
  const { openSideDrawer, handleCloseSideDrawer } = useStateContext();

  return (
    <>
      <span className="hidden lg:inline h-full">
        <SideBarContent
          handleCloseDrawer={handleCloseSideDrawer}
          products={products}
          handleFilteredProducts={handleFilteredProducts}
        />
      </span>
      <Hidden>
        <Drawer open={openSideDrawer} onClose={handleCloseSideDrawer}>
          <div className="p-4">
            <SideBarContent
              handleCloseDrawer={handleCloseSideDrawer}
              products={products}
              handleFilteredProducts={handleFilteredProducts}
            />
          </div>
        </Drawer>
      </Hidden>
    </>
  );
};

type sideBarContentProps = {
  handleFilteredProducts: (filteredProducts: ProductType[]) => void;
  products: ProductType[];
  handleCloseDrawer: () => void;
};
const SideBarContent = ({
  handleFilteredProducts,
  products,
  handleCloseDrawer,
}: sideBarContentProps) => {
  const { handleSnackMessage } = useStateContext();
  const [checkedCategory, setcheckedCategory] = useState("");
  const [priceFilterVariant, setPriceFilterVariant] = useState({
    value: "Min",
  });
  const [priceRange, setPriceRange] = useState(0);
  const [isPriceFilterActive, setIsPriceFilterActive] = useState(false);

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () =>
      axios.get<CategoryType[]>("/product/categories").then((res) => res.data),
    onError: () => {
      handleSnackMessage(
        "something went wrong, couldn't fetch categories",
        "error"
      );
    },
  });

  const handlePriceRangeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    setPriceRange(isNaN(newValue) ? 0 : newValue);
  };

  const handlePriceFilter = () => {
    setIsPriceFilterActive(true);
    handleFilter(true);
  };

  const handleReset = () => {
    setIsPriceFilterActive(false);
    setPriceRange(0);
  };

  const handleCheckbox = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === checkedCategory) {
      setcheckedCategory("");
    } else {
      setcheckedCategory(e.target.value);
    }
  };

  const FilterByPrice = (products: ProductType[]) => {
    let filteredProducts: ProductType[];

    if (priceFilterVariant.value === "Min") {
      filteredProducts = products.filter(
        (product) => product.price >= priceRange
      );
    } else {
      filteredProducts = products.filter(
        (product) => product.price <= priceRange
      );
    }

    return filteredProducts;
  };

  const FilterByCheckbox = () => {
    return products.filter(
      (product) =>
        checkedCategory === "" ||
        product.category.some((c) =>
          c.name.toLowerCase().includes(checkedCategory)
        )
    );
  };

  const handleFilter = (ispriceFilterClicked = false) => {
    let filteredProducts = FilterByCheckbox();
    if (isPriceFilterActive || ispriceFilterClicked) {
      filteredProducts = FilterByPrice(filteredProducts);
    }
    handleFilteredProducts(filteredProducts);
  };

  const isChecked = (category: string) =>
    checkedCategory === category ? "font-bold" : "";

  useEffect(() => {
    handleFilter();
  }, [checkedCategory, isPriceFilterActive]);

  return (
    // <Drawer>
    <div className="w-60 md:border-r-2 h-full md:border-muted text-primary relative">
      <div>
        <p className="font-semibold pt-3">Filter</p>
        <div
          className="absolute right-2 -top-1 md:hidden"
          onClick={handleCloseDrawer}
        >
          <CloseIcon />
        </div>
        {categories && (
          <div className="">
            <p className="mt-10 font-bold">Categories</p>

            {categories.map((category) => (
              <div className="flex items-center flex-row h-8" key={category.id}>
                <input
                  type="checkbox"
                  name="category"
                  value={category.name}
                  checked={category.name === checkedCategory}
                  onChange={(e) => handleCheckbox(e)}
                  className="mr-3 rounded-sm border-gray-400 border-1 bg-secondary checked:text-pink-500 focus:ring-pink-500"
                />
                <span className={isChecked(category.name)}>
                  {category.name}
                </span>
              </div>
            ))}
          </div>
        )}
        <div className=" mr-10 mt-10">
          <span className="font-bold text-primary">Price range</span>
          <div className="mt-4 flex justify-between">
            <select
              onChange={(e) => setPriceFilterVariant({ value: e.target.value })}
              className="h-9 w-24 rounded-xl bg-muted text-gray-400 justify-center flex items-center focus:border-pink-300 focus:ring-pink-500"
              name="filterByPrice"
            >
              <option className="hover:bg-pink-500" value="Min">
                Min
              </option>
              <option value="Max">Max</option>
            </select>
            <input
              className="rounded-xl p-2 h-9 w-20 border-2 bg-secondary border-muted focus:border-pink-300 focus:shadow-pink-300 focus:ring-pink-300"
              type="number"
              value={priceRange}
              onChange={(e) => handlePriceRangeChange(e)}
              placeholder="&#8358;"
            />
          </div>
          <div className="flex justify-between mt-3 h-10">
            <Button
              text="Set Price"
              onClick={() => handlePriceFilter()}
              style="hover:bg-secondary hover:text-primary hover:border-primary hover:border-1 w-4/5"
            />
            <div
              className="flex items-center justify-center border-1 bg-gray-200 rounded-xl ml-2 cursor-pointer hover:bg-secondary hover:border-primary transition-all delay-75 p-4"
              onClick={() => handleReset()}
            >
              {" "}
              <CachedIcon />
            </div>
          </div>
        </div>
      </div>
    </div>
    // </Drawer>
  );
};

export default Sidebar;
