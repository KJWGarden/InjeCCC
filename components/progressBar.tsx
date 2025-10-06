"use client";

import * as React from "react";

import { Progress } from "@/components/ui/progress";

export function ProgressDemo(props: { value: number }) {
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    const timer = setTimeout(() => setProgress(props.value), 500);
    return () => clearTimeout(timer);
  }, [props.value]);

  const getProgressColor = (value: number) => {
    if (value < 25) return "bg-red-500";
    if (value < 40) return "bg-orange-500";
    if (value < 60) return "bg-yellow-500";
    return "bg-green-600";
  };

  return (
    <Progress
      value={progress}
      className="w-full"
      indicatorColor={getProgressColor(progress)}
    />
  );
}
