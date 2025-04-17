import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

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
  description: "인제대 CCC와 함께하는 갓같가",
  icons: {
    icon: "/favicon.png",
  },
  openGraph: {
    title: "INJE CCC",
    description: "INJE CCC 갓같가 가치를 채우는 시간",
    url: "https://inje-ccc.vercel.app",
    siteName: "INJE CCC",
    images: [
      {
        url: "https://inje-ccc.vercel.app/cover.jpg",
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
        {children}
      </body>
    </html>
  );
}
