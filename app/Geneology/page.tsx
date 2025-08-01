"use client";
import { useEffect, useState } from "react";
import genealogyData from "@/app/public/genealogy.json";
import Header from "../components/header";
import { GeneologySheet } from "@/components/geneologySheet";

export default function GeneologyPage() {
  const [isClient, setIsClient] = useState(false);

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

        // Create a sample graph
        const graph = new Graph();

        // Add nodes from JSON data
        genealogyData.nodes.forEach((node) => {
          // 학번을 숫자로 변환
          const studentIdNum = parseInt(node.studentId);

          // 같은 학번끼리 그룹화하여 위치 계산
          const sameYearNodes = genealogyData.nodes.filter(
            (n) => parseInt(n.studentId) === studentIdNum
          );
          const nodeIndexInYear = sameYearNodes.findIndex(
            (n) => n.id === node.id
          );

          // x 위치: 학번 * 10 (가로 간격)
          const x = studentIdNum * 10;
          // y 위치: 같은 학번 내에서 세로로 배치 (간격 5)
          const y = nodeIndexInYear * 5;

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
          isNodeFixed: (_, attr) => attr.highlighted,
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
  }, [isClient]); // Add isClient as dependency

  if (!isClient) {
    return (
      <div className="w-full h-screen flex flex-col">
        <div className="w-full bg-white sticky top-0 z-10">
          <Header />
        </div>
        <div className="flex justify-end mx-8 my-4">
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
      <div className="flex justify-end mx-8 my-4">
        <GeneologySheet />
      </div>
      <div id="sigma-container" className="w-full h-full"></div>
    </div>
  );
}
