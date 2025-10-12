export type ReadingStatus = "not_started" | "in_progress" | "completed";

export type ReadingProgress = {
  id: string;
  user_id: string;
  reading_group_id: string;
  date: string;
  status: ReadingStatus;
  created_at?: Date | null;
};
