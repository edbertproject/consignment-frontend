import { ProductQueryOptions } from '@/types';

export const formatProductsArgs = (options?: Partial<ProductQueryOptions>) => {
  // Destructure
  const {
    per_page = 30,
    price,
    categories,
    name,
    searchType,
    searchQuery,
    text,
    ...restOptions
  } = options || {};

  return {
    per_page,
    ...(price && { min_price: price.split(',')[0] as string }),
    ...(price && { max_price: price.split(',')[1] as string }),
    ...(categories && { categories: categories.split(',') }),
    ...(searchType && { type: searchType.toString() }),
    ...(text && { search: text.toString() }),
    ...restOptions,
  };
};
