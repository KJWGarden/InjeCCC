"use client";
import { useEffect, useState } from "react";
import genealogyData from "@/app/public/genealogy.json";
import Header from "../components/header";
import { GeneologySheet } from "@/components/geneologySheet";

export default function GeneologyPage() {
  const [isClient, setIsClient] = useState(false);
  const [sortBy, setSortBy] = useState<"studentId" | "joinYear">("studentId");

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

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

        // Retrieve the html document for sigma container
        const container = document.getElementById(
          "sigma-container"
        ) as HTMLElement;
        if (!container) return;

        // Clear previous content
        container.innerHTML = "";

        // Create a sample graph
        const graph = new Graph();

        // Add nodes from JSON data
        genealogyData.nodes.forEach((node) => {
          let x: number, y: number;

          if (sortBy === "joinYear") {
            // 가입년도별 정렬 - edge 교차 최소화
            const joinYear = node.joinYear || parseInt(node.studentId);
            const sameYearNodes = genealogyData.nodes.filter(
              (n) => (n.joinYear || parseInt(n.studentId)) === joinYear
            );

            // 같은 가입년도 내에서 연결된 노드들을 그룹화
            const connectedGroups: string[][] = [];
            const visited = new Set<string>();

            sameYearNodes.forEach((n) => {
              if (visited.has(n.id)) return;

              const group: string[] = [];
              const queue: string[] = [n.id];

              while (queue.length > 0) {
                const currentId = queue.shift()!;
                if (visited.has(currentId)) continue;

                visited.add(currentId);
                group.push(currentId);

                // 연결된 노드들 추가
                genealogyData.edges.forEach((edge) => {
                  if (edge.source === currentId && !visited.has(edge.target)) {
                    const targetNode = genealogyData.nodes.find(
                      (n) => n.id === edge.target
                    );
                    if (
                      targetNode &&
                      (targetNode.joinYear ||
                        parseInt(targetNode.studentId)) === joinYear
                    ) {
                      queue.push(edge.target);
                    }
                  }
                  if (edge.target === currentId && !visited.has(edge.source)) {
                    const sourceNode = genealogyData.nodes.find(
                      (n) => n.id === edge.source
                    );
                    if (
                      sourceNode &&
                      (sourceNode.joinYear ||
                        parseInt(sourceNode.studentId)) === joinYear
                    ) {
                      queue.push(edge.source);
                    }
                  }
                });
              }

              if (group.length > 0) {
                connectedGroups.push(group);
              }
            });

            // 현재 노드가 속한 그룹 찾기
            let groupIndex = -1;
            let nodeIndexInGroup = -1;

            for (let i = 0; i < connectedGroups.length; i++) {
              const group = connectedGroups[i];
              const nodeIndex = group.indexOf(node.id);
              if (nodeIndex !== -1) {
                groupIndex = i;
                nodeIndexInGroup = nodeIndex;
                break;
              }
            }

            // x 위치: 가입년도 * 12 (가로 간격 증가)
            x = joinYear * 12;

            // y 위치: 그룹별로 배치하여 edge 교차 최소화
            if (groupIndex !== -1) {
              const group = connectedGroups[groupIndex];
              const totalGroups = connectedGroups.length;
              const groupHeight = 8; // 그룹 간 간격
              const nodeHeight = 4; // 그룹 내 노드 간격

              // 그룹의 중심 y 위치
              const groupCenterY =
                (groupIndex - (totalGroups - 1) / 2) * groupHeight;
              // 그룹 내에서의 노드 위치
              const nodeOffsetY =
                (nodeIndexInGroup - (group.length - 1) / 2) * nodeHeight;

              y = groupCenterY + nodeOffsetY;
            } else {
              // 연결되지 않은 노드는 기본 위치
              const nodeIndexInYear = sameYearNodes.findIndex(
                (n) => n.id === node.id
              );
              y = nodeIndexInYear * 6;
            }
          } else {
            // 학번별 정렬 (기존 방식)
            const studentIdNum = parseInt(node.studentId);
            const sameYearNodes = genealogyData.nodes.filter(
              (n) => parseInt(n.studentId) === studentIdNum
            );
            const nodeIndexInYear = sameYearNodes.findIndex(
              (n) => n.id === node.id
            );

            // x 위치: 학번 * 10 (가로 간격)
            x = studentIdNum * 10;
            // y 위치: 같은 학번 내에서 세로로 배치 (간격 5)
            y = nodeIndexInYear * 5;
          }

          graph.addNode(node.id, {
            x: x,
            y: y,
            size: node.size,
            label: node.name,
            color: node.color,
            level: node.level,
          });
        });

        // 깊이 우선 탐색으로 각 노드의 깊이 계산
        const calculateDepth = (
          nodeId: string,
          visited: Set<string> = new Set()
        ): number => {
          if (visited.has(nodeId)) return 0;
          visited.add(nodeId);

          const outgoingEdges = genealogyData.edges.filter(
            (edge) => edge.source === nodeId
          );
          if (outgoingEdges.length === 0) return 1; // 리프 노드

          const maxDepth = Math.max(
            ...outgoingEdges.map((edge) =>
              calculateDepth(edge.target, new Set(visited))
            )
          );
          return maxDepth + 1;
        };

        // 각 노드의 깊이 계산 및 크기 업데이트
        genealogyData.nodes.forEach((node) => {
          const depth = calculateDepth(node.id);
          const newSize = Math.max(8, Math.min(20, 8 + depth * 2)); // 깊이에 따라 8~20 사이로 크기 조정

          graph.setNodeAttribute(node.id, "size", newSize);
        });

        // Add edges from JSON data
        genealogyData.edges.forEach((edge) => {
          graph.addEdge(edge.source, edge.target);
        });

        // Create the spring layout and start it
        const layout = new ForceSupervisor(graph, {
          isNodeFixed: (_, attr) => attr.highlighted || sortBy === "joinYear", // 가입년도별 정렬 시 모든 노드 고정
        });
        layout.start();

        // Create the sigma
        const renderer = new Sigma(graph, container, {
          minCameraRatio: 0.5,
          maxCameraRatio: 2,
        });

        //
        // Drag'n'drop feature
        // ~~~~~~~~~~~~~~~~~~~
        //

        // State for drag'n'drop
        let draggedNode: string | null = null;
        let isDragging = false;

        // On mouse down on a node
        //  - we enable the drag mode
        //  - save in the dragged node in the state
        //  - highlight the node
        //  - disable the camera so its state is not updated
        renderer.on("downNode", (e) => {
          isDragging = true;
          draggedNode = e.node;
          graph.setNodeAttribute(draggedNode, "highlighted", true);
          if (!renderer.getCustomBBox())
            renderer.setCustomBBox(renderer.getBBox());
        });

        // On mouse move, if the drag mode is enabled, we change the position of the draggedNode
        renderer.on("moveBody", ({ event }) => {
          if (!isDragging || !draggedNode) return;

          // Get new position of node
          const pos = renderer.viewportToGraph(event);

          graph.setNodeAttribute(draggedNode, "x", pos.x);
          graph.setNodeAttribute(draggedNode, "y", pos.y);

          // Prevent sigma to move camera:
          event.preventSigmaDefault();
          event.original.preventDefault();
          event.original.stopPropagation();
        });

        // On mouse up, we reset the dragging mode
        const handleUp = () => {
          if (draggedNode) {
            graph.removeNodeAttribute(draggedNode, "highlighted");
          }
          isDragging = false;
          draggedNode = null;
        };
        renderer.on("upNode", handleUp);
        renderer.on("upStage", handleUp);

        // Cleanup function
        return () => {
          layout.stop();
          renderer.kill();
        };
      })
      .catch((error) => {
        console.error("Error loading graph libraries:", error);
      });
  }, [isClient, sortBy]); // Add sortBy as dependency

  if (!isClient) {
    return (
      <div className="w-full h-screen flex flex-col">
        <div className="w-full bg-white sticky top-0 z-10">
          <Header />
        </div>
        <div className="flex justify-between items-center mx-8 my-4">
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="sortBy"
                value="studentId"
                checked={sortBy === "studentId"}
                onChange={(e) =>
                  setSortBy(e.target.value as "studentId" | "joinYear")
                }
                className="w-4 h-4"
              />
              <span className="text-sm font-medium">학번별 정렬</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="sortBy"
                value="joinYear"
                checked={sortBy === "joinYear"}
                onChange={(e) =>
                  setSortBy(e.target.value as "studentId" | "joinYear")
                }
                className="w-4 h-4"
              />
              <span className="text-sm font-medium">가입년도별 정렬</span>
            </label>
          </div>
          <GeneologySheet />
        </div>
        <div className="w-full h-full flex items-center justify-center">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen flex flex-col">
      <div className="w-full bg-white sticky top-0 z-10">
        <Header />
      </div>
      <div className="flex justify-between items-center mx-8 my-4">
        <div className="flex gap-4">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="sortBy"
              value="studentId"
              checked={sortBy === "studentId"}
              onChange={(e) =>
                setSortBy(e.target.value as "studentId" | "joinYear")
              }
              className="w-4 h-4"
            />
            <span className="text-sm font-medium">학번별 정렬</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="sortBy"
              value="joinYear"
              checked={sortBy === "joinYear"}
              onChange={(e) =>
                setSortBy(e.target.value as "studentId" | "joinYear")
              }
              className="w-4 h-4"
            />
            <span className="text-sm font-medium">가입년도별 정렬</span>
          </label>
        </div>
        <GeneologySheet />
      </div>
      <div id="sigma-container" className="w-full h-full"></div>
    </div>
  );
}
