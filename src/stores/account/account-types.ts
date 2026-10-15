// SRP: account domain shapes only. No fixtures, no formatting, no store.
export type OrderStatus = "processing" | "shipped" | "delivered" | "cancelled";
export type OrderItem = { name: string; image: string; qty: number; price: number };
export type Order = {
  id: string;
  date: string;
  status: OrderStatus;
  items: OrderItem[];
  shipping: number;
  addressId: string;
  payment: string;
};
export type Address = {
  id: string;
  label: string;
  name: string;
  phone: string;
  governorate: string;
  city: string;
  street: string;
  isDefault: boolean;
};
export type Profile = {
  name: string;
  email: string;
  phone: string;
  birthday: string;
  password: string;
};
export type Prefs = { offers: boolean; orderUpdates: boolean; newsletter: boolean };
