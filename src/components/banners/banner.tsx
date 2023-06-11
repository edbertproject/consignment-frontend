import dynamic from 'next/dynamic';
import { Banner } from '@/types';
const BannerWithPagination = dynamic(
  () => import('@/components/banners/banner-with-pagination')
);

const Banner: React.FC = () => {
  const banners: Banner[] = [
    {
      title: 'Exclusive furniture on cheap price',
      description:
        'Make your house a home with our wide collection of beautiful furniture',
      image: {
        id: 922,
        original:
          'https://images.tokopedia.net/img/cache/1200/NXCtjv/2023/2/3/c516f442-b9b4-4a54-bc0f-ab2a3165a41f.jpg.webp',
        thumbnail:
          'https://images.tokopedia.net/img/cache/1200/NXCtjv/2023/2/3/c516f442-b9b4-4a54-bc0f-ab2a3165a41f.jpg.webp',
      },
    },
    {
      title: 'Exclusive furniture on cheap price',
      description:
        'Make your house a home with our wide collection of beautiful furniture',
      image: {
        id: 922,
        original:
          'https://images.tokopedia.net/img/cache/1200/NXCtjv/2023/3/9/646f0b7e-e813-47e2-ab54-fe36c300cdce.jpg.webp',
        thumbnail:
          'https://images.tokopedia.net/img/cache/1200/NXCtjv/2023/3/9/646f0b7e-e813-47e2-ab54-fe36c300cdce.jpg.webp',
      },
    },
  ];

  return <BannerWithPagination banners={banners} layout="compact" />;
};

export default Banner;
