import { useEffect, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { browserConsentStorage, readConsent, saveConsent, scheduleCookieNotice } from '@/lib/cookie-consent'

export const OPEN_COOKIE_SETTINGS = 'floukaa:open-cookie-settings'

export function openCookieSettings() {
  window.dispatchEvent(new Event(OPEN_COOKIE_SETTINGS))
}

export function CookieNotice() {
  const [visible, setVisible] = useState(false)
  const [settings, setSettings] = useState(false)
  const [analytics, setAnalytics] = useState(false)
  const [marketing, setMarketing] = useState(false)

  useEffect(() => {
    const { local, session } = browserConsentStorage()
    const saved = readConsent(local, session)
    if (saved) { setAnalytics(saved.analytics); setMarketing(saved.marketing) }
    const cancel = saved ? () => {} : scheduleCookieNotice(() => setVisible(true))
    const open = () => {
      const current = readConsent(local, session)
      if (current) { setAnalytics(current.analytics); setMarketing(current.marketing) }
      setSettings(true)
    }
    window.addEventListener(OPEN_COOKIE_SETTINGS, open)
    return () => { cancel(); window.removeEventListener(OPEN_COOKIE_SETTINGS, open) }
  }, [])

  const save = (a: boolean, m: boolean) => {
    const { local, session } = browserConsentStorage()
    saveConsent(local, session, a, m)
    setAnalytics(a); setMarketing(m); setVisible(false); setSettings(false)
  }

  return (
    <>
      {visible && !settings && (
        <div role="region" aria-label="إشعار ملفات الارتباط" className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-xl rounded-2xl border border-border bg-card p-4 text-card-foreground shadow-lg animate-in fade-in slide-in-from-bottom-4 sm:p-5">
          <p className="text-sm font-semibold">بنستخدم ملفات الارتباط 🍪</p>
          <p className="mt-1 text-sm text-muted-foreground">
            بنستخدمها علشان الموقع يشتغل كويس، ولو وافقتي بنستخدمها كمان لتحسين تجربتك. تقدري تغيري اختيارك في أي وقت.{' '}
            <Link to="/privacy-policy" className="underline underline-offset-2">سياسة الخصوصية</Link>
          </p>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            <Button onClick={() => save(true, true)} className="sm:flex-1">موافقة على الكل</Button>
            <Button variant="outline" onClick={() => save(false, false)} className="sm:flex-1">الضروري فقط</Button>
            <Button variant="ghost" onClick={() => setSettings(true)}>الإعدادات</Button>
          </div>
        </div>
      )}
      <Dialog open={settings} onOpenChange={setSettings}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>إعدادات ملفات الارتباط</DialogTitle>
            <DialogDescription>اختاري الأنواع اللي توافقي عليها.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Row title="ضرورية" desc="مطلوبة لتشغيل السلة وتسجيل الدخول." checked disabled />
            <Row title="تحليلات" desc="بتساعدنا نفهم استخدام الموقع ونحسّنه." checked={analytics} onChange={setAnalytics} />
            <Row title="تسويق" desc="لعرض عروض تناسب اهتماماتك." checked={marketing} onChange={setMarketing} />
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => save(false, false)}>الضروري فقط</Button>
            <Button onClick={() => save(analytics, marketing)}>حفظ الاختيارات</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

function Row({ title, desc, checked, disabled, onChange }: { title: string; desc: string; checked: boolean; disabled?: boolean; onChange?: (v: boolean) => void }) {
  return (
    <label className="flex items-start justify-between gap-4">
      <span><span className="block text-sm font-medium">{title}</span><span className="block text-xs text-muted-foreground">{desc}</span></span>
      <Switch checked={checked} disabled={disabled} onCheckedChange={v => onChange?.(v)} aria-label={title} />
    </label>
  )
}
