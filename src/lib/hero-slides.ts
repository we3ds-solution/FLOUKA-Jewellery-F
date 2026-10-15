// SRP: hero slide content only. Images are local optimized WebP banners
// in public/banner (see webp conversion: ~660KB JPGs -> ~60-80KB WebP).
// Width/height are the real file dims so the browser reserves layout space.
export const HERO_INTERVAL = 6500;
export const HERO_SLIDES = [
  {
    id: "exclusive",
    image: "/banner/banner-2.webp",
    width: 1376,
    height: 768,
    label: "التشكيلة الحصرية",
    eyebrow: "NEW EXCLUSIVE COLLECTION",
    title: "فلوكة — تشكيلة حصرية",
    description: "تفاصيل مختلفة، وحكاية جديدة مع كل قطعة. اكتشفي أحدث تصميمات فلوكة.",
    action: "اكتشفي التشكيلة",
    category: "rings",
  },
  {
    id: "necklaces",
    image: "/banner/banner-1.webp",
    width: 1536,
    height: 652,
    label: "سلاسل",
    eyebrow: "THE NECKLACE EDIT",
    title: "سلاسل تكمل حكايتك",
    description: "من التفاصيل الناعمة للقطع اللافتة، اختاري السلسلة اللي تشبهك.",
    action: "تسوقي السلاسل",
    category: "necklaces",
  },
  {
    id: "bracelets",
    image: "/banner/banner-5.webp",
    width: 1376,
    height: 768,
    label: "أساور",
    eyebrow: "EVERYDAY DETAILS",
    title: "أساور بطريقتك",
    description: "قطعة واحدة أو أكثر… لمسة مميزة لكل إطلالة من تشكيلة أساور فلوكة.",
    action: "تسوقي الأساور",
    category: "bracelets",
  },
  {
    id: "earrings",
    image: "/banner/banner-3.webp",
    width: 1376,
    height: 768,
    label: "حلقان",
    eyebrow: "A LITTLE STATEMENT",
    title: "حلقان تلفت النظر",
    description: "تفاصيل صغيرة، حضور كبير. اكتشفي الحلقان اللي تكمل إطلالتك.",
    action: "تسوقي الحلقان",
    category: "earrings",
  },
  {
    id: "anklets",
    image: "/banner/banner-4.webp",
    width: 1376,
    height: 768,
    label: "خلاخيل",
    eyebrow: "THE FINAL TOUCH",
    title: "خلاخيل بروح البحر",
    description: "لمسة خفيفة ومختلفة، من تشكيلة خلاخيل مختارة لكل يوم.",
    action: "تسوقي الخلاخيل",
    category: "anklets",
  },
] as const;

export function nextHeroSlide(current: number, direction: number) {
  return (current + direction + HERO_SLIDES.length) % HERO_SLIDES.length;
}
