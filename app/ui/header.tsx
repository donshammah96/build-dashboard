'use client';

import { oxygen } from './fonts';
import Link from 'next/link';
import { Hammer, LogOut, User, Menu, X, Bell } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';

const publicNavigationLinks = [
  { title: 'Idea Books', href: '/' },
  { title: 'Find Professionals', href: '/' },
  { title: 'Guidance', href: '/' },
];

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className={`w-full bg-white shadow-md ${oxygen.className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <Image
              src="/bm-logo-main.png"
              alt="Build Market Logo"
              width={80} 
              height={40} 
              className="object-contain h-full max-h-16" 
            />
            <span className="hidden md:block text-xl font-bold text-black-800 leading-none">Build Market</span>
            <button 
              className="md:hidden ml-4 text-black hover:text-gray-700 focus:outline-none"
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Navigation Links - Hidden on mobile, shown on md+ */}
          <div className="hidden md:flex space-x-8 items-center">
            {publicNavigationLinks.map((link) => (
              <Link
                key={link.title}
                href={link.href}
                className="text-black hover:text-gray-700 font-medium"
              >
                {link.title}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <Link href="/login" className="flex items-center text-black hover:text-gray-700 font-medium">
              <span>Sign In</span>
            </Link>
            <button className="bg-black text-white px-4 py-2 rounded-lg shadow hover:bg-gray-800 font-medium">
              Join as a Pro
            </button>
          </div>
        </div>

        {/* Mobile Navigation - Shown on mobile, hidden on md+ */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white shadow-md p-4 absolute w-full top-16 left-0 z-50">
            {publicNavigationLinks.map((link) => (
              <Link
                key={link.title}
                href={link.href}
                className="block text-black hover:text-gray-700 font-medium py-2"
                onClick={toggleMobileMenu} // Close menu on link click
              >
                {link.title}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}