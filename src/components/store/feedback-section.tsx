import { useT } from '@/lib/i18n'
import { Quote } from "lucide-react";
import { SocialIcon } from "@/components/store/social-icon";
import { LordIcon } from "@/components/store/lord-icon";
import { motion } from "motion/react";
import { Reveal, Stagger, StaggerItem } from "./motion";

const REVIEWS = [
  {
    quote:
      "السلسلة وصلتني في تغليف هدية يجنن، والجودة فوق التوقع. لبستها في مناسبة وكل الناس سألتني جبتها منين!",
    name: "مريم س.",
    meta: "عميلة موثقة · سلسلة ذهبي",
    initial: "م",
  },
  {
    quote:
      "طلبت هدية لصاحبتي ووصلت في يومين. الأساور شيك جدًا وثابتة اللون مع الاستخدام اليومي. أكيد هطلب تاني.",
    name: "سارة أ.",
    meta: "عميلة موثقة · أساور",
    initial: "س",
  },
  {
    quote:
      "أحسن حاجة في فلوكة إن كل قطعة حسّاها معمولة بحب. الخاتم طلع أحلى من الصور بكتير والمقاس مظبوط.",
    name: "نورهان م.",
    meta: "عميلة موثقة · خواتم",
    initial: "ن",
  },
];

const STATS: Array<[string, string]> = [
  ["+10K", "عميلة سعيدة"],
  ["4.9★", "تقييم العملاء"],
  ["100%", "تغليف هدايا مجاني"],
];

export function FeedbackSection() {
  const t = useT()
  return (
    <section className="mx-auto mt-16 max-w-[1400px] px-4 pb-4 sm:mt-24 sm:px-6 lg:px-12 xl:px-20" aria-labelledby="feedback-title">
      <Reveal className="max-w-2xl">
        <p className="text-xs font-bold tracking-widest text-accent">{t("آراء العملاء")}</p>
        <h2 id="feedback-title" className="mt-2 text-3xl font-black sm:text-4xl">
          {t("إيه اللي بيقولوه عن فلوكة")}
        </h2>
        <p className="mt-3 text-sm text-muted-foreground sm:text-base">
          {t("تقييمات ورسائل حقيقية من بنات اختاروا قطع فلوكة في إطلالاتهم وهداياهم.")}
        </p>
      </Reveal>

      {/* Mobile: snap scroll. Tablet: 2 cols. Desktop: 3 cols with soft tilt. */}
      <div className="-mx-4 mt-10 overflow-hidden sm:mx-0 sm:mt-14 sm:overflow-visible">
        <Stagger className="flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 pb-6 pt-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:px-0 sm:pb-8 lg:grid-cols-3 lg:gap-8">
          {REVIEWS.map((r, i) => (
            <StaggerItem
              key={r.name}
              className={`w-[85%] max-w-sm shrink-0 snap-start sm:w-auto sm:max-w-none ${
                i === 2 ? "sm:col-span-2 sm:mx-auto sm:w-full sm:max-w-md lg:col-span-1 lg:max-w-none" : ""
              }`}
            >
              <motion.figure
                whileHover={{ y: -6, rotate: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 22 }}
                className={`flex h-full min-w-0 flex-col rounded-3xl border border-border bg-card p-5 shadow-soft sm:p-7 ${
                  i === 0 ? "lg:-rotate-2" : i === 2 ? "lg:rotate-2" : "lg:-translate-y-3"
                }`}
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-accent-surface text-primary-foreground">
                  <Quote className="size-5" />
                </span>
                <blockquote className="mt-4 flex-1 break-words text-sm leading-7 text-card-foreground sm:text-[15px]">
                  {t(r.quote)}
                </blockquote>
                <figcaption className="mt-5 flex min-w-0 items-center gap-3 border-t border-border pt-4">
                  <span className="grid size-10 shrink-0 place-items-center rounded-full bg-accent-surface text-sm font-black text-primary-foreground">
                    {r.initial}
                  </span>
                  <span className="min-w-0">
                    <b className="block truncate text-sm">{t(r.name)}</b>
                    <span className="block truncate text-xs text-muted-foreground">{t(r.meta)}</span>
                  </span>
                </figcaption>
              </motion.figure>
            </StaggerItem>
          ))}
        </Stagger>
      </div>

      <Reveal className="mt-6 flex flex-col items-center gap-8 sm:mt-10 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-14 sm:gap-y-6">
        <div className="grid w-full max-w-md grid-cols-3 gap-4 sm:flex sm:w-auto sm:max-w-none sm:gap-14">
          {STATS.map(([value, label]) => (
            <div key={label} className="min-w-0 text-center">
              <p className="text-2xl font-black text-primary sm:text-3xl" dir="ltr">
                {value}
              </p>
              <p className="mt-1 text-xs text-muted-foreground sm:text-sm">{t(label)}</p>
            </div>
          ))}
        </div>
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <a
            href="https://www.instagram.com/flouka_/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-accent-surface px-7 text-sm font-bold text-primary-foreground transition-transform hover:-translate-y-0.5"
          >
            <SocialIcon name="instagram" size={18} />
            {t("تابعينا على إنستجرام")}
          </a>
          <a
            href="https://www.facebook.com/FLOUKA10/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-border bg-card px-7 text-sm font-bold text-foreground transition-transform hover:-translate-y-0.5"
          >
            <SocialIcon name="facebook" size={18} />
            {t("تابعينا على فيسبوك")}
          </a>
        </div>
      </Reveal>
    </section>
  );
}
