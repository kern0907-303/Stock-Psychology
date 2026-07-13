import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? "https";
  const siteUrl = new URL(`${protocol}://${host}`);

  return {
    metadataBase: siteUrl,
    title: "操作節奏適配掃描｜NAS",
    description: "用 15 個情境，理解你在波動、等待與壓力下的操作習慣。",
    icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
    openGraph: {
      title: "操作節奏適配掃描｜NAS",
      description: "看懂你的操作習慣，不只看行情。",
      images: [{ url: "/og.png", width: 1792, height: 944, alt: "操作節奏適配掃描" }],
      type: "website",
      locale: "zh_TW",
    },
    twitter: { card: "summary_large_image", title: "操作節奏適配掃描｜NAS", description: "看懂你的操作習慣，不只看行情。", images: ["/og.png"] },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-Hant"><body>{children}</body></html>;
}
