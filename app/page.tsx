"use client";

import Toprating from "@/components/toprating";
import Header from "./components/header";
import Navbar from "@/components/navigation";
import { useState } from "react";
import TeamChart from "@/components/disciples";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "인제대 CCC",
  description: "인제대 CCC와 함께하는 갓같가",
  openGraph: {
    title: "INJE CCC",
    description: "INJE CCC 갓같가 가치를 채우는 시간",
    url: "https://inje-ccc.vercel.app/",
    siteName: "INJE CCC",
    images: [
      {
        url: "/public/cover.jpg",
        width: 1200,
        height: 630,
        alt: "INJE CCC OpenGraph Image",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
};

export default function Home() {
  const [activeTab, setActiveTab] = useState("home");
  return (
    <div className="overflow-y-scroll">
      <Header />
      <div className="w-full h-full">
        <div className="flex justify-center items-baseline gap-1 pt-4">
          <p className="text-xl font-bold">갓</p>
          <p className="text-lg">과</p>
          <p className="text-xl font-bold">같</p>
          <p className="text-lg">이하는</p>
          <p className="text-xl font-bold">가</p>
          <p className="text-lg">치 있는 시간</p>
        </div>
        <div className="flex justify-center pt-4">
          <Navbar setActiveTab={setActiveTab} />
        </div>
        <div className="p-4">
          {activeTab === "home" && <Toprating />}
          {activeTab === "disciples" && <TeamChart teamName="제자순" />}
          {activeTab === "hessed" && <TeamChart teamName="헤세드순" />}
          {activeTab === "yedalm" && <TeamChart teamName="예닮순" />}
        </div>
      </div>
    </div>
  );
}
