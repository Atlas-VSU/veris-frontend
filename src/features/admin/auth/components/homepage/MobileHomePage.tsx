"use client";

import Link from "next/link";
import { MobileHeader } from "../MobileHeader";

export function MobileHomePage() {
  return (
    <div className="flex min-h-svh flex-col">
      {/* Header */}
      <MobileHeader />

      <div className="relative" style={{ height: "100vh" }}>
        {/* Full-page background image — positioned at top */}
        <div
          className="absolute top-0 left-0 w-full h-screen z-0"
          style={{
            backgroundImage: `url('/searchfortruth.jpg')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        />

        {/* Green gradient overlay for mobile — slightly lessened */}
        <div
          className="absolute top-0 left-0 w-full h-screen z-10"
          style={{
            background:
              "linear-gradient(to bottom, #05621E 10%, #058C11 20%, transparent 100%)",
          }}
        />

        {/* Mobile content: positioned in the bottom half for scrolling */}
        <div className="absolute top-screen left-0 w-full h-screen z-20 flex flex-col justify-center px-4">
          {/* Top section: text */}
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center max-w-sm">
              <p className="mb-4 text-xs font-medium uppercase tracking-[0.25em] text-white/80 animate-fade-in">
                University Supreme Student Council
              </p>
              <h1 className="text-2xl font-black tracking-tight text-white leading-[0.95] animate-fade-in-up">
                Real-Time Eligibility.
                <span className="block text-white/90 font-bold">
                  Effortless Settlement.
                </span>
                <span className="block text-white/95 font-light">
                  Total Clarity.
                </span>
              </h1>
              <p className="mt-6 text-sm leading-relaxed text-white/85 font-light animate-fade-in-up delay-300">
                Streamline your semestral clearance process by tracking your
                organizational fees and fines, settle payments online, and
                monitor your clearance status in real-time.
              </p>
              <Link href="/login">
                <button className="mt-6 inline-flex items-center justify-center rounded-md bg-transparent ring-2 px-5 py-3 text-white font-medium active:bg-white active:text-black ">
                  Get Started
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}