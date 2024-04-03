import { z } from 'zod';
import { useForm, type UseFormProps } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';

export function useZodForm<TSchema extends Parameters<typeof zodResolver>[0]>(
  zodSchema: TSchema,
  props?: Omit<UseFormProps<z.infer<TSchema>>, 'resolver'>
) {
  return useForm<z.infer<TSchema>>({
    resolver: zodResolver(zodSchema),
    ...props
  });
}
