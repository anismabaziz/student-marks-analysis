import axiosClient from "./client";

export async function getStudents(searchTerm: string, page: number) {
  return (
    await axiosClient.get("/students", { params: { query: searchTerm, page } })
  ).data;
}

export async function getTopPerformingStudentsOverall() {
  return (
    await axiosClient.get("/students/top-performing", {
      params: { column: "moyenne_semestre" },
    })
  ).data;
}
export async function getLowestPerformingStudentsOverall() {
  return (
    await axiosClient.get("/students/lowest-performing", {
      params: { column: "moyenne_semestre" },
    })
  ).data;
}
