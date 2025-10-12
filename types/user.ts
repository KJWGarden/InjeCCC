export type User = {
  id: string;
  student_id: string;
  name: string;
  birth: Date | null;
  gender: string | null;
  role: string;
  password_hash: string;
  group_id: string | null;
  scripture_group_id: string | null;
  updated_at?: Date | null;
  created_at?: Date | null;
};
