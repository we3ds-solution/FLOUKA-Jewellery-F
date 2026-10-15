// Barrel: preserves the `@/stores/account` import surface.
export { DEMO_EMAIL, DEMO_PASSWORD } from "./account/demo-account";
export type {
  Address,
  Order,
  OrderItem,
  OrderStatus,
  Prefs,
  Profile,
} from "./account/account-types";
export { egp, orderTotal, statusLabel } from "./account/order-format";
export { useAccount } from "./account/account-store";
