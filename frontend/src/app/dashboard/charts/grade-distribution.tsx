import {
  Bar,
  BarChart,
  XAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { useInView } from "react-intersection-observer";

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

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  return (
    <div className="flex items-center justify-center mt-15" ref={ref}>
      <ChartContainer
        config={chartConfig}
        className="min-h-[300px] w-full max-w-[900px]"
      >
        {inView ? (
          <ResponsiveContainer width={"100%"} height={300}>
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
          </ResponsiveContainer>
        ) : (
          <></>
        )}
      </ChartContainer>
    </div>
  );
}
