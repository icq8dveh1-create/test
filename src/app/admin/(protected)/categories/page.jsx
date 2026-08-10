import Image from "next/image";
import Link from "next/link";
import { FolderSimple, LockKey } from "@phosphor-icons/react/dist/ssr";
import { listCategories } from "../../../../lib/cms/database";
import Notice from "../../_components/Notice";

export default async function CategoriesPage({ searchParams }) {
  const { error = "", saved = "" } = await searchParams;
  const categories = listCategories();
  return (
    <main className="admin-page">
      <header className="admin-page-header"><div><span>Catalog structure</span><h1>Categories</h1><p>Edit names, descriptions and visual information for product families.</p></div><Link className="admin-primary-button" href="/admin/categories/new">Add category <b>＋</b></Link></header>
      <Notice error={error} saved={saved} />
      <section className="admin-category-grid">{categories.map((category) => <article key={category.id}>
        <div className="admin-category-image">{category.image ? <Image src={category.image} alt="" fill sizes="140px" /> : <FolderSimple size={34} />}</div>
        <div><span>{category.label || "Product family"}</span><h2>{category.name}</h2><p>{category.description || "No description added."}</p><dl><div><dt>{category.productCount}</dt><dd>Products</dd></div><div><dt>{category.active ? "Live" : "Hidden"}</dt><dd>Status</dd></div></dl><footer><code>/products/{category.slug}</code>{category.locked ? <small><LockKey size={13} />Stable URL</small> : null}<Link href={`/admin/categories/${category.id}/edit`}>Edit category</Link></footer></div>
      </article>)}</section>
    </main>
  );
}
