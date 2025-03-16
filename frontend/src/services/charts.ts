import axiosClient from "./client";

interface IGetGradesDistribution {
  counts: number[];
  bins: [number, number][];
}
export async function getGradeDistribution() {
  return (
    await axiosClient.get<IGetGradesDistribution>(
      "/students/grades-distribution"
    )
  ).data;
}
