"use client";
import { useState, useMemo, useCallback } from "react";
import Header from "../components/header";
import { GeneologySheet } from "@/components/geneologySheet";
import { GenealogyGraph } from "@/components/genealogyGraph";
import { GenealogyTree } from "@/components/genealogyTree";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGenealogy } from "@/hooks/useGenealogy";
import { LastUpdated } from "@/components/lastUpdated";

const TEAMS = ["제자", "빛알사", "헤세드", "예닮"] as const;

export default function GeneologyPage() {
  const { data: genealogyData, isLoading, error } = useGenealogy();
  const [sortBy, setSortBy] = useState<"studentId" | "joinYear">("studentId");
  const [selectedTeam, setSelectedTeam] = useState<string>("제자");
  const [focusNodeId, setFocusNodeId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<string>("tree");

  const handleSelectMember = useCallback(
    (memberId: string) => {
      if (!genealogyData) return;
      const member = genealogyData.members.find((m) => m.id === memberId);
      if (member && member.team !== selectedTeam) {
        setSelectedTeam(member.team);
      }
      setViewMode("tree");
      setFocusNodeId(memberId);
    },
    [genealogyData, selectedTeam]
  );

  const filteredData = useMemo(() => {
    if (!genealogyData) return null;

    const { nodes, edges, edgesBySource } = genealogyData.graph;
    const filteredNodes: typeof nodes = {};
    for (const [id, node] of Object.entries(nodes)) {
      if (node.team === selectedTeam) {
        filteredNodes[id] = node;
      }
    }
    const nodeIds = new Set(Object.keys(filteredNodes));

    const filteredEdges = edges.filter(
      ([src, tgt]) => nodeIds.has(src) && nodeIds.has(tgt)
    );

    const filteredEdgesBySource: Record<string, string[]> = {};
    for (const [src, targets] of Object.entries(edgesBySource)) {
      if (!nodeIds.has(src)) continue;
      const filtered = targets.filter((t) => nodeIds.has(t));
      if (filtered.length > 0) {
        filteredEdgesBySource[src] = filtered;
      }
    }

    const filteredMembers = genealogyData.members.filter(
      (m) => m.team === selectedTeam
    );
    const memberIds = new Set(filteredMembers.map((m) => m.id));
    const filteredMemberEdges = genealogyData.edges.filter(
      (e) => memberIds.has(e.source_id) && memberIds.has(e.target_id)
    );

    return {
      graph: {
        nodes: filteredNodes,
        edges: filteredEdges,
        edgesBySource: filteredEdgesBySource,
      },
      members: filteredMembers,
      edges: filteredMemberEdges,
    };
  }, [genealogyData, selectedTeam]);

  const lastUpdatedAt = genealogyData?.members.reduce<string | null>(
    (max, m) => {
      if (!m.created_at) return max;
      return !max || m.created_at > max ? m.created_at : max;
    },
    null
  );

  if (isLoading || !genealogyData) {
    return (
      <div className="w-full h-screen flex flex-col">
        <div className="w-full bg-white sticky top-0 z-10">
          <Header />
        </div>
        <div className="w-full h-full flex items-center justify-center">
          <p>{error ? "데이터를 불러오는 중 오류가 발생했습니다." : "로딩 중..."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen flex flex-col">
      <div className="w-full bg-white sticky top-0 z-20">
        <Header />
      </div>

      {/* 풀스크린 컨텐츠 영역 */}
      <div className="flex-1 relative overflow-hidden">
        {/* 그래프/트리 풀스크린 배경 */}
        <div className="absolute inset-0">
          {viewMode === "graph" && filteredData && (
            <GenealogyGraph data={filteredData.graph} sortBy={sortBy} />
          )}
          {viewMode === "tree" && filteredData && (
            <GenealogyTree
              members={filteredData.members}
              edges={filteredData.edges}
              focusNodeId={focusNodeId}
            />
          )}
        </div>

        {/* 상단 비네트 효과 */}
        <div
          className="absolute inset-x-0 top-0 h-36 pointer-events-none z-10"
          style={{
            background:
              "linear-gradient(to bottom, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.7) 50%, transparent 100%)",
          }}
        />

        {/* 오버레이 컨트롤 */}
        <div className="absolute inset-x-0 top-0 z-10 px-3 sm:px-4 pt-2 sm:pt-3 flex flex-col gap-1.5 sm:gap-2">
          {/* 1행: 순 선택 + 검색 */}
          <div className="flex justify-between items-center gap-2 min-w-0">
            <Tabs value={selectedTeam} onValueChange={setSelectedTeam} className="min-w-0 flex-1 sm:flex-initial">
              <TabsList className="h-8 sm:h-9">
                {TEAMS.map((team) => (
                  <TabsTrigger key={team} value={team} className="text-xs sm:text-sm px-2 sm:px-3">
                    {team}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
            <div className="flex items-center gap-2 shrink-0">
              <GeneologySheet
                members={genealogyData.members}
                onSelectMember={handleSelectMember}
              />
              <span className="hidden sm:inline-flex">
                <LastUpdated date={lastUpdatedAt} />
              </span>
            </div>
          </div>

          {/* 2행: 뷰 모드 + 정렬 + 모바일 최종수정 */}
          <div className="flex justify-between items-center gap-2">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <Tabs value={viewMode} onValueChange={setViewMode}>
                <TabsList className="h-8 sm:h-9">
                  <TabsTrigger value="tree" className="text-xs sm:text-sm px-2 sm:px-3">순 계보</TabsTrigger>
                  <TabsTrigger value="graph" className="text-xs sm:text-sm px-2 sm:px-3">순의 원형</TabsTrigger>
                </TabsList>
              </Tabs>

              {viewMode === "graph" && (
                <div className="flex gap-2 sm:gap-3 shrink-0">
                  <label className="flex items-center gap-1">
                    <input
                      type="radio"
                      name="sortBy"
                      value="studentId"
                      checked={sortBy === "studentId"}
                      onChange={(e) =>
                        setSortBy(e.target.value as "studentId" | "joinYear")
                      }
                      className="w-3 h-3 sm:w-3.5 sm:h-3.5"
                    />
                    <span className="text-[10px] sm:text-xs font-medium">학번별</span>
                  </label>
                  <label className="flex items-center gap-1">
                    <input
                      type="radio"
                      name="sortBy"
                      value="joinYear"
                      checked={sortBy === "joinYear"}
                      onChange={(e) =>
                        setSortBy(e.target.value as "studentId" | "joinYear")
                      }
                      className="w-3 h-3 sm:w-3.5 sm:h-3.5"
                    />
                    <span className="text-[10px] sm:text-xs font-medium">가입년도별</span>
                  </label>
                </div>
              )}
            </div>

            <span className="sm:hidden shrink-0">
              <LastUpdated date={lastUpdatedAt} />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
