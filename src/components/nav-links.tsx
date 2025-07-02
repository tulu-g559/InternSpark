'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FileText,
  MessagesSquare,
  Gauge,
  Mail,
  ClipboardList,
} from 'lucide-react';
import { SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { useEffect, useState } from 'react';

const navItems = [
  {
    href: '/resume-review',
    icon: FileText,
    label: 'Resume Review',
    tooltip: 'Resume Review',
  },
  {
    href: '/mock-interview',
    icon: MessagesSquare,
    label: 'Mock Interview',
    tooltip: 'Mock Interview',
  },
  {
    href: '/readiness-tracker',
    icon: Gauge,
    label: 'Readiness Tracker',
    tooltip: 'Readiness Tracker',
  },
  {
    href: '/cover-letter',
    icon: Mail,
    label: 'Cover Letter Generator',
    tooltip: 'Cover Letter Generator',
  },
  {
    href: '/job-description-simplifier',
    icon: ClipboardList,
    label: 'JD Simplifier',
    tooltip: 'JD Simplifier',
  },
];

export default function NavLinks() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      {navItems.map((item) => (
        <SidebarMenuItem key={item.href}>
          <SidebarMenuButton
            asChild
            isActive={mounted ? pathname === item.href : false}
            tooltip={item.tooltip}
          >
            <Link href={item.href}>
              <item.icon />
              <span>{item.label}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </>
  );
}
