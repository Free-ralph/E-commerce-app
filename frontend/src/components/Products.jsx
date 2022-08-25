import React, { useState } from "react";
import SearchProducts from "./SearchProducts";
import Card from "./Card";
import { useStateContext } from "../context/ContextProvider";
import { Pagination } from "@mui/material";
import ProductDetail from "./ProductDetail";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const Products = () => {
  // const [filterBy, setfilterBy] = useState([]);
  const { products } = useStateContext();
  const [currentPage, setcurrentPage] = useState(1)
  const productsPerPage = 6
  const indexOfLastProduct = currentPage * productsPerPage
  const indexOfirstProduct = indexOfLastProduct - productsPerPage
  const CurrentProducts = products.slice(indexOfirstProduct, indexOfLastProduct)
  const [activeProductDetail, setactiveProductDetail] = useState({})
  
  // const handleFilter = (value) => {
  //   var updatedList = filterBy;
  //   if (!updatedList.includes(value)) {
  //     updatedList = [...filterBy, value];
  //   } else {
  //     updatedList.splice(filterBy.indexOf(value), 1);
  //   }
  //   setfilterBy(updatedList);
  // };

  // const filters = ["Popular", "Most Viewed", "Price"];

  // const isSelected = (value) => {
  //   return filterBy.includes(value)
  //     ? "rounded-xl  text-sm md:text-base border-2 border-gray-300 bg-pink-500 text-secondary cursor-pointer py-2 px-4"
  //     : "rounded-xl border-2 border-gray-300  text-sm md:text-base hover:bg-pink-500 hover:text-secondary cursor-pointer py-2 px-4";
  // };

  const paginate = (e, value) => {
    window.scrollTo({ top : 0 , behavior : 'smooth'});
    setcurrentPage(value)
  }

  const handleProductDetail = (e, product) => {
    // setfavChanged(Math.random)
    setactiveProductDetail(product)
  }
  return (
    <div className=" text-primary flex w-full relative ">
      <div className=" w-full md:w-4/6 border-r-2 mt-3 border-muted">
        <div className=" w-11/12 flex mx-auto flex-col">
          <SearchProducts />
          <div className="flex flex-wrap gap-6 lg:gap-10 justify-between mt-2 h-[500px] overflow-scroll p-2">
            {CurrentProducts.map((product) => (
              <Card
                key={product.id}
                id = {product.id}
                name={product.title}
                ratings={product.rating}
                popularity={product.popularity}
                price={product.price}
                image={product.image}
                onWhishlist = {product.whishlist}
                onClick = {(e) => handleProductDetail(e, product)}
              />
            ))}
          </div>
          <div className="flex m-auto mt-5">
            <Pagination
                count = {Math.ceil(products.length / productsPerPage)}
                page = {currentPage}
                defaultPage = {1}
                color = "standard"
                size = 'large'
                onChange = {paginate}
                shape = 'rounded'
                sx = {{
                  '& .Mui-selected':{
                    backgroundColor : '#ec4899 !important',
                    color : '#f7f7f8'
                  }
                }} />
          </div>
        </div>
      </div>
      {activeProductDetail.id ? <div className=" fixed z-50 h-full bototm-0 left-0 w-full top-0 md:static md:block md:w-2/6">
        <ProductDetail {...activeProductDetail} /> 
        <div className='absolute bg-secondary p-4 left-3 top-3 md:hidden rounded-xl border-2 border-primary'
          onClick={() => setactiveProductDetail({})}><ArrowBackIcon /></div>
      </div>
      : <div className="hidden justify-center items-center md:flex w-2/6">
          <p className="font-semibold text-2xl p-5 text-center">Select a Product to display details</p>
        </div>}
    </div>
  );
};

export default Products;
