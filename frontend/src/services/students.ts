import axiosClient from "./client";

interface IGetTableNames {
  tables: { table_name: string }[];
}
export async function getTableNames() {
  return (await axiosClient.get<IGetTableNames>("/students/tables")).data;
}

interface IGetRelevantCols {
  mappings: {
    name: string;
    db_name: string;
    id: string;
  }[];
}
export async function getRelevantCols(tableName: string) {
  return (
    await axiosClient.get<IGetRelevantCols>("/students/relevant-cols", {
      params: { table: tableName },
    })
  ).data;
}

export async function getStudentsTable(
  table: string,
  searchTerm: string,
  page: number
) {
  return (
    await axiosClient.get("/students", {
      params: { table, query: searchTerm, page },
    })
  ).data;
}

interface IGetTopPerformingStudents {
  module: string;
  students: { name: string; code: string; [key: string]: unknown }[];
}
export async function getTopPerformingStudents(table: string, module: string) {
  return (
    await axiosClient.get<IGetTopPerformingStudents>(
      "/students/top-performing",
      {
        params: { table, module },
      }
    )
  ).data;
}

interface IGetLowestPerformingStudents {
  students: { name: string; code: string; [key: string]: unknown }[];
  module: string;
}
export async function getLowestPerformingStudents(
  table: string,
  module: string
) {
  return (
    await axiosClient.get<IGetLowestPerformingStudents>(
      "/students/lowest-performing",
      {
        params: { table, module },
      }
    )
  ).data;
}
