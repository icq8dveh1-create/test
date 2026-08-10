import ProductForm from "../../../_components/ProductForm";
import { createProductAction } from "../../../actions";
import { listCategories } from "../../../../../lib/cms/database";

export default async function NewProductPage({ searchParams }) {
  const query = await searchParams;
  return <ProductForm categories={listCategories({ activeOnly: true })} action={createProductAction} error={query.error} />;
}
