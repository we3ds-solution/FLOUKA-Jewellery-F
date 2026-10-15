import { createFileRoute } from '@tanstack/react-router';
import { PolicyPage } from '@/components/store/help-page';
import { meta } from '@/lib/seo';
export const Route = createFileRoute('/terms-and-conditions')({ head: () => meta('الشروط والأحكام — Floukaa', 'شروط استخدام متجر فلوكة والشراء وحقوق المحتوى.'), component: () => <PolicyPage policy="terms-and-conditions" /> });