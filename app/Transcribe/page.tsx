"use client";

import React from "react";
import Header from "../components/header";
import TranscribeCard from "@/components/transcribeCard";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useScriptureProgress } from "@/hooks/useScriptureProgress";
import { ScriptureProgress } from "@/types/scripture_progress";

export default function TranscribePage() {
  const router = useRouter();
  const { data: progressData, isLoading, error } = useScriptureProgress();

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="w-full h-screen flex justify-center items-center">
          <div className="text-xl">로딩 중...</div>
        </div>
      </>
    );
  }

  if (error || !progressData) {
    return (
      <>
        <Header />
        <div className="w-full h-screen flex justify-center items-center">
          <div className="text-xl text-red-500">오류가 발생했습니다.</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="w-full h-full flex justify-center items-center flex-col">
        <motion.div
          className="w-[90%] h-[90%] md:w-[50%] lg:h-[50%] flex justify-center items-center"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <DotLottieReact src="/writing.json" loop={true} autoplay={true} />
        </motion.div>
        <motion.div
          className="text-2xl font-bold py-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2, delay: 0.6 }}
        >
          인제대학교 CCC 성경필사순 🌱
        </motion.div>
      </div>
      <div className="w-full h-full flex justify-center items-center pb-8">
        <div className="w-[90%] h-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-items-center items-center">
          {progressData.map((progress: ScriptureProgress, index) => (
            <TranscribeCard
              key={progress.id}
              transcribe={{
                id: progress.id,
                name: progress.scripture_name,
                bible_name: progress.bible_name,
                completed_chapters: progress.completed_chapters,
                target_chapters: progress.target_chapters,
              }}
              index={index}
              onClick={() => {
                router.push(`/Transcribe/${progress.user_id}`);
              }}
            />
          ))}
        </div>
      </div>
    </>
  );
}
