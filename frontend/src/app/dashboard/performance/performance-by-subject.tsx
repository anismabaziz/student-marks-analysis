import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectContent,
} from "@/components/ui/select";
import {
  getTopPerformingStudents,
  getLowestPerformingStudents,
} from "@/services/stats";
import { getRelevantMappings } from "@/services/mappings";
import { useQuery } from "@tanstack/react-query";
import useTableStore from "@/store/table-store";
import usePerformanceStore from "@/store/performance-store";
import { useEffect } from "react";
import TopPerformingTable from "./top-performing-table";
import LowestPerformingTable from "./lowest-performing-table";
import { Skeleton } from "@/components/ui/skeleton";

export default function PerformanceBySubject() {
  const { tableID } = useTableStore();
  const { module, setModule } = usePerformanceStore();

  const topPerformingTableQuery = useQuery({
    queryKey: ["top-perfoming", module, tableID],
    queryFn: () => getTopPerformingStudents(tableID, module),
    enabled: !!tableID && !!module,
  });

  const lowestPerformingTableQuery = useQuery({
    queryKey: ["lowest_performing", module, tableID],
    queryFn: () => getLowestPerformingStudents(tableID, module),
    enabled: !!tableID && !!module,
  });

  const relevantMappingsQuery = useQuery({
    queryKey: ["relevant-cols", tableID],
    queryFn: () => getRelevantMappings(tableID),
    enabled: !!tableID,
  });

  useEffect(() => {
    if (relevantMappingsQuery.data) {
      setModule(
        relevantMappingsQuery.data.relevant_mappings.filter(
          (mapping) => mapping.db_name != "name" && mapping.db_name != "code"
        )[0].db_name
      );
    }
  }, [relevantMappingsQuery.data, setModule]);

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        {relevantMappingsQuery.data && (
          <Select value={module} onValueChange={(value) => setModule(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {relevantMappingsQuery.data.relevant_mappings
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
        {(relevantMappingsQuery.isLoading || !relevantMappingsQuery.data) && (
          <Skeleton className="w-[180px] h-[30px]" />
        )}
      </div>

      <div className="space-y-4">
        {topPerformingTableQuery.data && (
          <TopPerformingTable
            students={topPerformingTableQuery.data?.students}
            module={
              relevantMappingsQuery.data?.relevant_mappings.find(
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
              relevantMappingsQuery.data?.relevant_mappings.find(
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
