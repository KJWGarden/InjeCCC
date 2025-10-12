import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { ScriptureProgress } from "@/types/scripture_progress";

export const useScriptureProgress = () => {
  return useQuery<ScriptureProgress[]>({
    queryKey: ["scriptureProgress"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("scripture_progress")
        .select("*")
        .order("scripture_name");

      if (error) throw error;
      return data || [];
    },
  });
};
