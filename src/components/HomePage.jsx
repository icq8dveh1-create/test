"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  CaretDown,
  Boat,
  BoxArrowDown,
  CheckCircle,
  ClipboardText,
  Cube,
  Factory,
  GearFine,
  List,
  MagnifyingGlass,
  Package,
  Plus,
  ShieldCheck,
  Snowflake,
  Target,
  X,
} from "@phosphor-icons/react";

const ProductSearchOverlay = dynamic(() => import("./ProductSearchOverlay"));

const defaultSystems = [
  {
    label: "Display Mounting",
    title: "Fish Finder Mounts",
    copy: "Secure, adjustable mounting for chartplotters and fish finders.",
    image: "/assets/products/telescoping-mount.jpg",
    href: "/products/fish-finder-mounts",
  },
  {
    label: "Sonar Positioning",
    title: "Transducer Pole Mounts",
    copy: "Stable vertical control for Livescope and sonar sensors.",
    image: "/assets/products/livescope-pole.jpg",
    href: "/products/transducer-pole-systems",
  },
  {
    label: "Transducer Alignment",
    title: "0-Degree Mounts",
    copy: "Precise alignment for clean, repeatable sonar readings.",
    image: "/assets/products/zero-degree-mount.jpg",
    href: "/inquiry",
  },
  {
    label: "Mobile Device Mounting",
    title: "Tablet & Camera Mounts",
    copy: "Rugged support for tablets, action cameras and accessories.",
    image: "/assets/products/tablet-mount.jpg",
    href: "/inquiry",
  },
  {
    label: "Industrial Platforms",
    title: "Industrial & Agricultural Mounts",
    copy: "AMPS, VESA and heavy-duty mounting systems for vehicles and equipment.",
    image: "/assets/products/industrial-agricultural-catalog/windfrd-c-003-8-7a/01.webp",
    href: "/products/industrial-agricultural-mounts",
  },
  {
    label: "System Components",
    title: "Accessories",
    copy: "Arms, bases, adapters and supporting hardware for complete installations.",
    image: "/assets/products/accessories-catalog/windfrd-c-00315a043/01.webp",
    href: "/products/accessories",
  },
];

function useCatalogSystems(enabled = true) {
  const [catalogSystems, setCatalogSystems] = useState(defaultSystems);
  useEffect(() => {
    if (!enabled) return undefined;
    let active = true;
    fetch("/api/products/categories", { cache: "no-store" })
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then(({ categories = [] }) => {
        if (!active || !categories.length) return;
        setCatalogSystems((current) => {
          const byHref = new Map(categories.map((category) => [category.href, category]));
          const merged = current.map((system) => byHref.get(system.href) ? { ...system, ...byHref.get(system.href) } : system);
          const existing = new Set(merged.map((system) => system.href));
          return [...merged, ...categories.filter((category) => !existing.has(category.href))];
        });
      })
      .catch(() => {});
    return () => { active = false; };
  }, [enabled]);
  return catalogSystems;
}

const stack = [
  {
    step: "01",
    title: "Base",
    copy: "Choose a flat or drill base to fit your platform.",
    image: "/assets/products/telescoping-mount.jpg",
  },
  {
    step: "02",
    title: "Arm",
    copy: "Select the reach and articulation for your application.",
    image: "/assets/products/fish-finder-mount.jpg",
  },
  {
    step: "03",
    title: "Device Interface",
    copy: "Match the interface to your electronics or accessory.",
    image: "/assets/products/dual-zero-degree.jpg",
  },
  {
    step: "04",
    title: "Finish",
    copy: "Marine aluminum or carbon fiber for demanding conditions.",
    image: "/assets/products/carbon-pole.png",
  },
];

