import axiosClient from "./client";

interface IGetStats {
  module: string;
  average_grade: number;
  max_grade: number;
  min_grade: number;
  passing_rate: number;
}
export async function getStats(table_id: string, module: string) {
  return (
    await axiosClient.get<IGetStats>("/stats", {
      params: { table_id, module },
    })
  ).data;
}

export async function getMappings() {
  return (await axiosClient.get("/students/mappings")).data;
}

interface IGetTopPerformingStudents {
  module: string;
  students: { name: string; code: string; [key: string]: unknown }[];
}
export async function getTopPerformingStudents(
  table_id: string,
  module: string
) {
  return (
    await axiosClient.get<IGetTopPerformingStudents>("/stats/top-performing", {
      params: { table_id, module },
    })
  ).data;
}

interface IGetLowestPerformingStudents {
  module: string;
  students: { name: string; code: string; [key: string]: unknown }[];
}
export async function getLowestPerformingStudents(
  table_id: string,
  module: string
) {
  return (
    await axiosClient.get<IGetLowestPerformingStudents>(
      "/stats/lowest-performing",
      {
        params: { table_id, module },
      }
    )
  ).data;
}
