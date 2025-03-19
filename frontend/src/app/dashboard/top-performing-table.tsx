import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getTopPerformingStudentsOverall } from "@/services/students";
import useTableStore from "@/store/table-store";
import { useQuery } from "@tanstack/react-query";
import { TrendingUp } from "lucide-react";
export default function TopPerformingTable() {
  const { tableName } = useTableStore();

  const topPerformingTableQuery = useQuery({
    queryKey: ["top_perfoming", "moyenne_semestre", tableName],
    queryFn: () => getTopPerformingStudentsOverall(tableName),
    enabled: !!tableName,
  });

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 px-2 mb-2">
        <TrendingUp className="h-4 w-4 text-green-600" />
        <h3 className="font-medium text-sm">Top Performing Students</h3>
      </div>
      <div className="rounded-md border">
        {topPerformingTableQuery.data && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Moyenne Du Semestre</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topPerformingTableQuery.data.students.map((student) => {
                return (
                  <TableRow key={student.code}>
                    <TableCell className="font-medium">
                      {student.name}
                    </TableCell>
                    <TableCell>{student.code}</TableCell>
                    <TableCell>{student.moyenne_du_semestre}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
        {(topPerformingTableQuery.isLoading ||
          !topPerformingTableQuery.data) && <Skeleton className="h-[200px]" />}
      </div>
    </div>
  );
}
