import { useModalAction } from '@/components/ui/modal/modal.context';
import { useTranslation } from 'next-i18next';
import {
  MutationFunction,
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from 'react-query';
import { toast } from 'react-toastify';
import client from './client';
import { authorizationAtom } from '@/store/authorization-atom';
import { useAtom } from 'jotai';
import { signOut as socialLoginSignOut } from 'next-auth/react';
import { useToken } from '@/lib/hooks/use-token';
import { API_ENDPOINTS } from './client/api-endpoints';
import { useState } from 'react';
import type {
  RegisterUserInput,
  ChangePasswordUserInput,
  OtpLoginInputType,
  DistrictPaginator,
} from '@/types';
import { initialOtpState, optAtom } from '@/components/otp/atom';
import { useStateMachine } from 'little-state-machine';
import {
  initialState,
  updateFormState,
} from '@/components/auth/forgot-password';
import { clearCheckoutAtom } from '@/store/checkout';
import { AxiosError } from 'axios';
import { useRouter } from 'next/router';

export function useUser() {
  const [isAuthorized] = useAtom(authorizationAtom);
  const { data, isLoading, error } = useQuery(
    [API_ENDPOINTS.USERS_ME],
    client.users.me,
    {
      enabled: isAuthorized,
      onError: (err) => {
        console.log(err);
      },
    }
  );
  //TODO: do some improvement here
  return { me: data?.data, isLoading, error, isAuthorized };
}

export const useDeleteAddress = () => {
  const { closeModal } = useModalAction();
  const queryClient = useQueryClient();
  return useMutation(client.users.deleteAddress, {
    onSuccess: (data) => {
      if (data) {
        toast.success('Successfully delete address');
        closeModal();
        return;
      }
    },
    onError: (error) => {
      const {
        response: { data },
      }: any = error ?? {};

      toast.error(data?.message);
    },
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.USERS_ME);
    },
  });
};

export const useRegisterPartner = () => {
  const queryClient = useQueryClient();
  const { closeModal } = useModalAction();
  return useMutation(client.users.registerPartner, {
    onSuccess: (data) => {
      if (data.success) {
        toast.success(
          'Successful register as partner, please check periodically the status of the registration'
        );
        closeModal();
      }
    },
    onError: (error) => {
      const {
        response: { data },
      }: any = error ?? {};

      toast.error(data?.message);
    },
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.USERS_ME);
    },
  });
};

export const useUpdateUser = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { closeModal } = useModalAction();
  let [serverError, setServerError] = useState<string | null>(null);
  const { mutate, isLoading } = useMutation(client.users.update, {
    onSuccess: (data) => {
      if (data.success) {
        toast.success(t('profile-update-successful'));
        closeModal();
      }
    },
    onError: (error) => {
      const {
        response: { data },
      }: any = error ?? {};

      setServerError(data.message);
    },
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.USERS_ME);
    },
  });

  return { mutate, isLoading, serverError, setServerError };
};

export const useCreateAddress = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { closeModal } = useModalAction();
  let [serverError, setServerError] = useState<string | null>(null);

  const { mutate, isLoading } = useMutation(client.users.createAddress, {
    onSuccess: (data) => {
      toast.success(data.message);
      closeModal();
    },
    onError: (error) => {
      const {
        response: { data },
      }: any = error ?? {};

      setServerError(data.message);
    },
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.USERS_ME);
    },
  });

  return { mutate, isLoading, serverError, setServerError };
};

export const useUpdateAddress = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { closeModal } = useModalAction();
  let [serverError, setServerError] = useState<string | null>(null);

  const { mutate, isLoading } = useMutation(client.users.updateAddress, {
    onSuccess: (data) => {
      toast.success(data.message);
      closeModal();
    },
    onError: (error) => {
      const {
        response: { data },
      }: any = error ?? {};

      setServerError(data.message);
    },
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.USERS_ME);
    },
  });

  return { mutate, isLoading, serverError, setServerError };
};

export const useSelectProvince = () => {
  const { t } = useTranslation('common');

  const { mutate, isLoading, isSuccess, data } = useMutation(
    client.users.selectProvince,
    {
      onError: (error) => {
        const {
          response: { data },
        }: any = error ?? {};

        toast.error(t(data?.message));
      },
    }
  );

  return {
    loadProvince: mutate,
    dataProvince: data,
    isLoadingProvince: isLoading,
    isSuccess,
  };
};

export const useSelectCity = () => {
  const { t } = useTranslation('common');

  const { mutate, isLoading, isSuccess, data } = useMutation(
    client.users.selectCity,
    {
      onError: (error) => {
        const {
          response: { data },
        }: any = error ?? {};

        toast.error(t(data?.message));
      },
    }
  );

  return {
    loadCity: mutate,
    dataCity: data,
    isLoadingCity: isLoading,
    isSuccess,
  };
};

