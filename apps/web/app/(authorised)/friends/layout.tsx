import { FriendsOrRequestsNav } from '@/components/friends/friends-or-requests-nav';

export default function FriendsLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col-reverse gap-5 lg:grid lg:grid-cols-[minmax(0,2.5fr)_minmax(0,1fr)] lg:items-start">
      <div className="flex flex-col rounded-lg bg-background p-5">
        {children}
      </div>
      <FriendsOrRequestsNav />
    </div>
  );
}
