import ProfileAddressGrid from '@/components/profile/profile-address';
import Card from '@/components/ui/cards/card';
import { useTranslation } from 'next-i18next';
import ProfileForm from '@/components/profile/profile-form';
import Seo from '@/components/seo/seo';
import { useRegisterPartner, useUser } from '@/framework/user';
import DashboardLayout from '@/layouts/_dashboard';
import Button from '@/components/ui/button';
import classNames from 'classnames';
import { StatusPartner } from '@/types';
import { toast } from 'react-toastify';
import { useModalAction } from '@/components/ui/modal/modal.context';

export { getStaticProps } from '@/framework/general.ssr';

const ProfilePage = () => {
  const { t } = useTranslation('common');
  const { me } = useUser();
  const { openModal } = useModalAction();

  if (!me) return null;

  const handleRegisterPartner = () => {
    if ((me.addresses?.length ?? 0) < 1) {
      toast.error('Please add your address first to register');
      return;
    }

    openModal('PARTNER_FORM');
  };

  return (
    <>
      <Seo noindex={true} nofollow={true} />
      <div className="w-full overflow-hidden px-1 pb-1">
        <div className="mb-8">
          <ProfileForm user={me} />
        </div>

        <Card className="mb-8 w-full">
          <div className="flex items-center justify-start">
            <div>Seller Status</div>
            <div>:</div>
            <div
              className={classNames(
                'ml-4 rounded py-2 px-4 text-sm font-bold text-white',
                {
                  'bg-red-400': [
                    StatusPartner.UNREGISTERED,
                    StatusPartner.REJECTED,
                  ].includes(me.status_partner),
                },
                {
                  'bg-green-400': me.status_partner === StatusPartner.APPROVED,
                },
                {
                  'bg-yellow-400':
                    me.status_partner === StatusPartner.WAITING_APPROVAL,
                }
              )}
            >
              {me.status_partner}
            </div>
          </div>

          {[StatusPartner.UNREGISTERED].includes(me.status_partner) && (
            <Button
              onClick={handleRegisterPartner}
              className="mt-8 ltr:ml-auto rtl:mr-auto"
            >
              {t('text-register')}
            </Button>
          )}

          {[StatusPartner.REJECTED].includes(me.status_partner) && (
            <>
              <div className="mt-3 flex items-center justify-start text-sm text-gray-500">
                <div>Note</div>
                <div>:</div>
                <div className="ml-4 ">
                  Please complete your profile correctly, particularly about
                  bank number
                </div>
              </div>
              <Button
                onClick={handleRegisterPartner}
                className="mt-8 ltr:ml-auto rtl:mr-auto"
              >
                {t('text-reregister')}
              </Button>
            </>
          )}

          {me.status_partner === StatusPartner.APPROVED && (
            <a
              href={`${process.env.NEXT_PUBLIC_ADMIN_URL}register`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-9 shrink-0 items-center justify-center rounded border border-transparent bg-accent px-3 py-0 text-sm font-semibold leading-none text-light outline-none transition duration-300 ease-in-out hover:bg-accent-hover focus:shadow focus:outline-none focus:ring-1 focus:ring-accent-700"
            >
              {t('text-seller-area')}
            </a>
          )}
        </Card>

        <Card className="w-full">
          <ProfileAddressGrid
            userId={me.id}
            addresses={me.addresses}
            label={t('text-addresses')}
          />
        </Card>
      </div>
    </>
  );
};

ProfilePage.authenticationRequired = true;

ProfilePage.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
export default ProfilePage;
