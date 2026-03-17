export interface GenealogyMember {
  id: string; // "학번_이름" 형식
  name: string;
  student_id: string;
  level: string; // 나사렛 | 순장
  team: string; // 제자
  color: string; // hex
  join_year: number;
  depth: number;
  created_at: string;
}

export interface GenealogyEdge {
  id: number;
  source_id: string;
  target_id: string;
  created_at: string;
}
