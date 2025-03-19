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

interface IGetTopPerformingStudentsOverall {
  students: { moyenne_du_semestre: string; name: string; code: string }[];
}
export async function getTopPerformingStudentsOverall(table: string) {
  return (
    await axiosClient.get<IGetTopPerformingStudentsOverall>(
      "/students/top-performing",
      {
        params: { table, module: "moyenne_du_semestre" },
      }
    )
  ).data;
}

interface IGetLowestPerformingStudentsOverall {
  students: { moyenne_du_semestre: string; name: string; code: string }[];
}
export async function getLowestPerformingStudentsOverall(table: string) {
  return (
    await axiosClient.get<IGetLowestPerformingStudentsOverall>(
      "/students/lowest-performing",
      {
        params: { table, module: "moyenne_du_semestre" },
      }
    )
  ).data;
}
