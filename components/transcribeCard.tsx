import React from "react";
import { ProgressDemo } from "./progressBar";
import Image from "next/image";
import { motion } from "framer-motion";

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

export default function TranscribeCard({
  transcribe,
  onClick,
  index = 0,
}: {
  transcribe: TranscribeData;
  onClick?: () => void;
  index?: number;
}) {
  return (
    <motion.div
      className="flex flex-col shadow-md border-black rounded-lg w-[150px] sm:w-[200px] h-fit px-4 py-2 hover:scale-105 transition-all duration-300 cursor-pointer"
      style={{ willChange: "transform, opacity" }}
      onClick={onClick}
      initial={{ x: 50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{
        duration: 0.1,
        delay: 0.8 + index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94],
        type: "spring",
        stiffness: 100,
        damping: 20,
      }}
    >
      <div className="flex flex-row items-center gap-2">
        <div className="w-10 h-10 rounded-full overflow-hidden shadow-md">
          <Image src="/순.png" alt="image" width={100} height={100} />
        </div>
        <div className="flex flex-col">
          <div className="text-lg font-bold">{transcribe.TeamName}</div>
          {transcribe.transcribe === "" ? (
            <div className="text-sm text-gray-500">미정</div>
          ) : (
            <div className="text-sm text-gray-500">{transcribe.transcribe}</div>
          )}
        </div>
      </div>
      <div>
        <ProgressDemo value={(transcribe.filled / transcribe.goal) * 100} />
      </div>
    </motion.div>
  );
}
