"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Heart, User, MessageSquareHeart, ShieldCheck, UserCheck, BrainCircuit, HeartHandshake, LogOut, Loader2, Video } from 'lucide-react';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

const menuItems = [
  { href: '/matches', label: 'Matches', icon: Heart },
  { href: '/profile', label: 'My Profile', icon: User },
  { href: '/call', label: 'Call', icon: Video },
  { href: '/conversation-starters', label: 'Icebreakers', icon: MessageSquareHeart, isHidden: true },
  { href: '/personality-analysis', label: 'Personality AI', icon: BrainCircuit, isHidden: true },
  { href: '/safety-guidance', label: 'Safety Tips', icon: ShieldCheck, isHidden: true },
  { href: '/risk-detection', label: 'Risk Detector', icon: UserCheck, isHidden: true },
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
  const router = useRouter();
  const auth = useAuth();
  const { toast } = useToast();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut(auth);
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
      router.push('/login');
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        variant: "destructive",
        title: "Logout Failed",
        description: "An error occurred during logout. Please try again.",
      });
    } finally {
      setIsLoggingOut(false);
    }
  };


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
          {menuItems.filter(item => !item.isHidden).map((item) => (
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
      <SidebarFooter className="flex flex-col gap-2 p-2">
        <Button 
            onClick={handleLogout} 
            variant="ghost" 
            className="w-full justify-start gap-2 text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground group-data-[state=collapsed]:justify-center"
            disabled={isLoggingOut}
        >
          {isLoggingOut ? <Loader2 className="animate-spin" /> : <LogOut />}
          <span className="group-data-[state=expanded]:inline">Logout</span>
        </Button>
        <div className="text-sm text-muted-foreground p-2 hidden group-data-[state=expanded]:flex">
            © {new Date().getFullYear()} HeartSync
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
