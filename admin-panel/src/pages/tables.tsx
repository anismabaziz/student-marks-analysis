import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { ArrowLeft, Search } from "lucide-react";
import { Link } from "react-router";
import { Input } from "@/components/ui/input";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { approveTable, getTables, rejectTable } from "@/services/requests";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function Tables() {
  const tablesQuery = useQuery({ queryKey: ["tables"], queryFn: getTables });
  const queryClient = useQueryClient();
  const approveTableMutation = useMutation({
    mutationFn: approveTable,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tables"] });
    },
  });
  const rejectTableMutation = useMutation({
    mutationFn: rejectTable,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tables"] });
    },
  });

  const validBadge = <Badge className="bg-green-500 rounded-4xl">Valid</Badge>;
  const invalidBadge = (
    <Badge className="bg-red-500 rounded-4xl">Invalid</Badge>
  );

  return (
    <div>
      {/* navbar */}
      <div className="py-4 border-b border">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant={"ghost"}
              size={"lg"}
              className="cursor-pointer"
              asChild
            >
              <Link to="/">
                <ArrowLeft />
              </Link>
            </Button>
            <h1 className="text-2xl font-semibold">Manage Tables</h1>
          </div>
        </div>
      </div>
      {/* tables card */}
      <div className="container mx-auto py-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              Extracted Tables
            </CardTitle>
            <CardDescription>
              View and validate tables extracted from PDF files
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Search tables */}
            <div className="mb-4 flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search tables..."
                  className="pl-8"
                />
              </div>
              <Button variant="outline" asChild>
                <Link to="/upload">Upload New PDF</Link>
              </Button>
            </div>
            {/* View tables */}
            <div className="border rounded">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Db Name</TableHead>
                    <TableHead>Valid</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tablesQuery.data &&
                    tablesQuery.data.tables.map((table) => {
                      return (
                        <TableRow>
                          <TableCell>{table.name}</TableCell>
                          <TableCell>{table.db_name}</TableCell>
                          <TableCell>
                            {table.valid ? validBadge : invalidBadge}
                          </TableCell>
                          <TableCell>
                            {table.valid ? (
                              <Button
                                className="bg-red-500 cursor-pointer"
                                onClick={() =>
                                  rejectTableMutation.mutate(table.id)
                                }
                              >
                                Reject
                              </Button>
                            ) : (
                              <Button
                                className="bg-green-500 cursor-pointer"
                                onClick={() =>
                                  approveTableMutation.mutate(table.id)
                                }
                              >
                                Approve
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
