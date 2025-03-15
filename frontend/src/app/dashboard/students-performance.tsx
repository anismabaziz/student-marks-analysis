import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TopPerformingTable from "./top-performing-table";
import LowestPerformingTable from "./lowest-performing-table";
export default function StudentsPerformance() {
  return (
    <Card>
      <CardHeader>
        <h3 className="text-xl font-semibold">Students Performance</h3>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overall" className="">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="overall">Overall</TabsTrigger>
            <TabsTrigger value="by_subject">By Subject</TabsTrigger>
          </TabsList>
          <TabsContent value="overall" className="space-y-4">
            <TopPerformingTable />
            <LowestPerformingTable />
          </TabsContent>
          <TabsContent value="password">
            <Card>
              <CardHeader>
                <CardTitle>Password</CardTitle>
                <CardDescription>
                  Change your password here. After saving, you'll be logged out.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="current">Current password</Label>
                  <Input id="current" type="password" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="new">New password</Label>
                  <Input id="new" type="password" />
                </div>
              </CardContent>
              <CardFooter>
                <Button>Save password</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
