"use client";

import { easeOut } from "motion";
import { motion } from "motion/react";
import Link from "next/link";

export default function DDay() {
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
      transition={{ duration: 0.6, delay: 1.0, ease: easeOut }}
      viewport={{ once: true, amount: 0.2 }}
    >
      <Link href={"https://www.kccc.org/?p=sc#"}>
        <div className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl shadow-md w-fit">
          <span className="text-lg font-bold">갓같가 이벤트 종료!</span>
          <span className="text-sm pt-2 font-bold">
            참여해주신 모든 순장 순원 여러분 감사합니다!
          </span>
          <span className="text-xs pt-2 font-semibold text-stone-500 text-center">
            앞으로의 여러분의 모든 삶이 <br />
            갓과 같이하는 가치있는 시간으로 <br /> 가득하길 기도합니다
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
