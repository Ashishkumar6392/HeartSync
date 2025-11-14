import type { PropsWithChildren } from 'react';
import AppHeader from '@/components/app-header';
import { AppSidebar } from '@/components/app-sidebar';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';

export default function AppLayout({ children }: PropsWithChildren) {
  return (
    <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
            <AppHeader />
            <div className="flex-1 p-4 md:p-6">{children}</div>
        </SidebarInset>
    </SidebarProvider>
  );
}
