import { Header } from '@/components/header';
import { DesktopNav } from '@/components/desktop-nav';
import { Main } from '@/components/main';

export default function AuthorisedLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex flex-1 justify-center bg-authorised">
        <div className="my-3 w-full max-w-authorised px-5">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-[175px_minmax(0,1fr)]">
            <DesktopNav />
            <Main>{children}</Main>
          </div>
        </div>
      </div>
    </div>
  );
}
