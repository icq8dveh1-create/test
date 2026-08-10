import { readFile } from "node:fs/promises";
import path from "node:path";
import { notFound } from "next/navigation";

const mimeTypes = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".avif": "image/avif",
};

export async function GET(_request, { params }) {
  const { path: segments } = await params;
  const uploadRoot = path.resolve(process.cwd(), "public", "uploads");
  const filePath = path.resolve(uploadRoot, ...segments);
  if (!filePath.startsWith(uploadRoot + path.sep)) notFound();
  const contentType = mimeTypes[path.extname(filePath).toLowerCase()];
  if (!contentType) notFound();
  try {
    const body = await readFile(filePath);
    return new Response(body, { headers: { "Content-Type": contentType, "Cache-Control": "public, max-age=3600, must-revalidate", "X-Content-Type-Options": "nosniff" } });
  } catch {
    notFound();
  }
}
