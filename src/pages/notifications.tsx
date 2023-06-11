import Card from '@/components/ui/cards/card';
import Seo from '@/components/seo/seo';
import DashboardLayout from '@/layouts/_dashboard';
import MyNotifications from "@/components/notifications/my-notifications";
export { getStaticProps } from '@/framework/general.ssr';

const MyNotificationPage = () => {
  return (
    <>
      <Seo noindex={true} nofollow={true} />
      <Card className="w-full shadow-none sm:shadow">
        <MyNotifications />
      </Card>
    </>
  );
};

MyNotificationPage.authenticationRequired = true;

MyNotificationPage.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default MyNotificationPage;
