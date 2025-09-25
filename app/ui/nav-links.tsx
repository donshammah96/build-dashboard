'use client';

import { BookOpenIcon, HomeIcon, UserIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { StoreIcon } from 'lucide-react';
import { ROUTES } from '@/app/lib/links';

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
  { 
    name: 'Home', 
    href: ROUTES.home, 
    icon: HomeIcon 
    },
  {
    name: 'Idea Books',
    href: ROUTES.ideaBooks,
    icon: BookOpenIcon,
  },
  { 
    name: 'Find a Professional', 
    href: ROUTES.findProfessional, 
    icon: UserIcon 
},
{ 
    name: 'Speak with an Advisor', 
    href: ROUTES.speakWithAdvisor, 
    icon: UserIcon 
},
{ 
    name: 'Hardware Shops', 
    href: ROUTES.hardwareShops, 
    icon: StoreIcon 
},
{ 
    name: 'Commercial Stores', 
    href: ROUTES.commercialStores, 
    icon: StoreIcon 
},
{ 
    name: 'Engineers', 
    href: ROUTES.engineers, 
    icon: UserIcon 
},
{ 
    name: 'Designers', 
    href: ROUTES.designers, 
    icon: UserIcon 
},
{ 
    name: 'Architects', 
    href: ROUTES.architects, 
    icon: UserIcon 
},
];

export default function NavLinks() {
  const pathname = usePathname();
  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              'flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3',
              {
                'bg-sky-100 text-blue-600': pathname === link.href,
              },
            )}          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
