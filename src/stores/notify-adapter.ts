// SRP: notification side-effect adapter — the single place that couples
// activity state with the Sonner toast UI. Account actions and other
// callers use this shared helper instead of touching toast directly.
import { toast } from "sonner";
import { useNotifications, type Notification } from "./notification-state";

export function notify(
  title: string,
  description?: string,
  kind: Notification["kind"] = "success",
) {
  useNotifications.getState().add(title, description, kind);
  toast[kind](title, description ? { description } : {});
}
