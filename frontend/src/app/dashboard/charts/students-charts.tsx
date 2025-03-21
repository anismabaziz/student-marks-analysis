import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getGradeDistribution, getModulesAverages } from "@/services/charts";
import { getRelevantCols } from "@/services/students";
import { useQuery } from "@tanstack/react-query";
import GradeDistribution from "./grade-distribution";
import useTableStore from "@/store/table-store";
import SubjectAverages from "./subject-averages";

export default function StudentsCharts() {
  const { tableName } = useTableStore();
  const gradesDistributionQuery = useQuery({
    queryKey: ["grades-distributions", tableName],
    queryFn: () => getGradeDistribution(tableName),
    enabled: !!tableName,
  });
  const modulesAveragesQuery = useQuery({
    queryKey: ["modules-averages", tableName],
    queryFn: () => getModulesAverages(tableName),
    enabled: !!tableName,
  });
  const relevantColsQuery = useQuery({
    queryKey: ["relevant-cols", tableName],
    queryFn: () => getRelevantCols(tableName),
    enabled: !!tableName,
  });

  const transformedAverages = modulesAveragesQuery.data?.averages.map(
    (module) => {
      const column = relevantColsQuery.data?.mappings.find(
        (mapping) => mapping.db_name === module.name
      );
      return { name: column?.name, average: module.average };
    }
  );

  return (
    <Card className="min-h-[800px]">
      <CardHeader>
        <h3 className="text-xl font-semibold">Grades Analytics</h3>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
          {gradesDistributionQuery.data && (
            <GradeDistribution
              counts={gradesDistributionQuery.data.counts}
              bins={gradesDistributionQuery.data.bins}
            />
          )}
          {modulesAveragesQuery.data &&
            relevantColsQuery.data &&
            transformedAverages && (
              <SubjectAverages averages={transformedAverages} />
            )}
        </div>
      </CardContent>
    </Card>
  );
}
