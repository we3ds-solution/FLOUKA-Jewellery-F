import { meta } from "@/lib/seo";
import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDir } from "@/lib/i18n";
import { AccountSection } from "@/components/store/account-ui";
import { useAccount, type Address } from "@/stores/account";

export const Route = createFileRoute("/account/addresses")({ head: () => meta("العناوين — Floukaa", "إدارة عناوين توصيل طلبات فلوكة."), component: Addresses });

const governorates = ["القاهرة", "الجيزة", "الإسكندرية", "القليوبية", "الشرقية", "الدقهلية", "الغربية", "المنوفية", "البحيرة", "بورسعيد", "السويس", "الإسماعيلية", "دمياط", "أسيوط", "سوهاج", "المنيا", "قنا", "الأقصر", "أسوان"];

function Addresses() {
  const list = useAccount(s => s.addresses), save = useAccount(s => s.saveAddress), remove = useAccount(s => s.removeAddress), setDefault = useAccount(s => s.setDefaultAddress);
  const profile = useAccount(s => s.profile);
  const [editing, setEditing] = useState<Address | null>(null);
  const dir = useDir();
  const blank = (): Address => ({ id: crypto.randomUUID(), label: "", name: profile?.name ?? "", phone: profile?.phone ?? "", governorate: "القاهرة", city: "", street: "", isDefault: list.length === 0 });
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); if (!editing) return;
    const f = new FormData(e.currentTarget), v = (k: string) => String(f.get(k) ?? "").trim();
    save({ ...editing, label: v("label") || "عنوان", name: v("name"), phone: v("phone"), governorate: v("governorate"), city: v("city"), street: v("street"), isDefault: f.get("isDefault") === "on" || editing.isDefault });
    setEditing(null);
  }
  return <AccountSection title="العناوين" description="عناوين التوصيل المحفوظة." action={<Button onClick={() => setEditing(blank())}><Plus className="size-4" />إضافة عنوان</Button>}>
    {list.length ? <div className="grid gap-4 md:grid-cols-2">{list.map(a => <div key={a.id} className="account-card text-sm leading-7" data-default={a.isDefault}>
      <div className="account-card-head"><h2>{a.label}</h2>{a.isDefault && <span className="order-status" data-status="delivered">الأساسي</span>}</div>
      <p className="font-bold">{a.name}</p><p>{a.street}</p><p>{a.city}، {a.governorate}</p><p dir="ltr" className="text-end text-muted-foreground">{a.phone}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <Button size="sm" variant="outline" onClick={() => setEditing(a)}><Pencil className="size-3.5" />تعديل</Button>
        {!a.isDefault && <Button size="sm" variant="ghost" onClick={() => setDefault(a.id)}>اجعليه الأساسي</Button>}
        <Button size="sm" variant="ghost" className="text-destructive" onClick={() => remove(a.id)} aria-label={`حذف ${a.label}`}><Trash2 className="size-3.5" />حذف</Button>
      </div>
    </div>)}</div> : <div className="account-empty"><b className="text-lg font-black">مفيش عناوين محفوظة</b><p className="text-sm text-muted-foreground">ضيفي أول عنوان ليكي.</p></div>}
    <Dialog open={!!editing} onOpenChange={o => !o && setEditing(null)}>
      <DialogContent className="account-dialog" dir={dir}>
        <DialogTitle className="text-xl font-black">{editing && list.some(a => a.id === editing.id) ? "تعديل العنوان" : "عنوان جديد"}</DialogTitle>
        <DialogDescription>هنستخدم العنوان ده لتوصيل طلباتك.</DialogDescription>
        {editing && <form onSubmit={submit} className="grid gap-3">
          <label className="account-field">اسم العنوان<Input name="label" defaultValue={editing.label} placeholder="البيت، الشغل..." /></label>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="account-field">الاسم بالكامل<Input name="name" defaultValue={editing.name} required /></label>
            <label className="account-field">رقم الموبايل<Input name="phone" type="tel" dir="ltr" pattern="01[0-9]{9}" title="رقم موبايل مصري من 11 رقم" defaultValue={editing.phone} required /></label>
            <label className="account-field">المحافظة<Select name="governorate" defaultValue={editing.governorate || governorates[0]!}><SelectTrigger aria-label="المحافظة"><SelectValue /></SelectTrigger><SelectContent>{governorates.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent></Select></label>
            <label className="account-field">المدينة / المنطقة<Input name="city" defaultValue={editing.city} required /></label>
          </div>
          <label className="account-field">العنوان بالتفصيل<Input name="street" defaultValue={editing.street} placeholder="الشارع، رقم العمارة، الدور" required /></label>
          <label className="flex items-center gap-2 text-sm font-bold"><Checkbox name="isDefault" defaultChecked={editing.isDefault} />عنوان أساسي</label>
          <Button type="submit">حفظ العنوان</Button>
        </form>}
      </DialogContent>
    </Dialog>
  </AccountSection>;
}
