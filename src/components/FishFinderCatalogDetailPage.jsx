"use client";

import Image from "next/image";
import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Boat,
  Check,
  Cube,
  DownloadSimple,
  FilePdf,
  Minus,
  Package,
  Plus,
  ShieldCheck,
  StackSimple,
  Wrench,
} from "@phosphor-icons/react";
import { Brand, Header } from "./HomePage";
import { withVelpawProductBrand } from "../lib/productBrand";

const compatibility = [
  ["Garmin", "Fish finders & chartplotters", "Confirm model and hole pattern"],
  ["Lowrance", "Fish finders & chartplotters", "Confirm model and hole pattern"],
  ["Humminbird", "Fish finders & chartplotters", "Confirm model and hole pattern"],
];

function cleanText(value = "") {
  return value.replaceAll("聽", " ").replaceAll("鈥?", "–").trim();
}

function splitFeature(feature) {
  const cleaned = cleanText(feature);
  const marker = cleaned.indexOf(" - ");
  if (marker < 0) return ["Engineering note", cleaned];
  return [cleaned.slice(0, marker), cleaned.slice(marker + 3)];
}

const defaultCatalog = {
  basePath: "/products/fish-finder-mounts",
  label: "Fish Finder Mounts",
  relatedLabel: "fish finder mounts",
  productCount: 36,
  typicalApplications: ["Boat console", "Kayak / track", "Flat surface", "OEM station"],
  selectorOneLabel: "Compatible device brand",
  selectorOnePlaceholder: "Select device brand",
  selectorOneOptions: ["Garmin", "Lowrance", "Humminbird", "Other / OEM review"],
  selectorTwoLabel: "Mounting surface",
  selectorTwoPlaceholder: "Select mounting surface",
  selectorTwoOptions: ["Boat console / deck", "Track system", "Rail / tube", "Custom OEM interface"],
  compatibility,
  compatibilityNote: "Send the exact device model, weight, hole pattern and mounting surface for final confirmation.",
  overviewTitle: "Built for secure marine positioning.",
};

