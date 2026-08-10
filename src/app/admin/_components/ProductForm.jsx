import Image from "next/image";
import Link from "next/link";
import { ArrowSquareOut, ImageSquare, UploadSimple } from "@phosphor-icons/react/dist/ssr";
import { deleteProductAction } from "../actions";
import ConfirmDeleteButton from "./ConfirmDeleteButton";
import Notice from "./Notice";
import SubmitButton from "./SubmitButton";

export default function ProductForm({ product = null, categories, action, error = "", saved = "" }) {
  const editing = Boolean(product);
  const publicHref = product ? `/products/${product.categorySlug}/${product.slug}` : "";
  return (
    <main className="admin-page admin-editor-page">
      <header className="admin-page-header"><div><Link className="admin-back-link" href="/admin/products">← Products</Link><h1>{editing ? "Edit product" : "New product"}</h1><p>{editing ? "Update product details, images and publishing status." : "Add a new product to the VELPAW catalog."}</p></div>{editing && product.status === "published" ? <Link className="admin-secondary-button" href={publicHref} target="_blank">View product <ArrowSquareOut size={17} /></Link> : null}</header>
      <Notice error={error} saved={saved} />
      <form className="admin-editor-form admin-product-form" action={action}>
        <div className="admin-form-columns">
          <div className="admin-form-primary">
            <section className="admin-form-card"><header><span>Basic information</span><h2>Product details</h2></header><div className="admin-form-grid">
              <label className="admin-field admin-field-wide"><span>Product name <b>*</b></span><input name="title" defaultValue={product?.title} placeholder="Complete product name" required /></label>
              <label className="admin-field"><span>SKU</span><input name="sku" defaultValue={product?.sku} placeholder="VLP-XXXXX" /></label>
              <label className="admin-field"><span>URL slug <b>*</b></span><input name="slug" defaultValue={product?.slug} placeholder="product-url-slug" required /></label>
              <label className="admin-field"><span>Mount type</span><input name="mountType" defaultValue={product?.mountType} placeholder="e.g. Display Mount" /></label>
              <label className="admin-field"><span>Material</span><input name="material" defaultValue={product?.material} placeholder="e.g. Marine-Grade Aluminum" /></label>
              <label className="admin-field admin-field-wide"><span>Description</span><textarea name="description" defaultValue={product?.description} rows={12} placeholder="Technical description, compatibility and application notes." /></label>
            </div></section>
            <section className="admin-form-card"><header><span>Engineering content</span><h2>Features and options</h2><p>Enter one item per line. Existing product detail pages will format them automatically.</p></header><div className="admin-form-grid">
              <label className="admin-field admin-field-wide"><span>Key features</span><textarea name="features" defaultValue={product?.features?.join("\n")} rows={12} placeholder={'Heavy Duty - Engineering detail\nUniversal Design - Compatibility detail'} /></label>
              <label className="admin-field admin-field-wide"><span>Options / variants</span><textarea name="options" defaultValue={product?.options?.join("\n")} rows={6} placeholder="One option or variant per line" /></label>
              <label className="admin-field admin-field-wide"><span>Original source URL (internal reference)</span><input name="sourceUrl" type="url" defaultValue={product?.sourceUrl} placeholder="https://..." /></label>
            </div></section>
          </div>
          <aside className="admin-form-secondary">
            <section className="admin-form-card"><header><span>Publishing</span><h2>Catalog placement</h2></header><div className="admin-form-grid single">
              <label className="admin-field"><span>Category <b>*</b></span><select name="categoryId" defaultValue={product?.categoryId || categories[0]?.id} required>{categories.map((category) => <option value={category.id} key={category.id}>{category.name}</option>)}</select></label>
              <label className="admin-field"><span>Status</span><select name="status" defaultValue={product?.status || "draft"}><option value="draft">Draft — hidden from website</option><option value="published">Published — visible on website</option></select><small className="admin-field-help">Main and detail images only appear on the public website after the product is published.</small></label>
              <label className="admin-field"><span>Display order</span><input name="sortOrder" type="number" min="0" defaultValue={product?.sortOrder || 0} /></label>
            </div></section>
            <section className="admin-form-card"><header><span>Product gallery</span><h2>Main & detail images</h2><p>JPG, PNG, WebP or AVIF · max 8 MB each, up to 12 images per save.</p></header>
              <div className="admin-image-guide"><strong>Image order</strong><p>The first image is the catalog cover and product-detail main image. Images 2–12 appear in the detail gallery. To replace the main image, mark “Main” for removal and choose the new files.</p></div>
              {product?.images?.length ? <div className="admin-existing-images">{product.images.map((image, index) => <label key={image}><input name="removeImages" type="checkbox" value={image} /><span><Image src={image} alt={`Product image ${index + 1}`} fill sizes="92px" /><b>{index === 0 ? "Main" : index + 1}</b><em>Remove</em></span><input name="existingImages" type="hidden" value={image} /></label>)}</div> : <div className="admin-no-images"><ImageSquare size={28} /><span>No product images yet.</span></div>}
              <label className="admin-upload-field"><UploadSimple size={24} /><strong>Upload main and detail images</strong><span>Select multiple files together; their order becomes the gallery order.</span><input name="newImages" type="file" accept="image/jpeg,image/png,image/webp,image/avif" multiple /></label>
            </section>
          </aside>
        </div>
        <footer className="admin-editor-actions"><Link href="/admin/products">Cancel</Link><SubmitButton>{editing ? "Save changes" : "Create product"}</SubmitButton></footer>
      </form>
      {editing ? <section className="admin-danger-zone"><div><h2>Delete product</h2><p>This removes the product record and uploaded images. Existing source catalog images are left untouched.</p></div><form action={deleteProductAction.bind(null, product.id)}><ConfirmDeleteButton>Delete product</ConfirmDeleteButton></form></section> : null}
    </main>
  );
}
