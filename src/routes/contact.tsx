import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createFileRoute } from "@tanstack/react-router";
import { HelpLayout } from "@/components/store/help-page";
import { Mail, MapPin, Phone, ArrowLeft, CheckCircle2, Loader2, MessageCircle } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { useServerFn } from '@tanstack/react-start';
import { contactSchema } from '@/lib/contact-schema';
import { submitContact } from '@/lib/support.functions';
import { Button } from '@/components/ui/button';
import { meta } from "@/lib/seo";
export const Route = createFileRoute("/contact")({ head: () => meta("تواصل معنا — Floukaa", "تواصلي مع فريق فلوكة في بورسعيد عبر الهاتف أو البريد الإلكتروني."), component: ContactPage });
export function ContactPage() {
  const send = useServerFn(submitContact);
  const [state, setState] = useState<'idle' | 'sending' | 'success'>('idle');
  const [error, setError] = useState('');
  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsed = contactSchema.safeParse(Object.fromEntries(new FormData(event.currentTarget)));
    if (!parsed.success) { setError(parsed.error.issues[0]?.message ?? 'راجعي البيانات'); return; }
    setError(''); setState('sending');
    try { await send({ data: parsed.data }); setState('success'); }
    catch { setState('idle'); setError('تعذر إرسال رسالتك الآن. حاولي مرة أخرى أو اتصلي بنا.'); }
  }
  return <HelpLayout title="تواصل معنا" callout={{ title: "عايزة إجابة أسرع؟", text: "أغلب الأسئلة عن الطلبات والتوصيل والاسترجاع ليها إجابة جاهزة.", to: "/faq", action: "الأسئلة الشائعة" }} intro="كل سؤال يهمنا. سواء بتسألي عن قطعة، أو محتاجة مساعدة في طلبك، فريق فلوكة هنا علشانك."><div className="support-columns"><aside className="support-aside"><div className="support-aside-heading"><MessageCircle /><h2>خلّينا على تواصل</h2></div><p>اختاري الطريقة المناسبة ليكِ، ويسعدنا نسمع منك.</p><a className="support-contact" href="tel:+201017617122"><span className="support-icon"><Phone /></span><span><small>اتصلي بنا</small><b dir="ltr">+20 101 761 7122</b></span><ArrowLeft className="ltr:rotate-180" /></a><a className="support-contact" href="mailto:flouka.int@gmail.com"><span className="support-icon"><Mail /></span><span><small>البريد الإلكتروني</small><b dir="ltr">flouka.int@gmail.com</b></span><ArrowLeft className="ltr:rotate-180" /></a><div className="support-contact"><span className="support-icon"><MapPin /></span><span><small>من قلب بورسعيد</small><b>متجر إلكتروني · مصر</b></span></div><div className="support-note"><h3>عندك سؤال عن طلبك؟</h3><p>اكتبي رقم الطلب في رسالتك علشان نقدر نساعدك بشكل أدق.</p></div></aside><section className="support-form-section">{state === 'success' ? <div className="support-success" role="status"><CheckCircle2 /><h2>وصلتنا رسالتك</h2><p>شكرًا لتواصلك مع فلوكة. تم حفظ رسالتك لفريق خدمة العملاء.</p><Button variant="support" onClick={() => setState('idle')}>إرسال رسالة أخرى <ArrowLeft className="ltr:rotate-180" /></Button></div> : <><div className="support-form-heading"><h2>ابعتي لنا رسالة</h2><span>يسعدنا نساعدك</span></div><form className="support-form" onSubmit={onSubmit}><div className="support-field-row"><label>الاسم الكامل <span>*</span><Input name="name" autoComplete="name" placeholder="اسمك الكامل" maxLength={100} required /></label><label>البريد الإلكتروني <span>*</span><Input name="email" type="email" dir="ltr" autoComplete="email" placeholder="you@example.com" maxLength={255} required /></label></div><div className="support-field-row"><label>رقم الهاتف <small>(اختياري)</small><Input name="phone" type="tel" dir="ltr" autoComplete="tel" placeholder="01xxxxxxxxx" maxLength={30} /></label><label>موضوع الرسالة <span>*</span><Select name="topic" defaultValue="order"><SelectTrigger aria-label="موضوع الرسالة"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="order">استفسار عن طلب</SelectItem><SelectItem value="product">سؤال عن منتج</SelectItem><SelectItem value="returns">استبدال أو استرجاع</SelectItem><SelectItem value="other">استفسار آخر</SelectItem></SelectContent></Select></label></div><label>رقم الطلب <small>(اختياري)</small><Input name="order_number" placeholder="مثال: 12345" maxLength={50} /></label><label>رسالتك <span>*</span><Textarea name="message" placeholder="قولي لنا إزاي نقدر نساعدك…" minLength={10} maxLength={3000} rows={5} required /></label><div className="support-honeypot" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>{error && <p className="support-error" role="alert">{error}</p>}<div className="support-form-bottom"><Button variant="support" type="submit" disabled={state === 'sending'}>{state === 'sending' ? <><Loader2 className="support-spinner" /> جاري الإرسال</> : <>إرسال الرسالة <ArrowLeft className="ltr:rotate-180" /></>}</Button><span>بياناتك محفوظة ولا تُعرض للزوار.</span></div></form></>}</section></div></HelpLayout>;
}
