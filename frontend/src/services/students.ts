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

export async function getStudents(searchTerm: string, page: number) {
  return (
    await axiosClient.get("/students", { params: { query: searchTerm, page } })
  ).data;
}

export async function getTopPerformingStudentsOverall(table: string) {
  return (
    await axiosClient.get("/students/top-performing", {
      params: { table, module: "moyenne_du_semestre" },
    })
  ).data;
}
export async function getLowestPerformingStudentsOverall(table: string) {
  return (
    await axiosClient.get("/students/lowest-performing", {
      params: { table, module: "moyenne_du_semestre" },
    })
  ).data;
}
