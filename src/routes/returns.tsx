import { createFileRoute } from "@tanstack/react-router";
import { PolicyPage } from "@/components/store/help-page";
import { meta } from "@/lib/seo";
export const Route = createFileRoute("/returns")({ head: () => meta("الاستبدال والاسترجاع — Floukaa", "سياسة الاستبدال والاسترجاع في فلوكة."), component: () => <PolicyPage policy="return-refund-policy" /> });
