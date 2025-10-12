export type ScriptureProgress = {
  id: string;
  user_id: string;
  scripture_group_id: string;
  scripture_name: string;
  bible_name: string;
  target_chapters: number;
  completed_chapters: number;
  current_scripter: string;
  updated_at?: Date | null;
  created_at?: Date | null;
};
