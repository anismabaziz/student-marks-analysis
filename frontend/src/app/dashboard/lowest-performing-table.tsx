import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getLowestPerformingStudentsOverall } from "@/services/students";
import useTableStore from "@/store/table-store";
import { useQuery } from "@tanstack/react-query";
import { TrendingDown } from "lucide-react";
export default function TopPerformingTable() {
  const { tableName } = useTableStore();

  const TopPerformingTableQuery = useQuery({
    queryKey: ["lowest_performing", "moyenne_du_semestre", tableName],
    queryFn: () => getLowestPerformingStudentsOverall(tableName),
    enabled: !!tableName,
  });

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 px-2 mb-2">
        <TrendingDown className="h-4 w-4 text-red-600" />
        <h3 className="font-medium text-sm">Lowest Performing Students</h3>
      </div>
      <div className="rounded-md border">
        {TopPerformingTableQuery.data && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Name</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Moyenne Du Semestre</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {TopPerformingTableQuery.data.students.map((student) => {
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
        {TopPerformingTableQuery.isLoading && (
          <Skeleton className="h-[200px]" />
        )}
      </div>
    </div>
  );
}
