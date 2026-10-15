import { meta } from "@/lib/seo";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check } from "lucide-react";
import { AccountSection, StatusBadge, formatDate } from "@/components/store/account-ui";
import { egp, orderTotal, useAccount } from "@/stores/account";

export const Route = createFileRoute("/account/orders/$id")({ head: () => meta("تفاصيل الطلب — Floukaa", "تفاصيل المنتجات والشحن وحالة طلب فلوكة."), component: OrderDetail });

const steps = [{ key: "processing", label: "تم استلام الطلب" }, { key: "shipped", label: "خرج للشحن" }, { key: "delivered", label: "تم التوصيل" }] as const;

function OrderDetail() {
  const { id } = Route.useParams();
  const order = useAccount(s => s.orders.find(o => o.id === id)), address = useAccount(s => s.addresses.find(a => a.id === order?.addressId));
  const back = <Link to="/account/orders" className="inline-flex items-center gap-1 text-sm font-bold text-accent"><ArrowRight className="size-4" />رجوع للطلبات</Link>;
  if (!order) return <AccountSection title="الطلب مش موجود" action={back}><p className="text-muted-foreground">مش لاقيين طلب بالرقم ده في حسابك.</p></AccountSection>;
  const subtotal = order.items.reduce((s, i) => s + i.qty * i.price, 0);
  const reached = order.status === "cancelled" ? -1 : steps.findIndex(s => s.key === order.status);
  return <AccountSection title={`طلب #${order.id}`} description={formatDate(order.date)} action={back}>
    <div className="account-card">
      <div className="account-card-head"><h2>حالة الطلب</h2><StatusBadge status={order.status} /></div>
      {order.status === "cancelled" ? <p className="text-sm text-muted-foreground">الطلب ده اتلغى.</p> :
        <ol className="order-timeline">{steps.map((s, i) => <li key={s.key} data-done={i <= reached}><span>{i <= reached && <Check className="size-3" />}</span>{s.label}</li>)}</ol>}
    </div>
    <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
      <div className="account-card"><h2 className="mb-3 font-black">المنتجات</h2>
        <ul className="grid gap-3">{order.items.map((i, k) => <li key={k} className="flex items-center gap-3"><img src={i.image} alt="" className="order-thumb order-thumb-lg" /><div className="flex-1"><b className="block text-sm">{i.name}</b><span className="text-xs text-muted-foreground">الكمية: {i.qty}</span></div><b className="text-sm">{egp(i.qty * i.price)}</b></li>)}</ul>
      </div>
      <div className="grid content-start gap-4">
        <div className="account-card text-sm"><h2 className="mb-3 font-black">ملخص الدفع</h2>
          <dl className="order-summary"><dt>المجموع</dt><dd>{egp(subtotal)}</dd><dt>الشحن</dt><dd>{order.shipping ? egp(order.shipping) : "مجاني"}</dd><dt className="font-black">الإجمالي</dt><dd className="font-black">{egp(orderTotal(order))}</dd><dt>طريقة الدفع</dt><dd>{order.payment}</dd></dl>
        </div>
        {address && <div className="account-card text-sm leading-7"><h2 className="mb-1 font-black">عنوان التوصيل</h2><p>{address.name}</p><p>{address.street}، {address.city}، {address.governorate}</p><p dir="ltr" className="text-end text-muted-foreground">{address.phone}</p></div>}
      </div>
    </div>
  </AccountSection>;
}
