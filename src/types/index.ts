import type { NextPage } from 'next';
import type { ReactElement, ReactNode } from 'react';

export type NextPageWithLayout<P = {}> = NextPage<P> & {
  authenticationRequired?: boolean;
  getLayout?: (page: ReactElement) => ReactNode;
};

export interface GetParams {
  slug: string;
  language?: string;
}

export type LayoutProps = {
  readonly children: ReactNode;
};

export interface HomePageProps {
  variables: {
    hotProducts?: any;
    newProducts?: any;
    incomingProducts?: any;
    categories: any;
  };
}

export interface SearchParamOptions {
  type: string;
  name: string;
  categories: string;
  tags: string;
  author: string;
  price: string;
  manufacturer: string;
  status: string;
  is_active: string;
  shop_id: string;
  min_price: string;
  max_price: string;
  rating: string;
  question: string;
}

export interface QueryOptions {
  language?: string;
  limit?: number;
  page?: number;
  per_page?: number;
  search?: string;
  search_fields?: string;
  filter?: string;
  order_by?: string;
  sorted_by?: string;
  with?: string;
}

export interface Meta {
  current_page: number;
  last_page: number;
  links: any[];
  per_page: number;
  from: number;
  path: string;
  to: number;
  total: number;
}

export interface PaginatorInfo<T> {
  data: T[];
  meta: Meta;
}

export interface Attachment {
  id: number;
  original: string;
  thumbnail: string;
  __typename?: string;
  slug?: string;
}

export interface Photo {
  id: number;
  original_url: string;
  name: string;
}

export interface ProductQueryOptions extends QueryOptions {
  shop_id: string;
  sortedBy: string;
  orderBy: string;
  name: string;
  categories: string;
  tags: string;
  type: string;
  manufacturer: string;
  author: string;
  price: string;
  min_price: string;
  max_price: string;
  language: string;
  searchType: string;
  searchQuery: string;
  text: string;
}

export interface PaymentMethodQueryOptions extends QueryOptions {}
export interface HotProductQueryOptions extends QueryOptions {}
export interface NewProductQueryOptions extends QueryOptions {}
export interface IncomingProductQueryOptions extends QueryOptions {}

export interface CategoryQueryOptions extends QueryOptions {
  language: string;
  parent: string | null;
  type: string;
}

export interface TagQueryOptions extends QueryOptions {
  parent: string | null;
  type: string;
}

export interface TypeQueryOptions extends QueryOptions {
  language: string;
  name: string;
  orderBy: any;
}

export interface ShopQueryOptions extends QueryOptions {
  name: string;
  is_active: number;
}

export interface AuthorQueryOptions extends QueryOptions {
  language: string;
  name: string;
  orderBy: string;
}

export interface ManufacturerQueryOptions extends QueryOptions {
  name?: string;
  orderBy?: string;
  language: any;
}

export interface CouponQueryOptions extends QueryOptions {
  name: string;
  orderBy: string;
}

export interface OrderQueryOptions extends QueryOptions {
  name: string;
  orderBy: string;
}

export interface ReviewQueryOptions extends QueryOptions {
  product_id: string;
  rating?: string;
  orderBy?: string;
  sortedBy?: string;
}

export interface ProductBidQueryOptions extends QueryOptions {
  product_id: number;
}

export interface ReviewQueryOptions extends QueryOptions {
  product_id: string;
  rating?: string;
  orderBy?: string;
  sortedBy?: string;
}

export interface QuestionQueryOptions extends QueryOptions {
  product_id: string;
  question?: string;
}

export interface MyReportsQueryOptions extends QueryOptions {
  language: any;
}

export interface SettingsQueryOptions extends QueryOptions {}

export interface WishlistQueryOptions extends QueryOptions {}

export interface SingleData<T> {
  data: T;
}

export interface NotificationResponse extends SingleData<Notification[]> {}

export interface Product {
  id: number;
  name: string;
  slug: string;
  product_category?: ProductCategory;
  type?: ProductType;
  participant?: number;
  description: string;
  price: number;
  start_price: number;
  multiplied_price: number;
  desired_price: number;
  weight: number;
  long_dimension: number;
  wide_dimension: number;
  high_dimension: number;
  condition?: string;
  warranty?: string;
  photo: Photo;
  photos?: Photo[];
  quantity: number;
  available_quantity: number;
  in_wishlist?: boolean;
  related_products?: Product[];
  start_date: string;
  end_date: string;
  cancel_reason?: string;
  status?: string;
  seller_name?: string;
  seller_city?: string;
  current_bid: number;
  partner_id: number | null;
  bids?: Bid[];
  winner?: User;
}

