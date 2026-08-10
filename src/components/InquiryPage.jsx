"use client";

import Image from "next/image";
import { useState } from "react";
import {
  ArrowRight,
  CheckCircle,
  ClipboardText,
  FileText,
  GlobeHemisphereWest,
  MagnifyingGlass,
  MapPinLine,
  NavigationArrow,
  PaperPlaneTilt,
  ShieldCheck,
  WarningCircle,
  Wrench,
} from "@phosphor-icons/react";
import { Brand, Header } from "./HomePage";

const COUNTRY_CODES = [
  ["+1", "US / CA +1"],
  ["+44", "UK +44"],
  ["+49", "DE +49"],
  ["+33", "FR +33"],
  ["+39", "IT +39"],
  ["+34", "ES +34"],
  ["+31", "NL +31"],
  ["+61", "AU +61"],
  ["+64", "NZ +64"],
  ["+81", "JP +81"],
  ["+82", "KR +82"],
  ["+86", "CN +86"],
  ["+91", "IN +91"],
  ["+971", "UAE +971"],
  ["+966", "SA +966"],
];

const COUNTRIES = [
  "United States",
  "Canada",
  "United Kingdom",
  "Germany",
  "France",
  "Italy",
  "Spain",
  "Netherlands",
  "Australia",
  "New Zealand",
  "Japan",
  "South Korea",
  "China",
  "India",
  "United Arab Emirates",
  "Saudi Arabia",
  "Other",
];

const PRODUCT_OPTIONS = [
  "Fish Finder Mount",
  "Transducer Pole Mount",
  "0-Degree Mount",
  "Tablet / Camera Mount",
  "OEM / ODM Project",
  "Other / Not Sure",
];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_CHARS_PATTERN = /^[+\d\s().-]+$/;

function validateField(name, value) {
  const normalized = String(value || "").trim();

  if (name === "name" && !normalized) return "Please enter your name.";
  if (name === "email") {
    if (!normalized) return "Please enter your email address.";
    if (!EMAIL_PATTERN.test(normalized)) return "Enter a valid business email, such as name@company.com.";
  }
  if (name === "phone") {
    if (!normalized) return "Please enter your phone number.";
    const digitCount = normalized.replace(/\D/g, "").length;
    if (!PHONE_CHARS_PATTERN.test(normalized) || digitCount < 7 || digitCount > 15) {
      return "Enter a valid international phone number with 7–15 digits.";
    }
  }
  return "";
}

function FieldError({ id, message }) {
  return message ? <span className="rfq-field-error" id={id}>{message}</span> : null;
}

