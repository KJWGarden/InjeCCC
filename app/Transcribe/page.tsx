"use client";

import React from "react";
import Header from "../components/header";
import TranscribeCard from "@/components/transcribeCard";
import transcribeData from "@/app/public/transcribeData.json";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function TranscribePage() {
  const router = useRouter();
  return (
    <>
      <Header />
      <div className="w-full h-full flex justify-center items-center flex-col">
        <motion.div
          className="w-[90%] h-[90%] md:w-[50%] lg:h-[50%] flex justify-center items-center"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <DotLottieReact src="/writing.json" loop={true} autoplay={true} />
        </motion.div>
        <motion.div
          className="text-2xl font-bold py-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
        >
          인제대학교 CCC 성경필사순 🌱
        </motion.div>
      </div>
      <div className="w-full h-full flex justify-center items-center pb-8">
        <div className="w-[90%] h-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-items-center items-center">
          {transcribeData.map((transcribe, index) => (
            <TranscribeCard
              key={transcribe.id}
              transcribe={transcribe}
              index={index}
              onClick={() => {
                router.push(`/Transcribe/${transcribe.id}`);
              }}
            />
          ))}
        </div>
      </div>
    </>
  );
}
