import { createFileRoute } from '@tanstack/react-router';
import { PolicyPage } from '@/components/store/help-page';
import { meta } from '@/lib/seo';
export const Route = createFileRoute('/privacy-policy')({ head: () => meta('سياسة الخصوصية — Floukaa', 'كيف تتعامل فلوكة مع بياناتك الشخصية وملفات تعريف الارتباط.'), component: () => <PolicyPage policy="privacy-policy" /> });