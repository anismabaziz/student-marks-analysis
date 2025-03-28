import { useQuery } from "@tanstack/react-query";
import AllStudents from "./students/all-students";
import ClassStats from "./class-stats/class-stats";
import StudentsPerformance from "./performance/students-performance";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { getTables } from "@/services/tables";
import { Skeleton } from "@/components/ui/skeleton";
import useTableStore from "@/store/table-store";
import { useEffect } from "react";
import useStatsStore from "@/store/class-stats-store";
import StudentsCharts from "./charts/students-charts";

export default function Dashboard() {
  const tablesQuery = useQuery({
    queryKey: ["tables"],
    queryFn: getTables,
  });

  const { setModule } = useStatsStore();
  const { tableID, setTableID } = useTableStore();

  useEffect(() => {
    if (tablesQuery.data) {
      setTableID(tablesQuery.data.tables[0].id);
    }
  }, [tablesQuery.data, setTableID]);

  return (
    <div className="container mx-auto py-10 space-y-5 px-5">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Student Grades Dashboard</h1>
        {tablesQuery.data && (
          <Select
            onValueChange={(value) => {
              setTableID(value);
              setModule("moyenne_du_semestre");
            }}
            value={tableID}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {tablesQuery.data.tables.map((table, idx) => {
                return (
                  <SelectItem value={table.id} key={idx}>
                    {table.name}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        )}
        {tablesQuery.isLoading && <Skeleton className="w-[180px] h-[30px]" />}
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
