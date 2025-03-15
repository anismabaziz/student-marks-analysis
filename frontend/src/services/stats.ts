import axiosClient from "./client";

export async function getStats(module: string) {
  return (
    await axiosClient.get("/students/stats", { params: { column: module } })
  ).data;
}

export async function getMappings() {
  return (await axiosClient.get("/students/mappings")).data;
}
