import { create } from 'zustand'
import { useEffect } from 'react'

export type Lang = 'ar' | 'en'

/** Arabic source string → English. Arabic text is the key, so missing entries fall back to Arabic. */
const EN: Record<string, string> = {
  'الإشعارات': 'Notifications', 'غير مقروء': 'unread', 'كل الإشعارات مقروءة': 'All caught up',
  'إغلاق': 'Close', 'إغلاق الإشعار': 'Close notification', 'حذف الإشعار': 'Remove notification',
  'تحديد الكل كمقروء': 'Mark all as read', 'مسح الكل': 'Clear all', 'مفيش إشعارات جديدة': 'No new notifications',
  'إعدادات الإشعارات': 'Notification settings', 'تم تسجيل الدخول': 'Signed in successfully',
  'تم إنشاء حسابك': 'Your account is ready', 'أهلًا بيكي في فلوكة': 'Welcome to Floukaa',
  'تم حفظ بيانات الحساب': 'Account details saved', 'تم تغيير كلمة المرور': 'Password updated',
  'تم حفظ تفضيلات الإشعارات': 'Notification preferences saved',
  // Header / shell
  'القائمة': 'Menu', 'بحث': 'Search', 'مقارنة المنتجات': 'Compare products', 'المفضلة': 'Wishlist', 'السلة': 'Cart',
  'حسابي': 'My account', 'فلوكة — الرئيسية': 'Floukaa — Home', 'اختصارات': 'Shortcuts', 'المقارنة': 'Compare',
  'فلوكة للإكسسوارات والهدايا': 'Floukaa Accessories & Gifts', 'إنتِ بتدوري على إيه؟': 'What are you looking for?',
  'الوضع الفاتح': 'Light mode', 'الوضع الداكن': 'Dark mode', 'للأعلى': 'Back to top', 'English': 'English', 'العربية': 'العربية',
  'تغيير اللغة': 'Change language',
  // Cart
  'سلة التسوق': 'Shopping cart', 'سلتك لسه فاضية': 'Your cart is empty', 'تقليل': 'Decrease', 'زيادة': 'Increase',
  'الإجمالي': 'Total', 'إتمام الطلب بأمان': 'Secure checkout',
  // Footer
  'تفاصيل صغيرة، فرحة كبيرة. اكتشفي سلاسل وأساور وخواتم وإكسسوارات تكمّل إطلالتك، وهدايا تفرّح اللي بتحبيهم.':
    'Small details, big joy. Discover necklaces, bracelets, rings and accessories that complete your look — and gifts that delight the people you love.',
  'إكسسوارات': 'Accessories', 'هدايا': 'Gifts', 'تابعينا': 'Follow us', 'تسوقي': 'Shop', 'اكتشفي فلوكة': 'Discover Floukaa',
  'كل المنتجات': 'All products', 'وصل حديثًا': 'New arrivals', 'الأكثر مبيعًا': 'Best sellers', 'العروض': 'Offers',
  'خدمة العملاء': 'Customer care', 'دايمًا معاكي': 'Always here for you', 'تواصل معنا': 'Contact us', 'الأسئلة الشائعة': 'FAQ',
  'الاستبدال والاسترجاع': 'Exchanges & returns', 'خليكي قريبة': 'Stay close',
  'تشكيلات جديدة وقطع مميزة وهدايا لكل مناسبة.': 'New collections, special pieces and gifts for every occasion.',
  'بريدك الإلكتروني': 'Your email', 'اشتراك': 'Subscribe',
  // Nav
  'الرئيسية': 'Home', 'سلاسل': 'Necklaces', 'أساور': 'Bracelets', 'حلقان': 'Earrings', 'خلخال': 'Anklets', 'خواتم': 'Rings',
  'بيرسينج': 'Piercing', 'مداليا': 'Pendants', 'اطفال': 'Kids', 'أطفال': 'Kids', 'منتجات أخرى': 'More products', 'عن فلوكة': 'About Floukaa',
  'القائمة الرئيسية': 'Main menu', 'القائمة الرئيسية للجوال': 'Mobile main menu', 'أقسام': 'Sections of', 'طوق': 'Tokka',
  // Home
  'تشكيلات جديدة صيفية': 'New summer collections', 'تسوقي حسب القسم': 'Shop by category',
  'إخفاء خريطة الأقسام': 'Hide category map', 'عرض خريطة الأقسام': 'Show category map', 'متميز': 'Featured', 'عروض': 'Sale',
  'إغلاق خريطة الأقسام': 'Close category map', 'خريطة الأقسام': 'Category map',
  'عرض كل المنتجات': 'View all products', 'شحن لكل مصر': 'Shipping across Egypt', 'توصيل لجميع المحافظات': 'Delivery to every governorate',
  'تغليف هدايا': 'Gift wrapping', 'جاهزة تتهادى على طول': 'Ready to gift right away', 'استبدال سهل': 'Easy exchange',
  'خلال 14 يوم من الاستلام': 'Within 14 days of delivery',
  // Reviews
  'آراء العملاء': 'CLIENT FEEDBACK', 'إيه اللي بيقولوه عن فلوكة': 'What people are saying',
  'تقييمات ورسائل حقيقية من بنات اختاروا قطع فلوكة في إطلالاتهم وهداياهم.': 'Real reviews and messages from women who chose Floukaa pieces for their looks and gifts.',
  'السلسلة وصلتني في تغليف هدية يجنن، والجودة فوق التوقع. لبستها في مناسبة وكل الناس سألتني جبتها منين!':
    'My necklace arrived in gorgeous gift wrapping and the quality exceeded my expectations. I wore it to an event and everyone asked where I got it!',
  'طلبت هدية لصاحبتي ووصلت في يومين. الأساور شيك جدًا وثابتة اللون مع الاستخدام اليومي. أكيد هطلب تاني.':
    'I ordered a gift for my friend and it arrived in two days. The bracelets are so chic and keep their color with daily wear. Definitely ordering again.',
  'أحسن حاجة في فلوكة إن كل قطعة حسّاها معمولة بحب. الخاتم طلع أحلى من الصور بكتير والمقاس مظبوط.':
    'The best thing about Floukaa is that every piece feels made with love. The ring looks even better than the photos and fits perfectly.',
  'مريم س.': 'Mariam S.', 'سارة أ.': 'Sara A.', 'نورهان م.': 'Nourhan M.',
  'عميلة موثقة · سلسلة ذهبي': 'Verified buyer · Gold necklace', 'عميلة موثقة · أساور': 'Verified buyer · Bracelets', 'عميلة موثقة · خواتم': 'Verified buyer · Rings',
  'عميلة سعيدة': 'Happy customers', 'تقييم العملاء': 'Customer rating', 'تغليف هدايا مجاني': 'Free gift wrapping',
  'تابعينا على إنستجرام': 'Follow on Instagram', 'تابعينا على فيسبوك': 'Follow on Facebook',
  // Hero
  'التشكيلة الحصرية': 'Exclusive collection', 'فلوكة — تشكيلة حصرية': 'Floukaa — An exclusive collection',
  'تفاصيل مختلفة، وحكاية جديدة مع كل قطعة. اكتشفي أحدث تصميمات فلوكة.': 'Unique details and a new story with every piece. Discover the latest Floukaa designs.',
  'اكتشفي التشكيلة': 'Discover the collection', 'سلاسل تكمل حكايتك': 'Necklaces that complete your story',
  'من التفاصيل الناعمة للقطع اللافتة، اختاري السلسلة اللي تشبهك.': 'From delicate details to statement pieces, pick the necklace that feels like you.',
  'تسوقي السلاسل': 'Shop necklaces', 'أساور بطريقتك': 'Bracelets, your way',
  'قطعة واحدة أو أكثر… لمسة مميزة لكل إطلالة من تشكيلة أساور فلوكة.': 'One piece or more… a special touch for every look from the Floukaa bracelet collection.',
  'تسوقي الأساور': 'Shop bracelets', 'حلقان تلفت النظر': 'Earrings that turn heads',
  'تفاصيل صغيرة، حضور كبير. اكتشفي الحلقان اللي تكمل إطلالتك.': 'Small details, big presence. Discover earrings that complete your look.',
  'تسوقي الحلقان': 'Shop earrings', 'خلاخيل': 'Anklets', 'خلاخيل بروح البحر': 'Anklets with a sea spirit',
  'لمسة خفيفة ومختلفة، من تشكيلة خلاخيل مختارة لكل يوم.': 'A light, different touch from an anklet collection curated for every day.',
  'تسوقي الخلاخيل': 'Shop anklets', 'تشكيلات فلوكة': 'Floukaa collections', 'اكتشفي عالم فلوكة': 'Explore the Floukaa world',
  'التشكيلة السابقة': 'Previous collection', 'التشكيلة التالية': 'Next collection', 'تشغيل العرض': 'Play slideshow',
  'إيقاف العرض': 'Pause slideshow', 'اختيار التشكيلة': 'Choose collection',
  // Catalog / product card
  'جاري التحميل...': 'Loading...', 'لا توجد نتائج': 'No results', 'لا توجد منتجات مطابقة.': 'No matching products.', 'منتج': 'products',
  'عرض': 'Showing', 'من': 'of', 'لا توجد صورة': 'No image', 'أضف للمفضلة': 'Add to wishlist', 'عرض المقارنة': 'View comparison',
  'أضف للمقارنة': 'Add to compare', 'جديد': 'New', 'أضف للسلة': 'Add to cart',
}

