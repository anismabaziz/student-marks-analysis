import useSearchStore from "@/store/search-store";
import { useQuery } from "@tanstack/react-query";
import { getStudents } from "@/services/students";
import { columns } from "./students/columns";
import { DataTable } from "./students/data-table";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function AllStudents() {
  const { searchTerm, page } = useSearchStore();

  const { data, isLoading, isSuccess } = useQuery({
    queryKey: ["students", searchTerm, page],
    queryFn: () => getStudents(searchTerm, page),
  });

  return (
    <Card>
      <CardHeader>
        <h3 className="text-xl font-semibold">All Students</h3>
      </CardHeader>
      <CardContent>
        {isLoading && <div>Loading....</div>}
        {isSuccess && <DataTable columns={columns} data={data.data} />}
      </CardContent>
    </Card>
  );
}
