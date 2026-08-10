"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  CheckCircle,
  Clock,
  EnvelopeSimple,
  ListBullets,
  PaperPlaneTilt,
  Phone,
  User,
  WarningCircle,
} from "@phosphor-icons/react";
import { Brand, Header } from "./HomePage";

const TOC_ITEMS = [
  ["installation-demands", "01", "Understand installation demands"],
  ["marine-environment", "02", "Match the marine environment"],
  ["adjustability", "03", "Evaluate adjustability"],
  ["compatibility", "04", "Check compatibility"],
  ["long-term-reliability", "05", "Plan long-term reliability"],
];

function QuickInquiryForm() {
  const [status, setStatus] = useState({ type: "idle", message: "" });
  const [startedAt, setStartedAt] = useState(() => Date.now());

  async function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setStatus({ type: "loading", message: "Sending your request…" });

    try {
      const response = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          phoneCode: "",
          productRequirement: "Blog consultation",
          message: data.requirement,
          startedAt,
        }),
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message || "Submission failed.");

      form.reset();
      setStartedAt(Date.now());
      setStatus({ type: "success", message: "Thank you. Your request has been received." });
    } catch (error) {
      setStatus({
        type: "error",
        message: error instanceof Error ? error.message : "Please try again.",
      });
    }
  }

  return (
    <form className="blog-quick-form" onSubmit={handleSubmit}>
      <div className="blog-form-heading">
        <h2>Discuss Your Project</h2>
        <p>Share the basics and our product advisor will review your application.</p>
      </div>

      <label>
        <span><User size={15} /> Full name <b>*</b></span>
        <input name="name" type="text" autoComplete="name" placeholder="Your name" required maxLength={100} />
      </label>
      <label>
        <span><EnvelopeSimple size={15} /> Business email <b>*</b></span>
        <input name="email" type="email" autoComplete="email" placeholder="name@company.com" required maxLength={160} />
      </label>
      <label>
        <span><Phone size={15} /> Phone <b>*</b></span>
        <input name="phone" type="tel" autoComplete="tel" inputMode="tel" placeholder="+1 202 555 0188" required maxLength={30} />
      </label>
      <label>
        <span>Project requirement</span>
        <textarea name="requirement" rows={3} placeholder="Product, quantity and application" maxLength={800} />
      </label>

      <label className="blog-form-honeypot" aria-hidden="true">
        Website
        <input name="website" type="text" tabIndex={-1} autoComplete="off" />
      </label>

      <button type="submit" disabled={status.type === "loading"}>
        {status.type === "loading" ? "Sending…" : "Talk to an Advisor"}
        {status.type === "loading" ? <span className="blog-form-spinner" /> : <PaperPlaneTilt size={18} weight="bold" />}
      </button>

      <div className={`blog-form-status is-${status.type}`} role="status" aria-live="polite">
        {status.type === "success" ? <CheckCircle size={18} weight="fill" /> : null}
        {status.type === "error" ? <WarningCircle size={18} weight="fill" /> : null}
        <span>{status.message || "Your information is used only to respond to this inquiry."}</span>
      </div>
    </form>
  );
}

function ArticleSidebar() {
  return (
    <aside className="blog-sidebar" aria-label="Author and inquiry form">
      <div className="blog-sidebar-stack">
        <section className="blog-author-card">
          <div className="blog-author-mark" aria-hidden="true">
            <span>VP</span>
          </div>
          <div>
            <p className="blog-author-role">Product & OEM Advisor</p>
            <h2>VELPAW Product Advisor</h2>
            <p>Helping global buyers, distributors and OEM teams configure practical marine mounting systems.</p>
            <a href="/inquiry">Meet your project advisor <ArrowRight size={16} weight="bold" /></a>
          </div>
        </section>

        <QuickInquiryForm />
      </div>
    </aside>
  );
}