export interface Bid {
  id?: number;
  amount: number;
  date_time: string;
  user_name: string;
}

export interface CartResponse {
  id: number;
  user_id: number;
  product_id: number;
  quantity: number;
}

export interface CartItem {
  product_id: string | number;
  quantity?: number;
}

export interface RatingCount {
  rating: number;
  total: number;
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  photo: Photo;
}

export interface Category {
  id: string;
  code: string;
  name: string;
  photo: Photo;
}

export interface Banner {
  id?: string;
  title: string;
  description: string;
  image: Attachment;
}

export type ProductType = 'Consign' | 'Auction' | 'Special Auction';

export interface Type {
  id: string;
  name: string;
  slug?: any;
  banners: Banner[];
  icon?: string;
  promotional_sliders: Attachment[];
  settings: {
    isHome: boolean;
    layoutType: string;
    productCard?: string;
  };
}

export interface Shop {
  id: string;
  name: string;
  slug: string;
  description: string;
  cover_image: Attachment;
}

export interface Author {
  id: string;
  name: string;
  slug: string;
}

export interface Manufacturer {
  id: string;
  name: string;
  slug: string;
}

export enum CouponType {
  FIXED = 'fixed',
  PERCENTAGE = 'percentage',
  FREE_SHIPPING = 'free_shipping',
}
export interface Coupon {
  id: string;
  name: string;
  type: CouponType;
  slug: string;
  amount?: string;
  code?: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface Feedback {
  id: string;
  user_id: string;
  model_type: string;
  model_id: string;
  positive: boolean;
  negative: boolean;
  created_at: string;
  updated_at: string;
}

export interface Settings {
  id: string;
  name: string;
  slug: string;
  options: {
    [key: string]: any;
  };
}

export interface SetupIntentInfo {
  client_secret?: string;
  intent_id?: string;
}

export interface PaymentIntentInfo {
  client_secret: string;
  payment_id: string;
  is_redirect: boolean;
  redirect_url: string;
  currency: string;
  amount: string;
}

export interface PaymentMethod {
  id: number;
  type: string;
  code: string;
  name: string;
  description: string;
  xendit_code: string;
}

export interface Card {
  expires: string;
  network: string;
  origin: string;
  owner_name: string;
  payment_gateway_id: number | string;
  default_card: number;
}

export interface Invoice {
  id: string;
  date: string;
  number: string;
  payment_number: string;
  courier_code: string;
  courier_service: string;
  courier_esd: string;
  subtotal: number;
  tax_amount: number;
  admin_fee: number;
  platform_fee: number;
  courier_cost: number;
  grand_total: number;
  xendit_key: string;
  status: string;
  expires_at: string;
  created_at: string;
  updated_at: string;
  payment_method?: PaymentMethod;
}

export interface OrderStatusDetail {
  status: string;
  type: string;
}

export interface Order {
  id: string;
  date: string;
  number: string;
  invoice_id: string;
  user_id: number;
  user_address_id: number;
  product_id: number;
  partner_id: number;
  quantity: number;
  price: number;
  status: string;
  status_seller: string;
  seller_statuses?: OrderStatusDetail[];
  status_seller_updated_at: string;
  status_buyer: string;
  buyer_statuses?: OrderStatusDetail[];
  status_buyer_updated_at: string;
  next_status: string;
  can_process_next_status: boolean;
  next_status_buyer: string[];
  can_process_next_status_buyer: boolean;
  next_status_seller: string;
  can_process_next_status_seller: boolean;
  notes: string;
  product: Product;
  user_address: Address;
  user?: User;
  partner?: User;
  invoice: Invoice;
  created_at: Date;
  updated_at: Date;
}

export interface VerifyCouponInputType {
  code: string;
  sub_total: number;
}

export interface VerifyCouponResponse {
  is_valid: boolean;
  coupon?: Coupon;
  message?: string;
}

export interface CreateReviewInput {
  product_id: string;
  shop_id: string;
  order_id: string;
  variation_option_id: string;
  comment?: string;
  rating: number;
  photos?: Attachment[];
}

export interface UpdateReviewInput extends CreateReviewInput {
  id: string;
}

export interface ReviewResponse {
  product_id: string;
}

export interface CreateRefundInput {
  order_id: string;
  title: string;
  description: string;
  images: Attachment[];
}

export interface CreateOrderPaymentInput {
  tracking_number: string;
}

export interface CreateFeedbackInput {
  model_id: string;
  model_type: string;
  positive?: boolean;
  negative?: boolean;
}

export interface CreateQuestionInput {
  question: string;
  product_id: string;
  shop_id: string;
}

export interface CreateAbuseReportInput {
  model_id: string;
  model_type: string;
  message: string;
}

export interface Feedback {
  id: string;
  user_id: string;
  model_type: string;
  model_id: string;
  positive: boolean;
  negative: boolean;
  created_at: string;
  updated_at: string;
}

export interface Refund {
  id: string;
  title: string;
  description: string;
  images: Attachment[];
  amount: number;
  status: RefundStatus;
  shop: Shop;
  order: Order;
  customer: User;
  created_at: string;
  updated_at: string;
}

export enum OrderStatusBuyer {
  PENDING = 'Pending',
  CANCELED = 'Canceled',
  PROCESSED = 'Processed',
  ON_DELIVERY = 'On Delivery',
  ARRIVED = 'Arrived',
  COMPLAIN = 'Complained',
  COMPLETE = 'Complete',
}

export enum PaymentStatus {
  PENDING = 'Pending',
  PAID = 'Paid',
  CANCELED = 'Canceled',
}

export enum OrderStatus {
  WAITING_PAYMENT = 'Waiting Payment',
  EXPIRED = 'Expired',
  PAID = 'Paid',
  PROCESS = 'Process',
  PROBLEM = 'Problem',
  FINISH = 'Finish',
  CANCELED = 'Canceled',
}

enum RefundStatus {
  APPROVED = 'Approved',
  PENDING = 'Pending',
  REJECTED = 'Rejected',
  PROCESSING = 'Processing',
}

export interface Address {
  id: number;
  title: string;
  label: string;
  receiver_name: string;
  phone_number: string;
  full_address: string;
  postal_code: string;
  province_id: number;
  city_id: number;
  district_id: number;
  is_primary: boolean;
  note: string;
}

export interface NotificationData {
  subject: string;
  message: string;
}

export interface Notification {
  type: string;
  data: NotificationData;
  created_at: string;
}

export interface Shipping {
  code: string;
  name: string;
  service: string;
  description: string;
  cost: number;
  estimation_day: string;
}

export interface PaymentMethodInstruction {
  title: string;
  instructions: string[];
}

export interface PaymentMethod {
  id: number;
  type: string;
  code: string;
  name: string;
  description: string;
  xendit_code: string;
  payment_method_instructions?: PaymentMethodInstruction[];
}

export enum StatusPartner {
  UNREGISTERED = 'Unregistered',
  APPROVED = 'Approved',
  REJECTED = 'Rejected',
  WAITING_APPROVAL = 'Waiting Approval',
}

export interface Partner {
  id: number;
  postal_code: string;
  full_address: string;
  status: string;
}

export interface User {
  id: string;
  username?: string;
  name: string;
  email: string;
  phone_number?: string;
  date_of_birth?: string;
  gender?: string;
  bank_name?: string;
  bank_number?: string;
  status_partner: StatusPartner;
  photo?: Photo;
  partner: Partner;
  addresses?: Address[];
}

export interface UpdateUserInput {
  id: string;
  username?: string;
  name?: string;
  phone_number?: string;
  date_of_birth?: string;
  gender?: any;
  bank_name?: string;
  bank_number?: string;
  photo?: any;
}

export interface RegisterPartnerInput {
  user_address_id: number;
}

export interface UserAddressInput {
  label: string;
  receiver_name: string;
  phone_number: string;
  full_address: string;
  postal_code: string;
  province_id: number;
  city_id: number;
  district_id: number;
  note: string;
}

export interface LoginUserInput {
  username: string;
  password: string;
}

export type SocialLoginInputType = {
  provider: string;
  access_token: string;
};
export type SendOtpCodeInputType = {
  phone_number: string;
};

export interface RegisterUserInput {
  name: string;
  username: string;
  email: string;
  phone_number: string;
  password: string;
}

export interface RegisterTokenVerify {
  token: string;
}

export interface ForgotPasswordUserInput {
  email: string;
}

export interface ResetPasswordUserInput {
  email: string;
  token: string;
  password: string;
}

export interface VerifyForgotPasswordUserInput {
  token: string;
  email: string;
}

export interface ChangePasswordUserInput {
  old_password: string;
  password: string;
  password_confirmation: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
}

export interface AuthResponse {
  token_type: string;
  expires_in: number;
  access_token: string;
  refresh_token: string;
}

export interface OTPResponse {
  message: string;
  success: boolean;
  provider: string;
  id: string;
  phone_number: string;
  is_contact_exist: boolean;
}

export interface VerifyOtpInputType {
  phone_number: string;
  code: string;
  otp_id: string;
}

export interface OtpLoginInputType {
  phone_number: string;
  code: string;
  otp_id: string;
  name?: string;
  email?: string;
}

export interface BasicResponse {
  success: string;
  message: string;
}

export interface BasicResponseData<T> {
  success?: string;
  message?: string;
  data: T;
}

export interface BasicResponseWithData<T> {
  success: string;
  message: string;
  data: T[];
}

export interface AddressResponse extends BasicResponseWithData<Address> {}
export interface UserResponse extends BasicResponseData<User> {}
export interface ShippingResponse extends BasicResponseWithData<Shipping> {}
export interface PaymentMethodResponse
  extends BasicResponseWithData<PaymentMethod> {}

export interface DigitalFile {
  id: string;
  fileable: Product;
}

export interface DownloadableFile {
  id: string;
  purchase_key: string;
  digital_file_id: string;
  customer_id: string;
  file: DigitalFile;
  created_at: string;
  updated_at: string;
}

export type AuctionProductStatus = 'EXPIRED' | 'WINNER' | 'LOSE';

export interface AuctionProduct {
  id: number;
  name: string;
  type: string;
  slug: string;
  can_pay: number;
  expire_pay_date: string;
  status: AuctionProductStatus;
  current_bid: number;
  current_bid_at: string;
  photo?: Photo;
}

export interface CreateContactUsInput {
  name: string;
  email: string;
  subject: string;
  description: string;
}

export interface CardInput {
  number: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  email?: string;
}

export interface CreateOrderInput {
  payment_method_id: number;
  user_address_id: number;
  courier_code: string;
  courier_service: string;
  courier_cost: number;
  courier_esd: string;
  cart_ids?: number[];
  product_auction_id?: number;
}

export interface PaymentIntentCollection {
  tracking_number?: string;
  payment_intent_info?: PaymentIntentInfo;
  payment_gateway?: string;
}

export interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  photos: Attachment[];
  user: User;
  product: Product;
  shop: Shop;
  feedbacks: Feedback[];
  positive_feedbacks_count: number;
  negative_feedbacks_count: number;
  my_feedback: Feedback;
  created_at: string;
  updated_at: string;
}

