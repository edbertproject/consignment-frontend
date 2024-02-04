import { Photo, Product } from '@/types';

interface Item {
  id: number;
  name: string;
  slug: string;
  photo: Photo;
  price: number;
  sale_price?: number;
  quantity?: number;
  [key: string]: unknown;
}
export function generateCartItem({
  id,
  name,
  slug,
  photo,
  price,
  quantity,
  available_quantity,
}: Product): Item {
  return {
    id,
    name,
    slug,
    photo,
    quantity,
    stock: available_quantity,
    price: Number(price),
  };
}
