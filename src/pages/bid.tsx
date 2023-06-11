import Card from '@/components/ui/cards/card';
import { useTranslation } from 'next-i18next';
import Seo from '@/components/seo/seo';
import DashboardLayout from '@/layouts/_dashboard';
import BidProducts from '@/components/products/bid-products';

export { getStaticProps } from '@/framework/general.ssr';

const MyBidsPage = () => {
  const { t } = useTranslation('common');

  return (
    <>
      <Seo noindex={true} nofollow={true} />
      <Card className="relative w-full self-stretch shadow-none sm:shadow">
        <h1 className="mb-8 text-center text-lg font-semibold text-heading sm:mb-10 sm:text-xl">
          {t('text-my-bids')}
        </h1>
        <BidProducts />
      </Card>
    </>
  );
};

MyBidsPage.authenticationRequired = true;

MyBidsPage.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default MyBidsPage;
