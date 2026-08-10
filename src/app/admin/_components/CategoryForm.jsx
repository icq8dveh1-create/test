import Link from "next/link";
import { LockKey } from "@phosphor-icons/react/dist/ssr";
import { deleteCategoryAction } from "../actions";
import ConfirmDeleteButton from "./ConfirmDeleteButton";
import Notice from "./Notice";
import SubmitButton from "./SubmitButton";

export default function CategoryForm({ category = null, action, error = "", saved = "" }) {
  const editing = Boolean(category);
  return (
    <main className="admin-page admin-editor-page">
      <header className="admin-page-header"><div><Link className="admin-back-link" href="/admin/categories">← Categories</Link><h1>{editing ? "Edit category" : "New category"}</h1><p>{editing ? "Update the public label and catalog presentation." : "Create a new product family and catalog route."}</p></div></header>
      <Notice error={error} saved={saved} />
      <form className="admin-editor-form" action={action}>
        <section className="admin-form-card"><header><span>Basic information</span><h2>Category details</h2></header><div className="admin-form-grid">
          <label className="admin-field"><span>Category name <b>*</b></span><input name="name" defaultValue={category?.name} placeholder="e.g. Fish Finder Mounts" required /></label>
          <label className="admin-field"><span>Navigation label</span><input name="label" defaultValue={category?.label} placeholder="e.g. Display Mounting" /></label>
          <label className="admin-field admin-field-wide"><span>URL slug <b>*</b>{category?.locked ? <small><LockKey size={13} /> Locked to protect existing links</small> : null}</span><div className="admin-slug-input"><em>/products/</em><input name="slug" defaultValue={category?.slug} placeholder="product-category" required readOnly={category?.locked} /></div></label>
          <label className="admin-field admin-field-wide"><span>Section eyebrow</span><input name="eyebrow" defaultValue={category?.eyebrow} placeholder="Short technical category label" /></label>
          <label className="admin-field admin-field-wide"><span>Description</span><textarea name="description" defaultValue={category?.description} rows={5} placeholder="Describe the systems in this category." /></label>
          <label className="admin-field admin-field-wide"><span>Category image path</span><input name="image" defaultValue={category?.image} placeholder="/assets/products/category/image.webp" /></label>
          <label className="admin-field"><span>Local image count</span><input name="localImageCount" type="number" min="0" defaultValue={category?.localImageCount || 0} /></label>
          <label className="admin-field"><span>Display order</span><input name="position" type="number" min="0" defaultValue={category?.position || 0} /></label>
          <label className="admin-toggle admin-field-wide"><input name="active" type="checkbox" defaultChecked={category ? category.active : true} /><span><b>Visible on the website</b><small>Hidden categories remain editable in the admin.</small></span></label>
        </div></section>
        <footer className="admin-editor-actions"><Link href="/admin/categories">Cancel</Link><SubmitButton>{editing ? "Save changes" : "Create category"}</SubmitButton></footer>
      </form>
      {editing ? <section className="admin-danger-zone"><div><h2>Delete category</h2><p>{category.locked ? "Seeded categories are protected to preserve current website routes." : category.productCount ? "Move or delete all products before deleting this category." : "Deleting this category cannot be undone."}</p></div><form action={deleteCategoryAction.bind(null, category.id)}><ConfirmDeleteButton>Delete category</ConfirmDeleteButton></form></section> : null}
    </main>
  );
}
