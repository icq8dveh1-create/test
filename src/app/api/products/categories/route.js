import { listCategories } from "../../../../lib/cms/database";

export function GET() {
  const categories = listCategories({ activeOnly: true }).map((category) => ({
    key: category.slug,
    label: category.label,
    title: category.name,
    copy: category.description,
    image: category.image,
    href: `/products/${category.slug}`,
  }));
  return Response.json({ categories }, { headers: { "Cache-Control": "no-store" } });
}
