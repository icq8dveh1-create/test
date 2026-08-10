import { notFound } from "next/navigation";
import FishFinderCatalogDetailPage from "../../../../components/FishFinderCatalogDetailPage";
import { getProductBySlug, getRelatedProducts } from "../../../../lib/cms/database";
import { getDetailCatalog } from "../../../../lib/cms/public-catalog";
import { velpawText } from "../../../../lib/productBrand";

export async function generateMetadata({ params }) {
  const { category, slug } = await params;
  const product = getProductBySlug(category, slug);
  if (!product) return { title: "Product not found | VELPAW MOUNTS" };
  return { title: `${velpawText(product.title)} | VELPAW MOUNTS`, description: velpawText(product.description.split("\n")[0]).slice(0, 155) };
}

export default async function DynamicProductPage({ params }) {
  const { category, slug } = await params;
  const product = getProductBySlug(category, slug);
  const catalog = getDetailCatalog(category);
  if (!product || !catalog) notFound();
  return <FishFinderCatalogDetailPage product={product} relatedProducts={getRelatedProducts(category, slug)} catalog={catalog} />;
}
