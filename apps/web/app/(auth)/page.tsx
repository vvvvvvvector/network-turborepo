import { type Metadata } from 'next';

import { auth } from '@/app/(auth)/auth';

import { SignInForm } from '@/components/forms/signin-form';

export const metadata: Metadata = {
  title: 'Auth / Sign In'
};

export default async function SignInPage() {
  await auth('/profile', true);

  return <SignInForm />;
}