const applications = [
  {
    title: "Boat & Offshore",
    copy: "Rugged mounting for console and bay boats.",
    image: "/assets/applications/offshore.png",
    icon: Boat,
  },
  {
    title: "Kayak",
    copy: "Compact systems for kayaks and small craft.",
    image: "/assets/applications/kayak.png",
    icon: Target,
  },
  {
    title: "Ice Fishing",
    copy: "Cold-weather positioning for winter conditions.",
    image: "/assets/applications/ice-fishing.png",
    icon: Snowflake,
  },
  {
    title: "Commercial / Fleet",
    copy: "Dependable hardware for workboat operations.",
    image: "/assets/applications/commercial.png",
    icon: Factory,
  },
];

const faqs = [
  ["What makes VINmounts suitable for marine environments?", "Selected products use marine-grade aluminum, corrosion-resistant finishes and product-specific salt spray testing."],
  ["Can I combine components into a custom solution?", "Yes. We can review the device, mounting surface, reach and operating environment to configure a compatible system."],
  ["Do you support OEM or private-label projects?", "OEM and ODM support can include geometry, surface finish, branding and packaging after a specification review."],
  ["How is compatibility confirmed?", "Send the equipment model, mounting surface and use case. Our team will confirm the interface before quoting."],
];

export function Brand({ name = "VELPAW" }) {
  return (
    <a className="brand" href="/" aria-label={`${name} home`}>
      <strong>{name}</strong>
      {name === "VELPAW" ? <span>MOUNTS</span> : null}
    </a>
  );
}

