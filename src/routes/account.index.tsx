import { meta } from "@/lib/seo";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, MapPin, Package, Sparkles } from "lucide-react";
import { AccountSection, EmptyState, StatusBadge, formatDate } from "@/components/store/account-ui";
import { egp, orderTotal, useAccount } from "@/stores/account";
import { useWishlist } from "@/stores/wishlist";

export const Route = createFileRoute("/account/")({ head: () => meta("نظرة عامة على حسابي — Floukaa", "ملخص الطلبات والعناوين والمفضلة في فلوكة."), component: Overview });

function Overview() {
  const profile = useAccount(s => s.profile)!, orders = useAccount(s => s.orders), addresses = useAccount(s => s.addresses);
  const wish = useWishlist(s => s.items.length);
  const spent = orders.filter(o => o.status !== "cancelled").reduce((s, o) => s + orderTotal(o), 0);
  const points = Math.floor(spent / 10);
  const latest = orders[0], home = addresses.find(a => a.isDefault);
  const stats = [
    { label: "الطلبات", value: orders.length, icon: Package },
    { label: "المفضلة", value: wish, icon: Heart },
    { label: "العناوين", value: addresses.length, icon: MapPin },
    { label: "نقاط فلوكة", value: points, icon: Sparkles },
  ];
  return <AccountSection title={`أهلًا يا ${profile.name.split(" ")[0]} 👋`} description="من هنا تقدري تتابعي طلباتك وتعدّلي بياناتك.">
    <div className="account-stats">{stats.map(s => <div key={s.label} className="account-stat"><s.icon className="size-5 text-accent" /><b>{s.value}</b><span>{s.label}</span></div>)}</div>
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="account-card">
        <div className="account-card-head"><h2>آخر طلب</h2><Link to="/account/orders">كل الطلبات</Link></div>
        {latest ? <Link to="/account/orders/$id" params={{ id: latest.id }} className="order-row">
          <img src={latest.items[0]?.image} alt="" className="order-thumb" />
          <div className="min-w-0 flex-1"><b className="block">#{latest.id}</b><span className="text-xs text-muted-foreground">{formatDate(latest.date)} · {egp(orderTotal(latest))}</span></div>
          <StatusBadge status={latest.status} />
        </Link> : <EmptyState title="لسه مفيش طلبات" text="أول طلب ليكي هيظهر هنا." to="/shop" cta="ابدئي التسوق" />}
      </div>
      <div className="account-card">
        <div className="account-card-head"><h2>عنوان التوصيل الأساسي</h2><Link to="/account/addresses">إدارة العناوين</Link></div>
        {home ? <div className="text-sm leading-7"><b>{home.label}</b><p>{home.street}، {home.city}، {home.governorate}</p><p className="text-muted-foreground" dir="ltr">{home.phone}</p></div>
          : <EmptyState title="مفيش عنوان محفوظ" text="ضيفي عنوانك علشان الطلب يوصل أسرع." to="/account/addresses" cta="إضافة عنوان" />}
      </div>
    </div>
  </AccountSection>;
}
