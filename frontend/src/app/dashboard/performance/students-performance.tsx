import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PerformanceOverall from "./performance-overall";
import PerformanceBySubject from "./performance-by-subject";

export default function StudentsPerformance() {
  return (
    <Card className="min-h-[700px]">
      <CardHeader>
        <h3 className="text-xl font-semibold">Students Performance</h3>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overall" className="">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="overall" className="w-full">
              Overall
            </TabsTrigger>
            <TabsTrigger value="by_subject">By Subject</TabsTrigger>
          </TabsList>
          <TabsContent value="overall" className="space-y-4">
            <PerformanceOverall />
          </TabsContent>
          <TabsContent value="by_subject">
            <PerformanceBySubject />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
