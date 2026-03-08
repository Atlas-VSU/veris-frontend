import Link from "next/link";

export function MobileHeader() {
  return (
    <div>
      <header className="absolute inset-x-0 top-0 z-30 px-4 sm:px-6 py-0 flex items-center justify-between bg-white h-16">
        <img
          src="/main-banner-2.png"
          alt="USSC-Connect"
          className="h-12 w-auto object-contain"
        />
        <Link
          href="/login"
          className="px-3 py-1.5 rounded-lg bg-[#1B5E20] text-white text-xs font-semibold hover:bg-[#2E7D32] transition-colors uppercase"
        >
          Login
        </Link>
      </header>
    </div>
  );
}
