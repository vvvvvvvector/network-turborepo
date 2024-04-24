import { FormsWrapper } from '@/app/(auth)/forms-wrapper';
import { ThemePicker } from '@/app/(auth)/theme-picker';

export default function AuthLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ThemePicker />
      <FormsWrapper>{children}</FormsWrapper>
    </>
  );
}
