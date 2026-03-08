"use client";

import Link from "next/link";

export function DesktopHeader() {
  return (
    <div>
      <header className="absolute inset-x-0 top-0 z-1 px-6 sm:px-10 py-0 flex items-center justify-between bg-white h-20">
        <div className="inline-flex items-center gap-4 group">
          <img
            src="/main-banner-2.png"
            alt="USSC-Connect"
            className="ml-5 h-18 w-auto border-5 border-white rounded-xl object-contain"
          />
        </div>
        <nav className="hidden md:flex items-center gap-8 text-sm font-regular text-[#1B5E20]">
          <Link
            href="/"
            className="hover:text-[#1B5E20] transition-colors uppercase"
          >
            Home
          </Link>

          <Link
            href="/about"
            className="hover:text-[#1B5E20] transition-colors uppercase"
          >
            About
          </Link>

          <Link
            href="/contact"
            className="hover:text-[#1B5E20] transition-colors uppercase"
          >
            Contact
          </Link>

          <Link
            href="/login"
            className="px-4 py-2 rounded-lg bg-[#1B5E20] text-white hover:bg-[#2E7D32] transition-colors uppercase"
          >
            Login
          </Link>
        </nav>
      </header>
    </div>
  );
}
