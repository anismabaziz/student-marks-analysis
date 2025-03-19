import useSearchStore from "@/store/search-store";
import { useQuery } from "@tanstack/react-query";
import { getStudentsTable, getRelevantCols } from "@/services/students";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import useTableStore from "@/store/table-store";
import { DataTable } from "./students/data-table";
import { generateColumns } from "./students/columns";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";

export default function AllStudents() {
  const queryClient = useQueryClient();
  const { tableName } = useTableStore();
  const searchState = useSearchStore();

  const studentsTableQuery = useQuery({
    queryKey: ["students", searchState.page, tableName],
    queryFn: () =>
      getStudentsTable(tableName, searchState.searchTerm, searchState.page),
    enabled: !!tableName,
  });

  const relevantColsQuery = useQuery({
    queryKey: ["relevant-cols", tableName],
    queryFn: () => getRelevantCols(tableName),
    enabled: !!tableName,
  });

  const [cols, setCols] = useState<
    {
      id: string;
      db_name: string;
      name: string;
    }[]
  >([]);

  useEffect(() => {
    if (relevantColsQuery.data) {
      setCols(relevantColsQuery.data.mappings);
    }
  }, [relevantColsQuery.data]);

  const columns = generateColumns(cols);

  return (
    <Card>
      <CardHeader>
        <h3 className="text-xl font-semibold">All Students</h3>
      </CardHeader>
      <CardContent className="space-y-4 min-h-[500px]">
        <div className="flex justify-end">
          <div className="flex items-center gap-4">
            <Input
              placeholder="Search Student"
              className="w-fit"
              value={searchState.searchTerm}
              onChange={(e) => {
                e.preventDefault();
                searchState.setSearchTerm(e.target.value);
                queryClient.invalidateQueries({
                  queryKey: ["students", searchState.page, tableName],
                });
              }}
            />
          </div>
        </div>
        {studentsTableQuery.data && relevantColsQuery.data && (
          <DataTable columns={columns} data={studentsTableQuery.data.records} />
        )}
        {studentsTableQuery.isLoading && relevantColsQuery.isLoading && (
          <Skeleton className="w-full h-[400px] rounded" />
        )}
        <div className="flex justify-end gap-4">
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
      </CardContent>
    </Card>
  );
}
