import { TrendingUp } from "lucide-react";
import { PolarAngleAxis, PolarGrid, Radar, RadarChart, Legend } from "recharts";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  average: {
    label: "Average",
    color: "#2563eb",
  },
} satisfies ChartConfig;

interface SubjectAveragesProps {
  averages: { average: number; name: string | undefined }[];
}

export default function SubjectAverages({ averages }: SubjectAveragesProps) {
  return (
    <Card>
      <CardContent className="pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[400px]"
        >
          <RadarChart data={averages}>
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <PolarAngleAxis dataKey="name" domain={[0, 20]} tick={false} />
            <Legend layout="horizontal" verticalAlign="top" align="center" />
            <PolarGrid />
            <Radar
              dataKey="average"
              fill="var(--color-average)"
              fillOpacity={0.6}
            />
          </RadarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Semester Performance <TrendingUp className="h-4 w-4" />
        </div>
      </CardFooter>
    </Card>
  );
}
