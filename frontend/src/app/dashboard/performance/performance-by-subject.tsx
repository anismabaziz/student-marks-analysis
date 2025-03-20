import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectContent,
} from "@/components/ui/select";
import {
  getTopPerformingStudents,
  getRelevantCols,
  getLowestPerformingStudents,
} from "@/services/students";
import { useQuery } from "@tanstack/react-query";
import useTableStore from "@/store/table-store";
import usePerformanceStore from "@/store/performance-store";
import { useEffect } from "react";
import TopPerformingTable from "./top-performing-table";
import LowestPerformingTable from "./lowest-performing-table";
import { Skeleton } from "@/components/ui/skeleton";

export default function PerformanceBySubject() {
  const { tableName } = useTableStore();
  const { module, setModule } = usePerformanceStore();

  const topPerformingTableQuery = useQuery({
    queryKey: ["top_perfoming", module, tableName],
    queryFn: () => getTopPerformingStudents(tableName, module),
    enabled: !!tableName && !!module,
  });

  const lowestPerformingTableQuery = useQuery({
    queryKey: ["lowest_performing", module, tableName],
    queryFn: () => getLowestPerformingStudents(tableName, module),
    enabled: !!tableName && !!module,
  });

  const relevantColsQuery = useQuery({
    queryKey: ["relevant-cols", tableName],
    queryFn: () => getRelevantCols(tableName),
    enabled: !!tableName,
  });

  useEffect(() => {
    if (relevantColsQuery.data) {
      setModule(
        relevantColsQuery.data.mappings.filter(
          (mapping) => mapping.db_name != "name" && mapping.db_name != "code"
        )[0].db_name
      );
    }
  }, [relevantColsQuery.data, setModule]);

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        {relevantColsQuery.data && (
          <Select value={module} onValueChange={(value) => setModule(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {relevantColsQuery.data.mappings
                .filter(
                  (col) =>
                    col.db_name !== "name" &&
                    col.db_name !== "code" &&
                    col.db_name != "moyenne_du_semestre"
                )
                .map((col, idx) => {
                  return (
                    <SelectItem key={idx} value={col.db_name}>
                      {col.name}
                    </SelectItem>
                  );
                })}
            </SelectContent>
          </Select>
        )}
        {(relevantColsQuery.isLoading || !relevantColsQuery.data) && (
          <Skeleton className="w-[180px] h-[30px]" />
        )}
      </div>

      <div className="space-y-4">
        {topPerformingTableQuery.data && (
          <TopPerformingTable
            students={topPerformingTableQuery.data?.students}
            module={
              relevantColsQuery.data?.mappings.find(
                (mapping) => mapping.db_name === module
              )?.name as string
            }
            moduleDb={module}
          />
        )}
        {(topPerformingTableQuery.isLoading ||
          !topPerformingTableQuery.data) && <Skeleton className="h-[200px]" />}
        {lowestPerformingTableQuery.data && (
          <LowestPerformingTable
            students={lowestPerformingTableQuery.data?.students}
            module={
              relevantColsQuery.data?.mappings.find(
                (mapping) => mapping.db_name === module
              )?.name as string
            }
            moduleDb={module}
          />
        )}
        {(lowestPerformingTableQuery.isLoading ||
          !lowestPerformingTableQuery.data) && (
          <Skeleton className="h-[200px]" />
        )}
      </div>
    </div>
  );
}
