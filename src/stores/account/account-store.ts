// SRP: account state + persistence only. Types live in account-types,
// demo fixtures in demo-account, presentation in order-format.
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Address, Order, Prefs, Profile } from "./account-types";
import { DEMO_EMAIL, DEMO_PASSWORD, demoAddresses, demoOrders, demoProfile } from "./demo-account";

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

export const useAccount = create<S>()(
  persist(
    (set, get) => ({
      hydrated: false,
      dialogOpen: false,
      signedIn: false,
      profile: null,
      orders: [],
      addresses: [],
      prefs: { offers: true, orderUpdates: true, newsletter: false },
      setDialogOpen: (dialogOpen) => set({ dialogOpen }),
      login: (email, password) => {
        const e = email.trim().toLowerCase(),
          saved = get().profile;
        if (saved && saved.email.toLowerCase() === e && saved.password === password) {
          set({ signedIn: true });
          return true;
        }
        if (e === DEMO_EMAIL && password === DEMO_PASSWORD) {
          set({
            signedIn: true,
            profile: demoProfile,
            orders: demoOrders,
            addresses: demoAddresses,
          });
          return true;
        }
        return false;
      },
      register: (name, email, password) =>
        set({
          signedIn: true,
          profile: { name: name.trim(), email: email.trim(), phone: "", birthday: "", password },
          orders: [],
          addresses: [],
        }),
      logout: () => set({ signedIn: false }),
      updateProfile: (p) => {
        const cur = get().profile;
        if (cur) set({ profile: { ...cur, ...p } });
      },
      changePassword: (current, next) => {
        const cur = get().profile;
        if (!cur || cur.password !== current) return false;
        set({ profile: { ...cur, password: next } });
        return true;
      },
      saveAddress: (a) => {
        let list = get().addresses.some((x) => x.id === a.id)
          ? get().addresses.map((x) => (x.id === a.id ? a : x))
          : [...get().addresses, a];
        if (a.isDefault || list.length === 1)
          list = list.map((x) => ({ ...x, isDefault: x.id === a.id }));
        set({ addresses: list });
      },
      removeAddress: (id) => {
        let list = get().addresses.filter((x) => x.id !== id);
        if (list.length && !list.some((x) => x.isDefault))
          list = list.map((x, i) => ({ ...x, isDefault: i === 0 }));
        set({ addresses: list });
      },
      setDefaultAddress: (id) =>
        set({ addresses: get().addresses.map((x) => ({ ...x, isDefault: x.id === id })) }),
      setPrefs: (p) => set({ prefs: { ...get().prefs, ...p } }),
    }),
    {
      name: "floukaa-account",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      partialize: (s) =>
        ({
          signedIn: s.signedIn,
          profile: s.profile,
          orders: s.orders,
          addresses: s.addresses,
          prefs: s.prefs,
        }) as S,
      onRehydrateStorage: () => () => useAccount.setState({ hydrated: true }),
    },
  ),
);
