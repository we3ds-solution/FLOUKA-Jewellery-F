import * as React from "react";

// SRP: generic min/max-width media query, SSR-safe (mounts unmatched, then
// syncs in an effect — same pattern as use-mobile). Extracted so the shell
// and hero don't each hand-roll matchMedia listeners.
export function useMediaQuery(query: string) {
  const [matches, setMatches] = React.useState(false);

  React.useEffect(() => {
    const media = window.matchMedia(query);
    const update = () => setMatches(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, [query]);

  return matches;
}
