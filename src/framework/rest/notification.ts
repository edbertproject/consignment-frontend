import { NotificationResponse, QueryOptions } from '@/types';
import { useQuery } from 'react-query';
import client from './client';
import { API_ENDPOINTS } from './client/api-endpoints';

export function useMyNotification(options?: QueryOptions) {
  const { data, isLoading, error } = useQuery<NotificationResponse, Error>(
    [API_ENDPOINTS.USERS_NOTIFICATION, options],
    ({ queryKey, pageParam }) =>
      client.notification.all(Object.assign({}, queryKey[1], pageParam)),
    {}
  );
  return {
    notifications: data?.data ?? [],
    isLoading,
    error,
  };
}
