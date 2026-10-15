// SRP: demo-only fixtures for the browser demo account.
// Nothing here is sent to a server; the store decides when to use it.
import earrings from "@/assets/earrings.webp.asset.json";
import necklaces from "@/assets/necklaces.webp.asset.json";
import bracelets from "@/assets/bracelets.webp.asset.json";
import anklets from "@/assets/anklets.webp.asset.json";
import type { Address, Order, Profile } from "./account-types";

/** Demo-only account kept in this browser. Nothing is sent to a server. */
export const DEMO_EMAIL = "demo@floukaa.com";
export const DEMO_PASSWORD = "12345678";

export const demoAddresses: Address[] = [
  {
    id: "a1",
    label: "البيت",
    name: "سارة أحمد",
    phone: "01012345678",
    governorate: "القاهرة",
    city: "مدينة نصر",
    street: "15 شارع عباس العقاد، الدور 3",
    isDefault: true,
  },
  {
    id: "a2",
    label: "الشغل",
    name: "سارة أحمد",
    phone: "01012345678",
    governorate: "الجيزة",
    city: "الدقي",
    street: "22 شارع التحرير",
    isDefault: false,
  },
];
export const demoOrders: Order[] = [
  {
    id: "FL-10482",
    date: "2026-10-09",
    status: "shipped",
    shipping: 60,
    addressId: "a1",
    payment: "الدفع عند الاستلام",
    items: [
      { name: "حلق فضة دائري", image: earrings.url, qty: 1, price: 350 },
      { name: "سلسلة قلب ستانلس", image: necklaces.url, qty: 1, price: 420 },
    ],
  },
  {
    id: "FL-10311",
    date: "2026-09-21",
    status: "delivered",
    shipping: 60,
    addressId: "a1",
    payment: "بطاقة بنكية",
    items: [{ name: "انسيال خرز ملون", image: bracelets.url, qty: 2, price: 180 }],
  },
  {
    id: "FL-10107",
    date: "2026-08-30",
    status: "delivered",
    shipping: 0,
    addressId: "a2",
    payment: "فودافون كاش",
    items: [
      { name: "خلخال نجوم", image: anklets.url, qty: 1, price: 250 },
      { name: "حلق لؤلؤ صغير", image: earrings.url, qty: 1, price: 290 },
    ],
  },
  {
    id: "FL-09988",
    date: "2026-07-12",
    status: "cancelled",
    shipping: 60,
    addressId: "a1",
    payment: "الدفع عند الاستلام",
    items: [{ name: "سلسلة اسم مخصصة", image: necklaces.url, qty: 1, price: 550 }],
  },
];
export const demoProfile: Profile = {
  name: "سارة أحمد",
  email: DEMO_EMAIL,
  phone: "01012345678",
  birthday: "1998-04-12",
  password: DEMO_PASSWORD,
};
