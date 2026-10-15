import { Link, useRouterState } from '@tanstack/react-router';
import { ArrowLeft, ChevronDown } from 'lucide-react';
import { type ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { helpContent } from '@/lib/help-content';

/** Every customer-support page, in menu order. Single source for navigation. */
export const helpPages = [
  { to: '/contact', label: 'تواصل معنا' },
  { to: '/faq', label: 'الأسئلة الشائعة' },
  { to: '/order-tracking', label: 'تتبع الطلب' },
  { to: '/returns', label: 'الاستبدال والاسترجاع' },
  { to: '/return-refund-policy', label: 'سياسة الإرجاع والاسترداد' },
  { to: '/privacy-policy', label: 'سياسة الخصوصية' },
  { to: '/terms-and-conditions', label: 'الشروط والأحكام' },
  { to: '/about-us', label: 'عن فلوكة' },
  { to: '/assistant', label: 'مساعدة التسوق' },
] as const;

type Callout = { title: string; text: string; to: (typeof helpPages)[number]['to'] | '/shop'; action: string };
const defaultCallout: Callout = { title: 'لسه عندك سؤال؟', text: 'إحنا هنا علشان نساعدك في كل تفاصيل تجربتك مع فلوكة.', to: '/contact', action: 'تواصلي معنا' };

/** Reusable dropdown for jumping between help pages. */
export function HelpPagesMenu() {
  const path = useRouterState({ select: s => s.location.pathname });
  const current = helpPages.find(p => p.to === path);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="help-menu-trigger">
          <span>{current?.label ?? 'صفحات المساعدة'}</span><ChevronDown />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="help-menu">
        <DropdownMenuLabel>خدمة العملاء</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {helpPages.map(p => (
          <DropdownMenuItem key={p.to} asChild>
            <Link to={p.to} className="help-menu-item" activeProps={{ 'aria-current': 'page' }}>{p.label}</Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/** One identical structure for all help pages: breadcrumb, header + menu, body, callout. */
export function HelpLayout({ title, intro, children, callout = defaultCallout }: { title: string; intro: string; children: ReactNode; callout?: Callout }) {
  return (
    <article className="support-page">
      <nav className="help-breadcrumb" aria-label="مسار الصفحة"><Link to="/">الرئيسية</Link><span>/</span><span>خدمة العملاء</span><span>/</span><span aria-current="page">{title}</span></nav>
      <div className="support-header">
        <div>
          <p className="help-kicker">FLOUKAA · هنا من أجلك</p>
          <h1>{title}</h1>
          <p className="support-intro">{intro}</p>
        </div>
        <HelpPagesMenu />
      </div>
      <div className="support-body">{children}</div>
      <div className="support-callout">
        <div><h2>{callout.title}</h2><p>{callout.text}</p></div>
        <Button variant="support" asChild><Link to={callout.to}>{callout.action} <ArrowLeft /></Link></Button>
      </div>
    </article>
  );
}

export function PolicyPage({ policy }: { policy: keyof typeof helpContent }) {
  const content = helpContent[policy];
  return (
    <HelpLayout title={content.title} intro="كل التفاصيل اللي تهمك، بوضوح وبساطة.">
      <div className="support-prose">{content.paragraphs.map((paragraph, i) => <p key={i}>{paragraph}</p>)}</div>
    </HelpLayout>
  );
}
