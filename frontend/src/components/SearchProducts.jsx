import React, { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { fetchData } from "../utils/FetchData";
import { useStateContext } from "../context/ContextProvider";
const SearchProducts = () => {
  const [searchValue, setsearchValue] = useState("");
  const { setproducts } = useStateContext()
  const handleSearch = async (e) => {
    
    setsearchValue(e.target.value)
    const {response} = await fetchData('/api/products', 'GET')
    const products = response
    const searchedProducts = products.filter((product) => (
      product.title.toLowerCase().includes(e.target.value.toLowerCase()) || 
      product.category.toLowerCase().includes(e.target.value.toLowerCase())
    ))
    if (e.target.value){
      setproducts(searchedProducts)
    }else{
      setproducts(products)
    }
  }
  return (
    <div className="w-full flex flex-col mt-3 text-primary">
      <div className="flex flex-col mx-auto w-full ">
        <div className="flex w-full h-14">
            <button className="bg-muted rounded-l-xl border-0" type="search">
            <SearchIcon />
            </button>
            <input
            type="search"
            value={searchValue}
            placeholder="Search"
            className="w-full bg-muted border-0 rounded-r-xl focus:border-pink-300 focus:ring-pink-500"
            onChange={(e) => handleSearch(e)}
            />
        </div>
        {searchValue && <p className="text-gray-500 w-3/4 mt-4">search results for {searchValue}</p>}
      </div>
      
    </div>
  );
};

export default SearchProducts;
