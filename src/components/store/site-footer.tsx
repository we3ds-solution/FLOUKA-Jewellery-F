// SRP: footer only. Moved out of site-shell; social URLs come from the
// shared social-links module. Icons stay official SVG paths (see AGENTS.md).
import { Link } from "@tanstack/react-router";
import { ArrowUpLeft, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { useT } from "@/lib/i18n";
import { copyrightYear } from "@/lib/footer";
import logoAsset from "@/assets/floukaa-header-logo.png.asset.json";
import { SocialIcon } from "./social-icon";
import { FOOTER_SOCIALS } from "./social-links";
import { PaymentMarks } from "./payment-marks";
import { openCookieSettings } from "./cookie-notice";

export function SiteFooter() {
  const t = useT();
  return (
    <footer className="floukaa-footer">
      <div className="footer-main-grid">
        <div className="footer-about">
          <Link to="/" className="footer-brand" aria-label={t("فلوكة — الرئيسية")}>
            <img src={logoAsset.url} width={513} height={637} alt="FLOUKAA" />
          </Link>
          <p className="footer-about-copy">
            {t(
              "تفاصيل صغيرة، فرحة كبيرة. اكتشفي سلاسل وأساور وخواتم وإكسسوارات تكمّل إطلالتك، وهدايا تفرّح اللي بتحبيهم.",
            )}
          </p>
          <ul className="footer-brand-facts">
            <li>{t("إكسسوارات")}</li>
            <li>{t("هدايا")}</li>
            <li dir="ltr">@flouka_</li>
          </ul>
          <div className="footer-socials" aria-label={t("تابعينا")}>
            {FOOTER_SOCIALS.map((s) => (
              <IconButton
                key={s.name}
                asChild
                variant="outline"
                className="footer-social"
                label={s.label}
              >
                <a href={s.href} target="_blank" rel="noopener noreferrer">
                  <SocialIcon name={s.name} animated={false} />
                </a>
              </IconButton>
            ))}
          </div>
        </div>
        <nav className="footer-link-group" aria-label={t("تسوقي")}>
          <h3>{t("اكتشفي فلوكة")}</h3>
          <Link to="/shop">{t("كل المنتجات")}</Link>
          <Link to="/new-arrivals">{t("وصل حديثًا")}</Link>
          <Link to="/best-sellers">{t("الأكثر مبيعًا")}</Link>
          <Link to="/offers">{t("العروض")}</Link>
          <Link to="/wishlist">{t("المفضلة")}</Link>
        </nav>
        <nav className="footer-link-group" aria-label={t("خدمة العملاء")}>
          <h3>{t("دايمًا معاكي")}</h3>
          <Link to="/contact">{t("تواصل معنا")}</Link>
          <Link to="/faq">{t("الأسئلة الشائعة")}</Link>
          <Link to="/returns">{t("الاستبدال والاسترجاع")}</Link>
          <Link to="/order-tracking">تتبع الطلب</Link>
          <Link to="/privacy-policy">سياسة الخصوصية</Link>
          <Link to="/terms-and-conditions">الشروط والأحكام</Link>
          <button type="button" onClick={openCookieSettings} className="text-start">
            إعدادات ملفات الارتباط
          </button>
        </nav>
        <div className="footer-subscribe">
          <h3>{t("خليكي قريبة")}</h3>
          <p>{t("تشكيلات جديدة وقطع مميزة وهدايا لكل مناسبة.")}</p>
          <form onSubmit={(e) => e.preventDefault()} className="footer-subscribe-form">
            <label htmlFor="footer-email" className="sr-only">
              {t("بريدك الإلكتروني")}
            </label>
            <input
              id="footer-email"
              type="email"
              autoComplete="email"
              placeholder={t("بريدك الإلكتروني")}
            />
            <Button variant="accent" className="footer-subscribe-button">
              {t("اشتراك")}
              <ArrowUpLeft className="size-4 ltr:-scale-x-100" />
            </Button>
          </form>
        </div>
      </div>
      <div className="footer-bottom-strip" dir="ltr">
        <div className="footer-bottom-inner">
          <p className="footer-copyright">© {copyrightYear()} Flouka Store, All Rights Reserved.</p>
          <PaymentMarks />
          <p className="footer-credit">
            Made With Love <Heart className="footer-love" aria-label="love" /> by{" "}
            <a
              href="https://m-said-marketplace.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
            >
              M.Said
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
