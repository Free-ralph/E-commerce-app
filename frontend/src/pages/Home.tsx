import Sidebar from "../components/Sidebar";
import Products from "../components/Products";
import { useQuery } from "react-query";
import axios from "../api/axios";
import { useStateContext } from "../context/StateContextProvider";
import { ProductType } from "../types/api";
import { useState } from "react";
import FilterAltIcon from "@mui/icons-material/FilterAlt";

const Home = () => {
  const { handleSnackMessage, handleOpenSideDrawer } = useStateContext();
  const [filteredProducts, setFilteredProducts] = useState<ProductType[]>([]);
  const { data: products, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: () =>
      axios.get<ProductType[]>("/products").then((res) => res.data),
    onError: () => {
      handleSnackMessage(
        "something wen't wrong, couldn't fetch products",
        "error"
      );
    },
    onSuccess: (res) => {
      setFilteredProducts(res);
    },
  });
  const handleFilteredProducts = (filteredProducts: ProductType[]) => {
    setFilteredProducts(filteredProducts);
  };
  return (
    <div className="flex h-full">
      <Sidebar
        products={products ? products : []}
        handleFilteredProducts={handleFilteredProducts}
      />
      <Products
        products={products ? products : []}
        filteredProducts={filteredProducts}
        isLoadingProducts = {isLoading}
        handleFilteredProducts={handleFilteredProducts}
      />
      <div
        className="lg:hidden absolute bottom-2 right-2 bg-pink-500 text-white p-3 rounded"
        onClick={handleOpenSideDrawer}
      >
        <FilterAltIcon />
      </div>
    </div>
  );
};

export default Home;
