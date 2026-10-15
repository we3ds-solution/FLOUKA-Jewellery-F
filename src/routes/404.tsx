import { createFileRoute } from '@tanstack/react-router';
import { NotFoundPage } from '@/components/store/failure-page';
import { meta } from '@/lib/seo';
export const Route = createFileRoute('/404')({ head: () => ({ meta: [...meta('الصفحة غير موجودة — Floukaa', 'ارجعي إلى متجر فلوكة أو ابحثي عن منتجاتك المفضلة.').meta, { name: 'robots', content: 'noindex, follow' }] }), component: NotFoundPage });