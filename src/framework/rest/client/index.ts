import type {
  Attachment,
  Author,
  AuthorPaginator,
  AuthorQueryOptions,
  AuthResponse,
  CategoryPaginator,
  CategoryQueryOptions,
  ChangePasswordUserInput,
  CheckoutVerificationInput,
  CouponPaginator,
  CouponQueryOptions,
  CreateAbuseReportInput,
  CreateContactUsInput,
  CreateFeedbackInput,
  CreateOrderInput,
  CreateQuestionInput,
  CreateRefundInput,
  CreateReviewInput,
  DownloadableFilePaginator,
  Feedback,
  ForgotPasswordUserInput,
  LoginUserInput,
  Manufacturer,
  ManufacturerPaginator,
  ManufacturerQueryOptions,
  MyReportsQueryOptions,
  Order,
  OrderPaginator,
  OrderQueryOptions,
  OrderStatusPaginator,
  OtpLoginInputType,
  OTPResponse,
  Product,
  ProductPaginator,
  ProductQueryOptions,
  QueryOptions,
  QuestionPaginator,
  QuestionQueryOptions,
  Refund,
  RefundPaginator,
  RegisterUserInput,
  ResetPasswordUserInput,
  Review,
  ReviewPaginator,
  ReviewQueryOptions,
  ReviewResponse,
  SendOtpCodeInputType,
  Settings,
  Shop,
  ShopPaginator,
  ShopQueryOptions,
  SocialLoginInputType,
  TagPaginator,
  TagQueryOptions,
  Type,
  TypeQueryOptions,
  UpdateReviewInput,
  UpdateUserInput,
  User,
  VerifiedCheckoutData,
  VerifyCouponInputType,
  VerifyCouponResponse,
  VerifyForgotPasswordUserInput,
  VerifyOtpInputType,
  Wishlist,
  WishlistPaginator,
  WishlistQueryOptions,
  GetParams,
  SettingsQueryOptions,
  CreateOrderPaymentInput,
  SetupIntentInfo,
  PaymentIntentCollection,
  Card,
  PaginatorInfo,
  ProductBidQueryOptions,
  BidPaginator,
  DistrictPaginator,
  CityPaginator,
  PaymentMethodResponse,
  PaymentMethod,
} from '@/types';
import { API_ENDPOINTS } from './api-endpoints';
import { HttpClient } from './http-client';
import {
  AddressResponse,
  AuctionProductPaginator,
  BasicResponse,
  BasicResponseData,
  BasicResponseWithData,
  CartItem,
  CartResponse,
  NotificationResponse,
  ProvincePaginator,
  RegisterPartnerInput,
  RegisterResponse,
  RegisterTokenVerify,
  ShippingResponse,
  SingleData,
  UpdateStatusBuyerInput,
  UserAddressInput,
  UserResponse,
} from '@/types';
import { getEnv } from '@/config/get-env';

