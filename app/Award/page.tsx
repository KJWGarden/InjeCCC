"use client";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import studentsData from "@/app/public/data.json";

type Student = {
  id: string;
  name: string;
  department: string;
  level: string;
  team: string;
  filledHours: number;
};

const students: Student[] = studentsData;

export default function AwardPage() {
  // 콘페티 효과: page.tsx와 동일하게 적용
  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;
    let side: "left" | "right" = "left";
    function launchConfetti() {
      import("canvas-confetti").then((module) => {
        const confetti = module.default;
        const isDesktop =
          typeof window !== "undefined" && window.innerWidth >= 1024;
        const leftX = isDesktop ? 0.15 : 0;
        const rightX = isDesktop ? 0.85 : 1;
        confetti({
          particleCount: 180,
          spread: 80,
          origin: {
            x: side === "left" ? leftX : rightX,
            y: 0.6,
          },
        });
        side = side === "left" ? "right" : "left";
        const nextDelay = 1500 + Math.random() * 1000;
        timeoutId = setTimeout(launchConfetti, nextDelay);
      });
    }
    launchConfetti();
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  // Podium 애니메이션 순서 제어
  const [show, setShow] = useState([false, false, false, false, false, false]);
  const timers: NodeJS.Timeout[] = [];
  useEffect(() => {
    // 순장 3등, 2등, 1등, 순원 3등, 2등, 1등 순서로 0.8초 간격 등장
    for (let i = 0; i < 6; i++) {
      timers.push(
        setTimeout(() => {
          setShow((prev) => {
            const next = [...prev];
            next[i] = true;
            return next;
          });
        }, 800 * i)
      );
    }
    return () => timers.forEach(clearTimeout);
  }, []);

  // 순장/순원별 랭킹 계산 (Toprating 참고)
  const leaderTop3 = students
    .filter((s: Student) => s.level === "순장")
    .sort((a: Student, b: Student) => b.filledHours - a.filledHours)
    .slice(0, 3);
  const memberTop3 = students
    .filter((s: Student) => s.level === "순원")
    .sort((a: Student, b: Student) => b.filledHours - a.filledHours)
    .slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white py-12">
      <h1 className="text-4xl font-extrabold mb-10 text-center drop-shadow-lg">
        갓같가 시상식
      </h1>
      <div className="w-full">
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-center">순장 Top 3</h2>
          <div className="flex items-end justify-center gap-6 w-full max-w-xl mx-auto">
            {[0, 1, 2].map((idx, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 60 }}
                animate={show[i] ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0 }}
                className="flex flex-col items-center"
              >
                <div
                  className={`w-24 flex flex-col items-center justify-end rounded-t-xl shadow-lg mb-2 relative overflow-hidden`}
                  style={{
                    height: [120, 80, 60][idx],
                    backgroundColor: ["#FFD700", "#C0C0C0", "#CD7F32"][idx],
                  }}
                >
                  <span className="text-2xl font-bold text-white drop-shadow">
                    {leaderTop3[idx]?.name || "-"}
                  </span>
                  <span
                    className="text-white pb-2 w-full min-w-0 flex items-center justify-center overflow-hidden whitespace-nowrap text-ellipsis px-2"
                    style={{ fontSize: "min(12px, 2.5vw)" }}
                  >
                    {leaderTop3[idx]?.department || ""}
                  </span>
                </div>
                <div className="text-lg font-bold text-center">{idx + 1}위</div>
                <div className="text-sm text-gray-600">
                  {leaderTop3[idx]?.filledHours ?? "-"}시간
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-6 text-center">순원 Top 3</h2>
          <div className="flex items-end justify-center gap-6 w-full max-w-xl mx-auto">
            {[0, 1, 2].map((idx, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 60 }}
                animate={show[i + 3] ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0 }}
                className="flex flex-col items-center"
              >
                <div
                  className={`w-24 flex flex-col items-center justify-end rounded-t-xl shadow-lg mb-2 relative overflow-hidden`}
                  style={{
                    height: [120, 80, 60][idx],
                    backgroundColor: ["#FFD700", "#C0C0C0", "#CD7F32"][idx],
                  }}
                >
                  <span className="text-2xl font-bold text-white drop-shadow">
                    {memberTop3[idx]?.name || "-"}
                  </span>
                  <span
                    className="text-white pb-2 w-full min-w-0 flex items-center justify-center overflow-hidden whitespace-nowrap text-ellipsis px-2"
                    style={{ fontSize: "min(12px, 2.5vw)" }}
                  >
                    {memberTop3[idx]?.department || ""}
                  </span>
                </div>
                <div className="text-lg font-bold text-center">{idx + 1}위</div>
                <div className="text-sm text-gray-600">
                  {memberTop3[idx]?.filledHours ?? "-"}시간
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
