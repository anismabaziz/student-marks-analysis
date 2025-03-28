import axiosClient from "./client";

interface IGetGradesDistribution {
  counts: number[];
  bins: [number, number][];
}
export async function getGradeDistribution(table_id: string) {
  return (
    await axiosClient.get<IGetGradesDistribution>(
      "/stats/grades-distribution",
      { params: { table_id } }
    )
  ).data;
}

interface IGetModulesAverages {
  averages: { average: number; name: string }[];
}
export async function getModulesAverages(table_id: string) {
  return (
    await axiosClient.get<IGetModulesAverages>("/stats/modules-averages", {
      params: { table_id },
    })
  ).data;
}
