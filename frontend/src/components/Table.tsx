import { ChangeEvent, useEffect, useState } from "react";
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
import { NumericFormat } from "react-number-format";
import { Tooltip } from "@mui/material";
import { useStateContext } from "../context/StateContextProvider";
import UpgradeIcon from "@mui/icons-material/Upgrade";
import { useMutation, useQueryClient } from "react-query";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { CartType } from "../types/api";
type QuantityInputProps = {
  name: string;
  value: number;
  id: number;
};
const QunatityInput = ({ name, value, id }: QuantityInputProps) => {
  const queryClient = useQueryClient()
  const axiosPrivate = useAxiosPrivate();
  const { handleSnackMessage } = useStateContext();
  const [quantity, setquantity] = useState(value);

  const { mutate: updateQuantity } = useMutation({
    mutationFn: (id: number) =>
      axiosPrivate.post("/update-quantity", { id, quantity }),
    onSuccess: () => {
      handleSnackMessage("quantity updated", "success");
      queryClient.invalidateQueries("shopingCart")
    },
    onError: () => {
      handleSnackMessage(
        "something went wrong, could'nt update quantity",
        "error"
      );
    },
  });

  const handleQuantityChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    setquantity(isNaN(newValue) ? 0 : newValue);
  };  

  useEffect(() => {
    setquantity(value)
  }, [value])

 
  return (
    <div className="flex items-center justify-end">
      <input
        className="rounded-xl p-2 h-9 w-20 border-2 bg-secondary border-muted focus:border-pink-300 focus:shadow-pink-300 focus:ring-pink-300"
        type="number"
        name={name}
        value={quantity}
        onChange={(e) => handleQuantityChange(e)}
        min="1"
        placeholder="&#8358;"
      />
      <div
        className="text-white bg-pink-400 rounded-md flex ml-3 h-7 px-1 cursor-pointer hover:bg-primary transition-all delay-75"
        onClick={() => updateQuantity(id)}
      >
        <UpgradeIcon className="m-auto" />
      </div>
    </div>
  );
};

type BasicTableProps = {
  shopingCart: CartType | undefined;
};

const BasicTable = ({ shopingCart }: BasicTableProps) => {
  const axiosPrivate = useAxiosPrivate();
  const { handleSnackMessage } = useStateContext();
  const queryClient = useQueryClient();

  const { mutate: deleteCartItem } = useMutation({
    mutationFn: (id: number) => axiosPrivate.get(`/delete-item/${id}`),
    onSuccess: () => {
      handleSnackMessage("item has been deleted", "success");
      queryClient.invalidateQueries("shopingCart");
      queryClient.invalidateQueries("cartSize");
    },
    onError: () => {
      handleSnackMessage("delete operation failed unexpectedly", "error");
    },
  });

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
          {shopingCart?.order_product.map((cartProduct) => (
            <TableRow
              key={cartProduct.id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                <img
                  className=" w-40 h-40 object-cover object-center rounded-xl"
                  src={cartProduct.product.image}
                  alt={`${cartProduct.product.title}_thumbnail`}
                />
              </TableCell>
              <TableCell align="right">{cartProduct.product.title}</TableCell>
              <TableCell align="right">
                &#8358;{" "}
                <NumericFormat
                  value={cartProduct.product.price}
                  displayType="text"
                  thousandSeparator={true}
                  decimalScale={0}
                />
              </TableCell>
              <TableCell align="right">
                <QunatityInput
                  name={cartProduct.product.title}
                  value={cartProduct.quantity}
                  id={cartProduct.id}
                />
              </TableCell>
              <TableCell align="right">
                <div
                  className="flex items-center justify-center transition-all delay-75 text-pink-500 cursor-pointer hover:text-primary hover:scale-125"
                  onClick={() => deleteCartItem(cartProduct.id)}
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
};

export default BasicTable;
