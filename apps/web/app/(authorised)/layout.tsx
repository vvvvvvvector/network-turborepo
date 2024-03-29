import { SocketConnector } from '@/components/socket-connector';
import { Header } from '@/components/header';
import { DesktopNav } from '@/components/desktop-nav';

export default function AuthorisedLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <SocketConnector>
      <Header />
      <div className="flex flex-1 justify-center bg-authorised">
        <div className="my-3 w-full max-w-authorised px-5">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-[175px_minmax(0,1fr)]">
            <DesktopNav />
            <main>{children}</main>
          </div>
        </div>
      </div>
    </SocketConnector>
  );
}
