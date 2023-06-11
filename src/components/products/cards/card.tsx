import type { Product } from '@/types';
import Base from '@/components/products/cards/base';
import React from 'react';
interface ProductCardProps {
  product: Product;
  className?: string;
  cardType?: any;
}
const ProductCard: React.FC<ProductCardProps> = ({
  product,
  className,
  ...props
}) => {
  return <Base product={product} {...props} className={className} />;
};
export default ProductCard;
