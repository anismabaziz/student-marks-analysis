import { Table } from "@/types/db";
import axiosClient from "./client";

interface IGetTables {
  tables: Table[];
}
export async function getTables() {
  return (await axiosClient.get<IGetTables>("/tables")).data;
}
