import { meta } from "@/lib/seo";
import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/ui/date-picker";
import { AccountSection, FormStatus, formText } from "@/components/store/account-ui";
import { useAccount } from "@/stores/account";
import { notify } from '@/stores/notifications';
import { useT } from '@/lib/i18n';

export const Route = createFileRoute("/account/details")({ head: () => meta("بيانات الحساب — Floukaa", "تحديث بيانات التواصل وتاريخ الميلاد في حساب فلوكة."), component: Details });

function Details() {
  const t = useT();
  const profile = useAccount(s => s.profile), update = useAccount(s => s.updateProfile), changePassword = useAccount(s => s.changePassword);
  const [saved, setSaved] = useState(false), [pw, setPw] = useState<{ ok: boolean; text: string } | null>(null);
  function saveInfo(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); const form = e.currentTarget;
    update({ name: formText(form, "name"), email: formText(form, "email"), phone: formText(form, "phone"), birthday: formText(form, "birthday") }); setSaved(true); notify(t('تم حفظ بيانات الحساب'));
  }
  async function savePw(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); const form = e.currentTarget, f = new FormData(form), cur = String(f.get("current")), next = String(f.get("next")), confirm = String(f.get("confirm"));
    if (next !== confirm) return setPw({ ok: false, text: "كلمتين المرور الجداد مش زي بعض." });
    if (!(await changePassword(cur, next))) return setPw({ ok: false, text: "كلمة المرور الحالية غلط." });
    form.reset(); setPw({ ok: true, text: "تم تغيير كلمة المرور." }); notify(t('تم تغيير كلمة المرور'));
  }
  if (!profile) return null;
  return <AccountSection title="بيانات الحساب" description="عدّلي اسمك وطريقة التواصل معاكي.">
    <form onSubmit={saveInfo} onChange={() => setSaved(false)} className="account-card grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="account-field">الاسم<Input name="name" defaultValue={profile.name} required autoComplete="name" /></label>
        <label className="account-field">البريد الإلكتروني<Input name="email" type="email" dir="ltr" defaultValue={profile.email} required autoComplete="email" /></label>
        <label className="account-field">رقم الموبايل<Input name="phone" type="tel" dir="ltr" pattern="01[0-9]{9}" title="رقم موبايل مصري من 11 رقم" defaultValue={profile.phone} autoComplete="tel" /></label>
        <div className="account-field"><span>تاريخ الميلاد</span><DatePicker name="birthday" defaultValue={profile.birthday} placeholder="اختاري تاريخ ميلادك" onChange={() => setSaved(false)} /></div>
      </div>
      <div className="flex items-center gap-3"><Button type="submit">حفظ التغييرات</Button>{saved && <FormStatus ok text="اتحفظت ✓" />}</div>
    </form>
    <form onSubmit={savePw} className="account-card grid gap-4">
      <h2 className="font-black">تغيير كلمة المرور</h2>
      <div className="grid gap-4 sm:grid-cols-3">
        <label className="account-field">الحالية<Input name="current" type="password" required autoComplete="current-password" /></label>
        <label className="account-field">الجديدة<Input name="next" type="password" minLength={8} required autoComplete="new-password" /></label>
        <label className="account-field">تأكيد الجديدة<Input name="confirm" type="password" minLength={8} required autoComplete="new-password" /></label>
      </div>
      <div className="flex items-center gap-3"><Button type="submit" variant="outline">تحديث كلمة المرور</Button>{pw && <FormStatus ok={pw.ok} text={pw.text} />}</div>
    </form>
  </AccountSection>;
}
