import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getGradeDistribution } from "@/services/charts";
import { useQuery } from "@tanstack/react-query";
import GradeDistribution from "./charts/grade-distribution";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
export default function StudentsCharts() {
  const { data: grade_distribution_data } = useQuery({
    queryKey: ["grade-distributions"],
    queryFn: getGradeDistribution,
  });
  return (
    <Card>
      <CardHeader>
        <h3 className="text-xl font-semibold">Grade Analytics</h3>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="grades_distributions" className="">
          <TabsList className="grid w-full grid-cols-4 mb-4">
            <TabsTrigger value="grades_distributions">
              Grades Distribution
            </TabsTrigger>
            <TabsTrigger value="subject_averages">Subject Averages</TabsTrigger>
            <TabsTrigger value="performance_trends">
              Performance Trends
            </TabsTrigger>
            <TabsTrigger value="students_performance">
              Students Performance
            </TabsTrigger>
          </TabsList>
          <TabsContent value="grades_distributions" className="space-y-4">
            {grade_distribution_data && (
              <GradeDistribution
                counts={grade_distribution_data.counts}
                bins={grade_distribution_data.bins}
              />
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
