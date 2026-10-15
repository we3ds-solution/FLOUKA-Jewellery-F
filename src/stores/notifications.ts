import { create } from 'zustand';
import { toast } from 'sonner';

export type Notification = { id: number; title: string; description: string | undefined; kind: 'success' | 'error' | 'info'; createdAt: number; read: boolean };
export const canShowNotifications = (hydrated: boolean, signedIn: boolean) => hydrated && signedIn;

type State = {
  items: Notification[];
  add(title: string, description: string | undefined, kind: Notification['kind']): void;
  readAll(): void;
  remove(id: number): void;
  clear(): void;
};

// Activity is intentionally session-only, like the uploaded demo account experience.
export const useNotifications = create<State>((set) => ({
  items: [],
  add: (title, description, kind) => set(s => ({ items: [{ id: (s.items[0]?.id ?? 0) + 1, title, description, kind, createdAt: Date.now(), read: false }, ...s.items] })),
  readAll: () => set(s => ({ items: s.items.map(item => ({ ...item, read: true })) })),
  remove: id => set(s => ({ items: s.items.filter(item => item.id !== id) })),
  clear: () => set({ items: [] }),
}));

export function notify(title: string, description?: string, kind: Notification['kind'] = 'success') {
  useNotifications.getState().add(title, description, kind);
  toast[kind](title, description ? { description } : {});
}