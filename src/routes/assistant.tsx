import { createFileRoute } from '@tanstack/react-router';
import { meta } from '@/lib/seo';
import { HelpLayout } from '@/components/store/help-page';
export const Route = createFileRoute('/assistant')({ head: () => meta('مساعدة التسوق — Floukaa', 'مساعدة التسوق في فلوكة.'), component: AssistantPage });
function AssistantPage() { return <HelpLayout title="مساعدة التسوق" intro="محتاجة مساعدة في اختيار قطعة أو الاستفسار عن طلبك؟"><div className="support-prose"><p>فريق فلوكة جاهز يساعدك تختاري القطعة المناسبة أو تتابعي طلبك. تواصلي معانا بالطريقة اللي تريحك.</p></div></HelpLayout>; }