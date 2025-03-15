import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getTopPerformingStudentsOverall } from "@/services/students";
import { useQuery } from "@tanstack/react-query";
import { TrendingUp } from "lucide-react";
export default function TopPerformingTable() {
  const { data } = useQuery({
    queryKey: ["top_perfoming", "moyenne_semestre"],
    queryFn: getTopPerformingStudentsOverall,
  });

  console.log(data);

  if (!data) return <div>Loading....</div>;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 px-2 mb-2">
        <TrendingUp className="h-4 w-4 text-green-600" />
        <h3 className="font-medium text-sm">Top Performing Students</h3>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Name</TableHead>
              <TableHead>Code</TableHead>
              <TableHead className="text-center">Moyenne Semestre</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.data.map((student) => {
              return (
                <TableRow key={student.code}>
                  <TableCell className="font-medium">{student.name}</TableCell>
                  <TableCell>{student.code}</TableCell>
                  <TableCell className="text-center">
                    {student.moyenne_semestre}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
