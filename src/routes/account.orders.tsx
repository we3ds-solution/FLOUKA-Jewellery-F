import { meta } from "@/lib/seo";
import { createFileRoute, Link, Outlet, useMatch } from "@tanstack/react-router";
import { useState } from "react";
import { AccountSection, EmptyState, StatusBadge, formatDate } from "@/components/store/account-ui";
import { egp, orderTotal, statusLabel, useAccount, type OrderStatus } from "@/stores/account";

export const Route = createFileRoute("/account/orders")({ head: () => meta("طلباتي — Floukaa", "عرض ومتابعة طلبات فلوكة."), component: Orders });

const filters: ("all" | OrderStatus)[] = ["all", "processing", "shipped", "delivered", "cancelled"];

function Orders() {
  const child = useMatch({ from: "/account/orders/$id", shouldThrow: false });
  const orders = useAccount(s => s.orders);
  const [filter, setFilter] = useState<"all" | OrderStatus>("all");
  if (child) return <Outlet />;
  const list = filter === "all" ? orders : orders.filter(o => o.status === filter);
  return <AccountSection title="طلباتي" description="كل الطلبات اللي عملتيها وحالتها.">
    <div className="account-filters" role="tablist">{filters.map(f => <button key={f} type="button" role="tab" aria-selected={filter === f} data-active={filter === f} onClick={() => setFilter(f)}>{f === "all" ? "الكل" : statusLabel[f]}</button>)}</div>
    {list.length ? <ul className="grid gap-3">{list.map(o => <li key={o.id}>
      <Link to="/account/orders/$id" params={{ id: o.id }} className="order-row account-card">
        <div className="flex -space-x-3 space-x-reverse">{o.items.slice(0, 3).map((i, k) => <img key={k} src={i.image} alt="" className="order-thumb" />)}</div>
        <div className="min-w-0 flex-1"><b className="block">#{o.id}</b><span className="text-xs text-muted-foreground">{formatDate(o.date)} · {o.items.reduce((s, i) => s + i.qty, 0)} قطعة</span></div>
        <div className="grid justify-items-end gap-1"><StatusBadge status={o.status} /><b className="text-sm">{egp(orderTotal(o))}</b></div>
      </Link>
    </li>)}</ul> : <EmptyState title="مفيش طلبات هنا" text="جربي فلتر تاني أو ابدئي طلب جديد." to="/shop" cta="تسوقي دلوقتي" />}
  </AccountSection>;
}
