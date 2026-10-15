// SRP: notification activity state only — session-only by design
// (like the uploaded demo experience). No toast/UI imports here,
// so any layer can read activity without pulling in Sonner.
import { create } from "zustand";

export type Notification = {
  id: number;
  title: string;
  description: string | undefined;
  kind: "success" | "error" | "info";
  createdAt: number;
  read: boolean;
};
export const canShowNotifications = (hydrated: boolean, signedIn: boolean) => hydrated && signedIn;

type State = {
  items: Notification[];
  add(title: string, description: string | undefined, kind: Notification["kind"]): void;
  readAll(): void;
  remove(id: number): void;
  clear(): void;
};

// Activity is intentionally session-only, like the uploaded demo account experience.
export const useNotifications = create<State>((set) => ({
  items: [],
  add: (title, description, kind) =>
    set((s) => ({
      items: [
        {
          id: (s.items[0]?.id ?? 0) + 1,
          title,
          description,
          kind,
          createdAt: Date.now(),
          read: false,
        },
        ...s.items,
      ],
    })),
  readAll: () => set((s) => ({ items: s.items.map((item) => ({ ...item, read: true })) })),
  remove: (id) => set((s) => ({ items: s.items.filter((item) => item.id !== id) })),
  clear: () => set({ items: [] }),
}));
