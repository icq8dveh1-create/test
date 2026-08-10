"use server";

import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createCategory as insertCategory,
  createProduct as insertProduct,
  deleteCategory as removeCategory,
  deleteProduct as removeProduct,
  encodeProductAdminId,
  getCategory,
  getProduct,
  updateCategory as saveCategory,
  updateProduct as saveProduct,
} from "../../lib/cms/database";
import {
  assertAdmin,
  clearAdminSession,
  createAdminSession,
  verifyCredentials,
} from "../../lib/cms/auth";

const loginAttempts = globalThis.__velpawLoginAttempts || new Map();
if (process.env.NODE_ENV !== "production") globalThis.__velpawLoginAttempts = loginAttempts;

function textValue(formData, name) {
  return String(formData.get(name) || "").trim();
}

function values(formData, name) {
  return formData.getAll(name).map(String).filter(Boolean);
}

function lines(value) {
  return String(value || "").split(/\r?\n/).map((item) => item.trim()).filter(Boolean);
}

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}

function positiveInteger(value, fallback = 0) {
  const number = Number.parseInt(value, 10);
  return Number.isFinite(number) && number >= 0 ? number : fallback;
}

function messageUrl(pathname, key, value) {
  const params = new URLSearchParams({ [key]: value });
  return `${pathname}?${params.toString()}`;
}

function revalidateCatalog(categorySlug, productSlug = "") {
  revalidatePath("/");
  revalidatePath(`/products/${categorySlug}`);
  if (productSlug) revalidatePath(`/products/${categorySlug}/${productSlug}`);
  revalidatePath("/api/products/search");
  revalidatePath("/admin");
  revalidatePath("/admin/categories");
  revalidatePath("/admin/products");
}

async function clientAddress() {
  const requestHeaders = await headers();
  return requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
}

export async function loginAction(formData) {
  const address = await clientAddress();
  const attempt = loginAttempts.get(address) || { count: 0, blockedUntil: 0 };
  if (attempt.blockedUntil > Date.now()) {
    redirect(messageUrl("/admin/login", "error", "Too many attempts. Try again in 10 minutes."));
  }

  const username = textValue(formData, "username");
  const password = textValue(formData, "password");
  if (!verifyCredentials(username, password)) {
    const count = attempt.count + 1;
    loginAttempts.set(address, {
      count: count >= 5 ? 0 : count,
      blockedUntil: count >= 5 ? Date.now() + 10 * 60 * 1000 : 0,
    });
    redirect(messageUrl("/admin/login", "error", "Incorrect username or password."));
  }

  loginAttempts.delete(address);
  await createAdminSession(username);
  redirect("/admin");
}

export async function logoutAction() {
  await clearAdminSession();
  redirect("/admin/login");
}

function categoryInput(formData, current = null) {
  const name = textValue(formData, "name");
  const requestedSlug = slugify(textValue(formData, "slug") || name);
  if (!name || !requestedSlug) throw new Error("Category name and URL slug are required.");
  return {
    name,
    label: textValue(formData, "label"),
    slug: current?.locked ? current.slug : requestedSlug,
    eyebrow: textValue(formData, "eyebrow"),
    description: textValue(formData, "description"),
    image: textValue(formData, "image"),
    localImageCount: positiveInteger(textValue(formData, "localImageCount")),
    position: positiveInteger(textValue(formData, "position"), current?.position || 0),
    active: formData.get("active") === "on",
  };
}

export async function createCategoryAction(formData) {
  await assertAdmin();
  let id;
  try {
    id = insertCategory(categoryInput(formData));
  } catch (error) {
    redirect(messageUrl("/admin/categories/new", "error", error.message.includes("UNIQUE") ? "That category URL already exists." : error.message));
  }
  revalidateCatalog(textValue(formData, "slug"));
  redirect(`/admin/categories/${id}/edit?saved=created`);
}

export async function updateCategoryAction(id, formData) {
  await assertAdmin();
  const current = getCategory(id);
  if (!current) redirect("/admin/categories?error=Category+not+found");
  let input;
  try {
    input = categoryInput(formData, current);
    saveCategory(id, input);
  } catch (error) {
    redirect(messageUrl(`/admin/categories/${id}/edit`, "error", error.message.includes("UNIQUE") ? "That category URL already exists." : error.message));
  }
  revalidateCatalog(current.slug);
  revalidateCatalog(input.slug);
  redirect(`/admin/categories/${id}/edit?saved=updated`);
}

export async function deleteCategoryAction(id) {
  await assertAdmin();
  const category = getCategory(id);
  if (!category) redirect("/admin/categories?error=Category+not+found");
  if (!removeCategory(id)) {
    redirect("/admin/categories?error=Seeded+or+non-empty+categories+cannot+be+deleted");
  }
  revalidateCatalog(category.slug);
  redirect("/admin/categories?saved=deleted");
}

