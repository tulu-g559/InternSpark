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

  return (
    <>
      {navItems.map((item) => (
        <SidebarMenuItem key={item.href}>
          <Link href={item.href} legacyBehavior passHref>
            <SidebarMenuButton
              isActive={pathname === item.href}
              tooltip={item.tooltip}
            >
              <item.icon />
              <span>{item.label}</span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      ))}
    </>
  );
}