export default function BlogArticlePage() {
  const progressRef = useRef(null);
  const [activeSection, setActiveSection] = useState(TOC_ITEMS[0][0]);

  useEffect(() => {
    let frame = 0;
    const updateProgress = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const root = document.documentElement;
        const available = root.scrollHeight - root.clientHeight;
        const progress = available > 0 ? Math.min(window.scrollY / available, 1) : 0;
        if (progressRef.current) progressRef.current.style.transform = `scaleX(${progress})`;
      });
    };

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, []);

  useEffect(() => {
    const sections = TOC_ITEMS.map(([id]) => document.getElementById(id)).filter(Boolean);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]?.target.id) setActiveSection(visible[0].target.id);
      },
      { rootMargin: "-18% 0px -68% 0px", threshold: 0 },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <main className="blog-page">
      <Header />
      <div className="blog-reading-progress" aria-hidden="true"><span ref={progressRef} /></div>

      <article className="blog-article-shell">
        <div className="blog-content-grid">
          <div className="blog-main-column">
        <header className="blog-article-header">
          <div className="blog-article-heading">
            <p className="blog-category">Engineering Guide</p>
            <h1>How to Choose a Marine Fish Finder Mount for Demanding Installations</h1>
            <p className="blog-deck">A practical guide for B2B buyers, installers and OEM engineers evaluating secure, serviceable mounting systems for real-world marine conditions.</p>
            <div className="blog-meta">
              <span><Clock size={18} /> 8 min read</span>
              <span>Updated Aug 2026</span>
              <span>Marine Electronics</span>
            </div>
          </div>

          <div className="blog-hero-media">
            <Image
              src="/assets/applications/offshore.png"
              alt="Fish finder mounted at a marine console in offshore conditions"
              fill
              priority
              sizes="(max-width: 1040px) 100vw, 820px"
            />
            <span>Installation reference / Marine electronics</span>
          </div>
        </header>
            <nav className="blog-toc" aria-label="Quick article navigation">
              <div className="blog-toc-title"><ListBullets size={19} weight="bold" /> In this article</div>
              <ol>
                {TOC_ITEMS.map(([id, number, label]) => (
                  <li key={id}>
                    <a className={activeSection === id ? "is-active" : ""} href={`#${id}`}>
                      <b>{number}</b>
                      <span>{label}</span>
                    </a>
                  </li>
                ))}
              </ol>
            </nav>

            <div className="blog-article-body">
              <p className="blog-intro">Choosing the right marine fish finder mount is about more than holding a display in place. The mounting system needs to maintain visibility in rough conditions, protect the electronics interface and remain easy to service across the life of the vessel.</p>

              <section id="installation-demands">
                <p className="blog-section-number">01</p>
                <h2>Understand the installation demands first</h2>
                <p>Start with the vessel, operating environment and user workflow—not the mounting arm. A console installation on a commercial workboat has different load, reach and service requirements from a compact kayak or seasonal ice-fishing setup.</p>
                <p>Document the display size and weight, mounting surface, viewing position, available clearance and frequency of adjustment. These details determine the base geometry, arm length and interface plate before material or finish decisions are made.</p>
                <div className="blog-checklist">
                  <h3>Installation brief</h3>
                  <ul>
                    <li>Equipment model, weight and bolt pattern</li>
                    <li>Mounting surface and available reinforcement</li>
                    <li>Required viewing angle and operator reach</li>
                    <li>Expected vibration, impact and weather exposure</li>
                  </ul>
                </div>
              </section>

              <section id="marine-environment">
                <p className="blog-section-number">02</p>
                <h2>Match the system to the marine environment</h2>
                <p>Salt, spray, vibration and repeated adjustment expose weak points quickly. Review the primary material, fastener specification, surface treatment and how dissimilar metals are isolated. A durable assembly should also avoid pockets where water and debris collect.</p>
                <blockquote>
                  <strong>Engineering note</strong>
                  <p>Evaluate the complete assembly—not only the visible arm. Base plates, fasteners, knobs and interface hardware all contribute to long-term stability.</p>
                </blockquote>
              </section>

              <section id="adjustability">
                <p className="blog-section-number">03</p>
                <h2>Evaluate adjustability and ergonomics</h2>
                <p>Adjustability is valuable only when the equipment stays secure after positioning. Check the usable tilt, swivel and extension range, then confirm that controls remain reachable without forcing the operator into an awkward posture.</p>
                <figure className="blog-product-figure">
                  <div>
                    <Image
                      src="/assets/products/telescoping-mount.jpg"
                      alt="Adjustable telescoping marine mounting system"
                      fill
                      sizes="(max-width: 780px) 100vw, 720px"
                    />
                  </div>
                  <figcaption>Review reach, articulation and lock points as one working system.</figcaption>
                </figure>
              </section>

              <section id="compatibility">
                <p className="blog-section-number">04</p>
                <h2>Check compatibility and cable management</h2>
                <p>Confirm the device interface, fastener spacing and load direction before production. Cable routing should allow the full intended movement without pinching, excessive bending or pulling on the electronics connector.</p>
                <div className="blog-spec-table" role="table" aria-label="Compatibility review points">
                  <div role="row"><strong role="columnheader">Review point</strong><strong role="columnheader">Why it matters</strong></div>
                  <div role="row"><span role="cell">Device interface</span><span role="cell">Prevents adapters and improvised hole patterns</span></div>
                  <div role="row"><span role="cell">Load rating</span><span role="cell">Keeps movement controlled in real operating conditions</span></div>
                  <div role="row"><span role="cell">Cable clearance</span><span role="cell">Protects connectors through the full adjustment range</span></div>
                </div>
              </section>

              <section id="long-term-reliability">
                <p className="blog-section-number">05</p>
                <h2>Plan for long-term reliability and service</h2>
                <p>For distributors and fleet operators, consistency matters as much as initial performance. Ask how wear components are replaced, whether the interfaces remain compatible across the product family and which dimensions can be controlled for OEM integration.</p>
                <p>A clear specification reduces uncertainty during purchasing, installation and after-sales support. Share the equipment model, mounting location, quantity and operating environment with the supplier before requesting a final quotation.</p>
              </section>

              <section className="blog-closing-cta" aria-label="Project consultation">
                <div>
                  <h2>Need help reviewing your installation?</h2>
                  <p>Send your equipment details and application requirements for a mounting-system review.</p>
                </div>
                <a href="/inquiry">Start a project inquiry <ArrowRight size={18} weight="bold" /></a>
              </section>
            </div>
          </div>

          <ArticleSidebar />
        </div>
      </article>

      <footer className="blog-footer">
        <Brand />
        <p>Practical engineering guidance for marine mounting projects.</p>
        <a href="/">Return to homepage <ArrowRight size={16} /></a>
      </footer>
    </main>
  );
}
