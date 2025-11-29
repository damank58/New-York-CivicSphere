import { useQuery } from "@tanstack/react-query";
import { fetchAISummary } from "../services/api";

export const useAISummary = () =>
  useQuery({
    queryKey: ["ai-summary"],
    queryFn: fetchAISummary,
    staleTime: 1000 * 60 * 10,
  });

