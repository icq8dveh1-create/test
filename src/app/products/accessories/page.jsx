import FishFinderCollectionPage from "../../../components/FishFinderCollectionPage";
import { notFound } from "next/navigation";
import { getProductsByCategory } from "../../../lib/cms/database";
import { getCollectionConfig } from "../../../lib/cms/public-catalog";

export const metadata = { title: "Mounting Accessories | VELPAW MOUNTS", description: "Browse mounting arms, ball bases, adapters, track components and supporting hardware for B2B and OEM projects." };
export const dynamic = "force-dynamic";

export default function AccessoriesPage() {
  const products = getProductsByCategory("accessories");
  const config = getCollectionConfig("accessories");
  if (!config) notFound();
  return <FishFinderCollectionPage products={products} config={config} />;
}
