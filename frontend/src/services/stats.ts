import axiosClient from "./client";

interface IGetStats {
  module: string;
  average_grade: number;
  max_grade: number;
  min_grade: number;
  passing_rate: number;
}
export async function getStats(table: string, module: string) {
  return (
    await axiosClient.get<IGetStats>("/students/stats", {
      params: { table, module },
    })
  ).data;
}

export async function getMappings() {
  return (await axiosClient.get("/students/mappings")).data;
}
