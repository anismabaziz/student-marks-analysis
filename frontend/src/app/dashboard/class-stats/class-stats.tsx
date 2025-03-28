import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ClassStatsCard from "./class-stats-card";
import { useQuery } from "@tanstack/react-query";
import { getStats } from "@/services/stats";
import useStatsStore from "@/store/class-stats-store";
import { getRelevantMappings } from "@/services/mappings";
import useTableStore from "@/store/table-store";
import { Skeleton } from "@/components/ui/skeleton";

export default function ClassStats() {
  const { module, setModule } = useStatsStore();
  const { tableID } = useTableStore();

  const relevantMappingsQuery = useQuery({
    queryKey: ["relevant-cols", tableID],
    queryFn: () => getRelevantMappings(tableID),
    enabled: !!tableID,
  });

  const statsQuery = useQuery({
    queryKey: ["stats", module, tableID],
    queryFn: () => getStats(tableID, module),
    enabled: !!tableID,
  });

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Class Statistics</h3>
        {relevantMappingsQuery.data && (
          <Select value={module} onValueChange={(value) => setModule(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {relevantMappingsQuery.data.relevant_mappings
                .filter(
                  (col) => col.db_name !== "name" && col.db_name !== "code"
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
      </CardHeader>
      <CardContent className="grid md:grid-cols-2 gap-4">
        {statsQuery.data && (
          <>
            <ClassStatsCard
              metric={"Average"}
              value={statsQuery.data.average_grade}
              quality={
                relevantMappingsQuery.data?.relevant_mappings.find(
                  (mapping) => mapping.db_name === module
                )?.name as string
              }
            />
            <ClassStatsCard
              metric={"Highest"}
              value={statsQuery.data.max_grade}
              quality={"Highest grade"}
            />
            <ClassStatsCard
              metric={"Lowest"}
              value={statsQuery.data.min_grade}
              quality={"Lowest grade"}
            />
            <ClassStatsCard
              metric={"Passing"}
              value={statsQuery.data.passing_rate}
              quality={"Pass rate"}
            />
          </>
        )}
        {(statsQuery.isLoading || !statsQuery.data) &&
          [1, 2, 3, 4].map((ele) => {
            return (
              <Skeleton key={ele} className="w-full h-[130px] rounded-lg" />
            );
          })}
      </CardContent>
    </Card>
  );
}