type LangState = { lang: Lang; setLang(l: Lang): void }
export const useLang = create<LangState>((set) => ({
  lang: 'ar',
  setLang: (lang) => {
    try { localStorage.setItem('lang', lang) } catch { /* storage unavailable */ }
    applyDocLang(lang)
    set({ lang })
  },
}))

function applyDocLang(lang: Lang) {
  const root = document.documentElement
  root.lang = lang
  root.dir = lang === 'ar' ? 'rtl' : 'ltr'
}

export const translate = (lang: Lang, s: string) => (lang === 'en' ? EN[s] ?? s : s)

/** Returns a translator bound to the current language. Pass the Arabic source text. */
export function useT() {
  const lang = useLang(s => s.lang)
  return (s: string) => translate(lang, s)
}

/** Mount once: restores the saved language after hydration. */
export function useLangBootstrap() {
  useEffect(() => {
    let saved: string | null = null
    try { saved = localStorage.getItem('lang') } catch { /* ignore */ }
    if (saved === 'en' || saved === 'ar') { applyDocLang(saved); useLang.setState({ lang: saved }) }
  }, [])
}

/** Script injected in <head> so dir/lang are correct before first paint. */
export const LANG_BOOT_SCRIPT = "try{var l=localStorage.lang;if(l==='en'){document.documentElement.lang='en';document.documentElement.dir='ltr'}}catch(e){}"

/** Current text direction for the active language. */
export function useDir(): 'rtl' | 'ltr' {
  return useLang(s => s.lang) === 'ar' ? 'rtl' : 'ltr'
}
