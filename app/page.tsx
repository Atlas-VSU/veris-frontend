"use client"

import Link from "next/link"
import { Users, GraduationCap, ArrowRight } from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"

export default function HomePage() {

  return (
    <div className="flex min-h-svh flex-col bg-white overflow-hidden" suppressHydrationWarning>
      {/* Header */}
      <header className="absolute inset-x-0 top-0 z-30 px-6 sm:px-10 py-5">
        <Link href="/" className="inline-flex items-center gap-4 group">
          <div className="relative flex-shrink-0">
            <div className="absolute inset-0 rounded-full bg-transparent" />
            <div className="relative flex size-14 sm:size-16 items-center justify-center rounded-full bg-transparent">
              <img src="/ussc-logo-white.webp" alt="USSC-Connect" className="h-9 sm:h-10 w-auto object-contain drop-shadow-lg" />
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

      <div className="relative min-h-screen flex flex-col lg:flex-row">
        {/* Left Side */}
        <div
          className="hero-left-clip flex-1 relative overflow-hidden lg:flex-none lg:w-[50%] flex items-center min-h-[65vh] lg:min-h-screen"
          style={{
            background: "linear-gradient(135deg, #05621E 0%, #058C11 50%, #38B000 100%)",
          }}
        >
          <div className="absolute top-20 left-10 w-32 h-32 bg-white/5 rounded-full blur-xl animate-float" />
          <div className="absolute bottom-20 right-10 w-24 h-24 bg-white/5 rounded-full blur-xl animate-float-delayed" />
          <div className="absolute top-1/2 right-20 w-16 h-16 bg-white/3 rounded-full blur-lg animate-gentle-rotate" />

          <div className="relative z-10 w-full pt-28 pb-16 px-6 sm:px-10 lg:pt-0 lg:pb-0 lg:pl-16 lg:pr-18 max-w-xl mx-auto lg:mx-0">
            <p className="mb-3 sm:mb-4 lg:mb-6 text-xs sm:text-sm font-medium uppercase tracking-[0.25em] text-white/80 animate-fade-in text-center lg:text-left">
              University Supreme Student Council
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-4xl lg:text-4xl xl:text-5xl font-black tracking-tight text-white leading-[0.95] animate-fade-in-up text-center lg:text-left whitespace-nowrap">
              Real-Time Eligibility.
              <span className="block text-white/90 font-bold whitespace-nowrap">Effortless Settlement.</span>
              <span className="block text-white/95 font-light whitespace-nowrap">Total Clarity.</span>
            </h1>
            <p className="mt-5 sm:mt-6 lg:mt-8 text-sm sm:text-base lg:text-lg leading-relaxed text-white/85 font-light animate-fade-in-up delay-300 text-center lg:text-left">
              Streamline your semestral clearance process by tracking your organizational fees and fines, settle payments online, and monitor your clearance status in real-time.
            </p>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex-1 relative bg-white overflow-hidden flex items-center justify-center lg:flex-none lg:w-1/2">
          {/* Subtle background pattern */}
          <div
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: `
                radial-gradient(circle at 20% 80%, #058C11 1px, transparent 1px),
                radial-gradient(circle at 80% 20%, #38B000 1px, transparent 1px),
                radial-gradient(circle at 40% 40%, #87D300 1px, transparent 1px)
              `,
              backgroundSize: "100px 100px",
            }}
          />

          <div className="relative w-full max-w-2xl mx-auto px-4 lg:px-8 h-[70vh] lg:h-[70vh] flex items-center justify-center">
            <div className="absolute inset-0">
              <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full blur-2xl animate-float" />
              <div className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-to-br from-secondary/10 to-accent/10 rounded-full blur-2xl animate-float-delayed" />
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-gradient-to-br from-warning/10 to-primary/10 rounded-full blur-xl animate-gentle-rotate" />

              {/* geometric shapes */}
              {/* <div className="absolute top-20 right-20 w-16 h-16 bg-primary/5 rounded-full blur-sm animate-float" />
              <div className="absolute bottom-20 left-20 w-12 h-12 bg-secondary/5 rotate-45 animate-gentle-rotate" />
              <div className="absolute top-1/3 left-1/3 w-8 h-8 bg-accent/5 rounded-lg animate-float-delayed" />
              <div className="absolute bottom-1/3 right-1/3 w-6 h-6 bg-warning/5 rotate-12 animate-pulse" /> */}
            </div>

            {/* Main Sign-in Card */}
            <Card className="relative w-full max-w-sm lg:max-w-md border-0 bg-white/95 backdrop-blur-xl shadow-2xl transition-all duration-500 hover:shadow-3xl hover:scale-[1.02] overflow-hidden mx-4 lg:mx-0">
              {/* Card background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-white/80 to-white/50" />
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 opacity-50 animate-pulse" />
              <CardHeader className="relative text-center pb-6 lg:pb-8 pt-8 lg:pt-12">
                <div className="relative mb-4 lg:mb-6">
                  <div className="flex size-16 lg:size-20 items-center justify-center rounded-full bg-transparent mx-auto">
                    {/* <GraduationCap className="size-8 lg:size-10 text-primary drop-shadow-sm" /> */}
                    <img src="/ussc-logo-1.webp" alt="USSC-Connect" className="h-auto w-auto object-contain" />
                  </div>              
                </div>

                <CardTitle className="text-2xl lg:text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  USSC Connect
                </CardTitle>
                <CardDescription className="text-sm lg:text-base text-muted-foreground leading-relaxed max-w-sm mx-auto px-4 lg:px-0">
                  University Supreme Student Council Connect System
                </CardDescription>
              </CardHeader>

              <CardContent className="relative space-y-4 lg:space-y-6 px-6 lg:px-8 pb-8 lg:pb-12">
                <div className="grid grid-cols-2 gap-3 lg:gap-4 mb-6 lg:mb-8">
                  <div className="text-center p-2 lg:p-3 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/10">
                    <Users className="size-5 lg:size-6 text-primary mx-auto mb-1 lg:mb-2" />
                    <p className="text-xs font-medium text-primary">Admin Portal</p>
                  </div>
                  <div className="text-center p-2 lg:p-3 rounded-xl bg-gradient-to-br from-secondary/5 to-secondary/10 border border-secondary/10">
                    <GraduationCap className="size-5 lg:size-6 text-secondary mx-auto mb-1 lg:mb-2" />
                    <p className="text-xs font-medium text-secondary">Student Portal</p>
                  </div>
                </div>
                <div className="space-y-3 lg:space-y-4">
                  <Link href="/admin" className="block group">
                    <Button
                      size="lg"
                      className="w-full h-12 lg:h-14 gap-3 lg:gap-4 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white border-0 text-sm lg:text-base"
                    >
                      <div className="flex items-center justify-center w-7 h-7 lg:w-8 lg:h-8 rounded-lg bg-white/20 group-hover:bg-white/30 transition-colors">
                        <Users className="size-4 lg:size-5" />
                      </div>
                      <span className="flex-1 text-left">Sign in as Admin</span>
                      <ArrowRight className="size-4 lg:size-5 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>

                  <Link href="/portal" className="block group">
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full h-12 lg:h-14 gap-3 lg:gap-4 font-semibold border-2 border-secondary/30 hover:border-secondary hover:bg-secondary hover:text-secondary-foreground transition-all duration-300 shadow-lg hover:shadow-xl bg-white/50 backdrop-blur-sm text-sm lg:text-base"
                    >
                      <div className="flex items-center justify-center w-7 h-7 lg:w-8 lg:h-8 rounded-lg bg-secondary/10 group-hover:bg-secondary/20 transition-colors">
                        <GraduationCap className="size-4 lg:size-5" />
                      </div>
                      <span className="flex-1 text-left">Sign in as Student</span>
                      <ArrowRight className="size-4 lg:size-5 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                </div>

                <div className="text-center pt-3 lg:pt-4">
                  <p className="text-xs text-muted-foreground px-4 lg:px-0">
                    Atlas Development Team 2026 | Department of Computer Science and Technology
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Additional floating text elements */}
          {/* <div className="absolute top-16 left-8 opacity-20">
            <span className="text-6xl font-black text-primary/10 select-none">STUDENT</span>
          </div>
          <div className="absolute bottom-16 right-12 opacity-15">
            <span className="text-5xl font-bold text-secondary/10 select-none">COUNCIL</span>
          </div> */}

          {/* <div className="absolute top-8 right-8">
            <p className="text-xs text-muted-foreground/60 font-medium animate-fade-in delay-700 bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm border border-white/40">
              Demo mode — presentation only
            </p>
          </div> */}
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
  )
}
