import { describe, expect, it } from "vitest";
import { translate } from "@/lib/i18n/dictionary";

describe("translator", () => {
  it("passes Arabic through in Arabic mode", () => {
    expect(translate("ar", "سلاسل")).toBe("سلاسل");
  });

  it("translates known keys in English mode", () => {
    expect(translate("en", "سلاسل")).toBe("Necklaces");
    expect(translate("en", "أضف للسلة")).toBe("Add to cart");
  });

  it("falls back to Arabic for missing English keys", () => {
    expect(translate("en", "نص مش موجود في القاموس")).toBe("نص مش موجود في القاموس");
  });
});