export default function FishFinderCatalogDetailPage({ product: sourceProduct, relatedProducts: sourceRelatedProducts, catalog = defaultCatalog }) {
  const product = withVelpawProductBrand(sourceProduct);
  const relatedProducts = sourceRelatedProducts.map(withVelpawProductBrand);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(10);
  const primaryFeatures = product.features.slice(0, 5).map(splitFeature);
  const inquiryHref = `/inquiry?product=${encodeURIComponent(product.slug)}&quantity=${quantity}#rfq-form`;

  return (
    <main className="product-detail-page catalog-pdp">
      <Header />

      <nav className="pdp-breadcrumb" aria-label="Breadcrumb">
        <a href="/">Home</a><span>/</span><a href={catalog.basePath}>{catalog.label}</a><span>/</span><b>{product.title}</b>
      </nav>

      <section className="pdp-hero" aria-labelledby="catalog-pdp-title">
        <div className="pdp-gallery">
          <div className="pdp-main-image">
            <Image src={product.images[activeImage]} alt={`${product.title} view ${activeImage + 1}`} fill sizes="(max-width: 900px) 100vw, 56vw" priority />
            <span className="pdp-image-index">{String(activeImage + 1).padStart(2, "0")} / {String(product.images.length).padStart(2, "0")}</span>
          </div>
          <div className="catalog-pdp-thumbnails" aria-label="Product gallery">
            {product.images.map((src, index) => (
              <button className={index === activeImage ? "is-active" : ""} type="button" key={src} onClick={() => setActiveImage(index)} aria-label={`Show product view ${index + 1}`} aria-pressed={index === activeImage}>
                <Image src={src} alt="" fill sizes="90px" />
              </button>
            ))}
          </div>
          <a className="catalog-back-link" href={catalog.basePath}><ArrowLeft size={17} /> Back to all {catalog.relatedLabel}</a>
        </div>

        <div className="pdp-buy-panel">
          <p className="pdp-eyebrow">Engineering breakdown</p>
          <h1 id="catalog-pdp-title">{product.title}</h1>
          <p className="pdp-series">SKU: {product.sku} · {product.mountType}</p>
          <div className="pdp-badges"><span>OEM / ODM supported</span><span>Compatibility review available</span></div>
          <p className="pdp-product-lead">{cleanText(primaryFeatures[0]?.[1] || product.description.split("\n")[0])}</p>

          <div className="pdp-applications">
            <p>Typical applications</p>
            <div><span><Boat size={18} /> {catalog.typicalApplications[0]}</span><span><StackSimple size={18} /> {catalog.typicalApplications[1]}</span><span><Cube size={18} /> {catalog.typicalApplications[2]}</span><span><Wrench size={18} /> {catalog.typicalApplications[3]}</span></div>
          </div>

          <label className="pdp-select-field"><span>{catalog.selectorOneLabel || defaultCatalog.selectorOneLabel}</span><select defaultValue=""><option value="" disabled>{catalog.selectorOnePlaceholder || defaultCatalog.selectorOnePlaceholder}</option>{(catalog.selectorOneOptions || defaultCatalog.selectorOneOptions).map((option) => <option key={option}>{option}</option>)}</select></label>
          <label className="pdp-select-field"><span>{catalog.selectorTwoLabel || defaultCatalog.selectorTwoLabel}</span><select defaultValue=""><option value="" disabled>{catalog.selectorTwoPlaceholder || defaultCatalog.selectorTwoPlaceholder}</option>{(catalog.selectorTwoOptions || defaultCatalog.selectorTwoOptions).map((option) => <option key={option}>{option}</option>)}</select></label>

          <div className="pdp-quantity-block"><span>Project quantity</span><div className="pdp-quantity-control"><button type="button" onClick={() => setQuantity((value) => Math.max(1, value - 1))} aria-label="Decrease quantity"><Minus size={17} /></button><output>{quantity}</output><button type="button" onClick={() => setQuantity((value) => value + 1)} aria-label="Increase quantity"><Plus size={17} /></button><small>units</small></div></div>
          <a className="pdp-primary-cta" href={inquiryHref}>Get engineering quote <ArrowRight size={20} weight="bold" /></a>
          <a className="pdp-secondary-cta" href="#product-data"><DownloadSimple size={20} /> View product data</a>
          <p className="catalog-commerce-note"><ShieldCheck size={16} weight="fill" /> B2B quotation only. Compatibility is reviewed before supply.</p>
        </div>
      </section>

      <nav className="pdp-section-nav" aria-label="Product page sections"><a href="#overview">Overview</a><a href="#compatibility">Compatibility</a><a href="#product-data">Product data</a><a href="#resources">Resources</a><a href="#related">Related systems</a></nav>

      <section className="catalog-overview" id="overview">
        <div className="catalog-overview-heading"><p className="pdp-eyebrow">Product engineering</p><h2>{catalog.overviewTitle || defaultCatalog.overviewTitle}</h2><p>{cleanText(product.description.split("\n")[0])}</p></div>
        <div className="catalog-overview-image"><Image src={product.images[Math.min(1, product.images.length - 1)]} alt={`${product.title} engineering view`} fill sizes="(max-width: 800px) 90vw, 46vw" /></div>
        <ol className="catalog-feature-list">
          {primaryFeatures.map(([title, detail], index) => <li key={`${title}-${index}`}><span>{String(index + 1).padStart(2, "0")}</span><div><strong>{title}</strong><p>{detail}</p></div></li>)}
        </ol>
      </section>

      <section className="pdp-data-grid" id="product-data">
        <article className="pdp-spec-panel"><div className="pdp-panel-title"><p>Collected product data</p><h2>Specifications</h2></div><dl><div><dt>Product</dt><dd>{product.title}</dd></div><div><dt>SKU</dt><dd>{product.sku}</dd></div><div><dt>Mount type</dt><dd>{product.mountType}</dd></div><div><dt>Primary material</dt><dd>{product.material}</dd></div><div><dt>Gallery</dt><dd>{product.images.length} product views</dd></div><div><dt>Supply model</dt><dd>B2B quotation / OEM review</dd></div></dl></article>
        <article className="pdp-compat-panel" id="compatibility"><div className="pdp-panel-title"><p>Initial selection guide</p><h2>Compatibility matrix</h2></div><div className="pdp-table-wrap"><table><thead><tr><th>Platform</th><th>Device family</th><th>Review</th><th>Status</th></tr></thead><tbody>{(catalog.compatibility || defaultCatalog.compatibility).map(([brand, family, review]) => <tr key={brand}><td>{brand}</td><td>{family}</td><td>{review}</td><td><Check size={17} weight="bold" aria-label="Review available" /></td></tr>)}</tbody></table></div><p className="pdp-table-note">{catalog.compatibilityNote || defaultCatalog.compatibilityNote}</p></article>
      </section>

      <section className="catalog-detail-copy" id="resources">
        <article><Package size={30} /><p className="pdp-eyebrow">Source product information</p><h2>Technical details</h2><div>{product.features.map((feature, index) => { const [title, detail] = splitFeature(feature); return <section key={`${title}-${index}`}><h3>{title}</h3><p>{detail}</p></section>; })}</div></article>
        <aside><FilePdf size={30} /><h2>Project resources</h2><p>Drawings, installation guidance and packaging details are supplied after model and project review.</p><a href={inquiryHref}>Request datasheet <DownloadSimple size={18} /></a><a href={inquiryHref}>Request installation guide <DownloadSimple size={18} /></a><a href={inquiryHref}>Request OEM / CAD review <DownloadSimple size={18} /></a></aside>
      </section>

      <section className="pdp-related" id="related"><div className="pdp-related-heading"><div><p className="pdp-eyebrow">Compare configurations</p><h2>Related {catalog.relatedLabel}</h2></div><a href={catalog.basePath}>View all {catalog.productCount} systems <ArrowRight /></a></div><div className="pdp-related-grid">{relatedProducts.map((item) => <a href={`${catalog.basePath}/${item.slug}`} key={item.slug}><div><Image src={item.images[0]} alt={item.title} fill sizes="(max-width: 680px) 75vw, 25vw" /></div><h3>{item.title}</h3><p>{item.mountType} · {item.material}</p><span>View engineering details <ArrowRight size={15} /></span></a>)}</div></section>

      <section className="pdp-expert-cta"><div><p className="pdp-eyebrow">Need a custom solution?</p><h2>Configure this mount for your project.</h2><p>Share your electronics model, installation surface and quantity with our engineering team.</p></div><a href={inquiryHref}>Talk to an expert <ArrowRight size={20} /></a></section>

      <footer className="pdp-footer"><div><Brand /><p>Marine mounting systems engineered for real-world installations.</p></div><div><strong>Products</strong><a href={catalog.basePath}>{catalog.label}</a><a href="/#systems">All products</a></div><div><strong>Support</strong><a href="#compatibility">Compatibility</a><a href="#resources">Resources</a><a href="/inquiry">Contact</a></div><div><strong>Company</strong><a href="/inquiry">OEM / ODM</a><a href="/inquiry">Distributor inquiry</a></div></footer>
    </main>
  );
}
