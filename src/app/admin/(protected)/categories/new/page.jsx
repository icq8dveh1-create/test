import CategoryForm from "../../../_components/CategoryForm";
import { createCategoryAction } from "../../../actions";

export default async function NewCategoryPage({ searchParams }) {
  const { error = "" } = await searchParams;
  return <CategoryForm action={createCategoryAction} error={error} />;
}
