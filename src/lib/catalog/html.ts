// SRP: raw HTML → plain text. Pure function, no store or network access.
export const strip = (h: string) =>
  h
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&#8211;/g, "–")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
