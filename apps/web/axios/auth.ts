import { axiosApiInstance } from '@/axios';

// vvv ------------------mutations------------------ vvv

const signIn = async (values: { username: string; password: string }) => {
  const { data } = await axiosApiInstance.post<{ token: string }>(
    '/auth/signin',
    values
  );

  return data;
};

const signUp = async (values: {
  username: string;
  password: string;
  email: string;
}) => {
  const { data } = await axiosApiInstance.post<{
    receiver: string;
  }>('/auth/signup', values);

  return data;
};

// ^^^ ------------------mutations------------------ ^^^

export { signIn, signUp };
