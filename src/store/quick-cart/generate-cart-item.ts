import isEmpty from 'lodash/isEmpty';
interface Item {
  id: string | number;
  name: string;
  slug: string;
  photo: {
    original_url: string;
    [key: string]: unknown;
  };
  price: number;
  sale_price?: number;
  quantity?: number;
  [key: string]: unknown;
  language: string;
}
interface Variation {
  id: string | number;
  title: string;
  price: number;
  sale_price?: number;
  quantity: number;
  [key: string]: unknown;
}
export function generateCartItem(item: Item, variation: Variation) {
  const {
    id,
    name,
    slug,
    photo,
    price,
    sale_price,
    quantity,
    unit,
    is_digital,
    language,
  } = item;
  if (!isEmpty(variation)) {
    return {
      id: `${id}.${variation.id}`,
      productId: id,
      name: `${name} - ${variation.title}`,
      slug,
      unit,
      is_digital: variation?.is_digital,
      stock: variation.quantity,
      price: Number(
        variation.sale_price ? variation.sale_price : variation.price
      ),
      photo: photo?.original_url,
      variationId: variation.id,
      language,
    };
  }
  return {
    id,
    name,
    slug,
    unit,
    is_digital,
    photo: photo?.original_url,
    stock: quantity,
    price: Number(sale_price ? sale_price : price),
    language,
  };
}
