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
import { getRelevantCols } from "@/services/students";
import useTableStore from "@/store/table-store";
import { Skeleton } from "@/components/ui/skeleton";

export default function ClassStats() {
  const { module, setModule } = useStatsStore();
  const { tableName } = useTableStore();

  const relevantColsQuery = useQuery({
    queryKey: ["relevant-cols", tableName],
    queryFn: () => getRelevantCols(tableName),
    enabled: !!tableName,
  });

  const statsQuery = useQuery({
    queryKey: ["stats", module, tableName],
    queryFn: () => getStats(tableName, module),
    enabled: !!tableName,
  });

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Class Statistics</h3>
        {relevantColsQuery.data && (
          <Select value={module} onValueChange={(value) => setModule(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {relevantColsQuery.data.mappings
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
        {relevantColsQuery.isLoading && (
          <Skeleton className="w-[180px] h-[30px]" />
        )}
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4">
        {statsQuery.data && (
          <>
            <ClassStatsCard
              metric={"Average"}
              value={statsQuery.data.average_grade}
              quality={
                relevantColsQuery.data?.mappings.find(
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
        {statsQuery.isLoading &&
          [1, 2, 3, 4].map((ele) => {
            return <Skeleton key={ele} className="w-full h-[150px] rounded" />;
          })}
      </CardContent>
    </Card>
  );
}
