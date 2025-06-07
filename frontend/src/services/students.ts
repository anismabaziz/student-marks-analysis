import { Mapping } from "@/types/db";
import axiosClient from "./client";

interface IGetStudentsResponse {
  students: unknown[];
  total_students: number;
  mappings: Mapping[];
}
export async function getStudents(table_id: string, searchTerm: string) {
  return (
    await axiosClient.get<IGetStudentsResponse>("/students", {
      params: { table_id, query: searchTerm },
    })
  ).data;
}
