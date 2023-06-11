import useLayout from '@/lib/hooks/use-layout';
import HeaderMinimal from './header-minimal';
import MobileNavigation from './mobile-navigation';
import Footer from './footer';

export default function SiteLayout({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="flex min-h-screen flex-col bg-gray-100 transition-colors duration-150">
      <HeaderMinimal />
      {children}
      <Footer />
      <MobileNavigation />
    </div>
  );
}
export const getLayout = (page: React.ReactElement) => (
  <SiteLayout>{page}</SiteLayout>
);
