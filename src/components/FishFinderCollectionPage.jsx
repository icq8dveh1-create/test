"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  FadersHorizontal,
  GridFour,
  MagnifyingGlass,
  Rows,
  ShieldCheck,
  SlidersHorizontal,
  X,
} from "@phosphor-icons/react";
import { Brand, Header } from "./HomePage";
import { withVelpawProductBrand } from "../lib/productBrand";

const ALL = "All";

function FilterFields({ mountType, material, mountTypes, materials, search, sort, setMountType, setMaterial, setSearch, setSort }) {
  return (
    <div className="ffm-filter-fields">
      <label className="ffm-search-field">
        <span>Search products</span>
        <div><MagnifyingGlass size={18} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search title or SKU" /></div>
      </label>
      <label>
        <span>Mount type</span>
        <select value={mountType} onChange={(event) => setMountType(event.target.value)}>
          <option>{ALL}</option>
          {mountTypes.map((value) => <option key={value}>{value}</option>)}
        </select>
      </label>
      <label>
        <span>Material</span>
        <select value={material} onChange={(event) => setMaterial(event.target.value)}>
          <option>{ALL}</option>
          {materials.map((value) => <option key={value}>{value}</option>)}
        </select>
      </label>
      <label>
        <span>Sort</span>
        <select value={sort} onChange={(event) => setSort(event.target.value)}>
          <option value="featured">Featured</option>
          <option value="az">Name A–Z</option>
          <option value="za">Name Z–A</option>
        </select>
      </label>
    </div>
  );
}

function ProductCard({ basePath, product }) {
  const detailHref = `${basePath}/${product.slug}`;
  return (
    <article className="ffm-product-card">
      <a className="ffm-product-visual" href={detailHref} aria-label={`View ${product.title}`}>
        <Image className="ffm-card-image-primary" src={product.images[0]} alt={product.title} fill sizes="(max-width: 680px) 50vw, (max-width: 1100px) 33vw, 20vw" />
        {product.images[1] ? <Image className="ffm-card-image-secondary" src={product.images[1]} alt="" fill sizes="(max-width: 680px) 50vw, (max-width: 1100px) 33vw, 20vw" /> : null}
        <span>{product.mountType}</span>
      </a>
      <div className="ffm-product-card-copy">
        <p>{product.material}</p>
        <h2><a href={detailHref}>{product.title}</a></h2>
        <div className="ffm-product-meta"><span>SKU {product.sku}</span><span>{product.images.length} views</span></div>
        <a className="ffm-product-link" href={detailHref}>View engineering details <ArrowRight size={16} weight="bold" /></a>
      </div>
    </article>
  );
}

const defaultConfig = {
  basePath: "/products/fish-finder-mounts",
  breadcrumb: "Fish Finder Mounts",
  eyebrow: "Display mounting systems",
  title: "Fish Finder Mounts",
  description: "Marine electronics mounting systems for fish finders and chartplotters—organized for fast B2B specification, compatibility review and OEM projects.",
  localImageCount: 251,
  ctaTitle: "Need help choosing the right mount?",
  ctaDescription: "Share the fish finder brand, model, screen size, mounting surface and target quantity. Our team will recommend a configuration.",
};

