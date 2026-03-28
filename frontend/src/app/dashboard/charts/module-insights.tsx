import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { Mapping } from "@/types/db";
import { TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type StudentRow = Record<string, unknown>;

interface ModuleInsightsProps {
  students: StudentRow[];
  mappings: Mapping[];
}

interface ModuleStat {
  dbName: string;
  name: string;
  average: number;
  median: number;
  passRate: number;
  spread: number;
}

const chartConfig = {
  passRate: {
    label: "Pass rate",
    color: "#16a34a",
  },
} satisfies ChartConfig;

const excludedKeys = ["credit_ue", "moyenne_ue", "credits", "name", "code"];

function toNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const normalized = value.trim().replace(",", ".");
    if (!normalized) {
      return null;
    }
    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}

function calculateStats(values: number[]) {
  const sorted = [...values].sort((a, b) => a - b);
  const count = sorted.length;
  const average = sorted.reduce((sum, value) => sum + value, 0) / count;
  const median =
    count % 2 === 0
      ? (sorted[count / 2 - 1] + sorted[count / 2]) / 2
      : sorted[Math.floor(count / 2)];
  const passCount = sorted.filter((value) => value >= 10).length;
  const spread = sorted[count - 1] - sorted[0];

  return {
    average,
    median,
    passRate: (passCount / count) * 100,
    spread,
  };
}

function toModuleStats(students: StudentRow[], mappings: Mapping[]): ModuleStat[] {
  const metricMappings = mappings.filter(
    (mapping) => !excludedKeys.some((key) => mapping.db_name.includes(key))
  );

  return metricMappings
    .map((mapping) => {
      const values = students
        .map((student) => toNumber(student[mapping.db_name]))
        .filter((value): value is number => value !== null);

      if (!values.length) {
        return null;
      }

      const stats = calculateStats(values);

      return {
        dbName: mapping.db_name,
        name: mapping.name,
        average: stats.average,
        median: stats.median,
        passRate: stats.passRate,
        spread: stats.spread,
      };
    })
    .filter((module): module is ModuleStat => module !== null);
}

function round(value: number): number {
  return Math.round(value * 100) / 100;
}

export default function ModuleInsights({ students, mappings }: ModuleInsightsProps) {
  const moduleStats = toModuleStats(students, mappings);

  if (!moduleStats.length) {
    return null;
  }

  const strongest = [...moduleStats].sort((a, b) => b.average - a.average)[0];
  const toughest = [...moduleStats].sort((a, b) => a.passRate - b.passRate)[0];
  const widestSpread = [...moduleStats].sort((a, b) => b.spread - a.spread)[0];

  const passRateChartData = [...moduleStats]
    .sort((a, b) => a.passRate - b.passRate)
    .slice(0, 8)
    .map((module) => ({
      name: module.name,
      passRate: round(module.passRate),
    }));

  return (
    <Card>
      <CardContent className="space-y-5">
        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-lg border p-4">
            <p className="text-sm text-muted-foreground">Strongest module</p>
            <p className="mt-1 font-semibold">{strongest.name}</p>
            <p className="text-sm text-muted-foreground">
              Avg {round(strongest.average)}
            </p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="text-sm text-muted-foreground">Most challenging</p>
            <p className="mt-1 font-semibold">{toughest.name}</p>
            <p className="text-sm text-muted-foreground">
              Pass rate {round(toughest.passRate)}%
            </p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="text-sm text-muted-foreground">Widest score spread</p>
            <p className="mt-1 font-semibold">{widestSpread.name}</p>
            <p className="text-sm text-muted-foreground">
              Range {round(widestSpread.spread)}
            </p>
          </div>
        </div>

        <ChartContainer config={chartConfig} className="mx-auto h-[300px] w-full">
          <BarChart accessibilityLayer data={passRateChartData}>
            <Legend layout="horizontal" align="right" verticalAlign="top" />
            <CartesianGrid strokeDasharray="3 3" stroke="#D1D5DB" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 11 }}
              interval={0}
              angle={-20}
              textAnchor="end"
              height={60}
            />
            <YAxis
              domain={[0, 100]}
              label={{ value: "Pass rate %", angle: -90, position: "insideLeft" }}
            />
            <Tooltip />
            <Bar dataKey="passRate" fill="var(--color-passRate)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Module Insights <TrendingUp className="h-4 w-4" />
        </div>
      </CardFooter>
    </Card>
  );
}
