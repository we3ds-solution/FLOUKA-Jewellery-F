import { createFileRoute, Link } from "@tanstack/react-router";
import { ProductCard } from "@/components/store/product-card";
import { useWishlist } from "@/stores/wishlist";
import { meta } from "@/lib/seo";
import { useAccount } from '@/stores/account';
import { AccountFrame } from '@/components/store/account-frame';
import { AccountSection, EmptyState } from '@/components/store/account-ui';
export const Route = createFileRoute("/wishlist")({ head: () => meta("المفضلة — Floukaa", "القطع اللي حفظتيها."), component: W });
function W() {
  const items = useWishlist(s => s.items);
  const signedIn = useAccount(s => s.hydrated && s.signedIn && Boolean(s.profile));
  if (signedIn) return <AccountFrame current="المفضلة"><AccountSection title="المفضلة">
    {items.length ? <div className="grid grid-cols-2 gap-x-3 gap-y-8 lg:grid-cols-3">{items.map(p => <ProductCard key={p.id} product={p} />)}</div> : <EmptyState title="لسه مفيش حاجة في المفضلة" text="" to="/shop" cta="ابدئي التسوق" />}
  </AccountSection></AccountFrame>;
  return <div className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6"><h1 className="mb-8 text-2xl font-black sm:text-3xl">المفضلة</h1>{items.length ? <div className="grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-3 lg:grid-cols-4">{items.map(p => <ProductCard key={p.id} product={p} />)}</div> : <p className="py-20 text-center text-muted-foreground">لسه مفيش حاجة في المفضلة. <Link to="/shop" className="font-bold text-accent">ابدئي التسوق</Link></p>}</div>;
}
