import { notFound } from "next/navigation";
import CategoryForm from "../../../../_components/CategoryForm";
import { updateCategoryAction } from "../../../../actions";
import { getCategory } from "../../../../../../lib/cms/database";

export default async function EditCategoryPage({ params, searchParams }) {
  const { id } = await params;
  const query = await searchParams;
  const category = getCategory(id);
  if (!category) notFound();
  return <CategoryForm category={category} action={updateCategoryAction.bind(null, id)} error={query.error} saved={query.saved} />;
}
