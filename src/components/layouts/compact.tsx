import SectionBlock from '@/components/ui/section-block';
import Categories from '@/components/categories/categories';
import Banner from '@/components/banners/banner';
import { useTranslation } from 'next-i18next';
import type { HomePageProps } from '@/types';
import { Image } from '@/components/ui/image';
import NewProductGrid from '@/components/products/new-products';
import IncomingProducts from '@/components/products/incoming-products';
import HotProductGrid from '@/components/products/hot-products';

export default function CompactLayout({ variables }: HomePageProps) {
  const { t } = useTranslation('common');
  return (
    <div className="flex flex-1 flex-col bg-white">
      <main className="mt-6 block w-full xl:overflow-hidden">
        <SectionBlock>
          <Banner />
        </SectionBlock>
        <HotProductGrid variables={variables.hotProducts} />
        <Categories layout="compact" variables={variables.categories} />
        <NewProductGrid variables={variables.newProducts} />
        <IncomingProducts variables={variables.incomingProducts} />
        <SectionBlock>
          <Image
            className="h-full w-full rounded-xl"
            src="https://images.tokopedia.net/img/cache/1190/wmEwCC/2023/3/20/669963a1-528a-4ae1-a80a-600bb1053680.jpg.webp?ect=4g"
            width={1190}
            height={396}
            layout="responsive"
          />
        </SectionBlock>
      </main>
    </div>
  );
}
