"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  ArrowUp,
  ChatCircleDots,
  DownloadSimple,
  EnvelopeSimple,
  WhatsappLogo,
} from "@phosphor-icons/react";

const SALES_EMAIL = process.env.NEXT_PUBLIC_SALES_EMAIL?.trim();
const WHATSAPP_NUMBER = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "8613585089388").replace(/\D/g, "");
const EMAIL_SUBJECT = encodeURIComponent("Marine mounting project inquiry");
const WHATSAPP_MESSAGE = encodeURIComponent("Hello, I would like to discuss a marine mounting project.");
const EMAIL_HREF = SALES_EMAIL
  ? `mailto:${SALES_EMAIL}?subject=${EMAIL_SUBJECT}`
  : "/inquiry?channel=email#rfq-form";

export default function FloatingContactDock() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  useEffect(() => {
    function updateVisibility() {
      setIsVisible(window.scrollY > 180);
    }

    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });
    return () => window.removeEventListener("scroll", updateVisibility);
  }, []);

  if (pathname.startsWith("/admin")) return null;

  return (
    <aside
      className={isVisible ? "floating-contact-dock is-visible" : "floating-contact-dock"}
      aria-label="Quick contact options"
      aria-hidden={!isVisible}
    >
      <button
        className="floating-contact-action floating-contact-top"
        type="button"
        onClick={scrollToTop}
        tabIndex={isVisible ? 0 : -1}
        aria-label="Back to top"
      >
        <ArrowUp size={19} weight="bold" aria-hidden="true" />
        <span>Back to Top</span>
      </button>

      <a className="floating-contact-action floating-contact-quote" href="/inquiry#rfq-form" tabIndex={isVisible ? 0 : -1}>
        <ChatCircleDots size={19} weight="bold" aria-hidden="true" />
        <span>Get Quote</span>
      </a>

      <a
        className="floating-contact-action floating-contact-whatsapp"
        href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`}
        target="_blank"
        rel="noreferrer"
        tabIndex={isVisible ? 0 : -1}
      >
        <WhatsappLogo size={19} weight="bold" aria-hidden="true" />
        <span>WhatsApp</span>
      </a>

      <a
        className="floating-contact-action floating-contact-email"
        href={EMAIL_HREF}
        tabIndex={isVisible ? 0 : -1}
      >
        <EnvelopeSimple size={19} weight="fill" aria-hidden="true" />
        <span>Email</span>
      </a>

      <a
        className="floating-contact-action floating-contact-catalog"
        href="/inquiry?request=catalog#rfq-form"
        tabIndex={isVisible ? 0 : -1}
        aria-label="Request product catalog"
      >
        <DownloadSimple size={19} weight="bold" aria-hidden="true" />
        <span>Download Catalog</span>
      </a>
    </aside>
  );
}
