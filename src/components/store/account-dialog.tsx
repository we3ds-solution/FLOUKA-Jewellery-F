import { useState, type FormEvent } from 'react';
import { useNavigate, useRouterState } from '@tanstack/react-router';
import { Eye, EyeOff } from 'lucide-react';
import { LordIcon } from '@/components/store/lord-icon';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DEMO_EMAIL, DEMO_PASSWORD, useAccount } from '@/stores/account';
import { notify } from '@/stores/notifications';
import { useT } from '@/lib/i18n';

export function AccountDialog() {
  const t = useT();
  const open = useAccount(s => s.dialogOpen), setOpen = useAccount(s => s.setDialogOpen);
  const login = useAccount(s => s.login), register = useAccount(s => s.register);
  const navigate = useNavigate(), path = useRouterState({ select: s => s.location.pathname });
  const [mode, setMode] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState(''), [password, setPassword] = useState('');
  const isRegister = mode === 'register';
  function done() { setOpen(false); setError(''); setPassword(''); notify(t(isRegister ? 'تم إنشاء حسابك' : 'تم تسجيل الدخول'), t('أهلًا بيكي في فلوكة')); if (!path.startsWith('/account')) void navigate({ to: '/account' }); }
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isRegister) { const name = String(new FormData(event.currentTarget).get('name') ?? ''); register(name, email, password); return done(); }
    if (login(email, password)) return done();
    setError('البريد الإلكتروني أو كلمة المرور غير صحيحة.');
  }
  function fillDemo() { setMode('login'); setEmail(DEMO_EMAIL); setPassword(DEMO_PASSWORD); setError(''); }
  return <Dialog open={open} onOpenChange={(next) => { setOpen(next); setError(''); }}>
    <DialogContent className="account-dialog">
      <div className="account-brand"><span className="account-avatar"><LordIcon name="user" size={24} /></span><b className="text-xl font-black">FLOUKAA</b><span className="text-xs font-bold text-accent">فلوكة للإكسسوارات والهدايا</span></div>
      <DialogTitle className="text-center text-2xl font-black">{isRegister ? 'انضمي لعيلة فلوكة' : 'أهلًا بيكي من جديد'}</DialogTitle>
      <DialogDescription className="text-center">{isRegister ? 'إنشاء حساب جديد' : 'تسجيل الدخول لحسابك'}</DialogDescription>
      <Tabs value={mode} onValueChange={(value) => { setMode(value); setError(''); }}>
        <TabsList className="grid w-full grid-cols-2"><TabsTrigger value="login">تسجيل الدخول</TabsTrigger><TabsTrigger value="register">إنشاء حساب</TabsTrigger></TabsList>
      </Tabs>
      <form onSubmit={submit} className="grid gap-4" key={mode}>
        {isRegister && <label className="grid gap-2 text-sm font-bold" htmlFor="account-name">الاسم<Input id="account-name" name="name" autoComplete="name" placeholder="اسمك" required /></label>}
        <label className="grid gap-2 text-sm font-bold" htmlFor="account-email">البريد الإلكتروني<Input id="account-email" type="email" dir="ltr" autoComplete="email" placeholder="name@example.com" required value={email} onChange={e => setEmail(e.target.value)} /></label>
        <label className="grid gap-2 text-sm font-bold" htmlFor="account-password">كلمة المرور<span className="relative"><Input id="account-password" type={showPassword ? 'text' : 'password'} autoComplete={isRegister ? 'new-password' : 'current-password'} minLength={8} required className="pe-12" value={password} onChange={e => setPassword(e.target.value)} /><Button type="button" size="icon" variant="ghost" className="absolute end-0 top-0 size-9" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}>{showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}</Button></span></label>
        {error && <p role="alert" className="text-center text-sm font-bold text-destructive">{error}</p>}
        <Button type="submit" className="w-full">{isRegister ? 'إنشاء حساب' : 'تسجيل الدخول'}</Button>
        <div className="account-demo-hint">
          <p>حساب تجريبي: <span dir="ltr">{DEMO_EMAIL}</span> / <span dir="ltr">{DEMO_PASSWORD}</span></p>
          <Button type="button" variant="outline" size="sm" onClick={fillDemo}>استخدمي الحساب التجريبي</Button>
        </div>
        <p className="text-center text-xs text-muted-foreground">نسخة تجريبية: بياناتك محفوظة على الجهاز ده بس.</p>
      </form>
    </DialogContent>
  </Dialog>;
}
