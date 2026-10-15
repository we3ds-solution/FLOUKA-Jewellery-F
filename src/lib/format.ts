// SRP: money presentation. Pure formatter — no fetching, no store.
export type Money = { amount: string; currencyCode: string };

export function formatCurrency(money: Money) {
  return `${Number(money.amount).toLocaleString("en-US")} ${money.currencyCode === "EGP" ? "EGP" : money.currencyCode}`;
}
