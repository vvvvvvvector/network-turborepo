import { type Metadata } from 'next';

import { auth } from '@/app/(auth)/auth';

import { SignUpForm } from '@/components/forms/signup-form';

export const metadata: Metadata = {
  title: 'Auth / Sign Up'
};

export default async function SignUpPage() {
  await auth('/profile', 'username');

  return <SignUpForm />;
}
