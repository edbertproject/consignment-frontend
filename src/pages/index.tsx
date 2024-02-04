import type { NextPageWithLayout } from '@/types';
import type { InferGetStaticPropsType } from 'next';
import HomeLayout from '@/components/layouts/_home';
import Seo from '@/components/seo/seo';
import { getStaticProps } from '@/framework/home-pages.ssr';
import CompactLayout from '@/components/layouts/compact';
import { siteSettings } from '@/config/site';

export { getStaticProps };

const Index: NextPageWithLayout<
  InferGetStaticPropsType<typeof getStaticProps>
> = ({ variables }) => {
  return (
    <>
      <Seo title="Home" url={siteSettings.slug} />
      <CompactLayout variables={variables} />
    </>
  );
};

Index.getLayout = function getLayout(page) {
  return <HomeLayout>{page}</HomeLayout>;
};

export default Index;