export interface Question {
  id: string;
  answer: string;
  my_feedback: Feedback;
  negative_feedbacks_count: number;
  positive_feedbacks_count: number;
  question: string;
  created_at: string;
  updated_at: string;
  product: Product;
}

export interface Reports {
  id: string;
  message: string;
  created_at: string;
}

export interface ConnectProductOrderPivot {
  product_id: number;
  variation_option_id?: number;
  order_quantity: number;
  unit_price: number;
  subtotal: number;
}

export interface CheckoutVerificationInput {
  amount: number;
  products: ConnectProductOrderPivot[];
  billing_address?: Address;
  shipping_address?: Address;
}

export interface UpdateStatusBuyerInput {
  status: OrderStatusBuyer;
  id: string;
}

export interface VerifiedCheckoutData {
  total_tax: number;
  shipping_charge: number;
  unavailable_products?: number[];
  wallet_currency?: number;
  wallet_amount?: number;
}

export interface Wishlist {
  id: string;
  product: Product;
  product_id: string;
  user: User[];
  user_id: string;
}

export interface Province {
  id: string;
  name: string;
}

export interface City extends Province {
  province_id: number;
  type: string;
}

export interface District extends Province {
  city_id: number;
}
export interface ProductPaginator extends PaginatorInfo<Product> {}

