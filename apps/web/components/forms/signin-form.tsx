'use client';

import { useTransition } from 'react';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';

import { setToken } from '@/app/server';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { Icons } from '@/components/icons';

import { signIn } from '@/axios/auth';

import { useZodForm } from '@/hooks/use-zod-form';

import { env } from '@/lib/env';
import { ICON_INSIDE_BUTTON_SIZE, PAGES } from '@/lib/constants';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  username: z.string().min(1, { message: 'Username is required' }),
  password: z.string().min(1, { message: 'Password is required' })
});

export const SignInForm = () => {
  const [isPending, startTransition] = useTransition();

  const router = useRouter();

  const signInMutation = useMutation({
    mutationFn: (data: z.infer<typeof formSchema>) => signIn(data),
    onSuccess: ({ token }) => {
      setToken(token);
    }
  });

  const form = useZodForm(formSchema, {
    defaultValues: {
      username: '',
      password: env.NEXT_PUBLIC_SIGN_IN_PASSWORD || ''
    }
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => {
          signInMutation.mutate(data, {
            onSuccess: () => {
              toast.success('You have successfully signed in.');

              startTransition(() => {
                router.push(PAGES.NEWS);
              });
            }
          });
        })}
        className="space-y-10"
      >
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input
                  placeholder="your username here..."
                  type="text"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        ></FormField>
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  placeholder="your password here..."
                  type="password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        ></FormField>
        <Button
          type="submit"
          className="w-full"
          disabled={signInMutation.isPending || isPending}
        >
          {signInMutation.isPending || isPending ? (
            <div className="flex items-center gap-2">
              <Icons.spinner
                className={cn('animate-spin', ICON_INSIDE_BUTTON_SIZE)}
              />
              <span>Loading...</span>
            </div>
          ) : (
            'Sign In'
          )}
        </Button>
      </form>
    </Form>
  );
};
