import Card from '@/components/ui/cards/card';
import Seo from '@/components/seo/seo';
import DashboardLayout from '@/layouts/_dashboard';
import MyNotifications from '@/components/notifications/my-notifications';
import { siteSettings } from '@/config/site';
export { getStaticProps } from '@/framework/general.ssr';

const MyNotificationPage = () => {
  return (
    <>
      <Seo title="Notification" url="notifications" />
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
