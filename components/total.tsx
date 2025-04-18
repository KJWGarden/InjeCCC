import students from "@/app/public/data.json";
import { motion } from "motion/react";

type TotalProps = {
  ActiveTab: string;
};

export default function TotalCal({ ActiveTab }: TotalProps) {
  const prefixMap: { [key: string]: string } = {
    home: "우리 모두가",
    disciples: "제자순이",
    hessed: "헤세드순이",
    yedalm: "예닮순이",
  };
  const teamMap: { [key: string]: string } = {
    disciples: "제자순",
    hessed: "헤세드순",
    yedalm: "예닮순",
  };
  const filteredStudents =
    ActiveTab === "home"
      ? students
      : students.filter((student) => student.team === teamMap[ActiveTab]);
  const totalFilledHours = filteredStudents.reduce(
    (acc, student) => acc + student.filledHours,
    0
  );

  const prefixText = prefixMap[ActiveTab] || "";
  return (
    <motion.div
      className="flex flex-col items-center pt-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: 1,
        delay: 0.8,
        ease: [0, 0.71, 0.2, 1.01],
      }}
    >
      <div className="text-sm">{prefixText} 갓과 같이한 가치있는 시간</div>
      <div className="text-xl font-bold">총 {totalFilledHours} 시간</div>
    </motion.div>
  );
}
