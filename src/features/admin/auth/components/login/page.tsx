"use client";

import Link from "next/link";
import { Users, GraduationCap, ArrowRight } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";

function MobileView() {
  return (
    <div className="flex min-h-svh flex-col">
      {/* Header */}
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

        {/* Green gradient overlay for mobile */}
        <div
          className="absolute top-0 left-0 w-full h-screen z-10"
          style={{
            background:
              "linear-gradient(to bottom, #05621E 10%, #058C11 20%, transparent 100%)",
          }}
        />

        {/* Mobile content */}
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-6 pt-10 pb-8 ">
          <div className="w-full max-w-sm">
            <Card className="w-full border border-white/15 bg-white/15 backdrop-blur-xl animate-fade-in-up shadow-2xl rounded-2xl overflow-hidden">
              <CardHeader className="text-center pt-8 pb-4 px-6">
                <div className="flex size-14 items-center justify-center mx-auto mb-3">
                  <img
                    src="/ussc-logo-white.webp"
                    alt="USSC Connect"
                    className="size-14 object-contain"
                  />
                </div>
                <CardTitle className="text-xl font-bold tracking-tight text-white">
                  USSC Connect
                </CardTitle>
                <CardDescription className="mt-1 text-xs text-white/70 leading-relaxed">
                  University Supreme Student Council Connect System
                </CardDescription>
              </CardHeader>

              <CardContent className="px-6 pb-7 pt-2 space-y-3">
                {/* Portal type badges */}
                {/* <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-white/10 border border-white/20">
                    <Users className="size-5 text-white" />
                    <p className="text-xs font-semibold text-white/90 tracking-wide">
                      Admin Portal
                    </p>
                  </div>
                  <div className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-white/10 border border-white/20">
                    <GraduationCap className="size-5 text-white" />
                    <p className="text-xs font-semibold text-white/90 tracking-wide">
                      Student Portal
                    </p>
                  </div>
                </div> */}

                {/* Divider */}
                <div className="relative py-1">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/20" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-transparent px-3 text-[11px] font-medium uppercase tracking-widest text-white/50">
                      Select your role
                    </span>
                  </div>
                </div>

                {/* Sign-in buttons */}
                <div className="space-y-2.5 pt-1">
                  <Link href="/admin-dashboard" className="block group">
                    <Button
                      size="lg"
                      className="w-full h-11 gap-3 font-semibold bg-white text-primary hover:bg-white/90 shadow-sm hover:shadow-md transition-all duration-200 rounded-xl border-0"
                    >
                      <div className="flex items-center justify-center size-7 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                        <Users className="size-4" />
                      </div>
                      <span className="flex-1 text-left text-sm">
                        Sign in as Admin
                      </span>
                      <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                    </Button>
                  </Link>

                  <Link href="/portal-dashboard" className="block group">
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full h-11 gap-3 font-semibold border border-white/30 hover:border-white/60 bg-white/10 hover:bg-white/20 text-white transition-all duration-200 shadow-sm hover:shadow-md rounded-xl"
                    >
                      <div className="flex items-center justify-center size-7 rounded-lg bg-white/15 group-hover:bg-white/25 transition-colors">
                        <GraduationCap className="size-4" />
                      </div>
                      <span className="flex-1 text-left text-sm">
                        Sign in as Student
                      </span>
                      <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                    </Button>
                  </Link>
                </div>

                {/* Footer caption */}
                <p className="text-center text-[11px] text-white/45 pt-2 leading-relaxed">
                  Atlas Development Team 2026
                  <br />
                  Department of Computer Science and Technology
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function DesktopView() {
  return (
    <div className="flex min-h-svh flex-col ">
      {/* Header */}
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
      </header>

      <div className="relative min-h-screen overflow-hidden">
        {/* Full-page background image */}
        <div
          className="absolute inset-0 z-0 top-[-150] scale-[1.1] left-[590]"
          style={{
            backgroundImage: `url('/searchfortruth.jpg')`,
            backgroundSize: "cover",
            backgroundPosition: "top left",
            backgroundRepeat: "no-repeat",
          }}
        />

        {/* Left green gradient overlay — fades to transparent going right */}
        <div
          className="absolute inset-y-0 left-0 z-10 w-[70%]"
          style={{
            background:
              "linear-gradient(to right, #05621E 10%, #058C11 65%, transparent 100%)",
          }}
        />

        {/* Left side text content */}
        <div className="absolute animate-fade-in-up inset-y-0 left-20 z-20 w-[60%] hidden lg:flex items-center pl-5 pr-8">
          <div className="w-full max-w-lg">
            <Card className="w-full border border-white/15 bg-white/15 backdrop-blur-lg shadow-2xl rounded-2xl overflow-hidden">
              <CardHeader className="text-center pt-8 pb-4 px-8">
                <div className="flex size-16 items-center justify-center mx-auto mb-4">
                  <img
                    src="/ussc-logo-white.webp"
                    alt="USSC Connect"
                    className="size-16 object-contain"
                  />
                </div>
                <CardTitle className="text-2xl font-bold tracking-tight text-white">
                  USSC Connect
                </CardTitle>
                <CardDescription className="mt-1 text-sm text-white/70 leading-relaxed">
                  University Supreme Student Council Connect System
                </CardDescription>
              </CardHeader>

              <CardContent className="px-8 pb-8 pt-2 space-y-3">
                {/* Portal type badges */}
                {/* <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-white/10 border border-white/20">
                    <Users className="size-5 text-white" />
                    <p className="text-xs font-semibold text-white/90 tracking-wide">
                      Admin Portal
                    </p>
                  </div>
                  <div className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-white/10 border border-white/20">
                    <GraduationCap className="size-5 text-white" />
                    <p className="text-xs font-semibold text-white/90 tracking-wide">
                      Student Portal
                    </p>
                  </div>
                </div> */}

                {/* Divider */}
                <div className="relative py-1">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/20" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-transparent px-3 text-[11px] font-medium uppercase tracking-widest text-white/50">
                      Select your role
                    </span>
                  </div>
                </div>

                {/* Sign-in buttons */}
                <div className="space-y-2.5 pt-1">
                  <Link href="/admin-dashboard" className="block group">
                    <Button
                      size="lg"
                      className="w-full h-12 gap-3 font-semibold bg-white text-primary hover:bg-white/90 shadow-sm hover:shadow-md transition-all duration-200 rounded-xl border-0"
                    >
                      <div className="flex items-center justify-center size-7 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                        <Users className="size-4" />
                      </div>
                      <span className="flex-1 text-left text-sm">
                        Sign in as Admin
                      </span>
                      <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                    </Button>
                  </Link>

                  <Link href="/portal-dashboard" className="block group">
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full h-12 gap-3 font-semibold border border-white/30 hover:border-white/60 bg-white/10 hover:bg-white/20 text-white transition-all duration-200 shadow-sm hover:shadow-md rounded-xl"
                    >
                      <div className="flex items-center justify-center size-7 rounded-lg bg-white/15 group-hover:bg-white/25 transition-colors">
                        <GraduationCap className="size-4" />
                      </div>
                      <span className="flex-1 text-left text-sm">
                        Sign in as Student
                      </span>
                      <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                    </Button>
                  </Link>
                </div>

                {/* Footer caption */}
                <p className="text-center text-[11px] text-white/45 pt-3 leading-relaxed">
                  Atlas Development Team 2026
                  <br />
                  Department of Computer Science and Technology
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* <footer
        className="relative z-10 border-t border-border/50 bg-white/50 backdrop-blur-sm px-6 py-6"
        style={{
          clipPath: "polygon(0 0, 100% 15%, 100% 100%, 0 100%)",
        }}
      >
        <div className="max-w-4xl mx-auto text-center transform -translate-y-4">
          <p className="text-sm text-muted-foreground font-medium">
            Atlas v1.0 — University Supreme Student Council
          </p>
        </div>
      </footer> */}
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      <div className="lg:hidden">
        <MobileView />
      </div>
      <div className="hidden lg:block">
        <DesktopView />
      </div>
    </>
  );
}
