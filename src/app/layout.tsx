import type { Metadata } from "next";
import {
  DM_Sans,
  Geist_Mono,
  Inter,
  Noto_Serif_SC,
  Nunito_Sans,
  Outfit,
  Playfair_Display,
  Public_Sans,
} from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { SettingsScript } from "@/components/settings/settings-script";
import { Toaster } from "@/components/ui/sonner";
import { env } from "@/lib/env";
import { cn } from "@/lib/utils";

// Font families offered in the settings drawer. Each exposes a CSS variable;
// the active one is wired to --font-sans by the settings reflect effect.
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
const publicSans = Public_Sans({
  subsets: ["latin"],
  variable: "--font-public-sans",
});
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans" });
const nunitoSans = Nunito_Sans({
  subsets: ["latin"],
  variable: "--font-nunito",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Display serif pair for showcase headings: Playfair covers Latin, Noto Serif
// SC takes over for CJK glyphs (next/font splits it into unicode-range
// segments, so only the glyphs on the page are downloaded).
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});
const notoSerifSc = Noto_Serif_SC({
  weight: ["600", "700"],
  variable: "--font-noto-serif-sc",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
  title: {
    default: "Teyvat Palette · 跟着原神学配色",
    template: "%s · Teyvat Palette",
  },
  description:
    "从提瓦特场景中学习配色 — 色卡、渐变与「为什么和谐」的注解。非官方粉丝项目。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "h-full",
        "antialiased",
        "font-sans",
        outfit.variable,
        publicSans.variable,
        inter.variable,
        dmSans.variable,
        nunitoSans.variable,
        geistMono.variable,
        playfair.variable,
        notoSerifSc.variable,
      )}
    >
      <head>
        <SettingsScript />
      </head>
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  );
}
