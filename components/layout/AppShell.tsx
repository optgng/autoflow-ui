'use client';
import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';

const NO_SIDEBAR_ROUTES = ['/login'];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hasSidebar = !NO_SIDEBAR_ROUTES.includes(pathname);

  if (!hasSidebar) return <>{children}</>;

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      {/* ← bg-background убран, main прозрачный → видно ambient через glass-card */}
      <main className="flex-1 ml-64 min-h-screen">
        <div className="container-custom section-spacing page-transition">
          {children}
        </div>
      </main>
    </div>
  );
}

