import { Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import type { FamilyMember } from "@/lib/shopify";

// SRP: color/size family swatches only. Pure render from props.
export function FamilySwatches({
  family,
  currentHandle,
}: {
  family: FamilyMember[];
  currentHandle: string;
}) {
  if (family.length < 2) return null;
  const current = family.find((f) => f.handle === currentHandle);
  return (
    <div className="mt-6">
      <p className="text-sm font-bold">
        اللون / الشكل: <span className="font-normal text-muted-foreground">{current?.label}</span>
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {family.map((f) => {
          const active = f.handle === currentHandle;
          return (
            <Link
              key={f.handle}
              to="/product/$handle"
              params={{ handle: f.handle }}
              replace
              resetScroll={false}
              title={`${f.label} — ${f.price} EGP`}
              aria-current={active ? "true" : undefined}
              className={`relative w-[5.5rem] overflow-hidden rounded-xl border-2 bg-card text-center transition ${active ? "border-accent" : "border-border hover:border-foreground/40"} ${f.inStock ? "" : "opacity-50"}`}
            >
              {f.image ? (
                <img
                  src={f.image}
                  alt={f.label}
                  loading="lazy"
                  className="aspect-square w-full object-cover"
                />
              ) : (
                <div className="aspect-square w-full bg-muted" />
              )}
              <span className="flex items-center justify-center gap-1 px-1 py-1 text-[10px] font-bold leading-tight">
                {f.swatch && (
                  <span
                    className="size-2.5 shrink-0 rounded-full border border-border"
                    style={{ background: f.swatch }}
                  />
                )}
                <span className="truncate">{f.label}</span>
              </span>
              {active && (
                <span className="absolute end-1 top-1 grid size-4 place-items-center rounded-full bg-accent text-accent-foreground">
                  <Check className="size-3" />
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
