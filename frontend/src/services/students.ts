import axiosClient from "./client";

export async function getStudents(searchTerm: string, page: number) {
  return (
    await axiosClient.get("/students", { params: { query: searchTerm, page } })
  ).data;
}
