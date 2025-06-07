import useSearchStore from "@/store/search-store";
import { useQuery } from "@tanstack/react-query";
import { getStudents } from "@/services/students";
import { getRelevantMappings } from "@/services/mappings";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import useTableStore from "@/store/table-store";
import { DataTable } from "./data-table";
import { generateColumns } from "./columns";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Mapping } from "@/types/db";

export default function AllStudents() {
  const { tableID } = useTableStore();
  const searchState = useSearchStore();

  const studentsQuery = useQuery({
    queryKey: ["students", tableID],
    queryFn: () => getStudents(tableID, searchState.searchTerm),
    enabled: !!tableID,
  });

  const relevantMappingsQuery = useQuery({
    queryKey: ["relevant-mappings", tableID],
    queryFn: () => getRelevantMappings(tableID),
    enabled: !!tableID,
  });

  const [mappings, setMappings] = useState<Mapping[]>([]);

  useEffect(() => {
    if (relevantMappingsQuery.data) {
      setMappings(relevantMappingsQuery.data.relevant_mappings);
    }
  }, [relevantMappingsQuery.data]);

  const columns = generateColumns(mappings);

  console.log(columns);

  return (
    <Card>
      <CardHeader>
        <h3 className="text-xl font-semibold">All Students</h3>
      </CardHeader>
      <CardContent className="space-y-4 min-h-[500px]">
        {studentsQuery.data && relevantMappingsQuery.data && (
          <DataTable columns={columns} data={studentsQuery.data.students} />
        )}
        {(studentsQuery.isLoading ||
          relevantMappingsQuery.isLoading ||
          !studentsQuery.data ||
          !relevantMappingsQuery.data) && (
          <Skeleton className="w-full h-[400px] rounded" />
        )}
        <div className="flex justify-between gap-4 items-center">
          {(studentsQuery.isLoading || !studentsQuery.data) && (
            <Skeleton className="h-10 w-[100px]" />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
