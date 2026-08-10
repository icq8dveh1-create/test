"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  CheckCircle,
  MagnifyingGlass,
  SlidersHorizontal,
  X,
} from "@phosphor-icons/react";
const fallbackCatalogs = [
  {
    key: "fish-finder-mounts",
    label: "Fish Finder Mounts",
    basePath: "/products/fish-finder-mounts",
  },
  {
    key: "transducer-pole-systems",
    label: "Transducer Pole Mounts",
    basePath: "/products/transducer-pole-systems",
  },
  {
    key: "industrial-agricultural-mounts",
    label: "Industrial & Agricultural",
    basePath: "/products/industrial-agricultural-mounts",
  },
  {
    key: "accessories",
    label: "Accessories",
    basePath: "/products/accessories",
  },
];

function productSearchText(product) {
  return [
    product.title,
    product.sku,
    product.mountType,
    product.material,
    product.description,
    ...(product.features || []),
  ].join(" ").toLowerCase();
}

export default function ProductSearchOverlay({ onClose }) {
  const [catalogs, setCatalogs] = useState(fallbackCatalogs);
  const [searchableProducts, setSearchableProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [mode, setMode] = useState("keyword");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [mountType, setMountType] = useState("all");
  const [material, setMaterial] = useState("all");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function closeOnEscape(event) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [onClose]);

  useEffect(() => {
    let active = true;
    fetch("/api/products/search", { cache: "no-store" })
      .then((response) => {
        if (!response.ok) throw new Error("Catalog search is temporarily unavailable.");
        return response.json();
      })
      .then((data) => {
        if (!active) return;
        setCatalogs(data.categories?.length ? data.categories : fallbackCatalogs);
        setSearchableProducts(data.products || []);
        setLoading(false);
      })
      .catch(() => {
        if (!active) return;
        setLoadError("Catalog search is temporarily unavailable. Please try again.");
        setLoading(false);
      });
    return () => { active = false; };
  }, []);

  const categoryProducts = useMemo(
    () => category === "all" ? searchableProducts : searchableProducts.filter((product) => product.categoryKey === category),
    [category, searchableProducts],
  );

  const mountTypes = useMemo(
    () => [...new Set(categoryProducts.map((product) => product.mountType).filter(Boolean))].sort(),
    [categoryProducts],
  );

  const materials = useMemo(
    () => [...new Set(categoryProducts.map((product) => product.material).filter(Boolean))].sort(),
    [categoryProducts],
  );

  const matches = useMemo(() => {
    if (!submitted) return [];

    if (mode === "keyword") {
      const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
      if (!terms.length) return [];
      return searchableProducts.filter((product) => {
        const haystack = productSearchText(product);
        return terms.every((term) => haystack.includes(term));
      });
    }

    return categoryProducts.filter((product) => {
      const matchesMount = mountType === "all" || product.mountType === mountType;
      const matchesMaterial = material === "all" || product.material === material;
      return matchesMount && matchesMaterial;
    });
  }, [categoryProducts, material, mode, mountType, query, searchableProducts, submitted]);

  function changeMode(nextMode) {
    setMode(nextMode);
    setSubmitted(false);
    setError("");
  }

  function runSearch(event) {
    event.preventDefault();
    if (loading) return;
    if (mode === "keyword" && !query.trim()) {
      setError("Enter a product, device model, mount type or SKU.");
      setSubmitted(false);
      return;
    }
    setError("");
    setSubmitted(true);
  }

  return (
    <div className="product-search-overlay" role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose();
    }}>
      <section className="product-search-dialog" id="product-search-dialog" role="dialog" aria-modal="true" aria-labelledby="product-search-title">
        <header className="product-search-heading">
          <div>
            <span>VELPAW SYSTEM FINDER</span>
            <h2 id="product-search-title">Find the right mounting system.</h2>
            <p>Search the complete local catalog, then open the matching engineering detail page.</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close product search"><X size={22} weight="bold" /></button>
        </header>

        <div className="product-search-tabs" role="tablist" aria-label="Product search method">
          <button className={mode === "keyword" ? "is-active" : ""} type="button" role="tab" aria-selected={mode === "keyword"} onClick={() => changeMode("keyword")}>
            <MagnifyingGlass size={18} weight="bold" /> By product or model
          </button>
          <button className={mode === "guided" ? "is-active" : ""} type="button" role="tab" aria-selected={mode === "guided"} onClick={() => changeMode("guided")}>
            <SlidersHorizontal size={18} weight="bold" /> Guided finder
          </button>
        </div>

        <form className="product-search-form" onSubmit={runSearch}>
          {mode === "keyword" ? (
            <label className="product-search-keyword">
              <span>Product, device model, mounting type or SKU</span>
              <div>
                <MagnifyingGlass size={21} aria-hidden="true" />
                <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Try Garmin LVS34, VESA, socket arm or VELPAW-C-003" autoFocus />
                <button type="submit">Search catalog <ArrowRight size={18} weight="bold" /></button>
              </div>
            </label>
          ) : (
            <div className="product-search-guided">
              <label><span>Product family</span><select value={category} onChange={(event) => { setCategory(event.target.value); setMountType("all"); setMaterial("all"); }}><option value="all">All product families</option>{catalogs.map((catalog) => <option value={catalog.key} key={catalog.key}>{catalog.label}</option>)}</select></label>
              <label><span>Mounting type</span><select value={mountType} onChange={(event) => setMountType(event.target.value)}><option value="all">All mounting types</option>{mountTypes.map((value) => <option key={value}>{value}</option>)}</select></label>
              <label><span>Primary material</span><select value={material} onChange={(event) => setMaterial(event.target.value)}><option value="all">All materials</option>{materials.map((value) => <option key={value}>{value}</option>)}</select></label>
              <button type="submit">Find matching systems <ArrowRight size={18} weight="bold" /></button>
            </div>
          )}
          {error ? <p className="product-search-error" role="alert">{error}</p> : null}
        </form>

        <div className={submitted ? "product-search-results is-visible" : "product-search-results"} aria-live="polite">
          {submitted ? (
            matches.length ? (
              <>
                <div className="product-search-result-heading"><div><CheckCircle size={20} weight="fill" /><strong>{matches.length} matching systems found</strong></div><span>Showing the first {Math.min(matches.length, 12)}</span></div>
                <div className="product-search-result-grid">
                  {matches.slice(0, 12).map((product) => (
                    <a href={product.href} className="product-search-result-card" key={`${product.categoryKey}-${product.slug}`} onClick={onClose}>
                      <span className="product-search-result-image">{product.images[0] ? <Image src={product.images[0]} alt="" fill sizes="104px" /> : <MagnifyingGlass size={24} />}</span>
                      <span className="product-search-result-copy"><small>{product.categoryLabel}</small><strong>{product.title}</strong><em>{product.mountType} · {product.material}</em><b>View product <ArrowRight size={14} weight="bold" /></b></span>
                    </a>
                  ))}
                </div>
              </>
            ) : (
              <div className="product-search-empty"><MagnifyingGlass size={30} /><h3>No exact match found.</h3><p>Try a broader model or mounting term, or send the equipment details for an engineering review.</p><a href="/inquiry" onClick={onClose}>Request compatibility support <ArrowRight size={17} weight="bold" /></a></div>
            )
          ) : (
            <div className="product-search-prompt"><span>{loadError || "Searches product titles, SKUs, materials, mount types and collected technical details."}</span><b>{loading ? "Loading catalog…" : `${searchableProducts.length} product configurations indexed locally`}</b></div>
          )}
        </div>
      </section>
    </div>
  );
}
