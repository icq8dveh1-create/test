import Image from "next/image";
import {
  ArrowRight,
  CheckCircle,
  EnvelopeSimple,
  Factory,
  GlobeHemisphereWest,
  Handshake,
  MapPin,
  Package,
  UsersThree,
  WhatsappLogo,
} from "@phosphor-icons/react/dist/ssr";
import { Brand, Header } from "./HomePage";

const advantages = [
  {
    icon: Factory,
    number: "01",
    title: "Integrated Manufacturing",
    copy: "A 30,000+ m² factory brings production, assembly and quality control together, giving every project a clear path from specification to delivery.",
  },
  {
    icon: Package,
    number: "02",
    title: "Production Readiness",
    copy: "Organized workshop and warehouse operations support consistent output for product programs, repeat orders and growing B2B demand.",
  },
  {
    icon: UsersThree,
    number: "03",
    title: "Elite Team Support",
    copy: "Our 40+ elite team members work closely with customers to understand application requirements and move projects forward efficiently.",
  },
];

const capabilities = [
  ["Marine Mounting Systems", "Purpose-built solutions for fish finders, transducers and marine electronics."],
  ["OEM / ODM Programs", "Collaborative development for geometry, finish, branding and packaging requirements."],
  ["Global B2B Support", "Responsive specification review and project communication for international partners."],
];

export default function AboutUsPage() {
  return (
    <main className="about-page">
      <Header brandName="VINmounts" />

      <nav className="pdp-breadcrumb" aria-label="Breadcrumb">
        <a href="/">Home</a><span>/</span><b>About Us</b>
      </nav>

      <section className="about-hero" aria-labelledby="about-title">
        <div className="about-hero-copy">
          <p className="pdp-eyebrow">About VINmounts</p>
          <h1 id="about-title">Built to Hold. Engineered to Perform.</h1>
          <p>Founded in 2023, VINmounts develops dependable mounting solutions for marine electronics, industrial applications and professional equipment.</p>
          <p>From product development to scaled production, our team combines practical engineering, disciplined manufacturing and responsive B2B support to help customers build confidently.</p>
          <a className="button button-yellow" href="/#systems">Explore Our Products <ArrowRight size={18} weight="bold" /></a>
        </div>
        <div className="about-hero-visual">
          <Image src="/assets/about/vinmounts-factory-building.webp" alt="VINmounts factory building" fill priority sizes="(max-width: 900px) 100vw, 48vw" />
          <div><strong>2023</strong><span>VINmounts founded</span></div>
        </div>
      </section>

      <section className="about-contact-band" aria-label="Company contact details">
        <div><span>Company</span><strong>VINmounts</strong></div>
        <div><MapPin size={22} weight="bold" /><span>8508 Flanders Dr<br />San Diego, CA 92126, USA</span></div>
        <a href="tel:+16196387900"><WhatsappLogo size={22} weight="bold" /><span>Tel / WhatsApp<br /><strong>+1 619-638-7900</strong></span></a>
        <a href="/inquiry?channel=email#rfq-form"><EnvelopeSimple size={22} weight="bold" /><span>Email<br /><strong>Send an inquiry</strong></span></a>
      </section>

      <section className="about-section about-advantages">
        <div className="about-section-heading">
          <p className="pdp-eyebrow">Why VINmounts?</p>
          <h2>Real manufacturing capability behind every mounting solution.</h2>
        </div>
        <div className="about-advantage-grid">
          {advantages.map(({ icon: Icon, number, title, copy }) => (
            <article key={title}>
              <div><span>{number}</span><Icon size={30} weight="bold" /></div>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
        <div className="about-scenario-grid">
          {capabilities.map(([title, copy]) => (
            <div key={title}><CheckCircle size={20} weight="fill" /><span><strong>{title}</strong>{copy}</span></div>
          ))}
        </div>
      </section>

      <section className="about-section about-factory" aria-labelledby="factory-title">
        <div className="about-section-heading">
          <p className="pdp-eyebrow">Inside VINmounts</p>
          <h2 id="factory-title">People, production and fulfillment under one roof.</h2>
        </div>
        <div className="about-factory-gallery">
          <figure className="about-gallery-workshop">
            <div><Image src="/assets/about/vinmounts-workshop.webp" alt="VINmounts manufacturing workshop and production equipment" fill sizes="(max-width: 900px) 94vw, 62vw" /></div>
            <figcaption><span>01</span><strong>Manufacturing Workshop</strong><small>Integrated production environment</small></figcaption>
          </figure>
          <figure>
            <div><Image src="/assets/about/vinmounts-warehouse.webp" alt="VINmounts organized product warehouse" fill sizes="(max-width: 900px) 94vw, 34vw" /></div>
            <figcaption><span>02</span><strong>Warehouse &amp; Fulfillment</strong><small>Order-ready inventory management</small></figcaption>
          </figure>
          <figure>
            <div><Image src="/assets/about/vinmounts-customer-team.webp" alt="VINmounts team meeting with international customers" fill sizes="(max-width: 900px) 94vw, 34vw" /></div>
            <figcaption><span>03</span><strong>Customer Collaboration</strong><small>Global relationships, local support</small></figcaption>
          </figure>
        </div>
      </section>

      <section className="about-engineering">
        <div className="about-engineering-intro">
          <p className="pdp-eyebrow">Our Manufacturing Foundation</p>
          <h2>Built for focused development and reliable supply.</h2>
          <p>VINmounts combines a substantial manufacturing footprint with a focused team. This foundation helps us respond to application requirements, coordinate production and support customers from initial discussion through repeat orders.</p>
        </div>
        <div className="about-engineering-stats">
          <dl>
            <div><dt>2023</dt><dd>Founded</dd></div>
            <div><dt>30,000+ m²</dt><dd>Factory area</dd></div>
            <div><dt>40+</dt><dd>Elite team members</dd></div>
          </dl>
        </div>
      </section>

      <section className="about-section about-commitment">
        <article>
          <GlobeHemisphereWest size={38} weight="bold" />
          <p className="pdp-eyebrow">Global B2B Partnership</p>
          <h2>Built around your application.</h2>
          <p>Share your device, mounting surface, operating environment and quantity. Our team will help review the most suitable configuration for your project.</p>
        </article>
        <article className="about-join">
          <Handshake size={38} weight="bold" />
          <p className="pdp-eyebrow">Work With VINmounts</p>
          <h2>Let&apos;s build the right mounting system.</h2>
          <p>Talk with our team about standard products, volume requirements or OEM / ODM development.</p>
          <a href="/inquiry#rfq-form">Start Your Project <ArrowRight size={18} weight="bold" /></a>
        </article>
      </section>

      <footer className="pdp-footer about-footer">
        <div><Brand name="VINmounts" /><p>Professional mounting systems backed by real manufacturing capability.</p></div>
        <div><strong>Company</strong><a href="/about-us">About Us</a><a href="/inquiry">Contact</a></div>
        <div><strong>Products</strong><a href="/products/fish-finder-mounts">Fish Finder Mounts</a><a href="/products/transducer-pole-systems">Transducer Pole Mounts</a></div>
        <div><strong>Programs</strong><a href="/#oem">OEM / ODM</a><a href="/#engineering">Engineering</a></div>
      </footer>
    </main>
  );
}