export interface CategoryPaginator extends PaginatorInfo<Category> {}

export interface ShopPaginator extends PaginatorInfo<Shop> {}

export interface AuthorPaginator extends PaginatorInfo<Author> {}

export interface ManufacturerPaginator extends PaginatorInfo<Manufacturer> {}

export interface CouponPaginator extends PaginatorInfo<Coupon> {}

export interface TagPaginator extends PaginatorInfo<Tag> {}

export interface OrderPaginator extends PaginatorInfo<Order> {}

export interface OrderStatusPaginator extends PaginatorInfo<OrderStatus> {}

export interface RefundPaginator extends PaginatorInfo<Refund> {}

export interface ReviewPaginator extends PaginatorInfo<Review> {}

export interface BidPaginator extends PaginatorInfo<Bid> {}

export interface QuestionPaginator extends PaginatorInfo<Question> {}

export interface ReportsPaginator extends PaginatorInfo<Question> {}

export interface DownloadableFilePaginator
  extends PaginatorInfo<DownloadableFile> {}

export interface AuctionProductPaginator
  extends PaginatorInfo<AuctionProduct> {}

export interface WishlistPaginator extends PaginatorInfo<Wishlist> {}

export interface ProvincePaginator extends PaginatorInfo<Province> {}
export interface CityPaginator extends PaginatorInfo<City> {}
export interface DistrictPaginator extends PaginatorInfo<District> {}
