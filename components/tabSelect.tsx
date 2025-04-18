"use client";

import { motion } from "framer-motion";

type MotionTabsProps = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
};

const tabs = ["전체", "순원", "순장"];

export default function MotionTabs({
  activeTab,
  setActiveTab,
}: MotionTabsProps) {
  return (
    <div className="flex flex-col items-center p-4">
      <div className="flex gap-4 relative">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="relative px-4 py-2 text-sm font-medium text-gray-600"
          >
            {activeTab === tab && (
              <motion.div
                layoutId="underline"
                className="absolute left-0 right-0 bottom-0 h-1 bg-blue-500 rounded"
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
            <span className="relative z-10">{tab}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
