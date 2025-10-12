"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomeClient() {
  const router = useRouter();

  useEffect(() => {
    router.push("/Transcribe");
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-xl">로딩 중...</div>
    </div>
  );
}
