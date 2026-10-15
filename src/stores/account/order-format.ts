// SRP: order presentation helpers. Pure — no store, no fixtures.
import type { Order, OrderStatus } from "./account-types";

export const statusLabel: Record<OrderStatus, string> = {
  processing: "قيد التجهيز",
  shipped: "تم الشحن",
  delivered: "تم التوصيل",
  cancelled: "ملغي",
};
export const orderTotal = (o: Order) =>
  o.items.reduce((s, i) => s + i.qty * i.price, 0) + o.shipping;
export const egp = (n: number) => `${n.toLocaleString("en-US")} EGP`;
