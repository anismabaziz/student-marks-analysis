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

const chartConfig = {
  desktop: {
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
    <div className="flex items-center justify-center mt-15">
      <ChartContainer config={chartConfig} className="min-h-[200px] w-1/2">
        <BarChart accessibilityLayer data={chartData}>
          <Legend layout="horizontal" align="right" verticalAlign="top" />
          <CartesianGrid strokeDasharray="3 3" stroke="#D1D5DB" />
          <XAxis
            dataKey="class"
            label={{
              value: "Grade Ranges",
              position: "insideBottom",
              offset: -5,
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
            fill="var(--color-desktop)"
            radius={4}
            label={{ position: "top" }}
            animationDuration={1000}
          />
        </BarChart>
      </ChartContainer>
    </div>
  );
}
