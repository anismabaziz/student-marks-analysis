import client from "./client";

interface IUploadAndProcessFile {
  message: string;
}
export async function uploadAndProcessFile(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  return (
    await client.post<IUploadAndProcessFile>("/pdf/process", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
  ).data;
}
interface IGetTables {
  tables: {
    id: string;
    db_name: string;
    name: string;
    valid: boolean;
  }[];
}

export async function getTables() {
  return (await client.get<IGetTables>("/tables")).data;
}

interface IApproveTable {
  message: string;
}
export async function approveTable(table_id: string) {
  return await client.put<IApproveTable>("/tables/set-valid", null, {
    params: { table_id },
  });
}

interface IRejectTable {
  message: string;
}
export async function rejectTable(table_id: string) {
  return await client.put<IRejectTable>("/tables/set-invalid", null, {
    params: { table_id },
  });
}
