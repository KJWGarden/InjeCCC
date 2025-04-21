"use client";

import { easeInOut } from "motion";
import { motion } from "motion/react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface DDayProps {
  targetDate: string;
}

export default function DDay({ targetDate }: DDayProps) {
  const [dDayText, setDDayText] = useState("");

  useEffect(() => {
    const calculateDDay = () => {
      const today = new Date();
      const target = new Date(targetDate);

      today.setHours(0, 0, 0, 0);
      target.setHours(0, 0, 0, 0);

      const diffTime = target.getTime() - today.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays > 0) {
        setDDayText(`D-${diffDays}`);
      } else if (diffDays === 0) {
        setDDayText(`D-Day`);
      } else {
        setDDayText(`D+${Math.abs(diffDays)}`);
      }
    };

    calculateDDay();
  }, [targetDate]);

  return (
    <motion.div
      whileHover={{
        scale: 1.1,
        transition: { duration: 0.1 }, // **hover 따로 transition (빠르게)**
      }}
      whileTap={{
        scale: 0.95,
        transition: { duration: 0.1 }, // **tap도 따로 transition (빠르게)**
      }}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.8, ease: easeInOut }}
      viewport={{ once: true, amount: 0.2 }}
    >
      <Link href={"https://www.kccc.org/?p=sc#"}>
        <div className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl shadow-md w-fit">
          <span>갓같가는 여름수련회 전까지!</span>
          <span className="text-2xl font-bold text-gray-800">{dDayText}</span>
          <span className="text-xs pt-2 text-stone-500">
            갓같가 시상식은 여수 전 캠퍼스채플 때 진행됩니다.
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
