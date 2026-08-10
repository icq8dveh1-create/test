import { notFound } from "next/navigation";
import FishFinderCollectionPage from "../../../components/FishFinderCollectionPage";
import { getProductsByCategory } from "../../../lib/cms/database";
import { getCollectionConfig } from "../../../lib/cms/public-catalog";

export async function generateMetadata({ params }) {
  const { category } = await params;
  const config = getCollectionConfig(category);
  if (!config) return { title: "Category not found | VELPAW MOUNTS" };
  return { title: `${config.title} | VELPAW MOUNTS`, description: config.description.slice(0, 155) };
}

export default async function DynamicCategoryPage({ params }) {
  const { category } = await params;
  const config = getCollectionConfig(category);
  if (!config) notFound();
  return <FishFinderCollectionPage products={getProductsByCategory(category)} config={config} />;
}
