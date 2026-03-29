
'use client';

import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface User {
  _id: string;
  email: string;
}

export function useUser() {
  const { data, error, mutate, isLoading } = useSWR<{ user: User }>('/api/auth/me', fetcher);

  const loading = isLoading;
  const user = data?.user;

  return {
    user,
    loading,
    error,
    mutate,
  };
}
