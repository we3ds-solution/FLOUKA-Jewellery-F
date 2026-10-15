import { createFileRoute, notFound } from "@tanstack/react-router";
import { NotFoundPage, RouteErrorPage } from '@/components/store/failure-page';
import { CatalogPage } from "@/components/store/catalog-page";
import { CATEGORIES } from "@/lib/categories";
import { catById } from "@/lib/category-tree";
import { meta } from '@/lib/seo';
const titleOf = (slug: string) => CATEGORIES.find(c => c.slug === slug)?.title ?? (/^c\d+$/.test(slug) ? catById(Number(slug.slice(1)))?.name : undefined);
export const Route = createFileRoute("/category/$slug")({
  beforeLoad: ({ params }) => { if (!titleOf(params.slug)) throw notFound(); },
  notFoundComponent: NotFoundPage,
  errorComponent: RouteErrorPage,
  head: ({ params }) => { const t = titleOf(params.slug) ?? "تشكيلة"; return meta(`${t} — Floukaa`, `تسوقي ${t} من فلوكة.`); },
  component: Cat,
});
function Cat() { const { slug } = Route.useParams(); return <CatalogPage key={slug} title={titleOf(slug) ?? slug} query={`tag:${slug}`} />; }
