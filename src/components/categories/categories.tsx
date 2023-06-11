import ErrorMessage from '@/components/ui/error-message';
import dynamic from 'next/dynamic';
import { useCategories } from '@/framework/category';
import SlidingCardCategories from '@/components/categories/sliding-card-category';

interface CategoriesProps {
  layout: string;
  variables: any;
  className?: string;
}
export default function Categories({
  layout,
  className,
  variables,
}: CategoriesProps) {
  const { categories, isLoading, error } = useCategories(variables);

  if (error) return <ErrorMessage message={error.message} />;
  return (
    <SlidingCardCategories
      notFound={!Boolean(categories?.length)}
      categories={categories ?? []}
      loading={isLoading}
    />
  );
}
