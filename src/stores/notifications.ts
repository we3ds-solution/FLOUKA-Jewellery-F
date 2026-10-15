// Barrel: preserves the `@/stores/notifications` import surface.
// State stays session-only and UI-free in notification-state;
// the shared Sonner helper lives in notify-adapter.
export { canShowNotifications, useNotifications } from "./notification-state";
export type { Notification } from "./notification-state";
export { notify } from "./notify-adapter";
