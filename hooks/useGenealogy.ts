import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import type { GenealogyMember, GenealogyEdge } from "@/types/genealogy";

type GenealogyNode = {
  name: string;
  studentId: string;
  level: string;
  team: string;
  color: string;
  joinYear: number;
  depth: number;
};

export type GenealogyGraphData = {
  nodes: Record<string, GenealogyNode>;
  edges: [string, string][];
  edgesBySource: Record<string, string[]>;
};

export type GenealogyRawData = {
  members: GenealogyMember[];
  edges: GenealogyEdge[];
  graph: GenealogyGraphData;
};

export const useGenealogy = () => {
  return useQuery<GenealogyRawData>({
    queryKey: ["genealogy"],
    queryFn: async () => {
      const [membersRes, edgesRes] = await Promise.all([
        supabase.from("genealogy_members").select("*"),
        supabase.from("genealogy_edges").select("*"),
      ]);

      if (membersRes.error) throw membersRes.error;
      if (edgesRes.error) throw edgesRes.error;

      const members: GenealogyMember[] = membersRes.data || [];
      const rawEdges: GenealogyEdge[] = edgesRes.data || [];

      const nodes: Record<string, GenealogyNode> = {};
      for (const m of members) {
        nodes[m.id] = {
          name: m.name,
          studentId: m.student_id,
          level: m.level,
          team: m.team,
          color: m.color,
          joinYear: m.join_year,
          depth: m.depth,
        };
      }

      const graphEdges: [string, string][] = [];
      const edgesBySource: Record<string, string[]> = {};
      for (const e of rawEdges) {
        graphEdges.push([e.source_id, e.target_id]);
        if (!edgesBySource[e.source_id]) edgesBySource[e.source_id] = [];
        edgesBySource[e.source_id].push(e.target_id);
      }

      return {
        members,
        edges: rawEdges,
        graph: { nodes, edges: graphEdges, edgesBySource },
      };
    },
  });
};
