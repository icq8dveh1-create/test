import { notFound } from "next/navigation";
import ProductForm from "../../../../_components/ProductForm";
import { updateProductAction } from "../../../../actions";
import { getProduct, listCategories } from "../../../../../../lib/cms/database";

export default async function EditProductPage({ params, searchParams }) {
  const { id } = await params;
  const query = await searchParams;
  const product = getProduct(id);
  if (!product) notFound();
  return <ProductForm product={product} categories={listCategories()} action={updateProductAction.bind(null, id)} error={query.error} saved={query.saved} />;
}
