import { meta } from "@/lib/seo";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { AccountSection } from "@/components/store/account-ui";
import { LangToggle } from "@/components/store/lang-toggle";
import { ThemeToggle } from "@/components/store/theme-toggle";
import { useAccount, type Prefs } from "@/stores/account";
import { notify } from '@/stores/notifications';
import { useT } from '@/lib/i18n';

export const Route = createFileRoute("/account/settings")({ head: () => meta("الإعدادات — Floukaa", "إدارة تفضيلات حساب فلوكة."), component: SettingsPage });

const items: { key: keyof Prefs; title: string; text: string }[] = [
  { key: "orderUpdates", title: "تحديثات الطلبات", text: "رسالة لما طلبك يتشحن أو يوصل." },
  { key: "offers", title: "العروض والخصومات", text: "اعرفي أول بأول عن العروض الجديدة." },
  { key: "newsletter", title: "النشرة البريدية", text: "أحدث الكولكشنز مرة في الأسبوع." },
];

function SettingsPage() {
  const t = useT();
  const prefs = useAccount(s => s.prefs), setPrefs = useAccount(s => s.setPrefs), logout = useAccount(s => s.logout);
  const navigate = useNavigate();
  return <AccountSection title="الإعدادات" description="الإشعارات واللغة وشكل الموقع.">
    <div className="account-card grid gap-1">
      <h2 className="mb-2 font-black">الإشعارات</h2>
      {items.map(i => <label key={i.key} className="account-setting"><div><b className="block text-sm">{i.title}</b><span className="text-xs text-muted-foreground">{i.text}</span></div><Switch checked={prefs[i.key]} onCheckedChange={v => { setPrefs({ [i.key]: v }); notify(t('تم حفظ تفضيلات الإشعارات')); }} aria-label={i.title} /></label>)}
    </div>
    <div className="account-card grid gap-1">
      <h2 className="mb-2 font-black">العرض</h2>
      <div className="account-setting"><b className="text-sm">اللغة</b><LangToggle /></div>
      <div className="account-setting"><b className="text-sm">الوضع الليلي</b><ThemeToggle /></div>
    </div>
    <div className="account-card flex flex-wrap items-center justify-between gap-3">
      <div><b className="block text-sm">تسجيل الخروج</b><span className="text-xs text-muted-foreground">بياناتك هتفضل محفوظة على الجهاز ده.</span></div>
      <Button variant="destructive" onClick={() => { logout(); void navigate({ to: "/", replace: true }); }}>تسجيل الخروج</Button>
    </div>
  </AccountSection>;
}
