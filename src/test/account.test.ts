import { beforeEach, describe, expect, it } from "vitest";
import { DEMO_EMAIL, DEMO_PASSWORD, useAccount } from "@/stores/account";
import { hashPassword } from "@/stores/account/password-hash";

const reset = () => {
  localStorage.clear();
  useAccount.setState({
    hydrated: true,
    dialogOpen: false,
    signedIn: false,
    profile: null,
    orders: [],
    addresses: [],
    prefs: { offers: true, orderUpdates: true, newsletter: false },
  });
};

beforeEach(reset);

describe("demo login", () => {
  it("signs in with demo credentials", async () => {
    expect(await useAccount.getState().login(DEMO_EMAIL, DEMO_PASSWORD)).toBe(true);
    expect(useAccount.getState().signedIn).toBe(true);
    expect(useAccount.getState().profile?.email).toBe(DEMO_EMAIL);
  });

  it("rejects wrong passwords", async () => {
    expect(await useAccount.getState().login(DEMO_EMAIL, "nope-nope-nope")).toBe(false);
    expect(useAccount.getState().signedIn).toBe(false);
  });

  it("never persists plain-text passwords", async () => {
    await useAccount.getState().register("Sara", "sara@example.com", "secret-123");
    await useAccount.getState().login(DEMO_EMAIL, DEMO_PASSWORD);
    const raw = localStorage.getItem("floukaa-account") ?? "";
    expect(raw).not.toContain("secret-123");
    expect(raw).not.toMatch(/"password"\s*:/);
    expect(raw).toContain("passwordHash");
    expect(await hashPassword("secret-123")).toHaveLength(64);
  });
});

describe("register and password change", () => {
  it("registers then logs in with the same password", async () => {
    await useAccount.getState().register("Sara", "sara@example.com", "secret-123");
    useAccount.getState().logout();
    expect(await useAccount.getState().login("sara@example.com", "secret-123")).toBe(true);
  });

  it("rejects a wrong current password and accepts the new one", async () => {
    await useAccount.getState().register("Sara", "sara@example.com", "secret-123");
    expect(await useAccount.getState().changePassword("wrong", "new-secret-1")).toBe(false);
    expect(await useAccount.getState().changePassword("secret-123", "new-secret-1")).toBe(true);
    useAccount.getState().logout();
    expect(await useAccount.getState().login("sara@example.com", "new-secret-1")).toBe(true);
  });
});

describe("addresses", () => {
  it("defaults the first address and re-defaults on remove", () => {
    const s = useAccount.getState();
    s.saveAddress({ id: "a1", label: "home", name: "S", phone: "01012345678", governorate: "القاهرة", city: "C", street: "St", isDefault: false });
    expect(useAccount.getState().addresses[0]?.isDefault).toBe(true);
    s.saveAddress({ id: "a2", label: "work", name: "S", phone: "01012345678", governorate: "الجيزة", city: "C", street: "St", isDefault: true });
    expect(useAccount.getState().addresses.find((a) => a.id === "a2")?.isDefault).toBe(true);
    expect(useAccount.getState().addresses.find((a) => a.id === "a1")?.isDefault).toBe(false);
    useAccount.getState().removeAddress("a2");
    expect(useAccount.getState().addresses[0]?.isDefault).toBe(true);
  });

  it("merges prefs", () => {
    useAccount.getState().setPrefs({ newsletter: true });
    expect(useAccount.getState().prefs).toMatchObject({ offers: true, newsletter: true });
  });
});
