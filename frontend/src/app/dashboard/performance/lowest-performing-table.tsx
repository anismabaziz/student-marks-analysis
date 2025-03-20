import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TrendingDown } from "lucide-react";

interface LowestPerformingTableProps {
  module: string;
  moduleDb: string;
  students: { name: string; code: string; [key: string]: unknown }[];
}
export default function LowestPerformingTable({
  students,
  module,
  moduleDb,
}: LowestPerformingTableProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 px-2 mb-2">
        <TrendingDown className="h-4 w-4 text-red-600" />
        <h3 className="font-medium text-sm">Lowest Performing Students</h3>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>{module}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((student) => {
              return (
                <TableRow key={student.code}>
                  <TableCell className="font-medium">{student.name}</TableCell>
                  <TableCell>{student.code}</TableCell>
                  <TableCell>{String(student[moduleDb])}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
