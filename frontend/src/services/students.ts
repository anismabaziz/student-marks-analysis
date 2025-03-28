import { Mapping } from "@/types/db";
import axiosClient from "./client";

interface IGetStudentsResponse {
  students: unknown[];
  page: number;
  limit: number;
  total_students: number;
  mappings: Mapping[];
}
export async function getStudents(
  table_id: string,
  searchTerm: string,
  page: number
) {
  return (
    await axiosClient.get<IGetStudentsResponse>("/students", {
      params: { table_id, query: searchTerm, page },
    })
  ).data;
}
