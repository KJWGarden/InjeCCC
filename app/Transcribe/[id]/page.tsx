"use client";

import React from "react";
import Header from "../../components/header";
import { ProgressDemo } from "@/components/progressBar";
import transcribeData from "@/app/public/transcribeData.json";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

interface TranscribeData {
  id: string;
  TeamName: string;
  teamLeader: string;
  teamMembers: string[];
  transcribe: string;
  goal: number;
  filled: number;
  currentWrite: string;
}

export default function TranscribeDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const teamData = transcribeData.find(
    (team: TranscribeData) => team.id === params.id
  );

  if (!teamData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div>팀을 찾을 수 없습니다.</div>
      </div>
    );
  }

  const progressPercentage = (teamData.filled / teamData.goal) * 100;

  return (
    <>
      <Header />
      <div className="w-full min-h-screen p-4">
        <div className="max-w-4xl mx-auto">
          {/* 뒤로가기 버튼 */}
          <button
            onClick={() => router.back()}
            className="mb-6 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
          >
            ← 뒤로가기
          </button>

          {/* 팀 정보 헤더 */}
          <motion.div
            className="bg-white rounded-lg shadow-md p-6 mb-6"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full overflow-hidden shadow-md">
                <Image src="/순.png" alt="팀 이미지" width={100} height={100} />
              </div>
              <div>
                <h1 className="text-2xl font-bold">{teamData.TeamName}</h1>
                <p className="text-gray-600">순장: {teamData.teamLeader}</p>
                {teamData.transcribe && (
                  <p className="text-blue-600 font-medium">
                    {teamData.transcribe} 필사중
                  </p>
                )}
              </div>
            </div>

            {/* 진행률 */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">필사 진행률</span>
                <span className="text-sm text-gray-600">
                  {teamData.filled} / {teamData.goal} (
                  {Math.round(progressPercentage)}%)
                </span>
              </div>
              <ProgressDemo value={progressPercentage} />
            </div>
          </motion.div>

          {/* 팀원 목록 */}
          <motion.div
            className="bg-white rounded-lg shadow-md p-6"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          >
            <h2 className="text-xl font-bold mb-4">팀원 목록</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {/* 팀장 */}
              <div
                className={`flex items-center gap-3 p-3 rounded-lg shadow-md ${
                  teamData.currentWrite === teamData.teamLeader
                    ? "bg-blue-100 border-2 border-blue-300"
                    : "bg-yellow-50"
                }`}
              >
                <div className="w-10 h-10 rounded-full overflow-hidden shadow-sm">
                  <Image
                    src="/순.png"
                    alt="팀장 이미지"
                    width={40}
                    height={40}
                  />
                </div>
                <div className="flex flex-row justify-between items-center w-full">
                  <div className="flex flex-col">
                    <span
                      className={`font-medium ${
                        teamData.currentWrite === teamData.teamLeader
                          ? "text-blue-700"
                          : "text-yellow-800"
                      }`}
                    >
                      {teamData.teamLeader}
                    </span>
                    <span
                      className={`text-xs font-medium ${
                        teamData.currentWrite === teamData.teamLeader
                          ? "text-blue-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {teamData.currentWrite === teamData.teamLeader
                        ? "필사 중"
                        : "순장"}
                    </span>
                  </div>
                  {teamData.currentWrite === teamData.teamLeader && (
                    <div className="w-24 h-10">
                      <DotLottieReact
                        src="/pencil.json"
                        loop={true}
                        autoplay={true}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* 팀원들 */}
              {teamData.teamMembers.map((member, index) => {
                const isCurrentlyWriting = teamData.currentWrite === member;
                return (
                  <div
                    key={index}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                      isCurrentlyWriting
                        ? "bg-blue-100 border-2 border-blue-300 shadow-md"
                        : "bg-gray-50"
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full overflow-hidden shadow-sm">
                      <Image
                        src="/순.png"
                        alt="멤버 이미지"
                        width={40}
                        height={40}
                      />
                    </div>
                    <div className="flex flex-row justify-between items-center w-full">
                      <div className="flex flex-col">
                        <span
                          className={`font-medium ${
                            isCurrentlyWriting ? "text-blue-700" : ""
                          }`}
                        >
                          {member}
                        </span>
                        {isCurrentlyWriting && (
                          <span className="text-xs text-blue-600 font-medium">
                            필사 중
                          </span>
                        )}
                      </div>
                      {isCurrentlyWriting && (
                        <div className="w-24 h-10">
                          <DotLottieReact
                            src="/pencil.json"
                            loop={true}
                            autoplay={true}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