async function saveUploads(formData, slug) {
  const allowed = new Map([
    ["image/jpeg", "jpg"],
    ["image/png", "png"],
    ["image/webp", "webp"],
    ["image/avif", "avif"],
  ]);
  const files = formData.getAll("newImages").filter((file) => file && typeof file.arrayBuffer === "function" && file.size > 0);
  if (files.length > 12) throw new Error("Upload no more than 12 images at a time.");
  const saved = [];
  const directory = path.join(process.cwd(), "public", "uploads", "products", slug);
  await mkdir(directory, { recursive: true });
  for (const [index, file] of files.entries()) {
    if (!allowed.has(file.type)) throw new Error("Images must be JPG, PNG, WebP or AVIF.");
    if (file.size > 8 * 1024 * 1024) throw new Error("Each image must be 8 MB or smaller.");
    const extension = allowed.get(file.type);
    const fileName = `${Date.now()}-${index + 1}.${extension}`;
    await writeFile(path.join(directory, fileName), Buffer.from(await file.arrayBuffer()));
    saved.push(`/uploads/products/${slug}/${fileName}`);
  }
  return saved;
}

async function deleteUploadedImages(images) {
  for (const image of images) {
    if (!image.startsWith("/uploads/products/")) continue;
    const absolutePath = path.resolve(process.cwd(), "public", image.replace(/^\/+/, ""));
    const uploadRoot = path.resolve(process.cwd(), "public", "uploads", "products");
    if (!absolutePath.startsWith(uploadRoot + path.sep)) continue;
    await unlink(absolutePath).catch(() => {});
  }
}

async function productInput(formData, current = null) {
  const title = textValue(formData, "title");
  const slug = slugify(textValue(formData, "slug") || title);
  const categoryId = positiveInteger(textValue(formData, "categoryId"));
  if (!title || !slug || !categoryId) throw new Error("Product name, URL slug and category are required.");
  const existingImages = values(formData, "existingImages");
  const removedImages = new Set(values(formData, "removeImages"));
  const retainedImages = existingImages.filter((image) => !removedImages.has(image));
  const uploadedImages = await saveUploads(formData, slug);
  const replacingMainImage = existingImages[0] && removedImages.has(existingImages[0]) && uploadedImages.length > 0;
  const productImages = replacingMainImage ? [...uploadedImages, ...retainedImages] : [...retainedImages, ...uploadedImages];
  const status = textValue(formData, "status") === "published" ? "published" : "draft";
  if (status === "published" && !productImages.length) {
    await deleteUploadedImages(uploadedImages);
    throw new Error("Published products need at least one product image.");
  }
  return {
    input: {
      categoryId,
      slug,
      title,
      sku: textValue(formData, "sku"),
      mountType: textValue(formData, "mountType"),
      material: textValue(formData, "material"),
      description: textValue(formData, "description"),
      features: lines(textValue(formData, "features")),
      options: lines(textValue(formData, "options")),
      images: productImages,
      sourceUrl: textValue(formData, "sourceUrl"),
      status,
      sortOrder: positiveInteger(textValue(formData, "sortOrder"), current?.sortOrder || 0),
    },
    removedImages: [...removedImages],
    uploadedImages,
  };
}

export async function createProductAction(formData) {
  await assertAdmin();
  let payload;
  let id;
  try {
    payload = await productInput(formData);
    id = insertProduct(payload.input);
  } catch (error) {
    if (payload?.uploadedImages) await deleteUploadedImages(payload.uploadedImages);
    redirect(messageUrl("/admin/products/new", "error", error.message.includes("UNIQUE") ? "That product URL already exists in this category." : error.message));
  }
  const category = getCategory(payload.input.categoryId);
  revalidateCatalog(category.slug, payload.input.slug);
  redirect(`/admin/products/${encodeProductAdminId(id)}/edit?saved=created`);
}

export async function updateProductAction(id, formData) {
  await assertAdmin();
  const current = getProduct(id);
  if (!current) redirect("/admin/products?error=Product+not+found");
  let payload;
  try {
    payload = await productInput(formData, current);
    saveProduct(id, payload.input);
  } catch (error) {
    if (payload?.uploadedImages) await deleteUploadedImages(payload.uploadedImages);
    redirect(messageUrl(`/admin/products/${encodeProductAdminId(current.id)}/edit`, "error", error.message.includes("UNIQUE") ? "That product URL already exists in this category." : error.message));
  }
  await deleteUploadedImages(payload.removedImages);
  const nextCategory = getCategory(payload.input.categoryId);
  revalidateCatalog(current.categorySlug, current.slug);
  revalidateCatalog(nextCategory.slug, payload.input.slug);
  redirect(`/admin/products/${encodeProductAdminId(current.id)}/edit?saved=updated`);
}

export async function deleteProductAction(id) {
  await assertAdmin();
  const product = getProduct(id);
  if (!product) redirect("/admin/products?error=Product+not+found");
  removeProduct(id);
  await deleteUploadedImages(product.images);
  revalidateCatalog(product.categorySlug, product.slug);
  redirect("/admin/products?saved=deleted");
}