export default function FishFinderCollectionPage({ products: sourceProducts, config = defaultConfig }) {
  const products = useMemo(() => sourceProducts.map(withVelpawProductBrand), [sourceProducts]);
  const [mountType, setMountType] = useState(ALL);
  const [material, setMaterial] = useState(ALL);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("featured");
  const [density, setDensity] = useState("standard");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const mountTypes = useMemo(() => [...new Set(products.map((product) => product.mountType))].sort(), [products]);
  const materials = useMemo(() => [...new Set(products.map((product) => product.material))].sort(), [products]);

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();
    const result = products.filter((product) => {
      const matchesType = mountType === ALL || product.mountType === mountType;
      const matchesMaterial = material === ALL || product.material === material;
      const matchesQuery = !query || `${product.title} ${product.sku}`.toLowerCase().includes(query);
      return matchesType && matchesMaterial && matchesQuery;
    });
    if (sort === "az") return [...result].sort((a, b) => a.title.localeCompare(b.title));
    if (sort === "za") return [...result].sort((a, b) => b.title.localeCompare(a.title));
    return result;
  }, [material, mountType, products, search, sort]);

  function clearFilters() {
    setMountType(ALL);
    setMaterial(ALL);
    setSearch("");
    setSort("featured");
  }

  const filterProps = { mountType, material, mountTypes, materials, search, sort, setMountType, setMaterial, setSearch, setSort };

  return (
    <main className="ffm-collection-page">
      <Header />

      <nav className="pdp-breadcrumb" aria-label="Breadcrumb">
        <a href="/">Home</a><span>/</span><a href="/#systems">Products</a><span>/</span><b>{config.breadcrumb}</b>
      </nav>

      <section className="ffm-collection-hero" aria-labelledby="ffm-collection-title">
        <div>
          <p className="pdp-eyebrow">{config.eyebrow}</p>
          <h1 id="ffm-collection-title">{config.title}</h1>
          <p>{config.description}</p>
        </div>
        <dl>
          <div><dt>{products.length}</dt><dd>Product configurations</dd></div>
          <div><dt>{config.localImageCount}</dt><dd>Local product views</dd></div>
          <div><dt>RFQ</dt><dd>Engineering-led buying</dd></div>
        </dl>
      </section>

      <section className="ffm-collection-shell" aria-label={`${config.title} catalog`}>
        <div className="ffm-toolbar">
          <button className="ffm-mobile-filter" type="button" onClick={() => setFiltersOpen(true)}><FadersHorizontal size={19} /> Filter products</button>
          <FilterFields {...filterProps} />
          <div className="ffm-toolbar-state">
            <span><b>{filteredProducts.length}</b> systems</span>
            <div className="ffm-density-toggle" aria-label="Grid density">
              <button className={density === "standard" ? "is-active" : ""} type="button" onClick={() => setDensity("standard")} aria-label="Standard grid"><GridFour size={18} /></button>
              <button className={density === "compact" ? "is-active" : ""} type="button" onClick={() => setDensity("compact")} aria-label="Compact grid"><Rows size={18} /></button>
            </div>
          </div>
        </div>

        {filteredProducts.length ? (
          <div className={`ffm-product-grid is-${density}`} id="ffm-results">
            {filteredProducts.map((product) => <ProductCard basePath={config.basePath} product={product} key={product.slug} />)}
          </div>
        ) : (
          <div className="ffm-empty-state"><SlidersHorizontal size={34} /><h2>No matching systems</h2><p>Clear the filters or send your equipment model for a compatibility review.</p><button type="button" onClick={clearFilters}>Clear filters</button></div>
        )}
      </section>

      <section className="ffm-catalog-cta">
        <div><ShieldCheck size={34} weight="bold" /><p className="pdp-eyebrow">Compatibility before quotation</p><h2>{config.ctaTitle}</h2><p>{config.ctaDescription}</p></div>
        <a href="/inquiry">Start a compatibility review <ArrowRight size={20} weight="bold" /></a>
      </section>

      <footer className="pdp-footer ffm-catalog-footer">
        <div><Brand /><p>Marine mounting systems engineered for real-world installations.</p></div>
        <div><strong>Products</strong><a href={config.basePath}>{config.breadcrumb}</a><a href="/#systems">All mounting systems</a></div>
        <div><strong>Support</strong><a href="/inquiry">Compatibility review</a><a href="/blog/marine-fish-finder-mount-guide">Engineering guide</a></div>
        <div><strong>Company</strong><a href="/inquiry">OEM / ODM</a><a href="/inquiry">Contact</a></div>
      </footer>

      <div className={filtersOpen ? "ffm-filter-drawer is-open" : "ffm-filter-drawer"} aria-hidden={!filtersOpen}>
        <button className="ffm-filter-backdrop" type="button" onClick={() => setFiltersOpen(false)} aria-label="Close filters" />
        <aside aria-label="Product filters">
          <div><strong>Filter systems</strong><button type="button" onClick={() => setFiltersOpen(false)} aria-label="Close filters"><X size={22} /></button></div>
          <FilterFields {...filterProps} />
          <div className="ffm-filter-actions"><button type="button" onClick={clearFilters}>Clear</button><button type="button" onClick={() => setFiltersOpen(false)}>Show {filteredProducts.length} systems</button></div>
        </aside>
      </div>
    </main>
  );
}
