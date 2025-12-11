'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'About', href: '/about' },
  { name: 'CVAN EM Activity', href: '/activity' },
  { name: 'Events', href: '/events' },
  { name: 'Opportunities', href: '/opportunities' },
  { name: 'Mentoring', href: '/mentoring' },
];

const awdLink = {
  href: 'https://cvaneastmidlands.co.uk/awd/directory',
  external: true,
};

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-black/10 bg-white/80 backdrop-blur-md">
      {/* Corner Decoration - Left L-shape graphic symbol */}
      <div
        className="absolute top-2 left-2 w-10 h-10 bg-black pointer-events-none"
        style={{
          clipPath: 'polygon(0 0, 100% 0, 100% 25%, 25% 25%, 25% 100%, 0 100%)',
        }}
        aria-hidden="true"
      />

      <nav className="mx-auto max-w-7xl px-6 lg:px-8" aria-label="Main navigation">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <div className="flex lg:flex-1">
            <Link href="/" className="-m-1.5 p-1.5">
              <span className="sr-only">CVAN East Midlands</span>
              <Image
                src="/images/CVAN_logo_Shorthand_EastMidlands-01.png"
                alt="CVAN East Midlands"
                width={120}
                height={60}
                className="h-12 w-auto"
                priority
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:gap-x-8 lg:items-center">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-black hover:text-cvan-blue transition-colors"
              >
                {item.name}
              </Link>
            ))}

            {/* AWD Logo Link */}
            <Link
              href={awdLink.href}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
            >
              <Image
                src="/images/AWD-logo.png"
                alt="Artist Worker Directory"
                width={100}
                height={40}
                className="h-8 w-auto"
              />
            </Link>

            {/* Submit Dropdown */}
            <div className="relative group">
              <button className="px-4 py-2 text-sm font-semibold bg-cvan-yellow text-black rounded-md hover:bg-cvan-yellow/90 transition-colors">
                Submit
              </button>
              <div className="absolute right-0 mt-2 w-56 bg-white border border-black/10 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <Link
                  href="/events/submit"
                  className="block px-4 py-3 text-sm font-medium text-black hover:bg-cvan-yellow/20 rounded-t-lg transition-colors"
                >
                  Submit Event or Exhibition
                </Link>
                <Link
                  href="/opportunities/submit"
                  className="block px-4 py-3 text-sm font-medium text-black hover:bg-cvan-yellow/20 rounded-b-lg transition-colors"
                >
                  Submit Opportunity
                </Link>
              </div>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-black hover:bg-black/5"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        className={cn(
          'lg:hidden',
          mobileMenuOpen ? 'block' : 'hidden'
        )}
      >
        <div className="border-t border-black/10 px-6 py-6 bg-white/95 backdrop-blur-md">
          <div className="space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block px-3 py-2 text-base font-medium text-black hover:bg-cvan-yellow/20 rounded-md transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}

            {/* AWD Logo Link - Mobile */}
            <Link
              href={awdLink.href}
              target="_blank"
              rel="noopener noreferrer"
              className="block px-3 py-2 hover:bg-cvan-yellow/20 rounded-md transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Image
                src="/images/AWD-logo.png"
                alt="Artist Worker Directory"
                width={120}
                height={48}
                className="h-10 w-auto"
              />
            </Link>

            {/* Submit Links - Mobile */}
            <div className="mt-4 pt-4 border-t border-black/10 space-y-2">
              <p className="px-3 py-1 text-sm font-semibold text-black/60">Submit Content</p>
              <Link
                href="/events/submit"
                className="block px-3 py-2 text-base font-medium text-black bg-cvan-yellow/20 hover:bg-cvan-yellow rounded-md transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Submit Event or Exhibition
              </Link>
              <Link
                href="/opportunities/submit"
                className="block px-3 py-2 text-base font-medium text-black bg-cvan-yellow/20 hover:bg-cvan-yellow rounded-md transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Submit Opportunity
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
