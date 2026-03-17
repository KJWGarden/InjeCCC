"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { TextSearch } from "lucide-react";
import type { GenealogyMember } from "@/types/genealogy";

interface GeneologySheetProps {
  members: GenealogyMember[];
  onSelectMember: (memberId: string) => void;
}

export function GeneologySheet({ members, onSelectMember }: GeneologySheetProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const results = query.trim()
    ? members.filter(
        (m) =>
          m.name.includes(query.trim()) ||
          m.student_id.includes(query.trim())
      )
    : [];

  const handleSelect = (memberId: string) => {
    onSelectMember(memberId);
    setOpen(false);
    setQuery("");
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 font-medium border-indigo-300/60 bg-indigo-500/5 text-indigo-700 hover:bg-indigo-500/10 hover:border-indigo-300/80 shadow-[0_0_6px_rgba(99,102,241,0.2)] hover:shadow-[0_0_8px_rgba(99,102,241,0.25)] transition-shadow"
        >
          <TextSearch className="h-4 w-4 shrink-0" />
          <span>검색</span>
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>멤버 검색</SheetTitle>
        </SheetHeader>
        <div className="px-4 mt-4">
          <Input
            placeholder="이름 또는 학번으로 검색"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
        </div>
        <div className="flex-1 overflow-y-auto px-4 mt-4">
          {query.trim() && results.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              검색 결과가 없습니다.
            </p>
          )}
          <ul className="space-y-1">
            {results.map((m) => (
              <li key={m.id}>
                <button
                  className="w-full text-left px-3 py-2 rounded-md hover:bg-muted transition-colors"
                  onClick={() => handleSelect(m.id)}
                >
                  <span className="font-medium text-sm">{m.name}</span>
                  <span className="text-xs text-muted-foreground ml-2">
                    {m.student_id}학번 · {m.level} · {m.team}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </SheetContent>
    </Sheet>
  );
}
