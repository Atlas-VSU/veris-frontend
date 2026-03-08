import type { Metadata, Viewport } from "next"
import { Montserrat } from "next/font/google"
import { ThemeProvider } from "@/src/components/ui/theme-provider"
import { Toaster } from "@/src/components/ui/sonner"
import "./globals.css"

const montserrat = Montserrat({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
})

export const metadata: Metadata = {
  title: {
    default: "USSC Connect",
    template: "USSC Connect | %s",
  },
  description:
    "University Supreme Student Council management system for student registration, membership fees, fines, clearance, events, and financial reporting.",
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0d1a0f" },
  ],
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${montserrat.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  )
}
