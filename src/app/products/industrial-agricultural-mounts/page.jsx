import FishFinderCollectionPage from "../../../components/FishFinderCollectionPage";
import { notFound } from "next/navigation";
import { getProductsByCategory } from "../../../lib/cms/database";
import { getCollectionConfig } from "../../../lib/cms/public-catalog";

export const metadata = { title: "Industrial & Agricultural Mounts | VELPAW MOUNTS", description: "Browse AMPS, VESA, monitor and heavy-duty mounting systems for industrial vehicles, agricultural equipment and OEM projects." };
export const dynamic = "force-dynamic";

export default function IndustrialAgriculturalMountsPage() {
  const products = getProductsByCategory("industrial-agricultural-mounts");
  const config = getCollectionConfig("industrial-agricultural-mounts");
  if (!config) notFound();
  return <FishFinderCollectionPage products={products} config={config} />;
}
