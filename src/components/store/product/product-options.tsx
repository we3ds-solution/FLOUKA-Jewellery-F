import { Button } from "@/components/ui/button";
import { optionLabel } from "@/lib/catalog/option-labels";
import type { ShopifyProduct } from "@/lib/shopify";

type Option = ShopifyProduct["options"][number];

// SRP: variant option pickers only. Selection state lives in the parent hook.
export function ProductOptions({
  options,
  chosen,
  onPick,
}: {
  options: Option[];
  chosen: Record<string, string>;
  onPick: (option: string, value: string) => void;
}) {
  return (
    <>
      {options.map((o) => (
        <div key={o.name} className="mt-6">
          <p className="text-sm font-bold">
            {optionLabel(o.name)}:{" "}
            <span className="font-normal text-muted-foreground">{chosen[o.name]}</span>
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {o.values.map((val) => (
              <Button
                key={val}
                variant={chosen[o.name] === val ? "default" : "outline"}
                size="sm"
                className="max-w-full truncate"
                onClick={() => onPick(o.name, val)}
              >
                {val}
              </Button>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}
