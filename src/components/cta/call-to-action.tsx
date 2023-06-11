import { useTranslation } from 'next-i18next';
import { Image } from '@/components/ui/image';
import Link from '@/components/ui/link';
import SectionBlock from '@/components/ui/section-block';
import { siteSettings } from '@/config/site';
import AppStoreImg from '@/assets/app-store-btn.png';
import PlayStoreImg from '@/assets/play-store-btn.png';
import PatternImg from '@/assets/pattern.png';

const CallToAction = () => {
  const { t } = useTranslation('common');

  return (
    <SectionBlock className="last:pb-0">
      <div className="w-full"></div>
    </SectionBlock>
  );
};

export default CallToAction;
