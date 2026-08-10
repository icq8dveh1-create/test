import Image from "next/image";
import Link from "next/link";
import { MagnifyingGlass, Package } from "@phosphor-icons/react/dist/ssr";
import { encodeProductAdminId, listCategories, listProducts } from "../../../../lib/cms/database";
import Notice from "../../_components/Notice";

function pageHref(filters, page) {
  const params = new URLSearchParams();
  if (filters.query) params.set("query", filters.query);
  if (filters.categoryId) params.set("category", filters.categoryId);
  if (filters.status) params.set("status", filters.status);
  if (page > 1) params.set("page", String(page));
  return `/admin/products${params.size ? `?${params}` : ""}`;
}

function formatDate(value) {
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(value));
}

export default async function ProductsPage({ searchParams }) {
  const query = await searchParams;
  const filters = { query: query.query || "", categoryId: query.category || "", status: query.status || "" };
  const result = listProducts({ ...filters, page: query.page || 1, pageSize: 18 });
  const categories = listCategories();
  return (
    <main className="admin-page">
      <header className="admin-page-header"><div><span>Catalog content</span><h1>Products</h1><p>Search, publish and update all VELPAW product records.</p></div><Link className="admin-primary-button" href="/admin/products/new">Add product <b>＋</b></Link></header>
      <Notice error={query.error} saved={query.saved} />
      <section className="admin-panel admin-products-panel">
        <form className="admin-filter-bar">
          <label><span className="sr-only">Search products</span><MagnifyingGlass size={18} /><input name="query" defaultValue={filters.query} placeholder="Search product, SKU or slug" /></label>
          <select name="category" defaultValue={filters.categoryId} aria-label="Filter by category"><option value="">All categories</option>{categories.map((category) => <option value={category.id} key={category.id}>{category.name}</option>)}</select>
          <select name="status" defaultValue={filters.status} aria-label="Filter by status"><option value="">All statuses</option><option value="published">Published</option><option value="draft">Draft</option></select>
          <button type="submit">Apply filters</button>{filters.query || filters.categoryId || filters.status ? <Link href="/admin/products">Clear</Link> : null}
        </form>
        <div className="admin-result-summary"><strong>{result.total}</strong> products found</div>
        <div className="admin-table-wrap"><table className="admin-table admin-products-table"><thead><tr><th>Product</th><th>Category</th><th>Status</th><th>Updated</th><th><span className="sr-only">Action</span></th></tr></thead><tbody>{result.products.map((product) => <tr key={product.id}>
          <td><div className="admin-product-cell"><span>{product.images[0] ? <Image src={product.images[0]} alt="" fill sizes="54px" /> : <Package size={22} />}</span><div><strong>{product.title}</strong><small>SKU: {product.sku || "—"} · {product.mountType || "Unspecified"}</small></div></div></td>
          <td>{product.categoryName}</td><td><em className={`admin-status is-${product.status}`}>{product.status}</em></td><td>{formatDate(product.updatedAt)}</td><td><Link className="admin-edit-link" href={`/admin/products/${encodeProductAdminId(product.id)}/edit`}>Edit</Link></td>
        </tr>)}</tbody></table>{!result.products.length ? <div className="admin-empty"><Package size={32} /><h2>No products found</h2><p>Adjust the filters or create a new product.</p></div> : null}</div>
        {result.pageCount > 1 ? <nav className="admin-pagination" aria-label="Product pages"><Link aria-disabled={result.page === 1} href={pageHref(filters, Math.max(1, result.page - 1))}>← Previous</Link><span>Page {result.page} of {result.pageCount}</span><Link aria-disabled={result.page === result.pageCount} href={pageHref(filters, Math.min(result.pageCount, result.page + 1))}>Next →</Link></nav> : null}
      </section>
    </main>
  );
}
