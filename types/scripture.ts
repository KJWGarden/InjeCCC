export type Scripture = {
  id: string;
  user_id: string;
  scripture_name: string;
  bible_name: string;
  target_chapters: number | null;
  completed_chapters: number | null;
  current_scripter: string | null;
  updated_at?: Date | null;
};
