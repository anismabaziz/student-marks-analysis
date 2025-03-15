import { useQuery } from "@tanstack/react-query";
import { columns } from "./app/students/columns";
import { DataTable } from "./app/students/data-table";
import { getStudents } from "./services/students";
import useSearchStore from "./store/search-store";

export default function App() {
  const { searchTerm, page } = useSearchStore();

  const { data, isLoading, isSuccess } = useQuery({
    queryKey: ["students", searchTerm, page],
    queryFn: () => getStudents(searchTerm, page),
  });

  return (
    <div className="container mx-auto py-10">
      {isLoading && <div>Loading....</div>}
      {isSuccess && <DataTable columns={columns} data={data.data} />}
    </div>
  );
}
