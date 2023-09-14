export type AuthType = {
  access: string;
  refresh: string;
};

export type severityType = "success" | "error" | "warning";

export type snackMessageType = {
  message: string;
  severity: severityType;
};

export type AccountInfoType = {
  username: string;
  id: number;
};

export type ProductType = {
  id: number;
  title: string;
  category: CategoryType[];
  description: string;
  popularity: number;
  rating: number;
  image: string;
  price: number;
};

export type CategoryType = {
  id: number;
  name: string;
};

export type CartItemType = {
  id : number;
  user: AccountInfoType;
  product: ProductType;
  quantity: number;
  is_ordered: boolean;
};

export type CartType = {
  name: string;
  order_product: CartItemType[];
  timestamp: string;
  delivery_fee: number;
  is_ordered: boolean;
  status: string;
  is_paid: boolean;
  shipping_address: {address : string};
  get_summed_price: number;
  get_total_price: number;
  get_summed_coupon : number;
};


export type CoupnType = {
  coupon_name : string;
  coupon_code : string;
  discount : number
}