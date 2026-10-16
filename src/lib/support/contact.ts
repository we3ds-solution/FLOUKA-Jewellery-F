// SRP: contact form submission only — validation + Supabase insert.
import { createServerFn } from "@tanstack/react-start";
import { contactSchema } from "../contact-schema";

export const submitContact = createServerFn({ method: "POST" })
  .inputValidator((input) => contactSchema.parse(input))
  .handler(async ({ data }) => {
    if (data.website) throw new Error("تعذر إرسال الرسالة");
    const { website: _website, ...record } = data;
    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const { error } = await supabaseAdmin.from("contact_submissions").insert(record);
      if (error) throw new Error("تعذر حفظ الرسالة الآن. حاولي مرة أخرى أو اتصلي بنا.");
    } catch (e) {
      // Generated Supabase clients throw when env is missing (preview builds):
      // degrade to a friendly message instead of leaking the env error.
      if (e instanceof Error && /Missing Supabase environment/.test(e.message)) {
        throw new Error("خدمة التواصل غير متاحة الآن. تواصلي معنا مباشرة.");
      }
      throw e instanceof Error ? e : new Error("تعذر حفظ الرسالة الآن.");
    }
    return { success: true };
  });
