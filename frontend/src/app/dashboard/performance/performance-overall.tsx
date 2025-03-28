import { useQuery } from "@tanstack/react-query";
import useTableStore from "@/store/table-store";
import {
  getTopPerformingStudents,
  getLowestPerformingStudents,
} from "@/services/stats";
import { getRelevantMappings } from "@/services/mappings";
import TopPerformingTable from "./top-performing-table";
import { Skeleton } from "@/components/ui/skeleton";
import LowestPerformingTable from "./lowest-performing-table";

export default function PerformanceOverall() {
  const { tableID } = useTableStore();
  const topPerformingTableQuery = useQuery({
    queryKey: ["top-perfoming", "moyenne_du_semestre", tableID],
    queryFn: () => getTopPerformingStudents(tableID, "moyenne_du_semestre"),
    enabled: !!tableID,
  });
  const lowestPerformingTableQuery = useQuery({
    queryKey: ["lowest-performing", "moyenne_du_semestre", tableID],
    queryFn: () => getLowestPerformingStudents(tableID, "moyenne_du_semestre"),
    enabled: !!tableID,
  });

  const relevantMappingsQuery = useQuery({
    queryKey: ["relevant-cols", tableID],
    queryFn: () => getRelevantMappings(tableID),
    enabled: !!tableID,
  });

  return (
    <>
      {topPerformingTableQuery.data && relevantMappingsQuery.data && (
        <TopPerformingTable
          students={topPerformingTableQuery.data.students}
          module={
            relevantMappingsQuery.data.relevant_mappings.find(
              (mapping) => mapping.db_name === "moyenne_du_semestre"
            )?.name as string
          }
          moduleDb={topPerformingTableQuery.data.module}
        />
      )}
      {(topPerformingTableQuery.isLoading || !topPerformingTableQuery.data) && (
        <Skeleton className="h-[200px]" />
      )}
      {lowestPerformingTableQuery.data && relevantMappingsQuery.data && (
        <LowestPerformingTable
          students={lowestPerformingTableQuery.data.students}
          module={
            relevantMappingsQuery.data.relevant_mappings.find(
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
