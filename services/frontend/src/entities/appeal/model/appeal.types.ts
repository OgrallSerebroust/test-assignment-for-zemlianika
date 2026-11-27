export default interface Appeal {
  id: number;
  full_name: string;
  appeal: string;
  status: "queued" | "processing" | "done" | "failed";
  failure_reason: string;
  created_at: string;
  updated_at: string;
};

export interface AppealListParams {
  page: number;
  status?: Appeal["status"];
}
