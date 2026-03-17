"use client";

import { useEffect, useState } from "react";
import type { GenealogyGraphData } from "@/hooks/useGenealogy";

interface GenealogyGraphProps {
  data: GenealogyGraphData;
  sortBy: "studentId" | "joinYear";
}

export function GenealogyGraph({ data, sortBy }: GenealogyGraphProps) {
  const [containerSize, setContainerSize] = useState<{
    width: number;
    height: number;
  } | null>(null);

  const scaleFactor =
    typeof window === "undefined" || !containerSize
      ? 1
      : Math.max(0.35, Math.min(1, containerSize.width / 1280));

  // sigma-container 크기 관찰 - 유효한 크기가 있을 때만 ready
  useEffect(() => {
    const container = document.getElementById("sigma-container");
    if (!container) return;

    const updateSize = () => {
      const rect = container.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        setContainerSize((prev) =>
          prev && prev.width === rect.width && prev.height === rect.height
            ? prev
            : { width: rect.width, height: rect.height }
        );
      }
    };

    updateSize();

    const resizeObserver = new ResizeObserver(updateSize);
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!containerSize) return;

    const container = document.getElementById("sigma-container") as HTMLElement;
    if (!container || container.getBoundingClientRect().width === 0) return;

    // Dynamically import the libraries
    Promise.all([
      import("graphology"),
      import("graphology-layout-force/worker"),
      import("sigma"),
    ])
      .then(([GraphModule, ForceSupervisorModule, SigmaModule]) => {
        const Graph = GraphModule.default;
        const ForceSupervisor = ForceSupervisorModule.default;
        const Sigma = SigmaModule.default;

        const currentContainer = document.getElementById(
          "sigma-container"
        ) as HTMLElement;
        if (!currentContainer || currentContainer.getBoundingClientRect().width === 0) return;

        currentContainer.innerHTML = "";

        const graph = new Graph();
        const { nodes: nodesMap, edges, edgesBySource } = data;
        const nodeEntries = Object.entries(nodesMap);

        // 역방향 엣지 인덱스
        const edgesByTarget: Record<string, string[]> = {};
        for (const [src, targets] of Object.entries(edgesBySource)) {
          for (const t of targets) {
            if (!edgesByTarget[t]) edgesByTarget[t] = [];
            edgesByTarget[t].push(src);
          }
        }

        // 같은 joinYear / studentId 별로 노드를 사전 그룹화
        const nodesByJoinYear: Record<number, string[]> = {};
        const nodesByStudentId: Record<number, string[]> = {};
        for (const [id, node] of nodeEntries) {
          const jy = node.joinYear || parseInt(node.studentId);
          if (!nodesByJoinYear[jy]) nodesByJoinYear[jy] = [];
          nodesByJoinYear[jy].push(id);

          const sid = parseInt(node.studentId);
          if (!nodesByStudentId[sid]) nodesByStudentId[sid] = [];
          nodesByStudentId[sid].push(id);
        }

        for (const [id, node] of nodeEntries) {
          let x: number, y: number;

          if (sortBy === "joinYear") {
            const joinYear = node.joinYear || parseInt(node.studentId);
            const sameYearIds = nodesByJoinYear[joinYear] || [];

            const connectedGroups: string[][] = [];
            const visited = new Set<string>();
            const sameYearSet = new Set(sameYearIds);

            for (const nId of sameYearIds) {
              if (visited.has(nId)) continue;

              const group: string[] = [];
              const queue: string[] = [nId];

              while (queue.length > 0) {
                const currentId = queue.shift()!;
                if (visited.has(currentId)) continue;
                visited.add(currentId);
                group.push(currentId);

                const outgoing = edgesBySource[currentId] || [];
                for (const t of outgoing) {
                  if (!visited.has(t) && sameYearSet.has(t)) queue.push(t);
                }
                const incoming = edgesByTarget[currentId] || [];
                for (const s of incoming) {
                  if (!visited.has(s) && sameYearSet.has(s)) queue.push(s);
                }
              }

              if (group.length > 0) connectedGroups.push(group);
            }

            let groupIndex = -1;
            let nodeIndexInGroup = -1;
            for (let i = 0; i < connectedGroups.length; i++) {
              const idx = connectedGroups[i].indexOf(id);
              if (idx !== -1) {
                groupIndex = i;
                nodeIndexInGroup = idx;
                break;
              }
            }

            x = joinYear * 12;

            if (groupIndex !== -1) {
              const group = connectedGroups[groupIndex];
              const totalGroups = connectedGroups.length;
              const groupHeight = 8;
              const nodeHeight = 4;
              const groupCenterY =
                (groupIndex - (totalGroups - 1) / 2) * groupHeight;
              const nodeOffsetY =
                (nodeIndexInGroup - (group.length - 1) / 2) * nodeHeight;
              y = groupCenterY + nodeOffsetY;
            } else {
              y = sameYearIds.indexOf(id) * 6;
            }
          } else {
            const studentIdNum = parseInt(node.studentId);
            const sameStudentIds = nodesByStudentId[studentIdNum] || [];
            x = studentIdNum * 10;
            y = sameStudentIds.indexOf(id) * 5;
          }

          const edgeCount =
            (edgesBySource[id]?.length || 0) + (edgesByTarget[id]?.length || 0);
          const baseSize = Math.max(8, Math.min(24, 8 + edgeCount * 2));

          graph.addNode(id, {
            x,
            y,
            size: baseSize * scaleFactor,
            label: node.name,
            color: node.color,
            level: node.level,
          });
        }

        for (const [source, target] of edges) {
          graph.addEdge(source, target);
        }

        const layout = new ForceSupervisor(graph, {
          isNodeFixed: (_, attr) => attr.highlighted || sortBy === "joinYear",
        });
        layout.start();

        const renderer = new Sigma(graph, currentContainer, {
          allowInvalidContainer: true,
          minCameraRatio: 0.25 * scaleFactor,
          maxCameraRatio: 2,
        });

        const baseLabelThreshold = 10;
        renderer.setSetting(
          "labelRenderedSizeThreshold",
          baseLabelThreshold * scaleFactor
        );

        let draggedNode: string | null = null;
        let isDragging = false;

        renderer.on("downNode", (e) => {
          isDragging = true;
          draggedNode = e.node;
          graph.setNodeAttribute(draggedNode, "highlighted", true);
          if (!renderer.getCustomBBox())
            renderer.setCustomBBox(renderer.getBBox());
        });

        renderer.on("moveBody", ({ event }) => {
          if (!isDragging || !draggedNode) return;
          const pos = renderer.viewportToGraph(event);
          graph.setNodeAttribute(draggedNode, "x", pos.x);
          graph.setNodeAttribute(draggedNode, "y", pos.y);
          event.preventSigmaDefault();
          event.original.preventDefault();
          event.original.stopPropagation();
        });

        const handleUp = () => {
          if (draggedNode) {
            graph.removeNodeAttribute(draggedNode, "highlighted");
          }
          isDragging = false;
          draggedNode = null;
        };
        renderer.on("upNode", handleUp);
        renderer.on("upStage", handleUp);

        return () => {
          layout.stop();
          renderer.kill();
        };
      })
      .catch((error) => {
        console.error("Error loading graph libraries:", error);
      });
  }, [sortBy, scaleFactor, data, containerSize]);

  return <div id="sigma-container" className="w-full h-full min-h-[400px]" />;
}
