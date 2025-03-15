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
import { getMappings, getStats } from "@/services/stats";
import useStatsStore from "@/store/class-stats-store";

export default function ClassStats() {
  const { module, setModule } = useStatsStore();

  const { data: stats_data } = useQuery({
    queryKey: ["stats", module],
    queryFn: () => getStats(module),
  });

  const { data: mappings_data } = useQuery({
    queryKey: ["mappings"],
    queryFn: getMappings,
  });

  if (!stats_data || !mappings_data) return <div>Loading...</div>;

  console.log(stats_data);

  const statsFields = [
    "phy1",
    "asd1",
    "algebre1",
    "analyse1",
    "moyenne_semestre",
    "sm1",
    "le1",
    "est",
  ];

  const selectMappings = statsFields.map((field) => {
    const mappings = mappings_data.mappings;
    const mapping = mappings.find((mapping) => mapping.db_name == field);
    return {
      name: mapping.table_name,
      value: mapping.db_name,
    };
  });

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Class Statistics</h3>
        <Select
          defaultValue={module}
          onValueChange={(value) => setModule(value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {selectMappings.map((mapping, idx) => {
              return (
                <SelectItem key={idx} value={mapping.value}>
                  {mapping.name}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4">
        <ClassStatsCard
          metric={"Average"}
          value={stats_data.average_grade}
          quality={
            mappings_data.mappings.find((mapping) => mapping.db_name == module)
              .table_name
          }
        />
        <ClassStatsCard
          metric={"Highest"}
          value={stats_data.max_grade}
          quality={"Highest grade"}
        />
        <ClassStatsCard
          metric={"Lowest"}
          value={stats_data.min_grade}
          quality={"Lowest grade"}
        />
        <ClassStatsCard
          metric={"Passing"}
          value={stats_data.passing_rate}
          quality={"Pass rate"}
        />
      </CardContent>
    </Card>
  );
}
