"use client";

import { usePathname } from 'next/navigation';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { HeartHandshake } from 'lucide-react';

const pageTitles: { [key: string]: string } = {
    '/matches': 'Your Matches',
    '/profile': 'Your Profile',
    '/conversation-starters': 'Conversation Starters',
    '/personality-analysis': 'Personality Analysis',
    '/safety-guidance': 'Safe Dating Guidance',
    '/risk-detection': 'Message Risk Detection',
    '/call': 'Video Call',
};

export default function AppHeader() {
  const pathname = usePathname();
  const title = pageTitles[pathname] || 'HeartSync';

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
        <div className="flex items-center gap-4">
            <SidebarTrigger className="lg:hidden" />
            <h1 className="text-xl font-semibold">{title}</h1>
        </div>
        <div className="flex items-center gap-2 lg:hidden">
            <HeartHandshake className="w-7 h-7 text-primary" />
            <span className="font-bold">HeartSync</span>
        </div>
    </header>
  );
}