export function Header({ brandName = "VELPAW", systemsOverride = null }) {
  const loadedSystems = useCatalogSystems(!systemsOverride);
  const menuSystems = systemsOverride || loadedSystems;
  const [open, setOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  function closeNavigation() {
    setOpen(false);
    setMegaOpen(false);
  }

  function openSystemsOnDesktopHover() {
    if (window.innerWidth > 860) setMegaOpen(true);
  }

  function toggleSystemsMenu(event) {
    if (window.innerWidth > 860 && event.detail > 0) {
      setMegaOpen(true);
      return;
    }
    setMegaOpen((value) => !value);
  }

  return (
    <>
      <div className="utility-bar">
        <span>MARINE MOUNTING SYSTEMS</span>
        <i aria-hidden="true" />
        <span>OEM / ODM</span>
        <i aria-hidden="true" />
        <span>GLOBAL B2B SUPPLY</span>
      </div>
      <header className="site-header">
        <Brand name={brandName} />
        <nav
          className={open ? "main-nav is-open" : "main-nav"}
          aria-label="Primary navigation"
          onMouseLeave={() => setMegaOpen(false)}
        >
          <div className="mega-nav-item" onMouseEnter={openSystemsOnDesktopHover}>
            <button
              className={megaOpen ? "nav-trigger is-active" : "nav-trigger"}
              type="button"
              aria-expanded={megaOpen}
              aria-controls="systems-mega-menu"
              onClick={toggleSystemsMenu}
            >
              Products <CaretDown size={13} weight="bold" />
            </button>
          </div>
          <a href="/#industries" onClick={closeNavigation}>Industries</a>
          <a href="/#oem" onClick={closeNavigation}>OEM/ODM</a>
          <a href="/about-us" onClick={closeNavigation}>About Us</a>
          <button
            className="nav-search-trigger"
            type="button"
            aria-label="Search products"
            aria-expanded={searchOpen}
            aria-controls="product-search-dialog"
            onClick={() => { setOpen(false); setMegaOpen(false); setSearchOpen(true); }}
          >
            <MagnifyingGlass size={19} weight="bold" />
            <span>Search products</span>
          </button>

          {megaOpen ? (
            <section className="mega-menu" id="systems-mega-menu" aria-label="Mounting systems menu">
              <div className="mega-menu-intro">
                <span className="mega-kicker">Mounting Platform</span>
                <h2>Build the system around your equipment.</h2>
                <p>Start with a function, then configure the base, arm and device interface.</p>
                <a className="mega-view-all" href="/#systems" onClick={closeNavigation}>
                  Explore all products <ArrowRight size={16} weight="bold" />
                </a>
              </div>

              <div className="mega-system-grid">
                {menuSystems.map((system) => (
                  <a className="mega-system-card" href={system.href} key={system.title} onClick={closeNavigation}>
                    <span className="mega-system-image">
                      <Image src={system.image} alt="" fill sizes="88px" />
                    </span>
                    <span className="mega-system-copy">
                      <small>{system.label}</small>
                      <strong>{system.title}</strong>
                      <em>Configure <ArrowRight size={13} weight="bold" /></em>
                    </span>
                  </a>
                ))}
              </div>

              <div className="mega-menu-side">
                <span className="mega-side-title">Explore by need</span>
                <a href="/#industries" onClick={closeNavigation}><Boat size={18} /> Marine applications</a>
                <a href="/#engineering" onClick={closeNavigation}><GearFine size={18} /> Engineering approach</a>
                <a href="/#oem" onClick={closeNavigation}><Factory size={18} /> OEM / ODM programs</a>
                <a href="/#resources" onClick={closeNavigation}><ShieldCheck size={18} /> Quality validation</a>
                <a className="mega-quote" href="/inquiry" onClick={closeNavigation}>
                  <span>Have a specification?</span>
                  <strong>Discuss your project</strong>
                  <ArrowRight size={18} weight="bold" />
                </a>
              </div>
            </section>
          ) : null}
        </nav>
        <a className="button button-yellow header-cta" href="/inquiry">Build Your Solution</a>
        <button className="menu-button" type="button" aria-label={open ? "Close menu" : "Open menu"} onClick={() => { setOpen((value) => !value); setMegaOpen(false); }}>
          {open ? <X size={24} /> : <List size={24} />}
        </button>
      </header>
      {searchOpen ? <ProductSearchOverlay onClose={() => setSearchOpen(false)} /> : null}
    </>
  );
}

function HomePage() {
  const catalogSystems = useCatalogSystems();
  const [activeFaq, setActiveFaq] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  function submitQuote(event) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <main id="top">
      <Header systemsOverride={catalogSystems} />

      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="eyebrow">VINmounts</p>
          <h1 id="hero-title">One Mounting Platform.<span>Built Around Your Equipment.</span></h1>
          <p className="hero-description">Modular OEM mounting systems for marine electronics. Engineered for reliable positioning in saltwater. Designed to integrate. Built to perform.</p>
          <div className="hero-actions">
            <a className="button button-yellow" href="#systems">Build Your Mounting Solution <ArrowRight size={18} weight="bold" /></a>
            <a className="button button-outline" href="#quote">Get a Quote</a>
          </div>
          <a className="catalog-link" href="#quote"><BoxArrowDown size={18} /> Download Catalog</a>
        </div>
        <div className="hero-products" aria-label="VINmounts product systems">
          <div className="hero-product hero-display">
            <Image src="/assets/products/fish-finder-mount.jpg" alt="Aluminum fish finder mount" fill sizes="(max-width: 900px) 80vw, 360px" loading="eager" fetchPriority="high" />
            <span>Display Mount</span>
          </div>
          <div className="hero-product hero-pole">
            <Image src="/assets/products/telescoping-mount.jpg" alt="Adjustable telescoping marine mount" fill sizes="(max-width: 900px) 40vw, 220px" loading="eager" />
            <span>Adjustable System</span>
          </div>
          <div className="hero-product hero-interface">
            <Image src="/assets/products/carbon-pole.png" alt="Carbon fiber Livescope pole system" fill sizes="(max-width: 900px) 35vw, 190px" loading="eager" />
            <span>Livescope Pole</span>
          </div>
        </div>
      </section>

      <section className="proof-band" aria-label="Product proof points">
        <a href="#engineering"><ShieldCheck size={38} weight="bold" /><span><strong>2,000-Hour</strong>Salt Spray Tested*</span></a>
        <a href="#engineering"><Target size={38} weight="bold" /><span><strong>Multi-Axis</strong>Positioning</span></a>
        <a href="#systems"><Cube size={38} weight="bold" /><span><strong>High Load</strong>Selected Products</span></a>
        <a href="#oem"><GearFine size={38} weight="bold" /><span><strong>OEM / ODM</strong>Partnership</span></a>
      </section>

      <section className="section systems-section" id="systems">
        <div className="section-heading compact-heading">
          <p className="eyebrow">Choose Your System</p>
          <h2>Modular solutions organized by function.</h2>
        </div>
        <div className="system-grid" id="products">
          {catalogSystems.map((system) => (
            <a className="system-card" href={system.href} key={system.label}>
              <div className="card-kicker">{system.label}</div>
              <div className="system-image"><Image src={system.image} alt={system.title} fill sizes="(max-width: 800px) 88vw, 25vw" /></div>
              <h3>{system.title}</h3>
              <p>{system.copy}</p>
              <span className="card-link">View Products <ArrowRight size={15} /></span>
            </a>
          ))}
        </div>
      </section>

      <section className="section stack-section" id="engineering">
        <div className="section-heading compact-heading">
          <p className="eyebrow">An Engineered Stack, Not a Single Part</p>
          <h2>Configure only what your application needs.</h2>
        </div>
        <div className="stack-grid">
          {stack.map((item, index) => (
            <a className="stack-item" href="#quote" key={item.step}>
              <div className="stack-title"><span>{item.step}</span>{item.title}</div>
              <div className="stack-image"><Image src={item.image} alt={`${item.title} component`} fill sizes="(max-width: 800px) 80vw, 22vw" /></div>
              <p>{item.copy}</p>
              {index < stack.length - 1 ? <Plus className="stack-plus" size={28} weight="bold" aria-hidden="true" /> : null}
            </a>
          ))}
        </div>
      </section>

      <section className="featured-system">
        <div className="featured-product-image">
          <Image src="/assets/products/carbon-pole.png" alt="Carbon fiber Livescope pole system" fill sizes="(max-width: 800px) 90vw, 42vw" />
        </div>
        <div className="featured-copy">
          <p className="eyebrow yellow-text">Featured System</p>
          <h2>Livescope Pole System</h2>
          <ul>
            <li><CheckCircle size={22} weight="fill" /><span><strong>32mm carbon fiber pole</strong>Lightweight, rigid and corrosion resistant.</span></li>
            <li><CheckCircle size={22} weight="fill" /><span><strong>Horizontal sonar positioning arm</strong>Stable, repeatable sonar alignment.</span></li>
            <li><CheckCircle size={22} weight="fill" /><span><strong>Corrosion-resistant construction</strong>Built for harsh marine environments.</span></li>
          </ul>
          <a className="button button-yellow" href="#quote">View Pole System <ArrowRight size={18} /></a>
        </div>
      </section>

      <section className="section applications-section" id="industries">
        <div className="section-heading inline-heading">
          <div><p className="eyebrow">Built for How You Work</p><h2>Systems for demanding environments.</h2></div>
          <a href="#quote">Discuss an application <ArrowRight size={16} /></a>
        </div>
        <div className="application-grid">
          {applications.map((application) => {
            const Icon = application.icon;
            return (
              <a className="application-card" href="#quote" key={application.title}>
                <Image src={application.image} alt={application.title} fill sizes="(max-width: 800px) 90vw, 25vw" />
                <div className="application-overlay">
                  <Icon size={28} weight="bold" />
                  <h3>{application.title}</h3>
                  <p>{application.copy}</p>
                </div>
              </a>
            );
          })}
        </div>
      </section>

      <section className="twin-section" id="oem">
        <div className="oem-panel">
          <p className="eyebrow yellow-text">OEM / ODM Collaboration</p>
          <h2>From idea to finished product.</h2>
          <div className="oem-grid">
            <div><GearFine size={28} /><strong>Customize Geometry</strong><span>Tailored to your application.</span></div>
            <div><Cube size={28} /><strong>Material & Finish</strong><span>Aluminum or carbon fiber.</span></div>
            <div><ClipboardText size={28} /><strong>Branding</strong><span>Private-label options.</span></div>
            <div><Package size={28} /><strong>Packaging</strong><span>Retail or bulk-ready.</span></div>
          </div>
          <a className="button button-yellow" href="#quote">Discuss Your Specification <ArrowRight size={18} /></a>
        </div>
        <div className="quality-panel">
          <p className="eyebrow">Quality, Validated</p>
          <h2>Engineered for real-world demands.</h2>
          <ol className="quality-steps">
            <li><Cube size={28} /><span><b>1</b>Material Selection</span></li>
            <li><Factory size={28} /><span><b>2</b>CNC / Casting</span></li>
            <li><MagnifyingGlass size={28} /><span><b>3</b>Salt Spray & Load Test</span></li>
            <li><ShieldCheck size={28} /><span><b>4</b>Final Inspection</span></li>
          </ol>
          <small>*Test duration and load capacity vary by product model.</small>
        </div>
      </section>

      <section className="conversion-section" id="quote">
        <div className="faq-panel">
          <p className="eyebrow">Buyer FAQ</p>
          <h2>Answers before you specify.</h2>
          <div className="faq-list">
            {faqs.map(([question, answer], index) => (
              <div className={activeFaq === index ? "faq-item is-open" : "faq-item"} key={question}>
                <button type="button" aria-expanded={activeFaq === index} onClick={() => setActiveFaq(activeFaq === index ? -1 : index)}>
                  {question}<Plus size={18} />
                </button>
                <p>{answer}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="quote-panel">
          {submitted ? (
            <div className="success-message" role="status">
              <CheckCircle size={48} weight="fill" />
              <h2>Project brief received.</h2>
              <p>Thank you. Our sales team will review your requirements and contact you soon.</p>
              <button className="button button-dark" type="button" onClick={() => setSubmitted(false)}>Submit another request</button>
            </div>
          ) : (
            <form onSubmit={submitQuote}>
              <p className="eyebrow">Request a Quote</p>
              <h2>Send your project brief.</h2>
              <div className="form-grid">
                <label>Work Email<input name="email" type="email" placeholder="name@company.com" required /></label>
                <label>Country<input name="country" type="text" placeholder="Country / region" required /></label>
                <label>Product / System<select name="product" defaultValue="" required><option value="" disabled>Select a system</option><option>Fish Finder Mount</option><option>Transducer Pole</option><option>0-Degree Mount</option><option>Tablet / Camera Mount</option><option>Custom OEM Project</option></select></label>
                <label>Target Quantity<input name="quantity" type="text" placeholder="Estimated quantity" required /></label>
                <label className="form-wide">Application<textarea name="message" placeholder="Tell us about your equipment, mounting surface and timeline." required /></label>
              </div>
              <button className="button button-dark form-submit" type="submit">Send Project Brief <ArrowRight size={18} /></button>
            </form>
          )}
        </div>
      </section>

      <footer className="site-footer" id="resources">
        <div className="footer-brand"><Brand /><span className="vin-label">VINmounts</span><p>Modular mounting systems for marine electronics. Engineered to integrate.</p></div>
        <div><strong>Systems</strong><a href="#systems">Display Mounting</a><a href="#systems">Sonar Positioning</a><a href="#systems">Transducer Alignment</a><a href="#systems">Mobile Device Mounting</a></div>
        <div><strong>Industries</strong><a href="#industries">Boat & Offshore</a><a href="#industries">Kayak</a><a href="#industries">Ice Fishing</a><a href="#industries">Commercial / Fleet</a></div>
        <div><strong>Company</strong><a href="#oem">OEM / ODM</a><a href="#engineering">Engineering</a><a href="#engineering">Quality</a><a href="/about-us">About Us</a></div>
        <div><strong>Contact Actions</strong><a href="#quote">Build Your Solution</a><a href="#quote">Get a Quote</a><a href="#quote">Request Catalog</a><a href="#quote">Contact Us</a></div>
        <div className="footer-bottom"><span>© 2026 VELPAW LLC. All rights reserved.</span><span>Privacy Policy&nbsp;&nbsp;·&nbsp;&nbsp;Terms of Use</span></div>
      </footer>
    </main>
  );
}

export default HomePage;
