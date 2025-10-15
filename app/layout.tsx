import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Providers } from "./providers";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "인제대 CCC",
  description: "인제대 CCC 홈페이지",
  icons: {
    icon: "/favicon.png",
  },
  openGraph: {
    title: "INJE CCC",
    description: "INJE CCC 홈페이지",
    url: "https://inje-ccc.vercel.app",
    siteName: "INJE CCC",
    images: [
      {
        url: "https://inje-ccc.vercel.app/favicon.png",
        width: 1200,
        height: 630,
        alt: "INJE CCC OpenGraph Image",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
