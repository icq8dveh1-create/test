import { mkdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import { randomUUID } from "node:crypto";

const DATA_DIRECTORY = path.join(process.cwd(), ".data");
const DATABASE_PATH = path.join(DATA_DIRECTORY, "velpaw-cms.sqlite");

const CATEGORY_SEEDS = [
  {
    key: "fish-finder-mounts",
    name: "Fish Finder Mounts",
    label: "Display Mounting",
    slug: "fish-finder-mounts",
    eyebrow: "Display mounting systems",
    description: "Marine electronics mounting systems for fish finders and chartplotters.",
    image: "/assets/products/telescoping-mount.jpg",
    localImageCount: 251,
    fileName: "fishFinderProducts.json",
  },
  {
    key: "transducer-pole-systems",
    name: "Transducer Pole Mounts",
    label: "Sonar Positioning",
    slug: "transducer-pole-systems",
    eyebrow: "Live sonar positioning systems",
    description: "Complete pole systems and transducer positioning mounts for marine installations.",
    image: "/assets/products/livescope-pole.jpg",
    localImageCount: 157,
    fileName: "transducerPoleProducts.json",
  },
  {
    key: "industrial-agricultural-mounts",
    name: "Industrial & Agricultural Mounts",
    label: "Industrial Platforms",
    slug: "industrial-agricultural-mounts",
    eyebrow: "Industrial equipment mounting systems",
    description: "AMPS, VESA and heavy-duty mounting systems for vehicles and equipment.",
    image: "/assets/products/industrial-agricultural-catalog/windfrd-c-003-8-7a/01.webp",
    localImageCount: 55,
    fileName: "industrialAgriculturalProducts.json",
  },
  {
    key: "accessories",
    name: "Accessories",
    label: "System Components",
    slug: "accessories",
    eyebrow: "Mounting system components",
    description: "Arms, bases, adapters and supporting hardware for complete installations.",
    image: "/assets/products/accessories-catalog/windfrd-c-00315a043/01.webp",
    localImageCount: 181,
    fileName: "accessoriesProducts.json",
  },
];

function json(value, fallback = []) {
  try {
    const parsed = JSON.parse(value || "");
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

function brandText(value = "") {
  return typeof value === "string" ? value.replace(/windfrd/gi, "VELPAW") : value;
}

function brandArray(values = []) {
  return values.map((value) => typeof value === "string" ? brandText(value) : value);
}

export function encodeProductAdminId(id) {
  return Buffer.from(String(id), "utf8").toString("base64url");
}

function decodeProductAdminId(identifier) {
  const value = String(identifier || "");
  if (!value || value.includes(":")) return value;
  try {
    const decoded = Buffer.from(value, "base64url").toString("utf8");
    return decoded.includes(":") || /^[0-9a-f-]{36}$/i.test(decoded) ? decoded : value;
  } catch {
    return value;
  }
}

function mapCategory(row) {
  if (!row) return null;
  return {
    id: Number(row.id),
    key: row.key,
    name: row.name,
    label: row.label,
    slug: row.slug,
    eyebrow: row.eyebrow,
    description: row.description,
    image: row.image,
    localImageCount: Number(row.local_image_count || 0),
    position: Number(row.position || 0),
    active: Boolean(row.active),
    locked: Boolean(row.locked),
    productCount: Number(row.product_count || 0),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapProduct(row) {
  if (!row) return null;
  return {
    id: row.id,
    categoryId: Number(row.category_id),
    categorySlug: row.category_slug,
    categoryName: row.category_name,
    slug: row.slug,
    title: row.title,
    sku: row.sku,
    mountType: row.mount_type,
    material: row.material,
    description: row.description,
    features: json(row.features),
    options: json(row.options),
    images: json(row.images),
    sourceUrl: row.source_url,
    status: row.status,
    sortOrder: Number(row.sort_order || 0),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function createDatabase() {
  mkdirSync(DATA_DIRECTORY, { recursive: true });
  const db = new DatabaseSync(DATABASE_PATH);
  db.exec("PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON; PRAGMA busy_timeout = 5000;");
  db.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      key TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      label TEXT NOT NULL DEFAULT '',
      slug TEXT NOT NULL UNIQUE,
      eyebrow TEXT NOT NULL DEFAULT '',
      description TEXT NOT NULL DEFAULT '',
      image TEXT NOT NULL DEFAULT '',
      local_image_count INTEGER NOT NULL DEFAULT 0,
      position INTEGER NOT NULL DEFAULT 0,
      active INTEGER NOT NULL DEFAULT 1,
      locked INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
      slug TEXT NOT NULL,
      title TEXT NOT NULL,
      sku TEXT NOT NULL DEFAULT '',
      mount_type TEXT NOT NULL DEFAULT '',
      material TEXT NOT NULL DEFAULT '',
      description TEXT NOT NULL DEFAULT '',
      features TEXT NOT NULL DEFAULT '[]',
      options TEXT NOT NULL DEFAULT '[]',
      images TEXT NOT NULL DEFAULT '[]',
      source_url TEXT NOT NULL DEFAULT '',
      status TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('published', 'draft')),
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      UNIQUE(category_id, slug)
    );
    CREATE INDEX IF NOT EXISTS products_category_idx ON products(category_id, status, sort_order);
    CREATE INDEX IF NOT EXISTS products_search_idx ON products(title, sku);
  `);
  seedDatabase(db);
  migrateDatabase(db);
  return db;
}

function seedDatabase(db) {
  const now = new Date().toISOString();
  db.exec("BEGIN IMMEDIATE");
  try {
    const existing = db.prepare("SELECT COUNT(*) AS count FROM categories").get();
    if (Number(existing.count) > 0) {
      db.exec("COMMIT");
      return;
    }
    const categoryInsert = db.prepare(`
      INSERT INTO categories
        (key, name, label, slug, eyebrow, description, image, local_image_count, position, active, locked, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 1, ?, ?)
    `);
    const productInsert = db.prepare(`
      INSERT INTO products
        (id, category_id, slug, title, sku, mount_type, material, description, features, options, images, source_url, status, sort_order, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'published', ?, ?, ?)
    `);

    CATEGORY_SEEDS.forEach((category, categoryIndex) => {
      const result = categoryInsert.run(
        category.key,
        category.name,
        category.label,
        category.slug,
        category.eyebrow,
        category.description,
        category.image,
        category.localImageCount,
        categoryIndex,
        now,
        now,
      );
      const categoryId = Number(result.lastInsertRowid);
      const filePath = path.join(process.cwd(), "src", "data", category.fileName);
      const products = JSON.parse(readFileSync(filePath, "utf8"));
      products.forEach((product, productIndex) => {
        productInsert.run(
          `${category.slug}:${product.id || randomUUID()}`,
          categoryId,
          product.slug,
          brandText(product.title),
          brandText(product.sku || ""),
          brandText(product.mountType || ""),
          brandText(product.material || ""),
          brandText(product.description || ""),
          JSON.stringify(brandArray(product.features || [])),
          JSON.stringify(brandArray(product.options || [])),
          JSON.stringify(product.images || []),
          product.sourceUrl || "",
          productIndex,
          now,
          now,
        );
      });
    });
    db.exec("COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}

function migrateDatabase(db) {
  const version = Number(db.prepare("PRAGMA user_version").get().user_version || 0);
  if (version >= 2) return;
  const rows = db.prepare("SELECT id, title, sku, mount_type, material, description, features, options FROM products").all();
  const update = db.prepare("UPDATE products SET title = ?, sku = ?, mount_type = ?, material = ?, description = ?, features = ?, options = ? WHERE id = ?");
  db.exec("BEGIN IMMEDIATE");
  try {
    rows.forEach((row) => update.run(
      brandText(row.title),
      brandText(row.sku),
      brandText(row.mount_type),
      brandText(row.material),
      brandText(row.description),
      JSON.stringify(brandArray(json(row.features))),
      JSON.stringify(brandArray(json(row.options))),
      row.id,
    ));
    db.exec("PRAGMA user_version = 2; COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}

const globalStore = globalThis;
const database = globalStore.__velpawCmsDatabase || createDatabase();
if (process.env.NODE_ENV !== "production") globalStore.__velpawCmsDatabase = database;

export function getDashboardSummary() {
  const productCounts = database.prepare(`
    SELECT COUNT(*) AS total,
      SUM(CASE WHEN status = 'published' THEN 1 ELSE 0 END) AS published,
      SUM(CASE WHEN status = 'draft' THEN 1 ELSE 0 END) AS drafts
    FROM products
  `).get();
  const categories = database.prepare("SELECT COUNT(*) AS total FROM categories WHERE active = 1").get();
  return {
    products: Number(productCounts.total || 0),
    published: Number(productCounts.published || 0),
    drafts: Number(productCounts.drafts || 0),
    categories: Number(categories.total || 0),
  };
}

export function listCategories({ activeOnly = false } = {}) {
  const where = activeOnly ? "WHERE c.active = 1" : "";
  return database.prepare(`
    SELECT c.*, COUNT(p.id) AS product_count
    FROM categories c LEFT JOIN products p ON p.category_id = c.id
    ${where}
    GROUP BY c.id ORDER BY c.position ASC, c.name ASC
  `).all().map(mapCategory);
}

export function getCategory(identifier) {
  const isId = /^\d+$/.test(String(identifier));
  const row = database.prepare(`
    SELECT c.*, COUNT(p.id) AS product_count
    FROM categories c LEFT JOIN products p ON p.category_id = c.id
    WHERE c.${isId ? "id" : "slug"} = ? GROUP BY c.id
  `).get(identifier);
  return mapCategory(row);
}

export function createCategory(input) {
  const now = new Date().toISOString();
  const position = Number(database.prepare("SELECT COALESCE(MAX(position), -1) + 1 AS next FROM categories").get().next);
  const result = database.prepare(`
    INSERT INTO categories
      (key, name, label, slug, eyebrow, description, image, local_image_count, position, active, locked, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?)
  `).run(input.slug, input.name, input.label, input.slug, input.eyebrow, input.description, input.image, input.localImageCount, position, input.active ? 1 : 0, now, now);
  return Number(result.lastInsertRowid);
}

export function updateCategory(id, input) {
  const current = getCategory(id);
  if (!current) return false;
  const slug = current.locked ? current.slug : input.slug;
  database.prepare(`
    UPDATE categories SET name = ?, label = ?, slug = ?, eyebrow = ?, description = ?, image = ?, local_image_count = ?, position = ?, active = ?, updated_at = ?
    WHERE id = ?
  `).run(input.name, input.label, slug, input.eyebrow, input.description, input.image, input.localImageCount, input.position, input.active ? 1 : 0, new Date().toISOString(), id);
  return true;
}

export function deleteCategory(id) {
  const category = getCategory(id);
  if (!category || category.locked || category.productCount > 0) return false;
  return database.prepare("DELETE FROM categories WHERE id = ?").run(id).changes > 0;
}

export function listProducts({ query = "", categoryId = "", status = "", page = 1, pageSize = 20 } = {}) {
  const clauses = [];
  const values = [];
  if (query) {
    clauses.push("(p.title LIKE ? OR p.sku LIKE ? OR p.slug LIKE ?)");
    const term = `%${query}%`;
    values.push(term, term, term);
  }
  if (categoryId) {
    clauses.push("p.category_id = ?");
    values.push(Number(categoryId));
  }
  if (status) {
    clauses.push("p.status = ?");
    values.push(status);
  }
  const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
  const total = Number(database.prepare(`SELECT COUNT(*) AS count FROM products p ${where}`).get(...values).count);
  const currentPage = Math.max(1, Number(page) || 1);
  const offset = (currentPage - 1) * pageSize;
  const rows = database.prepare(`
    SELECT p.*, c.slug AS category_slug, c.name AS category_name
    FROM products p JOIN categories c ON c.id = p.category_id
    ${where} ORDER BY p.updated_at DESC, p.sort_order ASC LIMIT ? OFFSET ?
  `).all(...values, pageSize, offset).map(mapProduct);
  return { products: rows, total, page: currentPage, pageSize, pageCount: Math.max(1, Math.ceil(total / pageSize)) };
}

export function getProduct(id) {
  const productId = decodeProductAdminId(id);
  return mapProduct(database.prepare(`
    SELECT p.*, c.slug AS category_slug, c.name AS category_name
    FROM products p JOIN categories c ON c.id = p.category_id WHERE p.id = ?
  `).get(productId));
}

export function getProductBySlug(categorySlug, productSlug, { includeDraft = false } = {}) {
  return mapProduct(database.prepare(`
    SELECT p.*, c.slug AS category_slug, c.name AS category_name
    FROM products p JOIN categories c ON c.id = p.category_id
    WHERE c.slug = ? AND p.slug = ? ${includeDraft ? "" : "AND p.status = 'published' AND c.active = 1"}
  `).get(categorySlug, productSlug));
}

export function getProductsByCategory(categorySlug, { includeDraft = false } = {}) {
  return database.prepare(`
    SELECT p.*, c.slug AS category_slug, c.name AS category_name
    FROM products p JOIN categories c ON c.id = p.category_id
    WHERE c.slug = ? ${includeDraft ? "" : "AND p.status = 'published'"}
    ORDER BY p.sort_order ASC, p.created_at ASC
  `).all(categorySlug).map(mapProduct);
}

export function getRelatedProducts(categorySlug, productSlug, limit = 4) {
  return database.prepare(`
    SELECT p.*, c.slug AS category_slug, c.name AS category_name
    FROM products p JOIN categories c ON c.id = p.category_id
    WHERE c.slug = ? AND p.slug != ? AND p.status = 'published'
    ORDER BY p.sort_order ASC LIMIT ?
  `).all(categorySlug, productSlug, limit).map(mapProduct);
}

export function listSearchProducts() {
  return database.prepare(`
    SELECT p.*, c.slug AS category_slug, c.name AS category_name
    FROM products p JOIN categories c ON c.id = p.category_id
    WHERE p.status = 'published' AND c.active = 1
    ORDER BY c.position ASC, p.sort_order ASC
  `).all().map(mapProduct);
}

export function createProduct(input) {
  const id = randomUUID();
  const now = new Date().toISOString();
  database.prepare(`
    INSERT INTO products
      (id, category_id, slug, title, sku, mount_type, material, description, features, options, images, source_url, status, sort_order, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(id, input.categoryId, input.slug, input.title, input.sku, input.mountType, input.material, input.description, JSON.stringify(input.features), JSON.stringify(input.options), JSON.stringify(input.images), input.sourceUrl, input.status, input.sortOrder, now, now);
  return id;
}

export function updateProduct(id, input) {
  const productId = decodeProductAdminId(id);
  return database.prepare(`
    UPDATE products SET category_id = ?, slug = ?, title = ?, sku = ?, mount_type = ?, material = ?, description = ?, features = ?, options = ?, images = ?, source_url = ?, status = ?, sort_order = ?, updated_at = ?
    WHERE id = ?
  `).run(input.categoryId, input.slug, input.title, input.sku, input.mountType, input.material, input.description, JSON.stringify(input.features), JSON.stringify(input.options), JSON.stringify(input.images), input.sourceUrl, input.status, input.sortOrder, new Date().toISOString(), productId).changes > 0;
}

export function deleteProduct(id) {
  const productId = decodeProductAdminId(id);
  return database.prepare("DELETE FROM products WHERE id = ?").run(productId).changes > 0;
}

export { DATABASE_PATH };
