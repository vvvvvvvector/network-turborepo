'use client';

import { useTransition } from 'react';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';

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

import { signUp } from '@/axios/auth';

import { useZodForm } from '@/hooks/use-zod-form';

import { ICON_INSIDE_BUTTON_SIZE, PAGES } from '@/lib/constants';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email is required' })
    .email({ message: 'Invalid email address' }),
  username: z.string().min(1, { message: 'Username is required' }),
  password: z
    .string()
    .min(1, { message: 'Password is required' })
    .regex(new RegExp('^(?=.*[A-Za-z])(?=.*[0-9])[A-Za-z0-9]{8,}$'), {
      message: 'Minimum 8 characters, at least 1 letter and 1 number'
    })
});

export const SignUpForm = () => {
  const [isPending, startTransition] = useTransition();

  const router = useRouter();

  const signUpMutation = useMutation({
    mutationFn: (data: z.infer<typeof formSchema>) => signUp(data)
  });

  const form = useZodForm(formSchema, {
    defaultValues: {
      email: '',
      username: '',
      password: ''
    }
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => {
          signUpMutation.mutate(data, {
            onSuccess: ({ receiver }) => {
              toast.success(`You've successfully signed up`, {
                description: `Profile activation link has been sent to: ${receiver}.`
              });

              toast.info(`Profile activation via e-mail isn't impemented yet`, {
                description:
                  'You can sign in immediatly after successful sign up.'
              });

              startTransition(() => {
                router.push(PAGES.SIGN_IN);
              });
            }
          });
        })}
        className="space-y-10"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="your email here..."
                  type="text"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
        />
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
        />
        <Button
          type="submit"
          className="w-full"
          disabled={signUpMutation.isPending || isPending}
        >
          {signUpMutation.isPending || isPending ? (
            <div className="flex items-center gap-2">
              <Icons.spinner
                className={cn('animate-spin', ICON_INSIDE_BUTTON_SIZE)}
              />
              <span>Loading...</span>
            </div>
          ) : (
            'Sign Up'
          )}
        </Button>
      </form>
    </Form>
  );
};
