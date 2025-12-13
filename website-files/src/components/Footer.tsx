import Link from 'next/link';
import Image from 'next/image';
import { Instagram, Mail, Facebook, Linkedin, Youtube } from 'lucide-react';

const socialLinks = [
  {
    name: 'Instagram',
    href: 'https://instagram.com/cvaneastmidlands',
    icon: Instagram,
  },
  {
    name: 'Facebook',
    href: 'https://facebook.com/cvaneastmidlands',
    icon: Facebook,
  },
  {
    name: 'LinkedIn',
    href: 'https://linkedin.com/company/cvaneastmidlands',
    icon: Linkedin,
  },
  {
    name: 'YouTube',
    href: 'https://youtube.com/@cvaneastmidlands',
    icon: Youtube,
  },
  {
    name: 'Email',
    href: 'mailto:info@cvaneastmidlands.co.uk',
    icon: Mail,
  },
];

const legalLinks = [
  { name: 'Privacy Policy', href: '/privacy-policy' },
  { name: 'Accessibility', href: '/accessibility' },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-cvan-cream text-black">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Brand with Full Logo */}
          <div className="lg:col-span-1">
            <Image
              src="/images/CVAN_EastMidlands_logo_fullhand_2-colour_RGB-01.png"
              alt="CVAN East Midlands"
              width={280}
              height={140}
              className="h-24 w-auto mb-4"
            />
            <p className="text-sm text-black/70 max-w-xs">
              Contemporary Visual Arts Network East Midlands supports visual arts across the region.
            </p>
          </div>

          {/* Social Links - Left Aligned */}
          <div className="lg:col-span-1">
            <h3 className="text-sm font-semibold text-black mb-4">Connect</h3>
            <div className="flex flex-wrap gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target={social.name !== 'Email' ? '_blank' : undefined}
                  rel={social.name !== 'Email' ? 'noopener noreferrer' : undefined}
                  className="text-black/70 hover:text-black transition-colors"
                  aria-label={social.name}
                >
                  <social.icon className="h-6 w-6" />
                </a>
              ))}
            </div>
            <p className="text-sm text-black/70 mt-4">
              <a
                href="mailto:info@cvaneastmidlands.co.uk"
                className="hover:text-black transition-colors"
              >
                info@cvaneastmidlands.co.uk
              </a>
            </p>
          </div>

          {/* Legal Links */}
          <div className="lg:col-span-1">
            <h3 className="text-sm font-semibold text-black mb-4">Legal</h3>
            <ul className="space-y-3">
              {legalLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-black/70 hover:text-black transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Partner Logos */}
          <div className="lg:col-span-1">
            <h3 className="text-sm font-semibold text-black mb-4">Supported by</h3>
            <div className="flex flex-col gap-4">
              <a
                href="https://www.artscouncil.org.uk/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-opacity"
              >
                <Image
                  src="/images/lottery_Logo_Black-RGB.png"
                  alt="Arts Council England - National Lottery"
                  width={140}
                  height={56}
                  className="h-14 w-auto"
                />
              </a>
              <a
                href="https://nae.org.uk/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-opacity"
              >
                <Image
                  src="/images/nae-logo.svg"
                  alt="National Arts Education"
                  width={100}
                  height={40}
                  className="h-10 w-auto"
                />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-black/10">
          <p className="text-xs text-black/60 text-center">
            &copy; {currentYear} CVAN East Midlands. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
