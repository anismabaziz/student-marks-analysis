import {
  Bar,
  BarChart,
  XAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  YAxis,
} from "recharts";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
const chartConfig = {
  distribution: {
    label: "Desktop",
    color: "#2563eb",
  },
} satisfies ChartConfig;

interface GradeDistributionProps {
  counts: number[];
  bins: [number, number][];
}
export default function GradeDistribution({
  counts,
  bins,
}: GradeDistributionProps) {
  const bins_transform = bins.map((bin) => `${bin[0]}-${bin[1]}`);
  const chartData = bins_transform.map((bin, idx) => {
    return {
      class: bin,
      count: counts[idx],
    };
  });

  return (
    <Card>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[400px] md:w-1/2"
        >
          <BarChart accessibilityLayer data={chartData}>
            <Legend layout="horizontal" align="right" verticalAlign="top" />
            <CartesianGrid strokeDasharray="3 3" stroke="#D1D5DB" />
            <XAxis
              dataKey="class"
              label={{
                value: "Grade Ranges",
                position: "insideBottom",
                offset: 0,
              }}
            />
            <YAxis
              label={{
                value: "Number of Students",
                angle: -90,
                position: "insideLeft",
              }}
            />
            <Tooltip />
            <Bar
              dataKey="count"
              fill="var(--color-distribution)"
              radius={4}
              label={{ position: "top" }}
              animationDuration={1000}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Showing Grades Distribution <TrendingUp className="h-4 w-4" />
        </div>
      </CardFooter>
    </Card>
  );
}
