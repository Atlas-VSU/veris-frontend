import Link from "next/link";

export function MobileHeader() {
  return (
    <div>
      <header className="absolute inset-x-0 top-0 z-30 px-6 sm:px-10 py-5 flex items-center justify-between">
        <Link href="/" className="inline-flex items-center gap-4 group">
          <div className="relative flex-shrink-0">
            <div className="absolute inset-0 rounded-full bg-transparent" />
            <div className="relative flex size-14 sm:size-16 items-center justify-center rounded-full bg-transparent">
              <img
                src="/ussc-logo-white.webp"
                alt="USSC-Connect"
                className="h-9 sm:h-10 w-auto object-contain drop-shadow-lg"
              />
            </div>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-base sm:text-lg font-black text-white tracking-tight leading-none drop-shadow-md">
              Visayas State University
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[10px] sm:text-xs font-semibold text-white/80 tracking-[0.2em] uppercase">
                University Supreme Student Council
              </span>
            </div>
          </div>
        </Link>
        {/* <Link href="/auth">
          <Button variant="outline" className="rounded-full border-white/60 bg-white/10 text-white hover:bg-white hover:text-primary backdrop-blur-sm font-semibold px-5 transition-all duration-200">
            Log In
          </Button>
        </Link> */}
      </header>
    </div>
  );
}
