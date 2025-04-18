import studentsData from "@/app/public/data.json";
import { ChartContainer, ChartConfig } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from "recharts";
import CustomTooltip from "./customTooltip";
import { motion } from "motion/react";
import { ScrollArea } from "./ui/scroll-area";

const chartConfig = {
  filledHours: {
    label: "채운시간",
    color: "#2563eb",
  },
} satisfies ChartConfig;

type TeamChartProps = {
  teamName: string;
};

interface Student {
  id: string;
  name: string;
  department: string;
  level: string;
  team: string;
  filledHours: number;
}
const students: Student[] = studentsData;

export default function TeamChart({ teamName }: TeamChartProps) {
  const filterdata = students
    .filter((student) => student.team === teamName)
    .sort((a, b) => b.filledHours - a.filledHours);

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        duration: 1,
        delay: 0.3,
        ease: [0, 0.71, 0.2, 1.01],
      }}
      className="flex justify-center"
    >
      <div className="w-full h-full lg:max-w-[60vw]">
        <div>
          <p>{teamName} 갓같가 현황</p>
        </div>
        <div className="w-full h-full">
          <ScrollArea className="w-full h-[500px] overflow-y-scroll">
            <ChartContainer
              config={chartConfig}
              className="min-h-[800px] w-full"
            >
              <BarChart layout="vertical" accessibilityLayer data={filterdata}>
                <CartesianGrid vertical={true} horizontal={false} />
                <XAxis
                  type="number"
                  domain={[0, 100]}
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="filledHours"
                  fill="var(--color-filledHours)"
                  radius={4}
                />
              </BarChart>
            </ChartContainer>
          </ScrollArea>
        </div>
      </div>
    </motion.div>
  );
}
