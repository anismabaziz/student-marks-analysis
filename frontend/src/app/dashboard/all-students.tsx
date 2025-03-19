import useSearchStore from "@/store/search-store";
import { useQuery } from "@tanstack/react-query";
import { getStudentsTable, getRelevantCols } from "@/services/students";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import useTableStore from "@/store/table-store";
import { DataTable } from "./students/data-table";
import { generateColumns } from "./students/columns";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Search } from "lucide-react";
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
                  queryKey: ["students", searchState.page, tableName],
                });
              }}
            />
          </div>
        </div>
        {studentsTableQuery.data && relevantColsQuery.data && (
          <DataTable columns={columns} data={studentsTableQuery.data.records} />
        )}
        {(studentsTableQuery.isLoading ||
          relevantColsQuery.isLoading ||
          !studentsTableQuery.data ||
          !relevantColsQuery.data) && (
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