export const useSelectDistrict = () => {
  const { t } = useTranslation('common');

  const { mutate, isLoading, isSuccess, data } = useMutation(
    client.users.selectDistrict,
    {
      onError: (error) => {
        const {
          response: { data },
        }: any = error ?? {};

        toast.error(t(data?.message));
      },
    }
  );

  return {
    loadDistrict: mutate,
    dataDistrict: data,
    isLoadingDistrict: isLoading,
    isSuccess,
  };
};

export const useContact = () => {
  const { t } = useTranslation('common');

  return useMutation(client.users.contactUs, {
    onSuccess: (data) => {
      if (data.success) {
        toast.success(t(data.message));
      } else {
        toast.error(t(data.message));
      }
    },
    onError: (err) => {
      console.log(err);
    },
  });
};

export function useLogin() {
  const { t } = useTranslation('common');
  const [_, setAuthorized] = useAtom(authorizationAtom);
  const { closeModal } = useModalAction();
  const { setToken } = useToken();
  let [serverError, setServerError] = useState<string | null>(null);

  const { mutate, isLoading } = useMutation(client.users.login, {
    onSuccess: (data) => {
      if (!data.access_token) {
        setServerError('error-credential-wrong');
        return;
      }
      setToken(data.access_token);
      setAuthorized(true);
      closeModal();
    },
    onError: (error: AxiosError) => {
      setServerError(error.response?.data?.message);
    },
  });

  return { mutate, isLoading, serverError, setServerError };
}

export function useSocialLogin() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { setToken } = useToken();
  const [_, setAuthorized] = useAtom(authorizationAtom);

  return useMutation(client.users.socialLogin, {
    onSuccess: (data) => {
      if (data?.access_token) {
        setToken(data?.access_token);
        setAuthorized(true);
        return;
      }
      if (!data.access_token) {
        toast.error(t('error-credential-wrong'));
      }
    },
    onError: (error: Error) => {
      console.log(error.message);
    },
    onSettled: () => {
      queryClient.clear();
    },
  });
}

export function useSendOtpCode({
  verifyOnly,
}: Partial<{ verifyOnly: boolean }> = {}) {
  let [serverError, setServerError] = useState<string | null>(null);
  const [otpState, setOtpState] = useAtom(optAtom);

  const { mutate, isLoading } = useMutation(client.users.sendOtpCode, {
    onSuccess: (data) => {
      if (!data.success) {
        setServerError(data.message!);
        return;
      }
      setOtpState({
        ...otpState,
        otpId: data?.id!,
        isContactExist: data?.is_contact_exist!,
        phoneNumber: data?.phone_number!,
        step: data?.is_contact_exist! ? 'OtpForm' : 'RegisterForm',
        ...(verifyOnly && { step: 'OtpForm' }),
      });
    },
    onError: (error: Error) => {
      console.log(error.message);
    },
  });

  return { mutate, isLoading, serverError, setServerError };
}

