import { useQuery } from "@tanstack/react-query";
import useTableStore from "@/store/table-store";
import {
  getTopPerformingStudents,
  getRelevantCols,
  getLowestPerformingStudents,
} from "@/services/students";
import TopPerformingTable from "./top-performing-table";
import { Skeleton } from "@/components/ui/skeleton";
import LowestPerformingTable from "./lowest-performing-table";

export default function PerformanceOverall() {
  const { tableName } = useTableStore();
  const topPerformingTableQuery = useQuery({
    queryKey: ["top_perfoming", "moyenne_du_semestre", tableName],
    queryFn: () => getTopPerformingStudents(tableName, "moyenne_du_semestre"),
    enabled: !!tableName,
  });
  const lowestPerformingTableQuery = useQuery({
    queryKey: ["lowest_performing", "moyenne_du_semestre", tableName],
    queryFn: () =>
      getLowestPerformingStudents(tableName, "moyenne_du_semestre"),
    enabled: !!tableName,
  });

  const relevantColsQuery = useQuery({
    queryKey: ["relevant-cols", tableName],
    queryFn: () => getRelevantCols(tableName),
    enabled: !!tableName,
  });

  return (
    <>
      {topPerformingTableQuery.data && relevantColsQuery.data && (
        <TopPerformingTable
          students={topPerformingTableQuery.data.students}
          module={
            relevantColsQuery.data?.mappings.find(
              (mapping) => mapping.db_name === "moyenne_du_semestre"
            )?.name as string
          }
          moduleDb={topPerformingTableQuery.data.module}
        />
      )}
      {(topPerformingTableQuery.isLoading || !topPerformingTableQuery.data) && (
        <Skeleton className="h-[200px]" />
      )}
      {lowestPerformingTableQuery.data && relevantColsQuery.data && (
        <LowestPerformingTable
          students={lowestPerformingTableQuery.data.students}
          module={
            relevantColsQuery.data?.mappings.find(
              (mapping) => mapping.db_name === "moyenne_du_semestre"
            )?.name as string
          }
          moduleDb={lowestPerformingTableQuery.data.module}
        />
      )}
      {(lowestPerformingTableQuery.isLoading ||
        !lowestPerformingTableQuery.data) && <Skeleton className="h-[200px]" />}
    </>
  );
}
