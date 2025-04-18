"use client";
import students from "@/app/public/data.json";
import { Separator } from "./ui/separator";
import { motion } from "motion/react";
import Image from "next/image";
import { useState } from "react";
import { Dialog, DialogContent } from "./ui/dialog";

export default function Toprating() {
  const [isOpen, setIsOpen] = useState(false);

  const top10 = students
    .sort((a, b) => b.filledHours - a.filledHours)
    .slice(0, 10);

  let currentRank = 1;
  let prevHours: number | null = null;
  let sameRankCount = 0;

  const rankedTop10 = top10.map((student, index, array) => {
    let isJoint = false;
    if (
      (index > 0 && student.filledHours === array[index - 1].filledHours) ||
      (index < array.length - 1 &&
        student.filledHours === array[index + 1].filledHours)
    ) {
      isJoint = true;
    }

    if (index > 0 && student.filledHours === array[index - 1].filledHours) {
      // 바로 위 학생이랑 같으면 rank 유지
    } else {
      // 다르면 등수 업데이트
      currentRank = index + 1;
    }
    return {
      ...student,
      rank: currentRank,
      isJoint,
    };
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.8,
        delay: 0.5,
        ease: [0, 0.71, 0.2, 1.01],
      }}
      className="flex flex-col items-center"
    >
      <div className="pb-4 flex justify-center">
        <Image
          src="/menu.png"
          alt="메뉴사진"
          width={400}
          height={300}
          className="cursor-pointer shadow-xl"
          onClick={() => setIsOpen(true)}
        />
      </div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-3xl flex justify-center items-center">
          <Image
            src="/menu.png"
            alt="확대된 메뉴 사진"
            width={800}
            height={600}
          />
        </DialogContent>
      </Dialog>
      <div className="flex flex-col w-full lg:w-[40vw]">
        <div className="text-lg font-bold">Top 10</div>
        <p className="text-xs">현재 시간을 가장 많이 채운 10명입니다!</p>
        <div>
          {rankedTop10.map((student) => (
            <div key={student.id} className="w-full">
              <div className="flex flex-col w-full py-2">
                <div className="flex items-center gap-2">
                  <div className="w-4 text-center">
                    {student.rank === 1
                      ? "🥇"
                      : student.rank === 2
                      ? "🥈"
                      : student.rank === 3
                      ? "🥉"
                      : "🎖️"}
                  </div>
                  <div className="text-sm min-w-[60px] text-center font-bold">
                    {student.isJoint ? "공동 " : ""}
                    {student.rank}위
                  </div>
                  <div className="text-xs font-light min-w-[60px]">
                    <div className="w-fit border rounded-lg px-1 bg-stone-200">
                      {student.filledHours}시간
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center w-full pl-2 pr-2">
                  <p className="text-md">
                    {student.name} {student.level}
                  </p>
                  <p className="text-xs text-gray-500">{student.department}</p>
                </div>
              </div>
              <Separator orientation="horizontal" />
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
