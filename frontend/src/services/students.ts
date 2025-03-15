import axiosClient from "./client";

export async function getStudents() {
  return (await axiosClient.get("/students")).data;
}
