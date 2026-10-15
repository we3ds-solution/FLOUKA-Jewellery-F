// SRP: order-tracking token only — external fetch + nonce scrape.
import { createServerFn } from "@tanstack/react-start";

export const getTrackingToken = createServerFn({ method: "GET" }).handler(async () => {
  const response = await fetch("https://floukaa.com/order-tracking/", {
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) throw new Error("خدمة التتبع غير متاحة الآن. حاولي مرة أخرى.");
  const html = await response.text();
  const input = html.match(/<input[^>]*name=["']woocommerce-order-tracking-nonce["'][^>]*>/)?.[0];
  const token = input?.match(/value=["']([a-zA-Z0-9]+)["']/)?.[1];
  if (!token) throw new Error("تعذر بدء التتبع. تواصلي مع فريق فلوكة.");
  return { token };
});
