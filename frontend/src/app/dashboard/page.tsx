import { useQuery } from "@tanstack/react-query";
import AllStudents from "./all-students";
import ClassStats from "./class-stats";
import StudentsPerformance from "./performance/students-performance";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { getTableNames } from "@/services/students";
import { Skeleton } from "@/components/ui/skeleton";
import useTableStore from "@/store/table-store";
import { useEffect } from "react";
import useStatsStore from "@/store/class-stats-store";
import StudentsCharts from "./charts/students-charts";

export default function Dashboard() {
  const tableNamesQuery = useQuery({
    queryKey: ["table-names"],
    queryFn: getTableNames,
  });

  const { setModule } = useStatsStore();
  const { tableName, setTableName } = useTableStore();

  useEffect(() => {
    if (tableNamesQuery.data) {
      setTableName(tableNamesQuery.data.tables[0].table_name);
    }
  }, [tableNamesQuery.data, setTableName]);

  return (
    <div className="container mx-auto py-10 space-y-5 px-5">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Student Grades Dashboard</h1>
        {tableNamesQuery.data && (
          <Select
            onValueChange={(value) => {
              setTableName(value);
              setModule("moyenne_du_semestre");
            }}
            value={tableName}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {tableNamesQuery.data.tables.map((table, idx) => {
                return (
                  <SelectItem value={table.table_name} key={idx}>
                    {table.table_name}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        )}
        {tableNamesQuery.isLoading && (
          <Skeleton className="w-[180px] h-[30px]" />
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ClassStats />
        <StudentsPerformance />
      </div>
      <AllStudents />
      <StudentsCharts />
    </div>
  );
}
