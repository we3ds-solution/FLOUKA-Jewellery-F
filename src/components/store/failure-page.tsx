import { Link, useRouter, type ErrorComponentProps } from '@tanstack/react-router';
import { useEffect } from 'react';
import { Home, Search, RotateCcw, ShoppingBag, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { reportLovableError } from '@/lib/lovable-error-reporting';
import { useLang } from '@/lib/i18n';

export function FailurePage({ kind = 'missing', retry }: { kind?: 'missing' | 'error'; retry?: () => void }) {
  const english = useLang(s => s.lang) === 'en';
  const failed = kind === 'error';
  const text = (ar: string, en: string) => english ? en : ar;
  return <section className="failure-page" aria-labelledby="failure-title" role={failed ? 'alert' : undefined}>
    <Link to="/" className="failure-brand">FLOUKAA</Link>
    <div className="failure-art" aria-hidden="true"><span className="failure-code">{failed ? '!' : '404'}</span>{failed ? <WifiOff /> : <ShoppingBag />}</div>
    <p className="failure-eyebrow">{text('تفاصيل صغيرة، فرحة كبيرة', 'Small details, big joy')}</p>
    <h1 id="failure-title">{failed ? text('الصفحة ما قدرتش تفتح', 'This page couldn’t load') : text('الصفحة دي مش موجودة', 'This page isn’t here')}</h1>
    <p className="failure-copy">{failed ? text('حصلت مشكلة أثناء تحميل الصفحة. جربي مرة تانية، أو ارجعي تتصفحي فلوكة.', 'Something interrupted loading. Try again, or return to Floukaa.') : text('يمكن الرابط اتغيّر أو القطعة مش متاحة دلوقتي. لسه في حاجات حلوة مستنياكي.', 'The link may have changed or the item may no longer be available. There’s still plenty to discover.')}</p>
    <div className="failure-actions">{failed && retry && <Button onClick={retry}><RotateCcw />{text('حاولي تاني', 'Try again')}</Button>}<Button asChild variant={failed ? 'outline' : 'default'}><Link to="/shop"><ShoppingBag />{text('تصفحي المتجر', 'Browse the shop')}</Link></Button><Button asChild variant="outline"><Link to="/"><Home />{text('الرئيسية', 'Home')}</Link></Button></div>
    {!failed && <Link to="/search" search={{ q: '' }} className="failure-search"><Search />{text('دوري على قطعتك المفضلة', 'Find your favorite piece')}</Link>}
    <Link to="/contact" className="failure-contact">{text('محتاجة مساعدة؟ تواصلي معانا', 'Need a hand? Contact us')}</Link>
  </section>;
}

export function NotFoundPage() { return <FailurePage />; }
export function RouteErrorPage({ error, reset }: ErrorComponentProps) {
  const router = useRouter();
  useEffect(() => { reportLovableError(error, { boundary: 'floukaa_route' }); }, [error]);
  return <FailurePage kind="error" retry={() => { void router.invalidate().then(reset); }} />;
}