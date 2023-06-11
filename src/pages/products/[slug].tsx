import type { NextPageWithLayout } from '@/types';
import type { InferGetStaticPropsType } from 'next';
import { getLayout } from '@/components/layouts/layout';
import { AttributesProvider } from '@/components/products/details/attributes.context';
import Seo from '@/components/seo/seo';
import { useWindowSize } from '@/lib/use-window-size';
import ProductQuestions from '@/components/questions/product-questions';
import AverageRatings from '@/components/reviews/average-ratings';
import ProductReviews from '@/components/reviews/product-reviews';
import isEmpty from 'lodash/isEmpty';
import dynamic from 'next/dynamic';

import { getStaticPaths, getStaticProps } from '@/framework/product.ssr';
import ProductBids from '@/components/reviews/product-bid';
import { useUser } from '@/framework/user';
export { getStaticPaths, getStaticProps };
//FIXME: typescript and layout
const Details = dynamic(() => import('@/components/products/details/details'));
const RelatedProducts = dynamic(
  () => import('@/components/products/details/related-products')
);
const CartCounterButton = dynamic(
  () => import('@/components/cart/cart-counter-button'),
  { ssr: false }
);

const ProductPage: NextPageWithLayout<
  InferGetStaticPropsType<typeof getStaticProps>
> = ({ product }: any) => {
  const { isAuthorized } = useUser();
  const { width } = useWindowSize();
  return (
    <>
      <Seo
        title={product.name}
        url={product.slug}
        images={!isEmpty(product?.photo) ? [product.photo] : []}
      />
      <AttributesProvider>
        <div className="min-h-screen bg-light">
          <Details product={product} />
          {product.type === 'Auction' && (
            <ProductBids productId={product?.id} />
          )}
          {/*<ProductQuestions*/}
          {/*  productId={product?.id}*/}
          {/*  shopId={product?.shop?.id}*/}
          {/*  productType={product?.type?.slug}*/}
          {/*/>*/}
          {product?.related_products?.length > 1 && (
            <div className="p-5 lg:p-14 xl:p-16">
              <RelatedProducts
                products={product.related_products}
                currentProductId={product.id}
                gridClassName="lg:grid-cols-4 2xl:grid-cols-5 !gap-3"
              />
            </div>
          )}
        </div>
        {width > 1023 && product.type === 'Consign' && isAuthorized && (
          <CartCounterButton />
        )}
      </AttributesProvider>
    </>
  );
};
ProductPage.getLayout = getLayout;
export default ProductPage;
