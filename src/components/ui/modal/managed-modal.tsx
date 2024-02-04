import dynamic from 'next/dynamic';
import Modal from '@/components/ui/modal/modal';
import { useModalAction, useModalState } from './modal.context';

const OtpLoginView = dynamic(() => import('@/components/auth/otp-login'));
const Login = dynamic(() => import('@/components/auth/login-form'), {
  ssr: false,
});
const Register = dynamic(() => import('@/components/auth/register-form'));
const ForgotPassword = dynamic(
  () => import('@/components/auth/forgot-password')
);
// const ProductDetailsModalView = dynamic(
//   () => import('@/components/products/details/popup'),
//   { ssr: false }
// );
const ShopInfoCard = dynamic(() => import('@/components/shops/sidebar'));
const CreateOrUpdateAddressForm = dynamic(
  () => import('@/components/address/address-form'),
  { ssr: false }
);
const CreateOrUpdateGuestAddressForm = dynamic(
  () => import('@/components/checkout/create-or-update-guest')
);
const AddressDeleteView = dynamic(
  () => import('@/components/address/delete-view')
);
// const ProfileAddOrUpdateContact = dynamic(
//   () => import('@/components/profile/profile-add-or-update-contact')
// );
const CreateRefundView = dynamic(
  () => import('@/components/refunds/refund-form')
);
// const ReviewRating = dynamic(() => import('@/components/reviews/review-form'));
const QuestionForm = dynamic(
  () => import('@/components/questions/question-form')
);
const AbuseReport = dynamic(() => import('@/components/reviews/abuse-report'));
// const ProductVariation = dynamic(
//   () => import('@/components/products/variation-modal')
// );
const ReviewImageModal = dynamic(
  () => import('@/components/reviews/review-image-modal')
);
// const PaymentModal = dynamic(
//   () => import('@/components/payment/payment-modal'),
//   { ssr: false }
// );
// const AddNewPaymentModal = dynamic(
//   () => import('@/components/payment/add-new-payment-modal'),
//   { ssr: false }
// );
// const AddNewCardModal = dynamic(
//   () => import('@/components/card/add-new-card-modal'),
//   { ssr: false }
// );

const CustomBidProduct = dynamic(
  () => import('@/components/products/custom-bid-product'),
  { ssr: false }
);

const HowToPay = dynamic(() => import('@/components/orders/how-to-pay-modal'), {
  ssr: false,
});

const PartnerForm = dynamic(
  () => import('@/components/partner/partner-form-modal'),
  {
    ssr: false,
  }
);

const ManagedModal = () => {
  const { isOpen, view, data } = useModalState();
  const { closeModal } = useModalAction();

  // Controlled payment modal [custom & default]
  // if (view === 'PAYMENT_MODAL') {
  //   return <PaymentModal />;
  // }

  return (
    <Modal open={isOpen} onClose={closeModal}>
      {view === 'LOGIN_VIEW' && <Login />}
      {view === 'REGISTER' && <Register />}
      {view === 'FORGOT_VIEW' && <ForgotPassword />}
      {view === 'OTP_LOGIN' && <OtpLoginView />}
      {view === 'REFUND_REQUEST' && <CreateRefundView />}
      {view === 'ADD_OR_UPDATE_ADDRESS' && <CreateOrUpdateAddressForm />}
      {view === 'ADD_OR_UPDATE_GUEST_ADDRESS' && (
        <CreateOrUpdateGuestAddressForm />
      )}
      {/*{view === 'ADD_OR_UPDATE_PROFILE_CONTACT' && (*/}
      {/*  <ProfileAddOrUpdateContact />*/}
      {/*)}*/}
      {view === 'DELETE_ADDRESS' && <AddressDeleteView />}
      {/*{view === 'PRODUCT_DETAILS' && (*/}
      {/*  <ProductDetailsModalView productSlug={data} />*/}
      {/*)}*/}
      {view === 'PRODUCT_BID' && <CustomBidProduct data={data} />}
      {view === 'SHOP_INFO' && (
        <ShopInfoCard
          shop={data?.shop}
          cardClassName="!hidden"
          className="!flex !h-screen !w-screen max-w-screen-sm flex-col"
        />
      )}
      {/*{view === 'REVIEW_RATING' && <ReviewRating />}*/}
      {view === 'ABUSE_REPORT' && <AbuseReport data={data} />}
      {view === 'HOW_TO_PAY' && <HowToPay data={data} />}
      {view === 'PARTNER_FORM' && <PartnerForm />}
      {view === 'QUESTION_FORM' && <QuestionForm />}
      {/*{view === 'SELECT_PRODUCT_VARIATION' && (*/}
      {/*  <ProductVariation productSlug={data} />*/}
      {/*)}*/}
      {view === 'REVIEW_IMAGE_POPOVER' && <ReviewImageModal />}
      {/* Payment Modal */}
      {/*{view === 'USE_NEW_PAYMENT' && <AddNewPaymentModal />}*/}
      {/* Card/My Card Modal */}
      {/*{view === 'ADD_NEW_CARD' && <AddNewCardModal />}*/}
    </Modal>
  );
};

export default ManagedModal;