class Client {
  products = {
    all: (params: Partial<ProductQueryOptions>) =>
      HttpClient.get<ProductPaginator>(API_ENDPOINTS.PRODUCTS, {
        with: 'photo',
        ...params,
      }),
    home: (params: Partial<QueryOptions>) =>
      HttpClient.get<PaginatorInfo<Product>>(API_ENDPOINTS.PRODUCTS, params),

    questions: ({ question, ...params }: QuestionQueryOptions) =>
      HttpClient.get<QuestionPaginator>(API_ENDPOINTS.PRODUCTS_QUESTIONS, {
        searchJoin: 'and',
        ...params,
        search: HttpClient.formatSearchParams({
          question,
        }),
      }),

    get: ({ slug, language }: GetParams) =>
      HttpClient.get<SingleData<Product>>(`${API_ENDPOINTS.PRODUCTS}/${slug}`, {
        with: 'photos;photo;productCategory;bids;partner.city;partner.user',
      }),

    allBid: ({ product_id, ...params }: ProductBidQueryOptions) =>
      HttpClient.get<BidPaginator>(
        `${API_ENDPOINTS.PRODUCTS}/${product_id}/bid`,
        {
          ...params,
        }
      ),
    bid: (input: { product_id: number; amount: number }) =>
      HttpClient.post<BasicResponse>(
        `${API_ENDPOINTS.PRODUCTS}/${input.product_id}/bid`,
        input
      ),

    createFeedback: (input: CreateFeedbackInput) =>
      HttpClient.post<Feedback>(API_ENDPOINTS.FEEDBACK, input),
    createAbuseReport: (input: CreateAbuseReportInput) =>
      HttpClient.post<Review>(
        API_ENDPOINTS.PRODUCTS_REVIEWS_ABUSE_REPORT,
        input
      ),
    createQuestion: (input: CreateQuestionInput) =>
      HttpClient.post<Review>(API_ENDPOINTS.PRODUCTS_QUESTIONS, input),
  };
  carts = {
    all: ({ product_id, ...params }: ProductBidQueryOptions) =>
      HttpClient.get<BidPaginator>(
        `${API_ENDPOINTS.PRODUCTS}/${product_id}/bid`,
        {
          ...params,
        }
      ),
    update: (payload: { carts: CartItem[] }) =>
      HttpClient.put<BasicResponseWithData<CartResponse>>(
        API_ENDPOINTS.CART_UPDATE,
        payload
      ),
  };
  myReports = {
    all: (params: MyReportsQueryOptions) =>
      HttpClient.get<QuestionPaginator>(API_ENDPOINTS.MY_REPORTS, {
        with: 'user',
        orderBy: 'created_at',
        sortedBy: 'desc',
        ...params,
      }),
  };
  reviews = {
    all: ({ rating, ...params }: ReviewQueryOptions) =>
      HttpClient.get<ReviewPaginator>(API_ENDPOINTS.PRODUCTS_REVIEWS, {
        searchJoin: 'and',
        with: 'user',
        ...params,
        search: HttpClient.formatSearchParams({
          rating,
        }),
      }),
    get: ({ id }: { id: string }) =>
      HttpClient.get<Review>(`${API_ENDPOINTS.PRODUCTS_REVIEWS}/${id}`),
    create: (input: CreateReviewInput) =>
      HttpClient.post<ReviewResponse>(API_ENDPOINTS.PRODUCTS_REVIEWS, input),
    update: (input: UpdateReviewInput) =>
      HttpClient.put<ReviewResponse>(
        `${API_ENDPOINTS.PRODUCTS_REVIEWS}/${input.id}`,
        input
      ),
  };
  categories = {
    all: ({ type, ...params }: Partial<CategoryQueryOptions>) =>
      HttpClient.get<CategoryPaginator>(API_ENDPOINTS.CATEGORIES, params),
  };
  tags = {
    all: (params: Partial<TagQueryOptions>) =>
      HttpClient.get<TagPaginator>(API_ENDPOINTS.TAGS, params),
  };
  shops = {
    all: (params: Partial<ShopQueryOptions>) =>
      HttpClient.get<ShopPaginator>(API_ENDPOINTS.SHOPS, {
        search: HttpClient.formatSearchParams({
          is_active: '1',
        }),
        ...params,
      }),
    get: (slug: string) =>
      HttpClient.get<Shop>(`${API_ENDPOINTS.SHOPS}/${slug}`),
  };
  authors = {
    all: ({ name, ...params }: Partial<AuthorQueryOptions>) => {
      return HttpClient.get<AuthorPaginator>(API_ENDPOINTS.AUTHORS, {
        ...params,
        search: HttpClient.formatSearchParams({
          name,
        }),
      });
    },
    top: (params: Pick<QueryOptions, 'limit'>) =>
      HttpClient.get<Author[]>(API_ENDPOINTS.AUTHORS_TOP, params),
    get: ({ slug, language }: { slug: string; language?: string }) =>
      HttpClient.get<Author>(`${API_ENDPOINTS.AUTHORS}/${slug}`, {
        language,
      }),
  };
  manufacturers = {
    all: ({ name, ...params }: Partial<ManufacturerQueryOptions>) =>
      HttpClient.get<ManufacturerPaginator>(API_ENDPOINTS.MANUFACTURERS, {
        ...params,
        search: HttpClient.formatSearchParams({
          name,
        }),
      }),
    top: (params: Pick<QueryOptions, 'limit'>) =>
      HttpClient.get<Manufacturer[]>(API_ENDPOINTS.MANUFACTURERS_TOP, params),
    get: ({ slug, language }: { slug: string; language?: string }) =>
      HttpClient.get<Manufacturer>(`${API_ENDPOINTS.MANUFACTURERS}/${slug}`, {
        language,
      }),
  };
  coupons = {
    all: (params: Partial<CouponQueryOptions>) =>
      HttpClient.get<CouponPaginator>(API_ENDPOINTS.COUPONS, params),
    verify: (input: VerifyCouponInputType) =>
      HttpClient.post<VerifyCouponResponse>(
        API_ENDPOINTS.COUPONS_VERIFY,
        input
      ),
  };
  orders = {
    all: (params: Partial<OrderQueryOptions>) =>
      HttpClient.get<OrderPaginator>(API_ENDPOINTS.ORDERS, {
        with: 'product.photo;userAddress;user;invoice.paymentMethod.paymentMethodInstructions;partner.province;partner;buyerStatuses',
        order_by: 'created_at',
        sorted_by: 'desc',
        ...params,
      }),
    get: (tracking_number: string) =>
      HttpClient.get<Order>(`${API_ENDPOINTS.ORDERS}/${tracking_number}`),
    create: (input: CreateOrderInput) =>
      HttpClient.post<Order>(API_ENDPOINTS.ORDERS, input),
    refunds: (params: Pick<QueryOptions, 'limit'>) =>
      HttpClient.get<RefundPaginator>(API_ENDPOINTS.ORDERS_REFUNDS, params),
    createRefund: (input: CreateRefundInput) =>
      HttpClient.post<Refund>(API_ENDPOINTS.ORDERS_REFUNDS, input),
    payment: (input: CreateOrderPaymentInput) =>
      HttpClient.post<any>(API_ENDPOINTS.ORDERS_PAYMENT, input),
    savePaymentMethod: (input: any) =>
      HttpClient.post<any>(API_ENDPOINTS.SAVE_PAYMENT_METHOD, input),
    verify: (input: CheckoutVerificationInput) =>
      HttpClient.post<VerifiedCheckoutData>(
        API_ENDPOINTS.ORDERS_CHECKOUT_VERIFY,
        input
      ),
    updateStatusBuyer: (input: UpdateStatusBuyerInput) =>
      HttpClient.put<BasicResponse>(
        `${API_ENDPOINTS.ORDERS_STATUS_BUYER}/${input.id}`,
        input
      ),
    generateDownloadLink: (input: { digital_file_id: string }) =>
      HttpClient.post<string>(
        API_ENDPOINTS.GENERATE_DOWNLOADABLE_PRODUCT_LINK,
        input
      ),
    getPaymentIntent: ({ tracking_number }: { tracking_number: string }) =>
      HttpClient.get<PaymentIntentCollection>(API_ENDPOINTS.PAYMENT_INTENT, {
        tracking_number,
      }),
  };
  notification = {
    all: (params: Partial<QueryOptions>) =>
      HttpClient.get<NotificationResponse>(API_ENDPOINTS.USERS_NOTIFICATION, {
        per_page: 9999,
        ...params,
      }),
  };
  checkouts = {
    verify: () =>
      HttpClient.post<BasicResponse>(API_ENDPOINTS.ORDERS_CHECK, null),
    verifyAuction: (product_id: number) =>
      HttpClient.post<BasicResponseData<Product>>(
        API_ENDPOINTS.ORDERS_CHECK_AUCTION,
        {
          product_id,
        }
      ),
    paymentMethod: (payload: QueryOptions) =>
      HttpClient.get<PaginatorInfo<PaymentMethod>>(
        API_ENDPOINTS.PAYMENT_METHODS,
        payload
      ),
  };
  shippings = {
    calculate: (payload: {
      user_address_id: string;
      product_auction_id?: string;
    }) =>
      HttpClient.post<ShippingResponse>(
        API_ENDPOINTS.SHIPPINGS_CALCULATE,
        payload
      ),
  };
  users = {
    me: () =>
      HttpClient.get<UserResponse>(API_ENDPOINTS.USERS_ME, {
        with: 'photo',
      }),
    myAuction: (query: QueryOptions) =>
      HttpClient.get<AuctionProductPaginator>(
        API_ENDPOINTS.USERS_AUCTION,
        query
      ),
    update: (user: UpdateUserInput) =>
      HttpClient.post<BasicResponse>(`${API_ENDPOINTS.USERS_ME}`, user),
    registerPartner: (input: RegisterPartnerInput) =>
      HttpClient.post<BasicResponse>(
        `${API_ENDPOINTS.USERS_PARTNER_REGISTER}`,
        input
      ),
    login: (input: LoginUserInput) =>
      HttpClient.post<AuthResponse>(API_ENDPOINTS.USERS_LOGIN, {
        client_id: parseInt(process.env.NEXT_PUBLIC_PASSPORT_CLIENT_ID || ''),
        client_secret: process.env.NEXT_PUBLIC_PASSPORT_CLIENT_SECRET,
        grant_type: 'password',
        ...input,
      }),
    socialLogin: (input: SocialLoginInputType) =>
      HttpClient.post<AuthResponse>(API_ENDPOINTS.SOCIAL_LOGIN, input),
    sendOtpCode: (input: SendOtpCodeInputType) =>
      HttpClient.post<OTPResponse>(API_ENDPOINTS.SEND_OTP_CODE, input),
    verifyOtpCode: (input: VerifyOtpInputType) =>
      HttpClient.post<BasicResponse>(API_ENDPOINTS.VERIFY_OTP_CODE, input),
    OtpLogin: (input: OtpLoginInputType) =>
      HttpClient.post<AuthResponse>(API_ENDPOINTS.OTP_LOGIN, input),
    register: (input: RegisterUserInput) =>
      HttpClient.post<RegisterResponse>(API_ENDPOINTS.USERS_REGISTER, input),
    registerVerify: (data: RegisterTokenVerify) =>
      HttpClient.post<RegisterResponse>(
        API_ENDPOINTS.USERS_REGISTER_VERIFY,
        data
      ),
    forgotPassword: (input: ForgotPasswordUserInput) =>
      HttpClient.post<BasicResponse>(
        API_ENDPOINTS.USERS_FORGOT_PASSWORD,
        input
      ),
    verifyForgotPasswordToken: (input: VerifyForgotPasswordUserInput) =>
      HttpClient.post<BasicResponse>(
        API_ENDPOINTS.USERS_VERIFY_FORGOT_PASSWORD_TOKEN,
        input
      ),
    resetPassword: (input: ResetPasswordUserInput) =>
      HttpClient.post<BasicResponse>(API_ENDPOINTS.USERS_RESET_PASSWORD, input),
    changePassword: (input: ChangePasswordUserInput) =>
      HttpClient.post<BasicResponse>(
        API_ENDPOINTS.USERS_CHANGE_PASSWORD,
        input
      ),
    logout: () => HttpClient.post<boolean>(API_ENDPOINTS.USERS_LOGOUT, {}),
    createAddress: (payload: UserAddressInput) =>
      HttpClient.post<BasicResponse>(`${API_ENDPOINTS.USERS_ADDRESS}`, payload),
    updateAddress: ({
      id,
      payload,
    }: {
      id: string;
      payload: UserAddressInput;
    }) =>
      HttpClient.put<BasicResponse>(
        `${API_ENDPOINTS.USERS_ADDRESS}/${id}`,
        payload
      ),
    deleteAddress: ({ id }: { id: string }) =>
      HttpClient.delete<boolean>(`${API_ENDPOINTS.USERS_ADDRESS}/${id}`),
    subscribe: (input: { email: string }) =>
      HttpClient.post<any>(API_ENDPOINTS.USERS_SUBSCRIBE_TO_NEWSLETTER, input),
    contactUs: (input: CreateContactUsInput) =>
      HttpClient.post<any>(API_ENDPOINTS.USERS_CONTACT_US, input),

    selectProvince: (params: QueryOptions) =>
      HttpClient.get<ProvincePaginator>(
        API_ENDPOINTS.USERS_SELECT_PROVINCE,
        params
      ),
    selectCity: (params: QueryOptions) =>
      HttpClient.get<CityPaginator>(API_ENDPOINTS.USERS_SELECT_CITY, params),
    selectDistrict: (params: QueryOptions) =>
      HttpClient.get<DistrictPaginator>(
        API_ENDPOINTS.USERS_SELECT_DISTRICT,
        params
      ),
  };
  wishlist = {
    all: (params: WishlistQueryOptions) =>
      HttpClient.get<WishlistPaginator>(API_ENDPOINTS.WISHLIST, {
        with: 'product.photo;user',
        ...params,
      }),
    toggle: (input: { product_id: number; language?: string }) =>
      HttpClient.post<BasicResponse>(
        API_ENDPOINTS.USERS_WISHLIST_TOGGLE,
        input
      ),
    remove: (id: number) =>
      HttpClient.delete<Wishlist>(`${API_ENDPOINTS.WISHLIST}/${id}`),
    checkIsInWishlist: ({ product_id }: { product_id: number }) =>
      HttpClient.get<BasicResponseData<boolean>>(
        `${API_ENDPOINTS.WISHLIST}/in_wishlist/${product_id}`
      ),
  };
  settings = {
    upload: (input: File[]) => {
      let formData = new FormData();
      input.forEach((attachment) => {
        formData.append('attachment[]', attachment);
      });
      return HttpClient.post<Attachment[]>(API_ENDPOINTS.UPLOADS, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    },
  };
  cards = {
    all: (params?: any) =>
      HttpClient.get<Card[]>(API_ENDPOINTS.CARDS, { ...params }),
    remove: ({ id }: { id: string }) =>
      HttpClient.delete<any>(`${API_ENDPOINTS.CARDS}/${id}`),
    addPaymentMethod: (method_key: any) =>
      HttpClient.post<any>(API_ENDPOINTS.CARDS, method_key),
    makeDefaultPaymentMethod: (input: any) =>
      HttpClient.post<any>(API_ENDPOINTS.SET_DEFAULT_CARD, input),
  };
}

export default new Client();
