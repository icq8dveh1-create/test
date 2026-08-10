import FishFinderCollectionPage from "../../../components/FishFinderCollectionPage";
import { notFound } from "next/navigation";
import { getProductsByCategory } from "../../../lib/cms/database";
import { getCollectionConfig } from "../../../lib/cms/public-catalog";

export const metadata = { title: "Transducer Pole Mounts | VELPAW MOUNTS", description: "Browse transducer pole mounts, zero-degree mounts and compatible sonar mounting accessories for B2B and OEM projects." };
export const dynamic = "force-dynamic";

export default function TransducerPoleSystemsPage() {
  const products = getProductsByCategory("transducer-pole-systems");
  const config = getCollectionConfig("transducer-pole-systems");
  if (!config) notFound();
  return <FishFinderCollectionPage products={products} config={config} />;
}
