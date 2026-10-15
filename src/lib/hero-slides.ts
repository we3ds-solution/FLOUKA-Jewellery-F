import originalBanner from '@/assets/floukaa-original-banner.webp.asset.json';
import necklaces from '@/assets/slider-necklaces.jpg.asset.json';
import bracelets from '@/assets/slider-bracelets.jpg.asset.json';
import earrings from '@/assets/slider-earrings.jpg.asset.json';
import anklets from '@/assets/slider-anklets.jpg.asset.json';

export const HERO_INTERVAL = 6500;
export const HERO_SLIDES = [
  { id: 'exclusive', image: originalBanner.url, label: 'التشكيلة الحصرية', eyebrow: 'NEW EXCLUSIVE COLLECTION', title: 'فلوكة — تشكيلة حصرية', description: 'تفاصيل مختلفة، وحكاية جديدة مع كل قطعة. اكتشفي أحدث تصميمات فلوكة.', action: 'اكتشفي التشكيلة', category: 'rings', original: true },
  { id: 'necklaces', image: necklaces.url, label: 'سلاسل', eyebrow: 'THE NECKLACE EDIT', title: 'سلاسل تكمل حكايتك', description: 'من التفاصيل الناعمة للقطع اللافتة، اختاري السلسلة اللي تشبهك.', action: 'تسوقي السلاسل', category: 'necklaces', original: false },
  { id: 'bracelets', image: bracelets.url, label: 'أساور', eyebrow: 'EVERYDAY DETAILS', title: 'أساور بطريقتك', description: 'قطعة واحدة أو أكثر… لمسة مميزة لكل إطلالة من تشكيلة أساور فلوكة.', action: 'تسوقي الأساور', category: 'bracelets', original: false },
  { id: 'earrings', image: earrings.url, label: 'حلقان', eyebrow: 'A LITTLE STATEMENT', title: 'حلقان تلفت النظر', description: 'تفاصيل صغيرة، حضور كبير. اكتشفي الحلقان اللي تكمل إطلالتك.', action: 'تسوقي الحلقان', category: 'earrings', original: false },
  { id: 'anklets', image: anklets.url, label: 'خلاخيل', eyebrow: 'THE FINAL TOUCH', title: 'خلاخيل بروح البحر', description: 'لمسة خفيفة ومختلفة، من تشكيلة خلاخيل مختارة لكل يوم.', action: 'تسوقي الخلاخيل', category: 'anklets', original: false },
] as const;

export function nextHeroSlide(current: number, direction: number) {
  return (current + direction + HERO_SLIDES.length) % HERO_SLIDES.length;
}