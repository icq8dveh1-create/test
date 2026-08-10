import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle, Clock, FolderSimple, Package } from "@phosphor-icons/react/dist/ssr";
import { encodeProductAdminId, getDashboardSummary, listProducts } from "../../../lib/cms/database";

function formatDate(value) {
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(value));
}

export default function AdminDashboardPage() {
  const summary = getDashboardSummary();
  const { products } = listProducts({ pageSize: 6 });
  const stats = [
    { label: "Products", value: summary.products, icon: Package },
    { label: "Categories", value: summary.categories, icon: FolderSimple },
    { label: "Published", value: summary.published, icon: CheckCircle },
    { label: "Drafts", value: summary.drafts, icon: Clock },
  ];
  return (
    <main className="admin-page">
      <header className="admin-page-header"><div><span>Overview</span><h1>Dashboard</h1><p>Manage the VELPAW product catalog without adding weight to the public website.</p></div><Link className="admin-primary-button" href="/admin/products/new">Add product <b>＋</b></Link></header>
      <section className="admin-stats" aria-label="Catalog summary">{stats.map(({ label, value, icon: Icon }) => <article key={label}><i><Icon size={22} /></i><strong>{value}</strong><span>{label}</span></article>)}</section>
      <section className="admin-panel">
        <header className="admin-panel-header"><div><span>Recently updated</span><h2>Product activity</h2></div><Link href="/admin/products">View all products <ArrowRight size={16} /></Link></header>
        <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Product</th><th>Category</th><th>Status</th><th>Updated</th><th><span className="sr-only">Action</span></th></tr></thead><tbody>{products.map((product) => <tr key={product.id}><td><div className="admin-product-cell"><span>{product.images[0] ? <Image src={product.images[0]} alt="" fill sizes="54px" /> : <Package size={22} />}</span><div><strong>{product.title}</strong><small>SKU: {product.sku || "—"}</small></div></div></td><td>{product.categoryName}</td><td><em className={`admin-status is-${product.status}`}>{product.status}</em></td><td>{formatDate(product.updatedAt)}</td><td><Link className="admin-edit-link" href={`/admin/products/${encodeProductAdminId(product.id)}/edit`}>Edit</Link></td></tr>)}</tbody></table></div>
      </section>
    </main>
  );
}
