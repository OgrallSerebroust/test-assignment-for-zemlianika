import { appealQueryKeys } from "./appeal.keys.js";
import { useQuery } from "@tanstack/react-query";
import getAppealAll from "../api/getAppealAll.js";
import type { AppealListParams } from "./appeal.types";

export default function useAppealAll(params: AppealListParams) {
  return useQuery({
    queryKey: appealQueryKeys.list(params),
    queryFn: ({ signal }) => getAppealAll(params, signal),
  });
}
