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
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { Mapping } from "@/types/db";

export default function AllStudents() {
  const queryClient = useQueryClient();
  const { tableID } = useTableStore();
  const searchState = useSearchStore();

  const studentsQuery = useQuery({
    queryKey: ["students", searchState.page, tableID],
    queryFn: () =>
      getStudents(tableID, searchState.searchTerm, searchState.page),
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

  return (
    <Card>
      <CardHeader>
        <h3 className="text-xl font-semibold">All Students</h3>
      </CardHeader>
      <CardContent className="space-y-4 min-h-[500px]">
        <div className="flex justify-between">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search students..."
              className="pl-8 w-full"
              value={searchState.searchTerm}
              onChange={(e) => {
                searchState.setSearchTerm(e.target.value);
                queryClient.invalidateQueries({
                  queryKey: ["students", searchState.page, tableID],
                });
              }}
            />
          </div>
        </div>
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
          {studentsQuery.data && (
            <div className="text-muted-foreground text-sm">
              Total Students {studentsQuery.data.total_students}
            </div>
          )}
          {(studentsQuery.isLoading || !studentsQuery.data) && (
            <Skeleton className="h-10 w-[100px]" />
          )}

          <div className="space-x-4">
            <Button
              variant={"outline"}
              className="cursor-pointer"
              onClick={() => {
                searchState.setPage(searchState.page - 1);
              }}
              disabled={searchState.page == 1}
            >
              Previous
            </Button>
            <Button
              className="cursor-pointer"
              onClick={() => {
                searchState.setPage(searchState.page + 1);
              }}
            >
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
