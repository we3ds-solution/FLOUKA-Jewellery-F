// SRP: contact form submission only — validation + Supabase insert.
import { createServerFn } from "@tanstack/react-start";
import { contactSchema } from "../contact-schema";

export const submitContact = createServerFn({ method: "POST" })
  .inputValidator((input) => contactSchema.parse(input))
  .handler(async ({ data }) => {
    if (data.website) throw new Error("تعذر إرسال الرسالة");
    const { website: _website, ...record } = data;
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("contact_submissions").insert(record);
    if (error) throw new Error("تعذر حفظ الرسالة الآن. حاولي مرة أخرى أو اتصلي بنا.");
    return { success: true };
  });
