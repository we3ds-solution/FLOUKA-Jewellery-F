// SRP: single source for official social URLs. Header, footer, and the
// feedback CTAs all render from here so a URL change touches one file.
// Icons stay official SVG paths via SocialIcon (see AGENTS.md).
import type { SocialIconName } from "./social-icon";

export type SocialLink = { name: SocialIconName; label: string; href: string };

const LINKS: Record<SocialIconName, { label: string; href: string }> = {
  tiktok: { label: "TikTok", href: "https://www.tiktok.com/@flouka_" },
  youtube: { label: "YouTube", href: "https://www.youtube.com/@flouka2214" },
  instagram: { label: "Instagram", href: "https://www.instagram.com/flouka_/" },
  facebook: { label: "Facebook", href: "https://www.facebook.com/FLOUKA10/" },
};

const link = (name: SocialIconName): SocialLink => ({ name, ...LINKS[name] });

/** Header top-bar order. */
export const HEADER_SOCIALS: SocialLink[] = (
  ["tiktok", "youtube", "instagram", "facebook"] as const
).map(link);
/** Footer order. */
export const FOOTER_SOCIALS: SocialLink[] = (
  ["instagram", "facebook", "tiktok", "youtube"] as const
).map(link);

export const socialHref = (name: SocialIconName): string => LINKS[name].href;
