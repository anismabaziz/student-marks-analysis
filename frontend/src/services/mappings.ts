import { Mapping } from "@/types/db";
import axiosClient from "./client";

interface IGetRelevantMappings {
  relevant_mappings: Mapping[];
}
export async function getRelevantMappings(table_id: string) {
  return (
    await axiosClient.get<IGetRelevantMappings>("/mappings/relevant", {
      params: { table_id },
    })
  ).data;
}
