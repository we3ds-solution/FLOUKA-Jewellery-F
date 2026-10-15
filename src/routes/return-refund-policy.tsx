import { createFileRoute } from '@tanstack/react-router';
import { PolicyPage } from '@/components/store/help-page';
import { meta } from '@/lib/seo';
export const Route = createFileRoute('/return-refund-policy')({ head: () => meta('سياسة الإرجاع والاسترداد — Floukaa', 'سياسة فلوكة المنشورة للإرجاع والاسترداد وتكاليف إعادة الشحن.'), component: () => <PolicyPage policy="return-refund-policy" /> });