import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { LordIcon } from "@/components/store/lord-icon";
import { useAccount } from "@/stores/account";
import { meta } from "@/lib/seo";
import { AccountFrame } from '@/components/store/account-frame';

export const Route = createFileRoute("/account")({
  head: () => ({ ...meta("حسابي — Floukaa", "طلباتك وعناوينك وبياناتك في فلوكة."), meta: [...meta("حسابي — Floukaa", "طلباتك وعناوينك وبياناتك في فلوكة.").meta, { name: "robots", content: "noindex" }] }),
  component: AccountLayout,
});

function AccountLayout() {
  const hydrated = useAccount(s => s.hydrated), signedIn = useAccount(s => s.signedIn), profile = useAccount(s => s.profile);
  const setOpen = useAccount(s => s.setDialogOpen);
  useEffect(() => { if (hydrated && !signedIn) setOpen(true); }, [hydrated, signedIn, setOpen]);

  if (!hydrated) return <div className="account-page"><div className="account-skeleton" aria-busy="true" /></div>;
  if (!signedIn || !profile) return <div className="account-page">
    <div className="account-gate">
      <span className="account-avatar"><LordIcon name="user" size={24} /></span>
      <h1 className="text-2xl font-black">سجّلي دخولك الأول</h1>
      <p className="text-sm text-muted-foreground">علشان تشوفي طلباتك وعناوينك وبياناتك.</p>
      <Button onClick={() => setOpen(true)}>تسجيل الدخول</Button>
    </div>
  </div>;

  return <AccountFrame><Outlet /></AccountFrame>;
}
