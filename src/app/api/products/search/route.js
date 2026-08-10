import { listCategories, listSearchProducts } from "../../../../lib/cms/database";
import { velpawText } from "../../../../lib/productBrand";

export function GET() {
  const categories = listCategories({ activeOnly: true }).map((category) => ({ key: category.slug, label: category.name, basePath: `/products/${category.slug}` }));
  const products = listSearchProducts().map((product) => ({
    slug: product.slug,
    title: velpawText(product.title),
    sku: velpawText(product.sku),
    mountType: velpawText(product.mountType),
    material: velpawText(product.material),
    description: velpawText(product.description),
    features: product.features.map(velpawText),
    images: product.images.slice(0, 1),
    categoryKey: product.categorySlug,
    categoryLabel: product.categoryName,
    href: `/products/${product.categorySlug}/${product.slug}`,
  }));
  return Response.json({ categories, products }, { headers: { "Cache-Control": "no-store" } });
}
