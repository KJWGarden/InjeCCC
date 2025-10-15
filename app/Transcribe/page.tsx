import { Metadata } from "next";
import TranscribeClient from "./TranscribeClient";

export const metadata: Metadata = {
  title: "인제대학교 CCC 성경필사순",
  description: "인제대학교 CCC 성경필사순의 필사 진행상황을 확인하세요",
  openGraph: {
    title: "인제대학교 CCC 성경필사순",
    description: "인제대학교 CCC 성경필사순의 필사 진행상황을 확인하세요",
    images: [
      {
        url: "/favicon.png",
        width: 1200,
        height: 630,
        alt: "인제대학교 CCC 성경필사순",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "인제대학교 CCC 성경필사순",
    description: "인제대학교 CCC 성경필사순의 필사 진행상황을 확인하세요",
    images: ["/favicon.png"],
  },
};

export default function TranscribePage() {
  return <TranscribeClient />;
}
