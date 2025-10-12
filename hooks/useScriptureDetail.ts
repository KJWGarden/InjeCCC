import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { ScriptureProgress } from "@/types/scripture_progress";

type GroupData = {
  id: string;
  name: string;
  leader_user_id: string;
};

type UserData = {
  id: string;
  name: string;
  scripture_group_id: string;
};

type DetailData = {
  progress: ScriptureProgress;
  group: GroupData;
  members: UserData[];
  leader: UserData | null;
};

export const useScriptureDetail = (progressId?: string | null) => {
  return useQuery<DetailData | null>({
    queryKey: ["scriptureDetail", progressId],
    queryFn: async () => {
      if (!progressId) return null;

      // 1. scripture_progress에서 해당 레코드 가져오기
      const { data: progressData, error: progressError } = await supabase
        .from("scripture_progress")
        .select("*")
        .eq("user_id", progressId)
        .single();

      if (progressError) throw progressError;
      if (!progressData) return null;

      // 2. scripture_groups에서 leader_user_id가 progressData.user_id와 같은 레코드 찾기
      const { data: groupData, error: groupError } = await supabase
        .from("scripture_groups")
        .select("*")
        .eq("leader_user_id", progressData.user_id)
        .single();

      if (groupError) throw groupError;
      if (!groupData) return null;

      // 3. users 테이블에서 scripture_group_id가 groupData.id와 같은 모든 레코드 가져오기
      console.log("Looking for members with group ID:", groupData.id);
      const { data: membersData, error: membersError } = await supabase
        .from("users")
        .select("id, name, scripture_group_id")
        .eq("scripture_group_id", groupData.id);

      console.log("Members data:", membersData, "Error:", membersError);
      if (membersError) throw membersError;

      // 4. leader_user_id로 순장 정보 가져오기
      const { data: leaderData, error: leaderError } = await supabase
        .from("users")
        .select("id, name, scripture_group_id")
        .eq("id", groupData.leader_user_id)
        .single();

      if (leaderError) {
        // 에러가 발생해도 계속 진행 (순장 정보가 없을 수 있음)
      }

      return {
        progress: progressData,
        group: groupData,
        members: membersData || [],
        leader: leaderData || null,
      };
    },
    enabled: !!progressId,
  });
};
