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

export default function LoginCard() {
  return (
    <div className="w-full max-w-md mt-15 z-3 animate-fade-up">
          <Card className="relative w-full border-0 bg-white/75 backdrop-blur-sm transition-all duration-500 hover:shadow-3xl hover:scale-[1.02] overflow-hidden px-3">
            {/* Card background gradient */}
            <div className="absolute bg-gradient-to-br from-white/50 via-white/80 to-white/50" />
            <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 opacity-50 animate-pulse" />
            <CardHeader className="relative text-center pb-6 lg:pb-8 pt-8 lg:pt-12">
              <div className="relative mb-4 lg:mb-6">
                <div className="flex size-16 lg:size-20 items-center justify-center rounded-full bg-transparent mx-auto">
                  {/* <GraduationCap className="size-8 lg:size-10 text-primary drop-shadow-sm" /> */}
                  <img
                    src="/ussc-logo-1.webp"
                    alt="USSC-Connect"
                    className="h-auto w-auto object-contain"
                  />
                </div>
              </div>

              <CardTitle className="text-2xl lg:text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                USSC Connect
              </CardTitle>
              <CardDescription className="text-xs lg:text-base text-black/60 leading-relaxed max-w-sm mx-auto px-4 lg:px-0">
                Welcome! Please select your portal to sign in and access your dashboard.
              </CardDescription>
            </CardHeader>

            <CardContent className="relative space-y-4 lg:space-y-6 px-6 lg:px-8 pb-8 lg:pb-12">
              <div className="grid grid-cols-2 gap-3 lg:gap-4">
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
                <Link href="/admin-dashboard" className="block group">
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

                <Link href="/portal-dashboard" className="block group">
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
                <p className="text-xs text-muted-foreground lg:px-0">
                  Powered by VERIS
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
  );
}
