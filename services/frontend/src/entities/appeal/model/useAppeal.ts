import { useQuery } from "@tanstack/react-query";
import getAppeal from "../api/getAppeal";
import { appealQueryKeys } from "./appeal.keys";

export default function useAppeal(id: string) {
  return useQuery({
    queryKey: appealQueryKeys.detail(id),
    queryFn: ({ signal }) => getAppeal(id, signal),
  });
}
