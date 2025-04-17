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

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.8,
        delay: 0.5,
        ease: [0, 0.71, 0.2, 1.01],
      }}
    >
      <div className="pb-4">
        <Image
          src="/menu.png"
          alt="메뉴사진"
          width={400}
          height={300}
          className="cursor-pointer rounded-lg shadow-xl"
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
            className="rounded-lg"
          />
        </DialogContent>
      </Dialog>

      <div className="text-lg font-bold">Top 10</div>
      <p className="text-xs">현재 시간을 가장 많이 채운 10명입니다!</p>
      <div>
        {top10.map((student, index) => (
          <div key={student.id}>
            <div className="flex pt-2 pb-1">
              <div className="w-full">
                <div className="flex gap-4 items-center">
                  {index + 1}위
                  <p className="text-xs font-light border rounded-lg px-1 bg-stone-200">
                    {student.filledHours} 시간
                  </p>
                </div>
                <div className="flex justify-between">
                  <p>
                    {student.name} {student.level}
                  </p>
                  <p>{student.department}</p>
                </div>
              </div>
            </div>
            <Separator orientation="horizontal" />
          </div>
        ))}
      </div>
    </motion.div>
  );
}
