import axiosClient from "./client";

interface IGetGradesDistribution {
  counts: number[];
  bins: [number, number][];
}
export async function getGradeDistribution(table: string) {
  return (
    await axiosClient.get<IGetGradesDistribution>(
      "/students/grades-distribution",
      { params: { table } }
    )
  ).data;
}

interface IGetModulesAverages {
  averages: unknown[];
}
export async function getModulesAverages(table: string) {
  return (
    await axiosClient.get<IGetModulesAverages>("/students/modules-averages", {
      params: { table },
    })
  ).data;
}
