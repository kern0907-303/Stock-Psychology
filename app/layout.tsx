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
    title: "你在不確定裡，怎麼做決定？｜NAS",
    description: "從股票這個情境，看看你遇到不確定時最常出現的決策慣性。",
    icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
    openGraph: {
      title: "你在不確定裡，怎麼做決定？｜NAS",
      description: "看懂那些在不確定裡，反覆替你做決定的慣性。",
      images: [{ url: "/og-v2.png", width: 1792, height: 944, alt: "NAS 決策慣性小測驗" }],
      type: "website",
      locale: "zh_TW",
    },
    twitter: { card: "summary_large_image", title: "你在不確定裡，怎麼做決定？｜NAS", description: "看懂那些在不確定裡，反覆替你做決定的慣性。", images: ["/og-v2.png"] },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-Hant"><body>{children}</body></html>;
}
