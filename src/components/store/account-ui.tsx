import { Link } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { statusLabel, type OrderStatus } from '@/stores/account'

export function AccountSection({ title, description, action, children }: { title: string; description?: string; action?: ReactNode; children: ReactNode }) {
  return <section className="account-section">
    <header className="account-section-head"><div><h1 className="text-2xl font-black sm:text-3xl">{title}</h1>{description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}</div>{action}</header>
    {children}
  </section>
}

export function StatusBadge({ status }: { status: OrderStatus }) {
  return <span className="order-status" data-status={status}>{statusLabel[status]}</span>
}

export function EmptyState({ title, text, to, cta }: { title: string; text: string; to: '/shop' | '/account/addresses'; cta: string }) {
  return <div className="account-empty"><b className="text-lg font-black">{title}</b><p className="text-sm text-muted-foreground">{text}</p><Link to={to} className="font-bold text-accent">{cta}</Link></div>
}

export const formatDate = (d: string) => new Date(d).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })
