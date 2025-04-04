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
