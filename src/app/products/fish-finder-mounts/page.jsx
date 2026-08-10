import FishFinderCollectionPage from "../../../components/FishFinderCollectionPage";
import { notFound } from "next/navigation";
import { getProductsByCategory } from "../../../lib/cms/database";
import { getCollectionConfig } from "../../../lib/cms/public-catalog";

export const metadata = { title: "Fish Finder Mounts | VELPAW MOUNTS", description: "Browse marine fish finder and chartplotter mounting configurations for B2B, OEM and compatibility-led projects." };
export const dynamic = "force-dynamic";

export default function FishFinderMountsPage() {
  const products = getProductsByCategory("fish-finder-mounts");
  const config = getCollectionConfig("fish-finder-mounts");
  if (!config) notFound();
  return <FishFinderCollectionPage products={products} config={config} />;
}
