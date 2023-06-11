import { useRouter } from 'next/router';
const useLayout = () => {
  const router = useRouter();
  const regex = /^\/$|^\/\?(.*)/;
  if (regex.test(router?.asPath)) {
    return {
      layout: 'compact',
    };
  }
  return {
    layout: 'compact',
  };
};

export default useLayout;
