"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  Boat,
  CaretDown,
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
  X,
} from "@phosphor-icons/react";
import { Brand, Header } from "./HomePage";

const GALLERY = [
  { src: "/assets/products/fish-finder-mount.jpg", label: "Complete mount" },
  { src: "/assets/products/telescoping-mount.jpg", label: "Telescoping configuration" },
  { src: "/assets/products/livescope-pole.jpg", label: "Sonar pole configuration" },
  { src: "/assets/products/zero-degree-mount.jpg", label: "Alignment accessory" },
  { src: "/assets/products/dual-zero-degree.jpg", label: "Dual transducer accessory" },
];

const SPECS = [
  ["Product", "Aluminum Fish Finder Mount"],
  ["Material", "Marine-grade aluminum"],
  ["Surface finish", "Saltwater-resistant powder coating"],
  ["Adjustment", "360° rotation via dual ball joints"],
  ["Ball size", '1.5" / C Size'],
  ["Load rating", "9 lbs static / 7 lbs dynamic"],
  ["Screen range", 'Common 5–12" marine displays'],
  ["Salt spray test", "2,000 hours"],
  ["Supported brands", "Garmin, Lowrance, Humminbird"],
  ["Customization", "OEM / ODM supported"],
];

const COMPATIBILITY = [
  ["Garmin", "Fish finders & chartplotters", 'Common 5–12" displays'],
  ["Lowrance", "Fish finders & chartplotters", 'Common 5–12" displays'],
  ["Humminbird", "Fish finders & chartplotters", 'Common 5–12" displays'],
];

const RELATED = [
  {
    title: "20.7-inch Adjustable Telescoping Mount",
    note: "14.68–20.7 inch height adjustment",
    image: "/assets/products/telescoping-mount.jpg",
  },
  {
    title: "Carbon Fiber Live Sonar Pole",
    note: "32 mm high-strength carbon fiber pole",
    image: "/assets/products/carbon-pole.png",
  },
  {
    title: "Livescope Transducer Pole Mount",
    note: "360-degree adjustable T-track system",
    image: "/assets/products/livescope-pole.jpg",
  },
  {
    title: "0-Degree Perspective Mount",
    note: "Fast Forward / Down / Perspective alignment",
    image: "/assets/products/zero-degree-mount.jpg",
  },
];

const FAQS = [
  [
    "Which fish finder brands are supported?",
    "The universal mounting system is designed for common Garmin, Lowrance and Humminbird displays. Confirm the display hole pattern and weight with our team before ordering.",
  ],
  [
    "Can the mount be configured for an OEM project?",
    "Yes. OEM and ODM support is available for branding, mounting interfaces and project-specific configurations.",
  ],
  [
    "Is the mount suitable for saltwater use?",
    "The aluminum construction uses a saltwater-resistant powder coating and the product information specifies a 2,000-hour salt spray test.",
  ],
  [
    "What information should I send for compatibility review?",
    "Share the display brand and model, screen size, mounting surface, operating environment and planned quantity.",
  ],
];

function ProductModal({ type, onClose }) {
  if (!type) return null;

  return (
    <div className="pdp-modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section className="pdp-modal" role="dialog" aria-modal="true" aria-labelledby="pdp-modal-title" onMouseDown={(event) => event.stopPropagation()}>
        <button className="pdp-modal-close" type="button" onClick={onClose} aria-label="Close dialog"><X size={24} /></button>
        {type === "compatibility" ? (
          <>
            <p className="pdp-eyebrow">Compatibility review</p>
            <h2 id="pdp-modal-title">Confirm your electronics.</h2>
            <p>Use this guide for initial selection. Final compatibility should be confirmed against your device model, hole pattern, weight and installation surface.</p>
            <div className="pdp-modal-matrix">
              {COMPATIBILITY.map(([brand, family, range]) => (
                <article key={brand}><strong>{brand}</strong><span>{family}</span><b><Check size={15} weight="bold" /> {range}</b></article>
              ))}
            </div>
            <a className="pdp-modal-cta" href="/inquiry">Send model for review <ArrowRight size={18} /></a>
          </>
        ) : (
          <>
            <p className="pdp-eyebrow">Kit components</p>
            <h2 id="pdp-modal-title">What is included.</h2>
            <p>The product kit combines a universal device plate, adjustable C-size arm, round mounting base and the mounting hardware shown with the product.</p>
            <div className="pdp-component-list">
              <article><span>01</span><div><strong>Universal device plate</strong><p>Multi-hole plate for common marine displays.</p></div></article>
              <article><span>02</span><div><strong>Dual-socket adjustable arm</strong><p>Tool-free repositioning through dual ball joints.</p></div></article>
              <article><span>03</span><div><strong>C-size round base</strong><p>Secure surface mounting interface.</p></div></article>
              <article><span>04</span><div><strong>Mounting hardware</strong><p>Hardware supplied as shown in the product image.</p></div></article>
            </div>
          </>
        )}
      </section>
    </div>
  );
}

