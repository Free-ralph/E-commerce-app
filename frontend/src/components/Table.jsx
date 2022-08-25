import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import NumberFormat from "react-number-format";
import { Tooltip } from "@mui/material";
import { fetchData } from "../utils/FetchData";
import { useStateContext } from "../context/ContextProvider";
import UpgradeIcon from '@mui/icons-material/Upgrade';

const QunatityInput = ({name, value, id}) => {
  const { authToken, setSnackbar, setmessage } = useStateContext()
  const [quantity, setquantity] = useState(value)

  const handleQuantity = async (e, id) => {
    console.log(id)
    const { status } = await fetchData(
      "/api/update-quantity",
      "POST",
      { id, quantity }, 
      { Authorization: "Bearer " + String(authToken.access) }
    );
    let message 
    if (status === 200){
      message = {
        message : 'quantity updated', 
        severity : 'success'
      }
    }else{
      message = {
        message : 'Something went wrong', 
        severity : 'error'
      }
    }
    setmessage(message)
    setSnackbar(true)

  };
  return (
    <div className="flex items-center justify-end">
      <input
        className="rounded-xl h-9 w-20 border-2 bg-secondary border-muted focus:border-pink-300 focus:shadow-pink-300 focus:ring-pink-300"
        type="number"
        name={name}
        value={quantity}
        onChange={(e) => setquantity(e.target.value)}
        min="1"
        placeholder="&#8358;"
      />
      <div className="text-white bg-pink-400 rounded-md flex ml-3 h-7 cursor-pointer hover:bg-primary transition-all delay-75" onClick={(e) => handleQuantity(e, id)}>
        <UpgradeIcon className="m-auto" />
      </div>
    </div>
  );
};

export default function BasicTable({ authToken }) {
  const { cartItems, GetCartItems } = useStateContext();
  const handleDelete = async (e, id) => {
    const { status } = await fetchData(
      `http://127.0.0.1:8000/api/delete-item/${id}`,
      "GET",
      null,
      { Authorization: "Bearer " + String(authToken.access) }
    );
    if (status === 200) {
      GetCartItems()
    } else {
      // error message
    }
  };
  return (
    <TableContainer className="mt-5" component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>
              <span className="font-bold text-lg">Image</span>
            </TableCell>
            <TableCell align="right">
              <span className="font-bold text-lg">name</span>
            </TableCell>
            <TableCell align="right">
              <span className="font-bold text-lg">price</span>
            </TableCell>
            <TableCell align="right">
              <span className="font-bold text-lg">quantity</span>
            </TableCell>
            <TableCell align="right"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {cartItems.map((item) => (
            <TableRow
              key={item.id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                <img
                  className=" w-40 h-40 object-cover object-center rounded-xl"
                  src={item.product.image}
                  alt={`${item.product.title}_thumbnail`}
                />
              </TableCell>
              <TableCell align="right">{item.product.title}</TableCell>
              <TableCell align="right">
                &#8358;{" "}
                <NumberFormat
                  value={item.product.price}
                  displayType="text"
                  thousandSeparator={true}
                  decimalScale={0}
                />
              </TableCell>
              <TableCell align="right">
                <QunatityInput name = {item.product.title} value = {item.quantity} id = {item.id}/>
              </TableCell>
              <TableCell align="right">
                <div
                  className="flex items-center justify-center transition-all delay-75 text-pink-500 cursor-pointer hover:text-primary hover:scale-125"
                  onClick={(e) => handleDelete(e, item.id)}
                >
                  <Tooltip title="delete">
                    <DeleteIcon />
                  </Tooltip>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
