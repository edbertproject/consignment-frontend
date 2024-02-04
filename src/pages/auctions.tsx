import Card from '@/components/ui/cards/card';
import { useTranslation } from 'next-i18next';
import Seo from '@/components/seo/seo';
import DashboardLayout from '@/layouts/_dashboard';
import AuctionProducts from '@/components/products/auction-products';

export { getStaticProps } from '@/framework/general.ssr';

const MyAuctionsPage = () => {
  const { t } = useTranslation('common');

  return (
    <>
      <Seo title="Auction" url="auction" />
      <Card className="relative w-full self-stretch shadow-none sm:shadow">
        <h1 className="mb-8 text-center text-lg font-semibold text-heading sm:mb-10 sm:text-xl">
          {t('text-my-auctions')}
        </h1>
        <AuctionProducts />
      </Card>
    </>
  );
};

MyAuctionsPage.authenticationRequired = true;

MyAuctionsPage.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default MyAuctionsPage;