export function useVerifyOtpCode({
  onVerifySuccess,
}: {
  onVerifySuccess: Function;
}) {
  const [otpState, setOtpState] = useAtom(optAtom);
  let [serverError, setServerError] = useState<string | null>(null);
  const { mutate, isLoading } = useMutation(client.users.verifyOtpCode, {
    onSuccess: (data) => {
      if (!data.success) {
        setServerError(data?.message!);
        return;
      }
      if (onVerifySuccess) {
        onVerifySuccess({
          phone_number: otpState.phoneNumber,
        });
      }
      setOtpState({
        ...initialOtpState,
      });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  return { mutate, isLoading, serverError, setServerError };
}

export function useOtpLogin() {
  const [otpState, setOtpState] = useAtom(optAtom);
  const { t } = useTranslation('common');
  const [_, setAuthorized] = useAtom(authorizationAtom);
  const { closeModal } = useModalAction();
  const { setToken } = useToken();
  const queryClient = new QueryClient();
  let [serverError, setServerError] = useState<string | null>(null);

  const { mutate: otpLogin, isLoading } = useMutation(client.users.OtpLogin, {
    onSuccess: (data) => {
      if (!data.access_token) {
        setServerError('text-otp-verify-failed');
        return;
      }
      setToken(data.access_token!);
      setAuthorized(true);
      setOtpState({
        ...initialOtpState,
      });
      closeModal();
    },
    onError: (error: Error) => {
      console.log(error.message);
    },
    onSettled: () => {
      queryClient.clear();
    },
  });

  function handleSubmit(input: OtpLoginInputType) {
    otpLogin({
      ...input,
      phone_number: otpState.phoneNumber,
      otp_id: otpState.otpId!,
    });
  }

  return { mutate: handleSubmit, isLoading, serverError, setServerError };
}

export function useRegister() {
  const { t } = useTranslation('common');
  const { closeModal } = useModalAction();
  let [serverError, setServerError] = useState<string | null>(null);

  const { mutate, isLoading } = useMutation(client.users.register, {
    onSuccess: (data) => {
      closeModal();
      toast.success(data.message, {
        autoClose: 5000,
      });
    },
    onError: (error) => {
      const {
        response: { data },
      }: any = error ?? {};

      setServerError(data.message);
    },
  });

  return { mutate, isLoading, serverError, setServerError };
}

export function useRegisterVerify() {
  const { t } = useTranslation('common');
  const { setToken } = useToken();
  const { closeModal } = useModalAction();
  let [serverError, setServerError] = useState<string | null>(null);

  const { mutate, isLoading } = useMutation(client.users.registerVerify, {
    onSuccess: (data) => {
      closeModal();
      toast.success(data.message, {
        autoClose: 5000,
      });
    },
    onError: (error) => {
      const {
        response: { data },
      }: any = error ?? {};

      setServerError(data.message);
    },
  });

  return { mutate, isLoading, serverError, setServerError };
}

export function useLogout() {
  const queryClient = useQueryClient();
  const { setToken } = useToken();
  const [_, setAuthorized] = useAtom(authorizationAtom);
  const [_r, resetCheckout] = useAtom(clearCheckoutAtom);

  const { mutate: signOut } = useMutation(client.users.logout, {
    onSuccess: (data) => {
      if (data) {
        setToken('');
        setAuthorized(false);
        resetCheckout();
        queryClient.refetchQueries(API_ENDPOINTS.USERS_ME);
      }
    },
    onSettled: () => {
      queryClient.clear();
    },
  });
  function handleLogout() {
    socialLoginSignOut({ redirect: false });
    signOut();
  }
  return {
    mutate: handleLogout,
  };
}

export function useChangePassword() {
  const { t } = useTranslation('common');
  let [formError, setFormError] =
    useState<Partial<ChangePasswordUserInput> | null>(null);

  const { mutate, isLoading } = useMutation(client.users.changePassword, {
    onSuccess: (data) => {
      toast.success(t('password-successful'));
    },
    onError: (error) => {
      const {
        response: { data },
      }: any = error ?? {};

      toast.error(data.message);
    },
  });

  return { mutate, isLoading, formError, setFormError };
}

export function useForgotPassword() {
  const { actions } = useStateMachine({ updateFormState });
  let [message, setMessage] = useState<string | null>(null);
  let [formError, setFormError] = useState<any>(null);
  let [serverError, setServerError] = useState<any>(null);
  const { t } = useTranslation();

  const { mutate, isLoading } = useMutation(client.users.forgotPassword, {
    onSuccess: (data, variables) => {
      setMessage(data?.message!);
      toast.success(data?.message!);
    },
    onError: (error) => {
      const {
        response: { data },
      }: any = error ?? {};

      setServerError(data.message);
    },
  });

  return {
    mutate,
    isLoading,
    message,
    formError,
    setFormError,
    setMessage,
    serverError,
    setServerError,
  };
}

export function useResetPassword() {
  const queryClient = useQueryClient();
  const router = useRouter();
  let [serverError, setServerError] = useState<string | null>(null);

  const { mutate, isLoading } = useMutation(client.users.resetPassword, {
    onSuccess: (data) => {
      toast.success(
        'Successfully Reset Password! please login using new password'
      );
      router.push('/');
    },
    onError: (error) => {
      const {
        response: { data },
      }: any = error ?? {};

      setServerError(data.message);
    },
    onSettled: () => {
      queryClient.clear();
    },
  });

  return { mutate, isLoading, serverError, setServerError };
}

export function useVerifyForgotPasswordToken() {
  const { actions } = useStateMachine({ updateFormState });
  const queryClient = useQueryClient();
  let [formError, setFormError] = useState<any>(null);

  const { mutate, isLoading } = useMutation(
    client.users.verifyForgotPasswordToken,
    {
      onSuccess: (data, variables) => {
        if (!data.success) {
          setFormError({
            token: data?.message ?? '',
          });
          return;
        }
        actions.updateFormState({
          step: 'Password',
          token: variables.token as string,
        });
      },
      onSettled: () => {
        queryClient.clear();
      },
    }
  );

  return { mutate, isLoading, formError, setFormError };
}
