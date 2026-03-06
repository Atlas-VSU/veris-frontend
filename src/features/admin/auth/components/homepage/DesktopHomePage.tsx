import Link from "next/link";
import {DesktopHeader}  from "../DesktopHeader";
import { ArrowRight } from "lucide-react";
import { Button } from "@/src/components/ui/button";

export function DesktopHomePage() {
  return (
    <div className="flex min-h-svh flex-col ">
      <DesktopHeader />

      

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
        <div className="absolute inset-y-0 left-0 z-20 w-[60%] hidden lg:flex items-center pl-16 pr-8">
          <div className="max-w-lg">
            <p className="mb-4 text-xs sm:text-sm font-medium uppercase tracking-[0.25em] text-white/80 animate-fade-in">
              USSC Connect
            </p>
            <h1 className="text-4xl xl:text-5xl font-black tracking-tight text-white leading-[0.95] animate-fade-in-up whitespace-nowrap">
              Real-Time Eligibility.
              <span className="block text-white/90 font-bold">
                Effortless Settlement.
              </span>
              <span className="block text-white/95 font-light">
                Total Clarity.
              </span>
            </h1>
            <p className="mt-8 text-base lg:text-lg leading-relaxed text-white/85 font-light animate-fade-in-up delay-300">
              Streamline your semestral clearance process by tracking your
              organizational fees and fines, settle payments online, and monitor
              your clearance status in real-time.
            </p>
            <Link href="/login">
              <Button className="mt-6 inline-flex items-center justify-center rounded-md bg-transparent ring-2 px-5 py-3 text-white font-medium hover:bg-white hover:text-black hover:ring-0 animate-fade-in-up">
                <span>Get Started</span>
                <ArrowRight className="size-4 text-white/80 transition-transform hover:text-black group-hover:translate-x-0.5" />
              </Button>
            </Link>
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
