"use client";
import Toprating from "@/components/toprating";
import Header from "./components/header";
import Navbar from "@/components/navigation";
import { useState } from "react";
import TeamChart from "@/components/teamChart";
import TotalCal from "@/components/total";

export default function HomeClient() {
  const [activeTab, setActiveTab] = useState("home");
  const [isFinalizing] = useState(true);
  return (
    <div className="overflow-y-scroll relative min-h-screen">
      <div
        className={
          isFinalizing
            ? "pointer-events-none filter blur-sm opacity-40 select-none"
            : ""
        }
      >
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
          <div className="flex-col flex items-center pt-4">
            <Navbar setActiveTab={setActiveTab} />
            <TotalCal ActiveTab={activeTab} />
          </div>
          <div className="p-4">
            {activeTab === "home" && <Toprating />}
            {activeTab === "disciples" && <TeamChart teamName="제자순" />}
            {activeTab === "hessed" && <TeamChart teamName="헤세드순" />}
            {activeTab === "yedalm" && <TeamChart teamName="예닮순" />}
          </div>
        </div>
      </div>
      {isFinalizing && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black bg-opacity-70">
          <div className="text-3xl md:text-5xl font-bold text-white drop-shadow-lg text-center">
            현재 최종 집계중입니다.
          </div>
          <div className="text-lg text-gray-200 mt-4 text-center">
            결과는 6월 11일 수요일 캠퍼스 채플에서 발표합니다.
          </div>
        </div>
      )}
    </div>
  );
}
