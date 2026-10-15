import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string().trim().min(1, 'اكتبي اسمك من فضلك').max(100),
  email: z.string().trim().email('اكتبي بريدًا إلكترونيًا صحيحًا').max(255),
  phone: z.string().trim().max(30).regex(/^[+\d\s()-]*$/, 'رقم الهاتف غير صحيح').default(''),
  topic: z.enum(['order', 'product', 'returns', 'other']),
  order_number: z.string().trim().max(50).default(''),
  message: z.string().trim().min(10, 'اكتبي رسالتك في 10 أحرف على الأقل').max(3000),
  website: z.string().max(200).default(''),
});
export const trackingSchema = z.object({
  orderid: z.string().trim().min(1, 'اكتبي رقم الطلب').max(50).regex(/^#?[\dA-Za-z-]+$/, 'راجعي رقم الطلب'),
  order_email: z.string().trim().email('اكتبي البريد الإلكتروني المستخدم في الطلب').max(255),
});