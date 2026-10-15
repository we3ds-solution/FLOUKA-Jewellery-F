import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';
import { useCompare } from '@/stores/compare';
import { meta } from '@/lib/seo';

export const Route = createFileRoute('/compare')({ head: () => meta('مقارنة المنتجات — Floukaa', 'قارني أسعار وتفاصيل القطع المختارة من فلوكة.'), component: CompareEntry });
function CompareEntry() {
  const navigate = useNavigate();
  const setOpen = useCompare(s => s.setOpen);
  useEffect(() => { void navigate({ to: '/shop', replace: true }).then(() => setOpen(true)); }, [navigate, setOpen]);
  return null;
}