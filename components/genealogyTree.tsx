"use client";

import { useMemo, useCallback, useEffect } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  type Node,
  type Edge,
  type NodeTypes,
  Handle,
  Position,
  useReactFlow,
  ReactFlowProvider,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import type { GenealogyMember, GenealogyEdge } from "@/types/genealogy";

const NODE_WIDTH = 160;
const NODE_HEIGHT = 60;
const HORIZONTAL_GAP = 40;
const VERTICAL_GAP = 100;

interface MemberNodeData {
  label: string;
  studentId: string;
  level: string;
  color: string;
  team: string;
  highlighted: boolean;
  [key: string]: unknown;
}

function MemberNode({ data }: { data: MemberNodeData }) {
  return (
    <>
      <Handle type="target" position={Position.Top} className="!bg-muted-foreground" />
      <div
        className="rounded-lg border-2 bg-background px-4 py-2 shadow-sm text-center min-w-[140px] transition-all duration-300"
        style={{
          borderColor: data.color,
          boxShadow: data.highlighted
            ? `0 0 0 3px ${data.color}, 0 0 16px ${data.color}80`
            : undefined,
          transform: data.highlighted ? "scale(1.1)" : undefined,
        }}
      >
        <div className="font-semibold text-sm">{data.label}</div>
        <div className="text-xs text-muted-foreground">
          {data.studentId} · {data.level}
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-muted-foreground" />
    </>
  );
}

const nodeTypes: NodeTypes = {
  member: MemberNode,
};

function buildTreeLayout(
  members: GenealogyMember[],
  edges: GenealogyEdge[]
): Node[] {
  const childrenMap = new Map<string, string[]>();
  const parentSet = new Set<string>();

  edges.forEach((e) => {
    const children = childrenMap.get(e.source_id) ?? [];
    children.push(e.target_id);
    childrenMap.set(e.source_id, children);
    parentSet.add(e.target_id);
  });

  const roots = members.filter((m) => !parentSet.has(m.id));

  const positions = new Map<string, { x: number; y: number }>();
  let currentX = 0;

  function layoutSubtree(nodeId: string, depth: number): number {
    const children = childrenMap.get(nodeId) ?? [];

    if (children.length === 0) {
      positions.set(nodeId, {
        x: currentX,
        y: depth * (NODE_HEIGHT + VERTICAL_GAP),
      });
      currentX += NODE_WIDTH + HORIZONTAL_GAP;
      return positions.get(nodeId)!.x;
    }

    const childXs: number[] = [];
    children.forEach((childId) => {
      const cx = layoutSubtree(childId, depth + 1);
      childXs.push(cx);
    });

    const centerX = (childXs[0] + childXs[childXs.length - 1]) / 2;
    positions.set(nodeId, {
      x: centerX,
      y: depth * (NODE_HEIGHT + VERTICAL_GAP),
    });

    return centerX;
  }

  roots.forEach((root) => {
    layoutSubtree(root.id, 0);
    currentX += HORIZONTAL_GAP;
  });

  return members.map((m) => {
    const pos = positions.get(m.id) ?? { x: currentX, y: 0 };
    if (!positions.has(m.id)) {
      currentX += NODE_WIDTH + HORIZONTAL_GAP;
    }

    return {
      id: m.id,
      type: "member",
      position: pos,
      data: {
        label: m.name,
        studentId: m.student_id,
        level: m.level,
        color: m.color,
        team: m.team,
        highlighted: false,
      } satisfies MemberNodeData,
    };
  });
}

interface GenealogyTreeInnerProps {
  members: GenealogyMember[];
  edges: GenealogyEdge[];
  focusNodeId: string | null;
}

function GenealogyTreeInner({ members, edges, focusNodeId }: GenealogyTreeInnerProps) {
  const { fitView, setCenter, getNodes } = useReactFlow();

  const baseNodes = useMemo(() => buildTreeLayout(members, edges), [members, edges]);

  const nodes = useMemo(
    () =>
      baseNodes.map((node) => ({
        ...node,
        data: {
          ...node.data,
          highlighted: node.id === focusNodeId,
        },
      })),
    [baseNodes, focusNodeId]
  );

  const flowEdges: Edge[] = useMemo(
    () =>
      edges.map((e) => ({
        id: `e-${e.id}`,
        source: e.source_id,
        target: e.target_id,
        type: "smoothstep",
        animated: true,
        style: { stroke: "#94a3b8", strokeWidth: 2 },
      })),
    [edges]
  );

  const onInit = useCallback(() => {
    setTimeout(() => fitView({ padding: 0.2 }), 50);
  }, [fitView]);

  useEffect(() => {
    if (!focusNodeId) return;

    const targetNode = getNodes().find((n) => n.id === focusNodeId);
    if (!targetNode) return;

    setTimeout(() => {
      setCenter(
        targetNode.position.x + NODE_WIDTH / 2,
        targetNode.position.y + NODE_HEIGHT / 2,
        { zoom: 1.5, duration: 800 }
      );
    }, 100);
  }, [focusNodeId, getNodes, setCenter]);

  return (
    <div className="h-full w-full">
      {members.length === 0 ? (
        <div className="flex h-full items-center justify-center text-muted-foreground">
          데이터가 없습니다.
        </div>
      ) : (
        <ReactFlow
          nodes={nodes}
          edges={flowEdges}
          nodeTypes={nodeTypes}
          onInit={onInit}
          fitView
          minZoom={0.2}
          maxZoom={2}
          nodesDraggable={false}
          nodesConnectable={false}
          proOptions={{ hideAttribution: true }}
        >
          <Background gap={20} />
          <Controls showInteractive={false} />
          <MiniMap
            nodeColor={(node) => {
              const d = node.data as MemberNodeData;
              return d.color ?? "#94a3b8";
            }}
            maskColor="rgba(0,0,0,0.1)"
            className="hidden sm:block"
          />
        </ReactFlow>
      )}
    </div>
  );
}

interface GenealogyTreeProps {
  members: GenealogyMember[];
  edges: GenealogyEdge[];
  focusNodeId?: string | null;
}

export function GenealogyTree({ members, edges, focusNodeId = null }: GenealogyTreeProps) {
  return (
    <ReactFlowProvider>
      <GenealogyTreeInner members={members} edges={edges} focusNodeId={focusNodeId} />
    </ReactFlowProvider>
  );
}