function InquiryPage() {
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ type: "idle", message: "" });
  const [startedAt, setStartedAt] = useState(() => Date.now());

  function handleBlur(event) {
    const { name, value } = event.currentTarget;
    if (!(["name", "email", "phone"].includes(name))) return;
    setErrors((current) => ({ ...current, [name]: validateField(name, value) }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    const nextErrors = {
      name: validateField("name", data.name),
      email: validateField("email", data.email),
      phone: validateField("phone", data.phone),
    };
    const firstInvalid = Object.keys(nextErrors).find((key) => nextErrors[key]);

    setErrors(nextErrors);
    if (firstInvalid) {
      setStatus({ type: "error", message: "Please complete all required fields marked with *." });
      form.elements.namedItem(firstInvalid)?.focus();
      return;
    }

    setStatus({ type: "loading", message: "Sending your inquiry…" });

    try {
      const response = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, startedAt }),
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message || "Submission failed.");

      form.reset();
      setErrors({});
      setStartedAt(Date.now());
      setStatus({ type: "success", message: result.message || "Your inquiry has been received." });
    } catch (error) {
      setStatus({
        type: "error",
        message: error instanceof Error ? error.message : "We could not submit your inquiry. Please try again.",
      });
    }
  }

  return (
    <main className="inquiry-page">
      <Header />

      <section className="rfq-shell" aria-labelledby="rfq-title">
        <aside className="rfq-brief">
          <Image
            className="rfq-brief-image"
            src="/assets/products/livescope-pole.jpg"
            alt=""
            fill
            sizes="(max-width: 900px) 100vw, 38vw"
            priority
          />
          <div className="rfq-brief-content">
            <p className="rfq-section-label">Inquiry / RFQ</p>
            <h1 id="rfq-title">Start Your Project</h1>
            <p className="rfq-lead">Tell us what you need. We’ll help configure the right mounting solution.</p>

            <div className="rfq-process" aria-label="Inquiry process">
              <h2>A simple process</h2>
              <ol>
                <li>
                  <span><ClipboardText size={24} /></span>
                  <div><strong>1. Submit</strong><p>Share the equipment, application and quantity you need.</p></div>
                </li>
                <li>
                  <span><MagnifyingGlass size={24} /></span>
                  <div><strong>2. Review</strong><p>We review compatibility, environment and project requirements.</p></div>
                </li>
                <li>
                  <span><Wrench size={24} /></span>
                  <div><strong>3. Respond</strong><p>We recommend a suitable configuration and clear next steps.</p></div>
                </li>
              </ol>
            </div>

            <p className="rfq-built-note"><ShieldCheck size={24} /> <span><strong>Built to perform.</strong> Project details are reviewed for your intended application.</span></p>
          </div>
        </aside>

        <section className="rfq-form-panel" id="rfq-form" aria-label="B2B inquiry form">
          <div className="rfq-form-heading">
            <div>
              <p>Project brief</p>
              <h2>Request a mounting solution.</h2>
            </div>
            <span><b>*</b> Required fields</span>
          </div>

          <div className={`rfq-status rfq-status-${status.type}`} aria-live="polite" role="status">
            {status.type === "success" ? <CheckCircle size={22} weight="fill" /> : null}
            {status.type === "error" ? <WarningCircle size={22} weight="fill" /> : null}
            {status.message || "Complete the form and we’ll review your project requirements."}
          </div>

          <form className="rfq-form" onSubmit={handleSubmit} noValidate>
            <div className="rfq-form-grid">
              <label className="rfq-field">
                <span>Name <b>*</b></span>
                <input name="name" type="text" autoComplete="name" placeholder="Enter your full name" required maxLength={100} onBlur={handleBlur} aria-invalid={Boolean(errors.name)} aria-describedby="name-error" />
                <FieldError id="name-error" message={errors.name} />
              </label>

              <label className="rfq-field">
                <span>Email <b>*</b></span>
                <input name="email" type="email" autoComplete="email" inputMode="email" placeholder="name@company.com" required maxLength={160} onBlur={handleBlur} aria-invalid={Boolean(errors.email)} aria-describedby="email-error" />
                <FieldError id="email-error" message={errors.email} />
              </label>

              <fieldset className="rfq-field rfq-phone-field">
                <legend>Phone <b>*</b></legend>
                <div className="rfq-phone-row">
                  <label>
                    <span className="sr-only">Country calling code</span>
                    <select name="phoneCode" defaultValue="+1" aria-label="Country calling code">
                      {COUNTRY_CODES.map(([value, label]) => <option value={value} key={value}>{label}</option>)}
                    </select>
                  </label>
                  <input name="phone" type="tel" autoComplete="tel-national" inputMode="tel" placeholder="20 7946 0958" required maxLength={30} onBlur={handleBlur} aria-invalid={Boolean(errors.phone)} aria-describedby="phone-error" />
                </div>
                <FieldError id="phone-error" message={errors.phone} />
              </fieldset>

              <label className="rfq-field">
                <span>Company Name <em>Optional</em></span>
                <input name="company" type="text" autoComplete="organization" placeholder="Company or organization" maxLength={160} />
              </label>

              <label className="rfq-field">
                <span>Country / Region <em>Optional</em></span>
                <select name="country" defaultValue="" autoComplete="country-name">
                  <option value="" disabled>Select country / region</option>
                  {COUNTRIES.map((country) => <option value={country} key={country}>{country}</option>)}
                </select>
              </label>

              <label className="rfq-field">
                <span>Product Requirement <em>Optional</em></span>
                <select name="productRequirement" defaultValue="">
                  <option value="" disabled>Select product or system</option>
                  {PRODUCT_OPTIONS.map((product) => <option value={product} key={product}>{product}</option>)}
                </select>
              </label>

              <label className="rfq-field rfq-field-wide">
                <span>Message <em>Optional</em></span>
                <textarea name="message" rows={5} placeholder="Tell us about your equipment, mounting surface, operating environment, quantity and timeline." maxLength={2000} />
                <small>Include any model numbers or drawings that will help us review compatibility.</small>
              </label>
            </div>

            <label className="rfq-honeypot" aria-hidden="true">
              Website
              <input name="website" type="text" tabIndex={-1} autoComplete="off" />
            </label>
            <input name="startedAt" type="hidden" value={startedAt} readOnly />

            <div className="rfq-form-footer">
              <p><ShieldCheck size={18} /> Your information is used only to respond to this inquiry.</p>
              <button className="rfq-submit" type="submit" disabled={status.type === "loading"}>
                {status.type === "loading" ? "Sending…" : "Send Inquiry"}
                {status.type === "loading" ? <span className="rfq-spinner" aria-hidden="true" /> : <PaperPlaneTilt size={20} weight="bold" />}
              </button>
            </div>
          </form>
        </section>
      </section>

      <section className="rfq-location" aria-labelledby="rfq-location-title">
        <div className="rfq-location-copy">
          <p className="rfq-location-kicker"><MapPinLine size={18} weight="fill" /> USA Office</p>
          <h2 id="rfq-location-title">Visit our California office.</h2>
          <p className="rfq-location-intro">Connect with our team for product selection, OEM/ODM projects and mounting system support.</p>

          <address className="rfq-location-address">
            <span>Company address</span>
            <strong>4182 Santa Monica Blvd</strong>
            Burbank, CA 90014<br />
            USA
          </address>

          <a
            className="rfq-map-link"
            href="https://www.openstreetmap.org/?mlat=34.09115&mlon=-118.28328#map=17/34.09115/-118.28328"
            target="_blank"
            rel="noreferrer"
          >
            Open in OpenStreetMap <NavigationArrow size={19} weight="bold" />
          </a>
        </div>

        <div className="rfq-map-frame">
          <div className="rfq-map-toolbar" aria-hidden="true">
            <span><i /> California, USA</span>
            <b>OpenStreetMap</b>
          </div>
          <div className="rfq-map-canvas">
            <iframe
              title="Map showing the company office at 4182 Santa Monica Boulevard"
              src="https://www.openstreetmap.org/export/embed.html?bbox=-118.2893%2C34.0871%2C-118.2773%2C34.0951&amp;layer=mapnik&amp;marker=34.09115%2C-118.28328"
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>
          <p className="rfq-map-credit">Map data <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">© OpenStreetMap contributors</a></p>
        </div>
      </section>

      <section className="rfq-confidence" aria-label="What happens next">
        <article><GlobeHemisphereWest size={34} /><div><strong>Global project intake</strong><p>International phone formats and regional requirements are supported.</p></div></article>
        <article><Wrench size={34} /><div><strong>Configuration review</strong><p>We assess the product, interface and application information you provide.</p></div></article>
        <article><FileText size={34} /><div><strong>Clear next steps</strong><p>We follow up with the information needed to progress your project.</p></div></article>
      </section>

      <footer className="rfq-footer">
        <Brand />
        <p>Modular mounting systems for marine electronics.</p>
        <a href="/">Return to homepage <ArrowRight size={16} /></a>
      </footer>
    </main>
  );
}

export default InquiryPage;
