import { useQuery } from "@tanstack/react-query";
import { columns } from "./app/dashboard/students/columns";
import { DataTable } from "./app/dashboard/students/data-table";
import { getStudents } from "./services/students";
import useSearchStore from "./store/search-store";
import Dashboard from "./app/dashboard/page";

export default function App() {
  /* const { searchTerm, page } = useSearchStore();

  const { data, isLoading, isSuccess } = useQuery({
    queryKey: ["students", searchTerm, page],
    queryFn: () => getStudents(searchTerm, page),
  });

  return (
    <div className="container mx-auto py-10">
      {isLoading && <div>Loading....</div>}
      {isSuccess && <DataTable columns={columns} data={data.data} />}
    </div>
  ); */

  return (
    <>
      <Dashboard />
    </>
  );
}
