import { createServerFn } from '@tanstack/react-start';
import { contactSchema } from './contact-schema';

export const submitContact = createServerFn({ method: 'POST' })
  .inputValidator((input) => contactSchema.parse(input))
  .handler(async ({ data }) => {
    if (data.website) throw new Error('تعذر إرسال الرسالة');
    const { website: _website, ...record } = data;
    const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
    const { error } = await supabaseAdmin.from('contact_submissions').insert(record);
    if (error) throw new Error('تعذر حفظ الرسالة الآن. حاولي مرة أخرى أو اتصلي بنا.');
    return { success: true };
  });

export const getTrackingToken = createServerFn({ method: 'GET' }).handler(async () => {
  const response = await fetch('https://floukaa.com/order-tracking/', { signal: AbortSignal.timeout(15000) });
  if (!response.ok) throw new Error('خدمة التتبع غير متاحة الآن. حاولي مرة أخرى.');
  const html = await response.text();
  const input = html.match(/<input[^>]*name=["']woocommerce-order-tracking-nonce["'][^>]*>/)?.[0];
  const token = input?.match(/value=["']([a-zA-Z0-9]+)["']/)?.[1];
  if (!token) throw new Error('تعذر بدء التتبع. تواصلي مع فريق فلوكة.');
  return { token };
});