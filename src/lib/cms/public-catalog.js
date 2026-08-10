import { getCategory } from "./database";

const collectionOverrides = {
  "fish-finder-mounts": {
    ctaTitle: "Need help choosing the right mount?",
    ctaDescription: "Share the fish finder brand, model, screen size, mounting surface and target quantity. Our team will recommend a configuration.",
  },
  "transducer-pole-systems": {
    ctaTitle: "Need the right pole and sensor interface?",
    ctaDescription: "Share the sonar brand, transducer model, mounting platform and operating environment. Our team will review the complete positioning stack.",
  },
  "industrial-agricultural-mounts": {
    ctaTitle: "Need the right equipment interface?",
    ctaDescription: "Share the device weight, hole pattern, vehicle or machine surface and target quantity. Our team will review the complete mounting stack.",
  },
  accessories: {
    ctaTitle: "Need to complete an existing mounting stack?",
    ctaDescription: "Share the ball size, device, interface, mounting surface and target quantity. Our team will identify the compatible component combination.",
  },
};

const detailOverrides = {
  "fish-finder-mounts": {
    relatedLabel: "fish finder mounts",
    typicalApplications: ["Boat console", "Kayak / track", "Flat surface", "OEM station"],
    selectorOneLabel: "Compatible device brand",
    selectorOnePlaceholder: "Select device brand",
    selectorOneOptions: ["Garmin", "Lowrance", "Humminbird", "Other / OEM review"],
    selectorTwoLabel: "Mounting surface",
    selectorTwoPlaceholder: "Select mounting surface",
    selectorTwoOptions: ["Boat console / deck", "Track system", "Rail / tube", "Custom OEM interface"],
  },
  "transducer-pole-systems": {
    relatedLabel: "transducer pole mounts",
    typicalApplications: ["Boat / kayak", "Live sonar", "Ice fishing", "OEM station"],
  },
  "industrial-agricultural-mounts": {
    relatedLabel: "industrial and agricultural mounts",
    typicalApplications: ["Work vehicles", "Machine displays", "Agricultural cabs", "OEM stations"],
    selectorOneLabel: "Equipment type",
    selectorOnePlaceholder: "Select equipment type",
    selectorOneOptions: ["Industrial monitor", "Agricultural display", "Tablet / PC", "Other / OEM review"],
    selectorTwoLabel: "Mounting interface",
    selectorTwoPlaceholder: "Select mounting interface",
    selectorTwoOptions: ["AMPS hole pattern", "VESA 75 × 75", "Rail / U-bolt", "Custom OEM interface"],
    compatibility: [["AMPS", "Displays, tablets and controls", "Confirm ball size and load"], ["VESA", "Industrial monitors", "Confirm pattern and weight"], ["Vehicle rail", "Cabs and machine frames", "Confirm tube profile"]],
    compatibilityNote: "Send the exact device weight, hole pattern, operating vibration and mounting surface for final confirmation.",
    overviewTitle: "Built for demanding equipment installations.",
  },
  accessories: {
    relatedLabel: "mounting accessories",
    typicalApplications: ["System expansion", "Device mounting", "Track installations", "OEM integration"],
    selectorOneLabel: "Component family",
    selectorOnePlaceholder: "Select component family",
    selectorOneOptions: ["Socket arm", "Ball base / adapter", "Track component", "Application accessory"],
    selectorTwoLabel: "Existing interface",
    selectorTwoPlaceholder: "Select existing interface",
    selectorTwoOptions: ["1-inch / B size", "1.5-inch / C size", "2.25-inch / D size", "Custom OEM interface"],
    compatibility: [["B size", "1-inch ball systems", "Confirm arm and load"], ["C size", "1.5-inch ball systems", "Confirm device weight"], ["Track / rail", "Marine and vehicle tracks", "Confirm profile and fastener"]],
    compatibilityNote: "Send the existing ball size, interface, device weight and mounting surface for final component confirmation.",
    overviewTitle: "Built to complete modular mounting systems.",
  },
};

export function getCollectionConfig(categorySlug) {
  const category = getCategory(categorySlug);
  if (!category || !category.active) return null;
  return {
    basePath: `/products/${category.slug}`,
    breadcrumb: category.name,
    eyebrow: category.eyebrow || category.label || "Mounting systems",
    title: category.name,
    description: category.description,
    localImageCount: category.localImageCount,
    ctaTitle: "Need help specifying the right mounting system?",
    ctaDescription: "Share the device, mounting surface, operating environment and target quantity. Our team will review the application.",
    ...collectionOverrides[categorySlug],
  };
}

export function getDetailCatalog(categorySlug) {
  const category = getCategory(categorySlug);
  if (!category || !category.active) return null;
  return {
    basePath: `/products/${category.slug}`,
    label: category.name,
    relatedLabel: category.name.toLowerCase(),
    productCount: category.productCount,
    typicalApplications: ["Marine installation", "Vehicle equipment", "Industrial station", "OEM integration"],
    ...detailOverrides[categorySlug],
  };
}
