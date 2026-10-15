import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import earrings from "@/assets/earrings.webp.asset.json";
import necklaces from "@/assets/necklaces.webp.asset.json";
import bracelets from "@/assets/bracelets.webp.asset.json";
import anklets from "@/assets/anklets.webp.asset.json";

/** Demo-only account kept in this browser. Nothing is sent to a server. */
export const DEMO_EMAIL = "demo@floukaa.com";
export const DEMO_PASSWORD = "12345678";

export type OrderStatus = "processing" | "shipped" | "delivered" | "cancelled";
export type OrderItem = { name: string; image: string; qty: number; price: number };
export type Order = { id: string; date: string; status: OrderStatus; items: OrderItem[]; shipping: number; addressId: string; payment: string };
export type Address = { id: string; label: string; name: string; phone: string; governorate: string; city: string; street: string; isDefault: boolean };
export type Profile = { name: string; email: string; phone: string; birthday: string; password: string };
export type Prefs = { offers: boolean; orderUpdates: boolean; newsletter: boolean };

export const statusLabel: Record<OrderStatus, string> = { processing: "قيد التجهيز", shipped: "تم الشحن", delivered: "تم التوصيل", cancelled: "ملغي" };
export const orderTotal = (o: Order) => o.items.reduce((s, i) => s + i.qty * i.price, 0) + o.shipping;
export const egp = (n: number) => `${n.toLocaleString("en-US")} EGP`;

const demoAddresses: Address[] = [
  { id: "a1", label: "البيت", name: "سارة أحمد", phone: "01012345678", governorate: "القاهرة", city: "مدينة نصر", street: "15 شارع عباس العقاد، الدور 3", isDefault: true },
  { id: "a2", label: "الشغل", name: "سارة أحمد", phone: "01012345678", governorate: "الجيزة", city: "الدقي", street: "22 شارع التحرير", isDefault: false },
];
const demoOrders: Order[] = [
  { id: "FL-10482", date: "2026-10-09", status: "shipped", shipping: 60, addressId: "a1", payment: "الدفع عند الاستلام", items: [{ name: "حلق فضة دائري", image: earrings.url, qty: 1, price: 350 }, { name: "سلسلة قلب ستانلس", image: necklaces.url, qty: 1, price: 420 }] },
  { id: "FL-10311", date: "2026-09-21", status: "delivered", shipping: 60, addressId: "a1", payment: "بطاقة بنكية", items: [{ name: "انسيال خرز ملون", image: bracelets.url, qty: 2, price: 180 }] },
  { id: "FL-10107", date: "2026-08-30", status: "delivered", shipping: 0, addressId: "a2", payment: "فودافون كاش", items: [{ name: "خلخال نجوم", image: anklets.url, qty: 1, price: 250 }, { name: "حلق لؤلؤ صغير", image: earrings.url, qty: 1, price: 290 }] },
  { id: "FL-09988", date: "2026-07-12", status: "cancelled", shipping: 60, addressId: "a1", payment: "الدفع عند الاستلام", items: [{ name: "سلسلة اسم مخصصة", image: necklaces.url, qty: 1, price: 550 }] },
];
const demoProfile: Profile = { name: "سارة أحمد", email: DEMO_EMAIL, phone: "01012345678", birthday: "1998-04-12", password: DEMO_PASSWORD };

type S = {
  hydrated: boolean;
  dialogOpen: boolean;
  signedIn: boolean;
  profile: Profile | null;
  orders: Order[];
  addresses: Address[];
  prefs: Prefs;
  setDialogOpen(open: boolean): void;
  login(email: string, password: string): boolean;
  register(name: string, email: string, password: string): void;
  logout(): void;
  updateProfile(p: Partial<Omit<Profile, "password">>): void;
  changePassword(current: string, next: string): boolean;
  saveAddress(a: Address): void;
  removeAddress(id: string): void;
  setDefaultAddress(id: string): void;
  setPrefs(p: Partial<Prefs>): void;
};

export const useAccount = create<S>()(persist((set, get) => ({
  hydrated: false, dialogOpen: false, signedIn: false, profile: null, orders: [], addresses: [],
  prefs: { offers: true, orderUpdates: true, newsletter: false },
  setDialogOpen: dialogOpen => set({ dialogOpen }),
  login: (email, password) => {
    const e = email.trim().toLowerCase(), saved = get().profile;
    if (saved && saved.email.toLowerCase() === e && saved.password === password) { set({ signedIn: true }); return true; }
    if (e === DEMO_EMAIL && password === DEMO_PASSWORD) { set({ signedIn: true, profile: demoProfile, orders: demoOrders, addresses: demoAddresses }); return true; }
    return false;
  },
  register: (name, email, password) => set({ signedIn: true, profile: { name: name.trim(), email: email.trim(), phone: "", birthday: "", password }, orders: [], addresses: [] }),
  logout: () => set({ signedIn: false }),
  updateProfile: p => { const cur = get().profile; if (cur) set({ profile: { ...cur, ...p } }); },
  changePassword: (current, next) => { const cur = get().profile; if (!cur || cur.password !== current) return false; set({ profile: { ...cur, password: next } }); return true; },
  saveAddress: a => {
    let list = get().addresses.some(x => x.id === a.id) ? get().addresses.map(x => x.id === a.id ? a : x) : [...get().addresses, a];
    if (a.isDefault || list.length === 1) list = list.map(x => ({ ...x, isDefault: x.id === a.id }));
    set({ addresses: list });
  },
  removeAddress: id => { let list = get().addresses.filter(x => x.id !== id); if (list.length && !list.some(x => x.isDefault)) list = list.map((x, i) => ({ ...x, isDefault: i === 0 })); set({ addresses: list }); },
  setDefaultAddress: id => set({ addresses: get().addresses.map(x => ({ ...x, isDefault: x.id === id })) }),
  setPrefs: p => set({ prefs: { ...get().prefs, ...p } }),
}), {
  name: "floukaa-account",
  storage: createJSONStorage(() => localStorage),
  skipHydration: true,
  partialize: s => ({ signedIn: s.signedIn, profile: s.profile, orders: s.orders, addresses: s.addresses, prefs: s.prefs }) as S,
  onRehydrateStorage: () => () => useAccount.setState({ hydrated: true }),
}));
