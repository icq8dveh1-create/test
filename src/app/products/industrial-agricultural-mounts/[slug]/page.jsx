import { notFound } from "next/navigation";
import FishFinderCatalogDetailPage from "../../../../components/FishFinderCatalogDetailPage";
import { getProductBySlug, getRelatedProducts } from "../../../../lib/cms/database";
import { getDetailCatalog } from "../../../../lib/cms/public-catalog";
import { velpawText } from "../../../../lib/productBrand";

const categorySlug = "industrial-agricultural-mounts";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = getProductBySlug(categorySlug, slug);
  if (!product) return { title: "Product not found | VELPAW MOUNTS" };
  return { title: `${velpawText(product.title)} | VELPAW MOUNTS`, description: velpawText(product.description.split("\n")[0]).slice(0, 155) };
}

export default async function IndustrialAgriculturalProductPage({ params }) {
  const { slug } = await params;
  const product = getProductBySlug(categorySlug, slug);
  if (!product) notFound();
  return <FishFinderCatalogDetailPage product={product} relatedProducts={getRelatedProducts(categorySlug, slug)} catalog={getDetailCatalog(categorySlug)} />;
}
