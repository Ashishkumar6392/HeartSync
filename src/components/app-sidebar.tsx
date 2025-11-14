"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Heart, User, MessageSquareHeart, ShieldCheck, UserCheck, BrainCircuit, HeartHandshake } from 'lucide-react';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';

const menuItems = [
  { href: '/matches', label: 'Matches', icon: Heart },
  { href: '/profile', label: 'My Profile', icon: User },
  { href: '/conversation-starters', label: 'Icebreakers', icon: MessageSquareHeart },
  { href: '/personality-analysis', label: 'Personality AI', icon: BrainCircuit },
  { href: '/safety-guidance', label: 'Safety Tips', icon: ShieldCheck },
  { href: '/risk-detection', label: 'Risk Detector', icon: UserCheck },
];

function HeartSyncLogo() {
  return (
    <Link href="/matches" className="flex items-center gap-2">
      <HeartHandshake className="w-8 h-8 text-primary" />
      <h1 className="text-xl font-bold text-foreground">HeartSync</h1>
    </Link>
  );
}

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="hidden h-10 items-center px-2 group-data-[state=expanded]:flex">
            <HeartSyncLogo />
        </div>
        <div className="flex h-10 items-center justify-center group-data-[state=collapsed]:flex">
            <HeartHandshake className="w-8 h-8 text-primary" />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.label}>
              <Link href={item.href} legacyBehavior passHref>
                <SidebarMenuButton
                  isActive={pathname.startsWith(item.href)}
                  tooltip={{ children: item.label }}
                >
                  <item.icon />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="hidden group-data-[state=expanded]:flex">
        <div className="text-sm text-muted-foreground p-2">
            © {new Date().getFullYear()} HeartSync
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
