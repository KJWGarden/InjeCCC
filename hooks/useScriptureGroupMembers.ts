import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";

type GroupData = {
  id: string;
  name: string;
};

type MemberData = {
  id: string;
  name: string;
};

type GroupMembersData = {
  group: GroupData;
  members: MemberData[];
};

export const useScriptureGroupMembers = (groupId?: string | null) => {
  return useQuery<GroupMembersData | null>({
    queryKey: ["scriptureGroupMembers", groupId],
    queryFn: async () => {
      if (!groupId) return null;

      // scripture_groups에서 해당 순의 정보 가져오기
      const { data: groupData, error: groupError } = await supabase
        .from("scripture_groups")
        .select("id, name")
        .eq("id", groupId)
        .single();

      if (groupError) throw groupError;

      // 해당 순의 모든 구성원 가져오기 (scripture_group_id로 필터링)
      const { data: membersData, error: membersError } = await supabase
        .from("users")
        .select("id, name")
        .eq("scripture_group_id", groupId);

      if (membersError) throw membersError;

      return {
        group: groupData,
        members: membersData || [],
      };
    },
    enabled: !!groupId,
  });
};
