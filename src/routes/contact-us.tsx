import { createFileRoute } from '@tanstack/react-router';
import { ContactPage } from './contact';
import { meta } from '@/lib/seo';
export const Route = createFileRoute('/contact-us')({ head: () => meta('تواصل بنا — Floukaa', 'الهاتف والبريد الإلكتروني لفريق فلوكة في بورسعيد.'), component: ContactPage });