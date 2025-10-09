import { UserProvider } from '@/src/context/UserContext';
import { ReactNode } from 'react';

export default function UserLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <UserProvider>
      {children}
    </UserProvider>
  )
}