"use client";
import Toprating from "@/components/toprating";
import Header from "./components/header";
import Navbar from "@/components/navigation";
import { useState } from "react";
import TeamChart from "@/components/teamChart";

export default function HomeClient() {
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
