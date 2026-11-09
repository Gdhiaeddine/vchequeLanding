'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ShoppingCart, Menu, X } from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isHome = pathname === '/';

  const navLinks = [
    { label: 'Accueil', href: '/' },
    { label: 'Fonctionnalités', href: isHome ? '#fonctionnalites' : '/#fonctionnalites' },
    { label: 'Banques compatibles', href: isHome ? '#banques' : '/#banques' },
    { label: 'Tarifs', href: isHome ? '#tarifs' : '/#tarifs' },
    { label: 'FAQ', href: isHome ? '#faq' : '/#faq' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <header className="site-header" data-elevate>
      <div className="container header-inner flex items-center justify-between py-4">
        {/* Brand */}
        <Link href="/" className="brand flex items-center gap-3 no-underline">
          <Image
            src="/img/vcheque-icon-128.png"
            alt="VCheque"
            width={40}
            height={40}
            priority
            className="brand-mark"
          />
          <span className="brand-text">
            <span className="brand-agency font-bold text-xl text-[#122620]">VCheque</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="site-nav hidden md:block" aria-label="Navigation principale">
          <ul className="flex items-center gap-6 list-none m-0 p-0">
            {navLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`nav-link text-sm font-medium hover:text-[#b99a5a] transition-colors ${
                      active ? 'text-[#b99a5a] font-semibold' : 'text-[#35433d]'
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Action Button */}
        <div className="header-actions hidden sm:flex items-center gap-3">
          <Link
            href="/commander"
            className="btn btn-primary inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold shadow-sm transition-all"
          >
            <ShoppingCart size={16} />
            <span>Acheter maintenant</span>
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          className="nav-toggle md:hidden p-2 text-[#122620] focus:outline-none"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <nav className="mobile-nav md:hidden border-t border-[#e2dcce] bg-[#fbf9f4] px-6 py-4">
          <ul className="flex flex-col gap-4 list-none m-0 p-0">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="mobile-link block text-base font-medium text-[#122620]"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="pt-2">
              <Link
                href="/commander"
                className="btn btn-primary w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold"
                onClick={() => setMobileMenuOpen(false)}
              >
                <ShoppingCart size={16} />
                <span>Acheter maintenant</span>
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
