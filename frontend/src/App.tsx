import { useQuery } from "@tanstack/react-query";
import { columns } from "./app/students/columns";
import { DataTable } from "./app/students/data-table";
import { getStudents } from "./services/students";

export default function App() {
  const { data, isLoading } = useQuery({
    queryKey: ["students"],
    queryFn: getStudents,
  });

  if (isLoading) return <div>Loading</div>;

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data.data} />
    </div>
  );
}
