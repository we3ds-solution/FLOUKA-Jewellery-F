import { useEffect, useState } from 'react';
import { Link } from '@tanstack/react-router';
import { Bell, BellOff, CheckCheck, CircleCheck, CircleAlert, Info, Settings, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { IconButton } from '@/components/ui/icon-button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useAccount } from '@/stores/account';
import { canShowNotifications, useNotifications } from '@/stores/notifications';
import { useDir, useLang, useT } from '@/lib/i18n';

export function NotificationButton({ className, tooltipSide = 'bottom' }: { className?: string; tooltipSide?: 'left' | 'bottom' }) {
  const visible = useAccount(s => canShowNotifications(s.hydrated, s.signedIn));
  const items = useNotifications(s => s.items), readAll = useNotifications(s => s.readAll), clear = useNotifications(s => s.clear), remove = useNotifications(s => s.remove);
  const [open, setOpen] = useState(false);
  const t = useT(), dir = useDir(), lang = useLang(s => s.lang);
  useEffect(() => { if (!visible) { setOpen(false); clear(); } }, [visible, clear]);
  if (!visible) return null;
  const unread = items.filter(item => !item.read).length;
  return <Popover open={open} onOpenChange={setOpen}>
    <PopoverTrigger asChild><IconButton variant="header" className={className} tooltipSide={tooltipSide} label={t('الإشعارات')}><Bell />{unread > 0 && <span className="header-count" aria-label={`${unread} ${t('غير مقروء')}`}>{unread > 99 ? '99+' : unread}</span>}</IconButton></PopoverTrigger>
    <PopoverContent dir={dir} side={tooltipSide === 'left' ? 'left' : 'bottom'} align={tooltipSide === 'left' ? 'center' : 'start'} sideOffset={12} collisionPadding={12} className="notification-panel" aria-label={t('الإشعارات')}>
      <div className="notification-heading"><div><h2>{t('الإشعارات')}</h2><span>{unread ? `${unread} ${t('غير مقروء')}` : t('كل الإشعارات مقروءة')}</span></div><IconButton variant="ghost" label={t('إغلاق')} onClick={() => setOpen(false)}><X /></IconButton></div>
      <div className="notification-toolbar"><Button variant="ghost" size="sm" disabled={!unread} onClick={readAll}><CheckCheck />{t('تحديد الكل كمقروء')}</Button><IconButton variant="ghost" label={t('مسح الكل')} disabled={!items.length} onClick={clear}><Trash2 /></IconButton></div>
      <div className="notification-list">
        {!items.length ? <div className="notification-empty"><span><BellOff /></span><h3>{t('مفيش إشعارات جديدة')}</h3></div> : items.map(item => {
          const Icon = item.kind === 'error' ? CircleAlert : item.kind === 'success' ? CircleCheck : Info;
          return <div key={item.id} className="notification-item" data-read={item.read} data-kind={item.kind}><span className="notification-symbol"><Icon /></span><div className="notification-copy"><h3>{item.title}</h3>{item.description && <p>{item.description}</p>}<time dateTime={new Date(item.createdAt).toISOString()}>{new Intl.DateTimeFormat(lang === 'ar' ? 'ar-EG' : 'en', { hour: 'numeric', minute: '2-digit' }).format(item.createdAt)}</time></div><IconButton variant="ghost" label={t('حذف الإشعار')} onClick={() => remove(item.id)}><X /></IconButton></div>;
        })}
      </div>
      <Button asChild variant="ghost" className="notification-settings"><Link to="/account/settings" onClick={() => setOpen(false)}><Settings />{t('إعدادات الإشعارات')}</Link></Button>
    </PopoverContent>
  </Popover>;
}