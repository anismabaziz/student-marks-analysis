import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getGradeDistribution, getModulesAverages } from "@/services/charts";
import { getRelevantMappings } from "@/services/mappings";
import { useQuery } from "@tanstack/react-query";
import GradeDistribution from "./grade-distribution";
import useTableStore from "@/store/table-store";
import SubjectAverages from "./subject-averages";

export default function StudentsCharts() {
  const { tableID } = useTableStore();
  const gradesDistributionQuery = useQuery({
    queryKey: ["grades-distributions", tableID],
    queryFn: () => getGradeDistribution(tableID),
    enabled: !!tableID,
  });
  const modulesAveragesQuery = useQuery({
    queryKey: ["modules-averages", tableID],
    queryFn: () => getModulesAverages(tableID),
    enabled: !!tableID,
  });
  const relevantColsQuery = useQuery({
    queryKey: ["relevant-mappings", tableID],
    queryFn: () => getRelevantMappings(tableID),
    enabled: !!tableID,
  });

  const transformedAverages = modulesAveragesQuery.data?.averages.map(
    (module) => {
      const column = relevantColsQuery.data?.relevant_mappings.find(
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
