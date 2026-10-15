import { createFileRoute } from '@tanstack/react-router';
import { HelpLayout } from '@/components/store/help-page';
import { Button } from '@/components/ui/button';
import { meta } from '@/lib/seo';
import { Link } from '@tanstack/react-router';
import { useState, type FormEvent } from 'react';
import { useServerFn } from '@tanstack/react-start';
import { getTrackingToken } from '@/lib/support.functions';
import { trackingSchema } from '@/lib/contact-schema';
import { Package, Mail, Truck, MapPin, ArrowLeft, Loader2, ShieldCheck } from 'lucide-react';
export const Route = createFileRoute('/order-tracking')({ head: () => meta('تتبع الطلب — Floukaa', 'تابعي طلبك برقم الطلب والبريد الإلكتروني لدى متجر فلوكة.'), component: TrackingPage });
function TrackingPage() {
  const tokenFn = useServerFn(getTrackingToken); const [busy, setBusy] = useState(false); const [error, setError] = useState('');
  async function track(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const form = event.currentTarget;
    const parsed = trackingSchema.safeParse(Object.fromEntries(new FormData(form)));
    if (!parsed.success) { setError(parsed.error.issues[0]?.message ?? 'راجعي بيانات الطلب'); return; }
    setBusy(true); setError('');
    try { const { token } = await tokenFn(); const field = form.elements.namedItem('woocommerce-order-tracking-nonce'); if (!(field instanceof HTMLInputElement)) throw new Error(); field.value = token; form.submit(); }
    catch { setError('تعذر الاتصال بخدمة التتبع الآن. حاولي مرة أخرى أو تواصلي معنا.'); setBusy(false); }
  }
  return <HelpLayout title="تتبع طلبك" intro="قطعتك في الطريق لحكاية جديدة. تابعي آخر تحديث لطلبك بكل سهولة."><div className="support-columns tracking-columns"><aside className="support-aside"><div className="support-aside-heading"><Package /><h2>كل خطوة، أقرب ليكِ</h2></div><p>من اختيارك لحد وصول القطعة، دي مراحل رحلة الطلب.</p><ol className="tracking-steps"><li><span><Package /></span><div><h3>تأكيد الطلب</h3><p>تأكيد تفاصيل القطع وبياناتك.</p></div></li><li><span><Truck /></span><div><h3>التجهيز والشحن</h3><p>تجهيز الطلب وتسليمه للشحن.</p></div></li><li><span><MapPin /></span><div><h3>وصول الطلب</h3><p>استلام قطعك في عنوان التوصيل.</p></div></li></ol><small className="tracking-disclaimer">مراحل عامة للطلب، وليست الحالة الحالية لطلبك.</small></aside><section className="support-form-section"><div className="support-form-heading"><h2>بيانات طلبك</h2><Package /></div><p className="tracking-form-intro">استخدمي نفس البريد الإلكتروني اللي كتبتيه أثناء الشراء.</p><form className="support-form" method="post" action="https://floukaa.com/order-tracking/" onSubmit={track}><label>رقم الطلب <span>*</span><div className="support-input-icon"><Package /><input name="orderid" placeholder="رقم الطلب من رسالة التأكيد" maxLength={50} required /></div></label><label>البريد الإلكتروني للطلب <span>*</span><div className="support-input-icon"><Mail /><input name="order_email" type="email" dir="ltr" autoComplete="email" placeholder="you@example.com" maxLength={255} required /></div></label><input type="hidden" name="woocommerce-order-tracking-nonce" /><input type="hidden" name="_wp_http_referer" value="/order-tracking/" /><input type="hidden" name="track" value="تتبع الطلب" />{error && <p className="support-error" role="alert">{error}</p>}<Button variant="support" type="submit" disabled={busy}>{busy ? <><Loader2 className="support-spinner" /> جاري الاتصال</> : <>تتبع الطلب <ArrowLeft /></>}</Button><p className="tracking-security"><ShieldCheck /> تُعرض النتيجة بأمان على متجر floukaa.com.</p></form><div className="support-note"><h3>مش لاقية رقم الطلب؟</h3><p>راجعي رسالة تأكيد الطلب في بريدك، بما فيها الرسائل غير المرغوب فيها. أو <Link to="/contact">تواصلي معنا</Link> لمساعدتك.</p></div></section></div></HelpLayout>;
}