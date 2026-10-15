import { createFileRoute } from "@tanstack/react-router";
import { HelpLayout } from "@/components/store/help-page";
import { Link } from '@tanstack/react-router';
import { meta } from "@/lib/seo";
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Search, Plus, ArrowLeft, Package, Truck, Gem, RotateCcw } from 'lucide-react';
const categories = [{ id: 'all', title: 'كل الأسئلة', icon: Package }, { id: 'orders', title: 'الطلبات', icon: Package }, { id: 'delivery', title: 'التوصيل', icon: Truck }, { id: 'products', title: 'المنتجات', icon: Gem }, { id: 'returns', title: 'الاسترجاع', icon: RotateCcw }];
const items = [
  { id: 'place', category: 'orders', q: 'إزاي أعمل طلب من فلوكة؟', a: <>اختاري القطعة واللون أو المقاس المتاح، وأضيفيها لسلة التسوق. من السلة، انتقلي لإتمام الطلب على متجر فلوكة وأكملي بيانات التوصيل والدفع.</> },
  { id: 'track', category: 'orders', q: 'إزاي أتابع حالة طلبي؟', a: <>من <Link to="/order-tracking">صفحة تتبع الطلب</Link> اكتبي رقم الطلب والبريد الإلكتروني المستخدم وقت الشراء لعرض حالته لدى متجر فلوكة.</> },
  { id: 'number', category: 'orders', q: 'ألاقي رقم الطلب فين؟', a: <>رقم الطلب موجود في رسالة تأكيد الطلب المرسلة على بريدك الإلكتروني. راجعي الرسائل غير المرغوب فيها أيضًا، ولو مش لاقياه <Link to="/contact">تواصلي معنا</Link> ببيانات الشراء.</> },
  { id: 'change', category: 'orders', q: 'ممكن أعدل بيانات الطلب أو عنوان التوصيل؟', a: <>تواصلي مع الفريق برقم الطلب والتعديل المطلوب. إمكانية التعديل تعتمد على حالة تجهيز وشحن الطلب؛ الفريق هيأكد لكِ المتاح.</> },
  { id: 'shipping', category: 'delivery', q: 'إيه مدة وتكلفة التوصيل؟', a: <>التفاصيل بتختلف حسب عنوان التوصيل والطلب. راجعي التفاصيل عند إتمام الطلب، أو تواصلي معنا لتأكيد التكلفة والموعد الخاصين بطلبك.</> },
  { id: 'late', category: 'delivery', q: 'أعمل إيه لو طلبي اتأخر؟', a: <>راجعي حالة الطلب أولًا، ثم ابعتي رقم الطلب لفريق خدمة العملاء من صفحة التواصل علشان نراجع آخر تحديث معك.</> },
  { id: 'options', category: 'products', q: 'إزاي أختار اللون أو المقاس المناسب؟', a: <>راجعي صور القطعة ووصفها والاختيارات المتاحة في صفحة المنتج قبل الإضافة للسلة. لو محتاجة تفاصيل إضافية، ابعتي لنا اسم القطعة أو رابطها.</> },
  { id: 'care', category: 'products', q: 'إزاي أحافظ على الإكسسوارات؟', a: <>احتفظي بالقطع بشكل منفصل، وتجنبي تعريضها للعطور والمنظفات والرطوبة. طريقة العناية بتعتمد على خامة كل قطعة؛ اسألينا عن المنتج المحدد قبل استخدامه مع الماء.</> },
  { id: 'return', category: 'returns', q: 'إيه سياسة الاستبدال والاسترجاع؟', a: <>راجعي <Link to="/return-refund-policy">سياسة الإرجاع والاسترداد</Link> المنشورة، ثم تواصلي معنا برقم الطلب وتفاصيل القطعة قبل إرسال أي منتج للإرجاع.</> },
  { id: 'damaged', category: 'returns', q: 'أعمل إيه لو عندي مشكلة في القطعة؟', a: <>ابعتي لنا رقم الطلب ووصف المشكلة من صفحة التواصل. الفريق هيراجع التفاصيل معك وفقًا لسياسة الإرجاع والاسترداد.</> },
];
export const Route = createFileRoute("/faq")({ head: () => meta("الأسئلة الشائعة — Floukaa", "إجابات عن طلبات فلوكة والتوصيل والعناية بالإكسسوارات والإرجاع."), component: FaqPage });
function FaqPage() {
  const [category, setCategory] = useState('all'); const [search, setSearch] = useState(''); const [open, setOpen] = useState<string | null>('place');
  const shown = items.filter(item => (category === 'all' || item.category === category) && item.q.includes(search.trim()));
  return <HelpLayout title="الأسئلة الشائعة" intro="إجابات على أسئلتك، علشان تختاري وتتسوّقي بكل راحة."><div className="faq-search"><Search /><input aria-label="ابحثي في الأسئلة" placeholder="بتدوري على إجابة؟ اكتبي سؤالك هنا…" value={search} onChange={e => setSearch(e.target.value)} maxLength={200} /></div><div className="faq-columns"><nav className="faq-categories" aria-label="موضوعات الأسئلة">{categories.map(({ id, title, icon: Icon }) => <Button key={id} variant="faqCategory" aria-pressed={category === id} onClick={() => { setCategory(id); setOpen(null); }}><Icon /><span>{title}</span><ArrowLeft /></Button>)}</nav><div className="faq-list">{shown.map((item, index) => <section className="faq-item" key={item.id} data-open={open === item.id}><h2><Button variant="faqQuestion" aria-expanded={open === item.id} aria-controls={`answer-${item.id}`} id={`question-${item.id}`} onClick={() => setOpen(open === item.id ? null : item.id)}><span className="faq-number">{String(index + 1).padStart(2, '0')}</span><span>{item.q}</span><Plus /></Button></h2><div className="faq-answer" id={`answer-${item.id}`} role="region" aria-labelledby={`question-${item.id}`} inert={open !== item.id}><div><p>{item.a}</p></div></div></section>)}{!shown.length && <div className="faq-empty"><Search /><h2>مش لاقية سؤالك؟</h2><p>جربي كلمة مختلفة، أو ابعتي لنا استفسارك.</p><Button variant="outline" onClick={() => { setSearch(''); setCategory('all'); }}>عرض كل الأسئلة</Button></div>}</div></div></HelpLayout>;
}