export default function ProductDetailPage() {
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(10);
  const [modal, setModal] = useState("");
  const [openFaq, setOpenFaq] = useState(0);

  useEffect(() => {
    if (!modal) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [modal]);

  return (
    <main className="product-detail-page">
      <Header />

      <nav className="pdp-breadcrumb" aria-label="Breadcrumb">
        <a href="/">Home</a><span>/</span><a href="/#systems">Products</a><span>/</span><b>Aluminum Fish Finder Mount</b>
      </nav>

      <section className="pdp-hero" aria-labelledby="pdp-title">
        <div className="pdp-gallery">
          <div className="pdp-main-image">
            <Image
              src={GALLERY[activeImage].src}
              alt={GALLERY[activeImage].label}
              fill
              sizes="(max-width: 900px) 100vw, 54vw"
              priority
            />
            <span className="pdp-image-index">0{activeImage + 1} / 0{GALLERY.length}</span>
          </div>
          <div className="pdp-thumbnails" aria-label="Product gallery">
            {GALLERY.map((item, index) => (
              <button
                className={index === activeImage ? "is-active" : ""}
                type="button"
                key={item.src}
                onClick={() => setActiveImage(index)}
                aria-label={`Show ${item.label}`}
                aria-pressed={index === activeImage}
              >
                <Image src={item.src} alt="" fill sizes="100px" />
              </button>
            ))}
          </div>

          <div className="pdp-component-strip">
            <p>Explore compatible systems</p>
            <div>
              {GALLERY.slice(1).map((item, index) => (
                <button type="button" key={item.src} onClick={() => setActiveImage(index + 1)}>
                  <Image src={item.src} alt={item.label} fill sizes="88px" />
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="pdp-buy-panel">
          <p className="pdp-eyebrow">Engineering breakdown</p>
          <h1 id="pdp-title">Adjustable Marine Fish Finder Mount</h1>
          <p className="pdp-series">Series: C-Size Aluminum System</p>

          <div className="pdp-badges">
            <span>OEM / ODM supported</span>
            <span>2,000-hour salt spray tested</span>
          </div>

          <p className="pdp-product-lead">A rigid, adjustable mounting solution for marine fish finders and chartplotters, engineered for secure positioning and fast angle changes.</p>

          <div className="pdp-applications">
            <p>Typical applications</p>
            <div><span><Boat size={18} /> Boat console</span><span><StackSimple size={18} /> Hardtop</span><span><Cube size={18} /> Bulkhead / wall</span><span><Wrench size={18} /> OEM station</span></div>
          </div>

          <label className="pdp-select-field">
            <span>Compatible device brand</span>
            <select defaultValue=""><option value="" disabled>Select device brand</option><option>Garmin</option><option>Lowrance</option><option>Humminbird</option><option>Other / OEM review</option></select>
          </label>

          <label className="pdp-select-field">
            <span>Mounting surface</span>
            <select defaultValue=""><option value="" disabled>Select mounting surface</option><option>Boat console</option><option>Hardtop</option><option>Bulkhead / wall</option><option>Custom OEM interface</option></select>
          </label>

          <div className="pdp-quantity-block">
            <span>Project quantity</span>
            <div className="pdp-quantity-control">
              <button type="button" onClick={() => setQuantity((current) => Math.max(1, current - 1))} aria-label="Decrease quantity"><Minus size={17} /></button>
              <output>{quantity}</output>
              <button type="button" onClick={() => setQuantity((current) => current + 1)} aria-label="Increase quantity"><Plus size={17} /></button>
              <small>units</small>
            </div>
          </div>

          <a className="pdp-primary-cta" href="/inquiry">Get engineering quote <ArrowRight size={20} weight="bold" /></a>
          <a className="pdp-secondary-cta" href="#documents"><DownloadSimple size={20} /> View datasheet / resources</a>

          <div className="pdp-hero-actions">
            <button type="button" onClick={() => setModal("compatibility")}><ShieldCheck size={20} /> Compatibility</button>
            <button type="button" onClick={() => setModal("components")}><Cube size={20} /> Kit components</button>
          </div>
        </div>
      </section>

      <nav className="pdp-section-nav" aria-label="Product page sections">
        <a href="#overview">Overview</a><a href="#compatibility">Compatibility</a><a href="#specifications">Specifications</a><a href="#components">Components</a><a href="#documents">Resources</a>
      </nav>

      <section className="pdp-breakdown" id="overview">
        <div className="pdp-breakdown-heading">
          <p className="pdp-eyebrow">Engineering breakdown</p>
          <h2>System breakdown</h2>
          <p>Each visible component supports secure positioning, adjustment and installation in demanding marine applications.</p>
        </div>

        <div className="pdp-breakdown-visual">
          <Image src="/assets/products/fish-finder-mount.jpg" alt="Aluminum fish finder mount component breakdown" fill sizes="(max-width: 800px) 80vw, 500px" />
        </div>

        <ol className="pdp-callouts">
          <li><span>01</span><div><strong>Universal device plate</strong><p>Multi-hole aluminum plate for common marine displays.</p></div></li>
          <li><span>02</span><div><strong>Dual ball joints</strong><p>360-degree positioning with near-infinite angle adjustment.</p></div></li>
          <li><span>03</span><div><strong>Adjustable arm</strong><p>Vibration-dampening mechanics help maintain a stable view.</p></div></li>
          <li><span>04</span><div><strong>C-size round base</strong><p>1.5-inch mounting interface for a rigid installation.</p></div></li>
          <li><span>05</span><div><strong>Mounting hardware</strong><p>Hardware supplied as shown with the product.</p></div></li>
        </ol>
      </section>

      <section className="pdp-data-grid" id="specifications">
        <article className="pdp-spec-panel">
          <div className="pdp-panel-title"><p>Verified product data</p><h2>Specifications</h2></div>
          <dl>{SPECS.map(([term, value]) => <div key={term}><dt>{term}</dt><dd>{value}</dd></div>)}</dl>
        </article>

        <article className="pdp-compat-panel" id="compatibility">
          <div className="pdp-panel-title"><p>Initial selection guide</p><h2>Compatibility matrix</h2></div>
          <div className="pdp-table-wrap">
            <table>
              <thead><tr><th>Brand</th><th>Device family</th><th>Screen range</th><th>Status</th></tr></thead>
              <tbody>{COMPATIBILITY.map(([brand, family, range]) => <tr key={brand}><td>{brand}</td><td>{family}</td><td>{range}</td><td><Check size={17} weight="bold" aria-label="Supported" /></td></tr>)}</tbody>
            </table>
          </div>
          <p className="pdp-table-note">Confirm the exact model, hole pattern and weight with our team before ordering.</p>
        </article>
      </section>

      <section className="pdp-support-grid" id="components">
        <article>
          <Package size={28} />
          <h2>Included system</h2>
          <ul><li>Universal aluminum device plate</li><li>Dual-socket adjustable arm</li><li>C-size round mounting base</li><li>Mounting hardware shown</li></ul>
          <button type="button" onClick={() => setModal("components")}>Review kit components <ArrowRight size={16} /></button>
        </article>

        <article id="documents">
          <FilePdf size={28} />
          <h2>Documents & resources</h2>
          <div className="pdp-downloads"><a href="/inquiry">Request product datasheet <DownloadSimple /></a><a href="/inquiry">Request installation guide <DownloadSimple /></a><a href="/inquiry">Request drawings / CAD review <DownloadSimple /></a></div>
        </article>

        <article className="pdp-faq-panel">
          <ShieldCheck size={28} />
          <h2>Product FAQ</h2>
          <div className="pdp-faqs">
            {FAQS.map(([question, answer], index) => (
              <div className={openFaq === index ? "is-open" : ""} key={question}>
                <button type="button" onClick={() => setOpenFaq(openFaq === index ? -1 : index)} aria-expanded={openFaq === index}>{question}<CaretDown size={17} /></button>
                <p>{answer}</p>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="pdp-related" aria-labelledby="pdp-related-title">
        <div className="pdp-related-heading"><div><p className="pdp-eyebrow">Build a complete system</p><h2 id="pdp-related-title">Related mounting solutions</h2></div><a href="/inquiry">Discuss a configuration <ArrowRight /></a></div>
        <div className="pdp-related-grid">
          {RELATED.map((product) => (
            <a href="/inquiry" key={product.title}>
              <div><Image src={product.image} alt={product.title} fill sizes="(max-width: 680px) 75vw, 25vw" /></div>
              <h3>{product.title}</h3><p>{product.note}</p><span>View product <ArrowRight size={15} /></span>
            </a>
          ))}
        </div>
      </section>

      <section className="pdp-expert-cta">
        <div><p className="pdp-eyebrow">Need a custom solution?</p><h2>Configure this mount for your project.</h2><p>Share your device, installation surface and quantity with our engineering team.</p></div>
        <a href="/inquiry">Talk to an expert <ArrowRight size={20} /></a>
      </section>

      <footer className="pdp-footer">
        <div><Brand /><p>Marine mounting systems engineered for real-world installations.</p></div>
        <div><strong>Products</strong><a href="/#systems">Mounting systems</a><a href="/inquiry">OEM / ODM</a><a href="/blog/marine-fish-finder-mount-guide">Engineering guide</a></div>
        <div><strong>Support</strong><a href="#compatibility">Compatibility</a><a href="#documents">Resources</a><a href="/inquiry">Contact</a></div>
        <div><strong>Company</strong><a href="/">About us</a><a href="/inquiry">Become a distributor</a></div>
      </footer>

      <ProductModal type={modal} onClose={() => setModal("")} />
    </main>
  );
}
